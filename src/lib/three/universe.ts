import * as THREE from 'three';
import type { GhRepo } from '$lib/github';
import { contributions } from '$lib/github';

/* ------------------------------------------------------------------ *
 * The Universe — one continuous WebGL flight synced to document scroll.
 *   zone 0  : hero starfield + nebula
 *   zone ~60: repo constellation (orbs + links), hoverable
 *   zone ~130: contribution terrain (365 instanced bars, real data)
 *   zone ~190: contact vortex + brass ring
 * ------------------------------------------------------------------ */

export interface RepoOrb {
	name: string;
	url: string;
	stars: number;
	x: number;
	y: number;
	z: number;
}

export interface HoverPayload {
	name: string;
	url: string;
	stars: number;
	/** normalized screen px for tooltip placement */
	sx: number;
	sy: number;
}

export interface DayHover {
	date: string;
	count: number;
	sx: number;
	sy: number;
}

interface UniverseCallbacks {
	onRepoHover?: (h: HoverPayload | null) => void;
	onDayHover?: (h: DayHover | null) => void;
}

const HERO_Z = 10;
const ORB_Z = -62;
const TERRAIN_Z = -132;
const CONTACT_Z = -192;

const CREAM = new THREE.Color('#f6f1e3');
const BRASS = new THREE.Color('#e7b84f');
const TEAL = new THREE.Color('#2dd4bf');
const NOVA = new THREE.Color('#7c9cf5');

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

function radialSprite(inner: string, outer: string): THREE.Texture {
	const c = document.createElement('canvas');
	c.width = c.height = 128;
	const ctx = c.getContext('2d')!;
	const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
	g.addColorStop(0, inner);
	g.addColorStop(0.35, outer);
	g.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, 128, 128);
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

export class Universe {
	posCurve: THREE.CatmullRomCurve3;
	lookCurve: THREE.CatmullRomCurve3;

	private renderer: THREE.WebGLRenderer;
	private scene = new THREE.Scene();
	private camera: THREE.PerspectiveCamera;
	private clock = new THREE.Clock();
	private elapsed = 0;
	private raf = 0;
	private disposed = false;

	private stars: THREE.Points | null = null;
	private nebulae: THREE.Sprite[] = [];
	private shooters: THREE.Points | null = null;
	private orbMesh: THREE.InstancedMesh | null = null;
	private orbGlow: THREE.Points | null = null;
	private orbLines: THREE.LineSegments | null = null;
	private orbs: RepoOrb[] = [];
	private terrain: THREE.InstancedMesh | null = null;
	private dayGrid: { x: number; z: number; h: number; date: string; count: number }[] = [];
	private vortex: THREE.Points | null = null;
	private ring: THREE.Mesh | null = null;

	private mouse = new THREE.Vector2(0, 0);
	private smoothMouse = new THREE.Vector2(0, 0);
	private raycaster = new THREE.Raycaster();
	private hoverOrb = -1;
	private hoverDay = -1;
	private smoothP = 0;
	private keyframeMap: [number, number][] = [[0, 0]];

	constructor(
		private canvas: HTMLCanvasElement,
		private cb: UniverseCallbacks = {},
		private quality: 'high' | 'low' = 'high'
	) {
		this.renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: quality === 'high',
			alpha: false,
			powerPreference: 'high-performance'
		});
		this.renderer.setClearColor(0x07080a, 1);
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'high' ? 1.75 : 1.25));

		this.camera = new THREE.PerspectiveCamera(62, 1, 0.1, 420);
		this.scene.fog = new THREE.FogExp2(0x07080a, 0.0105);

		const curves = this.buildCurves();
		this.posCurve = curves[0];
		this.lookCurve = curves[1];
		this.buildStars();
		this.buildNebulae();
		this.buildTerrain();
		this.buildContact();
		if (quality === 'high') this.buildShooters();

		this.resize();
		addEventListener('resize', this.resize);
		addEventListener('pointermove', this.onPointer, { passive: true });
		this.loop();
	}

	/* ---------------- geometry builders ---------------- */

	private buildCurves(): [THREE.CatmullRomCurve3, THREE.CatmullRomCurve3] {
		const pos = new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(0, 0, HERO_Z + 6),
				new THREE.Vector3(0, 0, HERO_Z - 6),
				new THREE.Vector3(0, 2.5, ORB_Z + 18),
				new THREE.Vector3(0, 1.5, ORB_Z + 2),
				new THREE.Vector3(0, 15, TERRAIN_Z + 24),
				new THREE.Vector3(0, 9, TERRAIN_Z - 4),
				new THREE.Vector3(0, 2.2, CONTACT_Z + 18),
				new THREE.Vector3(0, 1.6, CONTACT_Z + 6)
			],
			false,
			'catmullrom',
			0.35
		);
		const look = new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(0, 0, HERO_Z - 20),
				new THREE.Vector3(0, 0, HERO_Z - 40),
				new THREE.Vector3(0, 2, ORB_Z - 6),
				new THREE.Vector3(0, 1, ORB_Z - 14),
				new THREE.Vector3(0, 0, TERRAIN_Z + 4),
				new THREE.Vector3(0, 0, TERRAIN_Z - 26),
				new THREE.Vector3(0, 3, CONTACT_Z - 4),
				new THREE.Vector3(0, 3, CONTACT_Z - 12)
			],
			false,
			'catmullrom',
			0.35
		);
		return [pos, look];
	}

	private buildStars() {
		const n = this.quality === 'high' ? 2600 : 1200;
		const pos = new Float32Array(n * 3);
		const col = new Float32Array(n * 3);
		const size = new Float32Array(n);
		const seed = new Float32Array(n);
		const c = new THREE.Color();
		for (let i = 0; i < n; i++) {
			const r = 26 + Math.random() * 90;
			const th = Math.random() * Math.PI * 2;
			pos[i * 3] = Math.cos(th) * r;
			pos[i * 3 + 1] = (Math.random() - 0.5) * 110;
			pos[i * 3 + 2] = -Math.random() * 260 + 26;
			const pick = Math.random();
			if (pick < 0.72) c.copy(CREAM).multiplyScalar(0.75 + Math.random() * 0.25);
			else if (pick < 0.86) c.copy(BRASS);
			else if (pick < 0.94) c.copy(TEAL).multiplyScalar(0.85);
			else c.copy(NOVA);
			col[i * 3] = c.r;
			col[i * 3 + 1] = c.g;
			col[i * 3 + 2] = c.b;
			size[i] = 0.6 + Math.pow(Math.random(), 3) * 2.6;
			seed[i] = Math.random() * Math.PI * 2;
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
		geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
		geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

		const mat = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			uniforms: {
				uTime: { value: 0 },
				uPix: { value: this.renderer.getPixelRatio() },
				uTex: { value: radialSprite('rgba(255,255,255,1)', 'rgba(255,255,255,.28)') }
			},
			vertexShader: /* glsl */ `
				attribute vec3 aColor;
				attribute float aSize;
				attribute float aSeed;
				uniform float uTime;
				uniform float uPix;
				varying vec3 vColor;
				varying float vTw;
				void main() {
					vColor = aColor;
					vTw = 0.6 + 0.4 * sin(uTime * (0.6 + fract(aSeed) * 1.4) + aSeed * 9.0);
					vec4 mv = modelViewMatrix * vec4(position, 1.0);
					float near = smoothstep(5.0, 22.0, -mv.z);
					vTw = vTw * near;
					gl_PointSize = min(aSize * uPix * (30.0 / -mv.z), 9.0 * uPix);
					gl_Position = projectionMatrix * mv;
				}`,
			fragmentShader: /* glsl */ `
				uniform sampler2D uTex;
				varying vec3 vColor;
				varying float vTw;
				void main() {
					vec4 t = texture2D(uTex, gl_PointCoord);
					gl_FragColor = vec4(vColor * (0.55 + 0.45 * vTw), t.a * vTw);
				}`
		});
		this.stars = new THREE.Points(geo, mat);
		this.scene.add(this.stars);
	}

	private buildNebulae() {
		const tex = radialSprite('rgba(255,255,255,.85)', 'rgba(255,255,255,.18)');
		const spots: [number, number, number, number, THREE.Color][] = [
			[-26, 10, ORB_Z + 26, 46, new THREE.Color('#0e2e36')],
			[30, -12, ORB_Z - 12, 52, new THREE.Color('#2c2109')],
			[-18, 14, TERRAIN_Z + 26, 56, new THREE.Color('#0a222b')],
			[24, 12, CONTACT_Z + 20, 40, new THREE.Color('#33260b')]
		];
		for (const [x, y, z, s, c] of spots) {
			const m = new THREE.SpriteMaterial({
				map: tex,
				color: c,
				transparent: true,
				opacity: 0.24,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			});
			const sp = new THREE.Sprite(m);
			sp.position.set(x, y, z);
			sp.scale.setScalar(s);
			this.nebulae.push(sp);
			this.scene.add(sp);
		}
	}

	private buildShooters() {
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
		const mat = new THREE.PointsMaterial({
			map: radialSprite('rgba(255,240,200,1)', 'rgba(255,220,140,.4)'),
			size: 1.4,
			transparent: true,
			opacity: 0,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});
		this.shooters = new THREE.Points(geo, mat);
		this.shooters.userData = { t: -1, v: new THREE.Vector3(), origin: new THREE.Vector3() };
		this.scene.add(this.shooters);
	}

	/** swap the repo constellation whenever live data lands */
	setRepos(repos: GhRepo[]) {
		const top = repos
			.slice()
			.sort((a, b) => b.stars - a.stars || (a.updated < b.updated ? 1 : -1))
			.slice(0, this.quality === 'high' ? 42 : 24);

		this.orbs = top.map((r, i) => {
			// fibonacci sphere around ORB_Z, stretched horizontally
			const phi = Math.acos(1 - (2 * (i + 0.5)) / top.length);
			const theta = Math.PI * (1 + Math.sqrt(5)) * i;
			const R = 13.5;
			return {
				name: r.name,
				url: r.url,
				stars: r.stars,
				x: Math.cos(theta) * Math.sin(phi) * R * 1.6,
				y: Math.cos(phi) * R * 0.78 + 1.5,
				z: ORB_Z + Math.sin(theta) * Math.sin(phi) * R * 0.7
			};
		});

		if (this.orbMesh && this.orbGlow && this.orbLines) {
			this.scene.remove(this.orbMesh, this.orbGlow, this.orbLines);
			this.orbMesh.dispose();
			this.orbGlow.geometry.dispose();
			this.orbLines.geometry.dispose();
		}

		// instanced orbs — size by star count
		const geo = new THREE.IcosahedronGeometry(1, this.quality === 'high' ? 2 : 1);
		const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95 });
		const orbMesh = new THREE.InstancedMesh(geo, mat, this.orbs.length);
		this.orbMesh = orbMesh;
		const m = new THREE.Matrix4();
		const base = new THREE.Color('#cfc7b2');
		this.orbs.forEach((o, i) => {
			const s = 0.22 + Math.pow(Math.max(o.stars, 0.35), 0.5) * 0.2;
			m.makeScale(s, s, s).setPosition(o.x, o.y, o.z);
			orbMesh.setMatrixAt(i, m);
		});
		orbMesh.instanceMatrix.needsUpdate = true;
		this.scene.add(orbMesh);

		// glow halos
		const gGeo = new THREE.BufferGeometry();
		const gPos = new Float32Array(this.orbs.length * 3);
		const gSize = new Float32Array(this.orbs.length);
		const gCol = new Float32Array(this.orbs.length * 3);
		this.orbs.forEach((o, i) => {
			gPos[i * 3] = o.x;
			gPos[i * 3 + 1] = o.y;
			gPos[i * 3 + 2] = o.z;
			gSize[i] = 0.24 + Math.pow(Math.max(o.stars, 0.35), 0.5) * 0.32;
			const c = i < 3 ? BRASS : i < 12 ? NOVA : base;
			gCol[i * 3] = c.r;
			gCol[i * 3 + 1] = c.g;
			gCol[i * 3 + 2] = c.b;
		});
		gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
		gGeo.setAttribute('aSize', new THREE.BufferAttribute(gSize, 1));
		gGeo.setAttribute('aColor', new THREE.BufferAttribute(gCol, 3));
		const gMat = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			uniforms: {
				uTime: { value: 0 },
				uPix: { value: this.renderer.getPixelRatio() },
				uTex: { value: radialSprite('rgba(255,238,196,.95)', 'rgba(231,184,79,.22)') }
			},
			vertexShader: /* glsl */ `
				attribute vec3 aColor;
				attribute float aSize;
				uniform float uTime;
				uniform float uPix;
				varying vec3 vColor;
				varying float vA;
				void main() {
					vColor = aColor;
					vec4 mv = modelViewMatrix * vec4(position, 1.0);
					vA = smoothstep(16.0, 42.0, -mv.z);
					float near = smoothstep(0.0, 12.0, -mv.z);
					float pulse = 1.0 + 0.18 * sin(uTime * 1.7 + position.x * 2.0 + position.y);
					gl_PointSize = min(aSize * pulse * uPix * (120.0 / -mv.z), 40.0 * uPix) * (0.15 + 0.85 * near);
					gl_Position = projectionMatrix * mv;
				}`,
			fragmentShader: /* glsl */ `
				uniform sampler2D uTex;
				varying vec3 vColor;
				varying float vA;
				void main() {
					vec4 t = texture2D(uTex, gl_PointCoord);
					gl_FragColor = vec4(vColor, t.a * 0.42 * vA);
				}`
		});
		this.orbGlow = new THREE.Points(gGeo, gMat);
		this.scene.add(this.orbGlow);

		// constellation links between nearest orbs
		const linePts: number[] = [];
		for (let i = 0; i < this.orbs.length; i++) {
			const near = this.orbs
				.map((o, j) => ({ j, d: (o.x - this.orbs[i].x) ** 2 + (o.y - this.orbs[i].y) ** 2 }))
				.filter((e) => e.j !== i)
				.sort((a, b) => a.d - b.d)
				.slice(0, 2);
			for (const { j } of near) {
				if (j <= i) continue;
				linePts.push(
					this.orbs[i].x,
					this.orbs[i].y,
					this.orbs[i].z,
					this.orbs[j].x,
					this.orbs[j].y,
					this.orbs[j].z
				);
			}
		}
		const lGeo = new THREE.BufferGeometry();
		lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
		this.orbLines = new THREE.LineSegments(
			lGeo,
			new THREE.LineBasicMaterial({
				color: BRASS,
				transparent: true,
				opacity: 0.14,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			})
		);
		this.scene.add(this.orbLines);
	}

	private buildTerrain() {
		const { counts, dates } = contributions;
		const max = Math.max(...counts, 1);
		const cell = 1.18;
		const cols = Math.ceil(counts.length / 7);
		const w = cols * cell;
		const hGeo = new THREE.BoxGeometry(0.82, 1, 0.82);
		hGeo.translate(0, 0.5, 0);
		const hMat = new THREE.MeshBasicMaterial();
		this.terrain = new THREE.InstancedMesh(hGeo, hMat, counts.length);
		const m = new THREE.Matrix4();
		const col = new THREE.Color();
		const cold = new THREE.Color('#1d232c');
		const warm = new THREE.Color('#b98a2c');
		for (let i = 0; i < counts.length; i++) {
			const week = Math.floor(i / 7);
			const day = i % 7;
			const x = (week - cols / 2) * cell;
			const z = TERRAIN_Z - (day - 3) * cell;
			const c = counts[i];
			const norm = Math.pow(c / max, 0.62);
			const h = 0.25 + norm * 9.5;
			m.makeScale(1, h, 1).setPosition(x, 0, z);
			this.terrain.setMatrixAt(i, m);
			col.copy(cold).lerp(warm, Math.min(1, norm * 1.35));
			if (c === 0) col.multiplyScalar(0.55);
			this.terrain.setColorAt(i, col);
			this.dayGrid.push({ x, z, h, date: dates[i], count: c });
		}
		this.terrain.instanceMatrix.needsUpdate = true;
		if (this.terrain.instanceColor) this.terrain.instanceColor.needsUpdate = true;
		this.scene.add(this.terrain);

		// faint floor grid
		const grid = new THREE.GridHelper(
			w + 20,
			28,
			new THREE.Color('#1b1e26'),
			new THREE.Color('#141720')
		);
		grid.position.set(0, -0.02, TERRAIN_Z);
		this.scene.add(grid);
	}

	private buildContact() {
		const n = this.quality === 'high' ? 900 : 420;
		const pos = new Float32Array(n * 3);
		const col = new Float32Array(n * 3);
		const c = new THREE.Color();
		for (let i = 0; i < n; i++) {
			const t = i / n;
			const ang = t * Math.PI * 14;
			const r = 3 + t * 9;
			pos[i * 3] = Math.cos(ang) * r;
			pos[i * 3 + 1] = 3 + Math.sin(t * Math.PI * 6) * (1.5 + t * 2.5);
			pos[i * 3 + 2] = CONTACT_Z - 16 + Math.sin(ang) * r * 0.4;
			c.copy(t < 0.55 ? BRASS : t < 0.8 ? CREAM : TEAL);
			col[i * 3] = c.r;
			col[i * 3 + 1] = c.g;
			col[i * 3 + 2] = c.b;
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
		this.vortex = new THREE.Points(
			geo,
			new THREE.PointsMaterial({
				size: 0.16,
				vertexColors: true,
				transparent: true,
				opacity: 0.7,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
				map: radialSprite('rgba(255,255,255,1)', 'rgba(255,255,255,.3)')
			})
		);
		this.scene.add(this.vortex);

		this.ring = new THREE.Mesh(
			new THREE.TorusGeometry(5.6, 0.06, 12, 120),
			new THREE.MeshBasicMaterial({ color: BRASS, transparent: true, opacity: 0.65 })
		);
		this.ring.position.set(0, 3, CONTACT_Z - 18);
		this.scene.add(this.ring);
	}

	/* ---------------- interaction + frame ---------------- */

	private onPointer = (e: PointerEvent) => {
		this.mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
	};

	/** document scroll fraction mapped through section keyframes → camera path t */
	private computeP(): number {
		const se = document.documentElement;
		const max = se.scrollHeight - innerHeight;
		if (max <= 0) return 0;
		const f = scrollY / max;
		const kf = this.keyframeMap;
		for (let i = 1; i < kf.length; i++) {
			if (f <= kf[i][0]) {
				const span = kf[i][0] - kf[i - 1][0] || 1;
				const local = Math.min(1, Math.max(0, (f - kf[i - 1][0]) / span));
				return kf[i - 1][1] + easeInOutSine(local) * (kf[i][1] - kf[i - 1][1]);
			}
		}
		return 1;
	}

	setKeyframes(map: [number, number][]) {
		if (map.length > 1) this.keyframeMap = map;
	}

	private raycast() {
		if (this.quality === 'low') return;
		this.raycaster.setFromCamera(this.mouse, this.camera);

		// orbs: only while the camera flies through the constellation zone
		if (this.orbMesh && this.smoothP > 0.14 && this.smoothP < 0.58) {
			const hit = this.raycaster.intersectObject(this.orbMesh, false)[0];
			const idx = hit?.instanceId ?? -1;
			this.hoverOrb = idx;
			if (idx >= 0 && this.orbGlow) {
				const o = this.orbs[idx];
				const v = new THREE.Vector3(o.x, o.y + 0.6, o.z).project(this.camera);
				this.cb.onRepoHover?.({
					name: o.name,
					url: o.url,
					stars: o.stars,
					sx: (v.x * 0.5 + 0.5) * innerWidth,
					sy: (-v.y * 0.5 + 0.5) * innerHeight
				});
			} else this.cb.onRepoHover?.(null);
		} else if (this.hoverOrb !== -1) {
			this.hoverOrb = -1;
			this.cb.onRepoHover?.(null);
		}

		// terrain day hover
		if (this.terrain && this.smoothP > 0.55) {
			const hit = this.raycaster.intersectObject(this.terrain, false)[0];
			const idx = hit?.instanceId ?? -1;
			this.hoverDay = idx;
			if (idx >= 0) {
				const d = this.dayGrid[idx];
				const v = new THREE.Vector3(d.x, d.h + 0.5, d.z).project(this.camera);
				if (v.z < 1) {
					this.cb.onDayHover?.({
						date: d.date,
						count: d.count,
						sx: (v.x * 0.5 + 0.5) * innerWidth,
						sy: (-v.y * 0.5 + 0.5) * innerHeight
					});
					return;
				}
			}
		} else if (this.hoverDay !== -1) this.hoverDay = -1;
		this.cb.onDayHover?.(null);
	}

	private loop = () => {
		if (this.disposed) return;
		this.raf = requestAnimationFrame(this.loop);
		if (document.hidden) return;

		const dt = Math.min(this.clock.getDelta(), 0.05);
		this.elapsed += dt;
		const t = this.elapsed;

		// damped scroll + pointer parallax
		const targetP = this.computeP();
		this.smoothP += (targetP - this.smoothP) * Math.min(1, dt * 4.2);
		this.smoothMouse.lerp(this.mouse, Math.min(1, dt * 3));

		const p = this.smoothP;
		const pos = this.posCurve.getPointAt(p);
		const look = this.lookCurve.getPointAt(Math.min(1, p + 0.002));
		this.camera.position.copy(pos);
		this.camera.position.x += this.smoothMouse.x * 2.2 * (1 - p * 0.2);
		this.camera.position.y += this.smoothMouse.y * 1.4;
		this.camera.lookAt(look);
		this.camera.rotation.z += this.smoothMouse.x * -0.012;

		// living elements
		if (this.stars) (this.stars.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
		if (this.orbGlow) (this.orbGlow.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
		if (this.orbLines) this.orbLines.rotation.y += 0.00035;
		if (this.vortex) this.vortex.rotation.y = t * 0.06;
		if (this.ring) {
			this.ring.rotation.x = Math.sin(t * 0.25) * 0.25 + 0.35;
			this.ring.rotation.y = t * 0.12;
		}
		for (let i = 0; i < this.nebulae.length; i++) {
			const n = this.nebulae[i];
			n.material.opacity = 0.18 + 0.07 * Math.sin(t * 0.22 + i * 1.7);
		}

		// shooting stars over the hero
		if (this.shooters) {
			const u = this.shooters.userData as { t: number; v: THREE.Vector3; origin: THREE.Vector3 };
			if (u.t < 0 && Math.random() < 0.004 && p < 0.25) {
				u.t = 0;
				u.origin.set((Math.random() - 0.5) * 60, Math.random() * 18 - 4, -Math.random() * 40);
				u.v.set(18 + Math.random() * 14, 6 + Math.random() * 5, -4);
			}
			if (u.t >= 0) {
				u.t += dt;
				const attr = this.shooters.geometry.attributes.position as THREE.BufferAttribute;
				const arr = attr.array as Float32Array;
				arr[0] = u.origin.x + u.v.x * u.t;
				arr[1] = u.origin.y + u.v.y * u.t;
				arr[2] = u.origin.z + u.v.z * u.t;
				attr.needsUpdate = true;
				(this.shooters.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - u.t / 1.6);
				if (u.t > 1.6) u.t = -1;
			}
		}

		this.raycast();
		this.renderer.render(this.scene, this.camera);
	};

	resize = () => {
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(innerWidth, innerHeight, false);
		const pix = this.renderer.getPixelRatio();
		if (this.stars) (this.stars.material as THREE.ShaderMaterial).uniforms.uPix.value = pix;
		if (this.orbGlow) (this.orbGlow.material as THREE.ShaderMaterial).uniforms.uPix.value = pix;
	};

	dispose() {
		this.disposed = true;
		cancelAnimationFrame(this.raf);
		removeEventListener('resize', this.resize);
		removeEventListener('pointermove', this.onPointer);
		this.scene.traverse((o) => {
			const mesh = o as THREE.Mesh;
			if (mesh.geometry) mesh.geometry.dispose();
			const material = (mesh as THREE.Mesh).material as
				THREE.Material | THREE.Material[] | undefined;
			const list = Array.isArray(material) ? material : material ? [material] : [];
			for (const mm of list) {
				mm.dispose();
				const withMap = mm as THREE.PointsMaterial;
				if ('map' in withMap) withMap.map?.dispose();
			}
		});
		this.renderer.dispose();
	}
}
