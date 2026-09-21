import * as THREE from 'three';
import type { GhRepo } from '$lib/github';
import { contributions } from '$lib/github';

/* ------------------------------------------------------------------ *
 * THE SURVEY — the fixed background is literally the data, dressed as
 * an observatory plate the visitor flies across as they scroll:
 *
 *   plate 00  · starfield          (the field: 169 public repos → N stars)
 *   plate 01  · repo constellation (each repo = one star, linked to nearest)
 *   plate 02  · contribution ridge (one column per surveyed day, height = n)
 *   plate 03  · contact horizon    (a rising brass sun = "what's next")
 *
 * Stage.svelte reads CSS vars for theme colors and publishes the current
 * plate's caption to the HUD, so the background always *names itself*.
 * ------------------------------------------------------------------ */

export interface RepoStar {
	name: string;
	url: string;
	stars: number;
	x: number;
	y: number;
	z: number;
}

export interface StarHover {
	name: string;
	url: string;
	stars: number;
	sx: number;
	sy: number;
}

export interface DayHover {
	date: string;
	count: number;
	sx: number;
	sy: number;
}

export interface Callbacks {
	onStarHover?: (h: StarHover | null) => void;
	onDayHover?: (h: DayHover | null) => void;
}

const PLATE_Z = [0, -70, -145, -215]; // star / constellation / ridge / horizon

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

function dotTexture(inner = 'rgba(255,255,255,1)', edge = 'rgba(255,255,255,0)'): THREE.Texture {
	const c = document.createElement('canvas');
	c.width = c.height = 64;
	const x = c.getContext('2d')!;
	const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
	g.addColorStop(0, inner);
	g.addColorStop(0.5, 'rgba(255,255,255,.35)');
	g.addColorStop(1, edge);
	x.fillStyle = g;
	x.fillRect(0, 0, 64, 64);
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

const css = (name: string) =>
	getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export class Survey {
	posCurve: THREE.CatmullRomCurve3;
	lookCurve: THREE.CatmullRomCurve3;

	private renderer: THREE.WebGLRenderer;
	private scene = new THREE.Scene();
	private camera: THREE.PerspectiveCamera;
	private clock = new THREE.Clock();
	private elapsed = 0;
	private raf = 0;
	private disposed = false;

	private stars!: THREE.Points;
	private starMat!: THREE.ShaderMaterial;
	private starBase = new THREE.Color('#1e1b14');

	private field!: THREE.Points; // constellation bodies
	private fieldMat!: THREE.ShaderMaterial;
	private links!: THREE.LineSegments;
	private linkMat!: THREE.LineBasicMaterial;
	private suns: RepoStar[] = [];

	private ridge!: THREE.InstancedMesh;
	private ridgeMat!: THREE.MeshBasicMaterial;
	private dayGrid: { x: number; z: number; h: number; date: string; count: number }[] = [];

	private sun!: THREE.Mesh;
	private sunMat!: THREE.MeshBasicMaterial;
	private sunGlow!: THREE.Sprite;

	private mouse = new THREE.Vector2(0, 0);
	private smooth = new THREE.Vector2(0, 0);
	private ray = new THREE.Raycaster();
	private hoverStar = -1;
	private hoverDay = -1;
	private p = 0;
	private keyframes: [number, number][] = [[0, 0]];
	private rayClock = 0;

	constructor(
		canvas: HTMLCanvasElement,
		private cb: Callbacks = {},
		private quality: 'high' | 'low' = 'high'
	) {
		this.renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: false,
			powerPreference: 'high-performance'
		});
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'high' ? 1.5 : 1));

		this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 400);

		const [pos, look] = this.buildCurves();
		this.posCurve = pos;
		this.lookCurve = look;

		this.buildField();
		this.buildRidge();
		this.buildSun();
		this.applyTheme();

		this.resize();
		addEventListener('resize', this.resize);
		addEventListener('pointermove', this.onPointer, { passive: true });
		this.loop();
	}

	/** re-read CSS theme vars on light/dark flip */
	applyTheme() {
		const bg = new THREE.Color(css('--plate') || '#f2ead8');
		const ink = new THREE.Color(css('--scene-1') || '#1e1b14');
		const brass = new THREE.Color(css('--brass') || '#9a7422');
		this.renderer.setClearColor(bg, 1);
		this.scene.fog = new THREE.FogExp2(bg.getHex(), 0.0075);
		if (this.stars) {
			this.starMat.uniforms.uColor.value = ink;
			this.starBase = ink.clone();
		}
		if (this.field) {
			this.fieldMat.uniforms.uColor.value = brass.clone();
			this.fieldMat.uniforms.uInk.value = ink.clone();
		}
		if (this.links) this.linkMat.color = brass.clone().lerp(ink, 0.45);
		if (this.sun) this.sunMat.color = brass.clone();
		if (this.ridge) this.recolorRidge(bg, brass);
		if (this.sunGlow) {
			(this.sunGlow.material as THREE.SpriteMaterial).color = brass.clone();
			(this.sunGlow.material as THREE.SpriteMaterial).opacity = 0.35;
		}
	}

	/** rebuild per-day instance colors for the active theme */
	private recolorRidge(bg: THREE.Color, brass: THREE.Color) {
		if (!this.ridge) return;
		const max = Math.max(...this.dayGrid.map((d) => d.count), 1);
		const c = new THREE.Color();
		for (let i = 0; i < this.dayGrid.length; i++) {
			const norm = Math.pow(this.dayGrid[i].count / max, 0.6);
			c.copy(bg).lerp(brass, 0.08 + Math.min(1, norm * 1.5) * 0.92);
			this.ridge.setColorAt(i, c);
		}
		if (this.ridge.instanceColor) this.ridge.instanceColor.needsUpdate = true;
	}

	private buildCurves(): [THREE.CatmullRomCurve3, THREE.CatmullRomCurve3] {
		const pos = new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(0, 0, 14),
				new THREE.Vector3(0, 1, PLATE_Z[1] + 26),
				new THREE.Vector3(0, 2.5, PLATE_Z[1] + 8),
				new THREE.Vector3(0, 16, PLATE_Z[2] + 20),
				new THREE.Vector3(0, 10, PLATE_Z[2] - 6),
				new THREE.Vector3(0, 3.5, PLATE_Z[3] + 16),
				new THREE.Vector3(0, 3, PLATE_Z[3] + 4)
			],
			false,
			'catmullrom',
			0.4
		);
		const look = new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(0, 0, -12),
				new THREE.Vector3(0, 3, PLATE_Z[1] - 4),
				new THREE.Vector3(0, 2, PLATE_Z[1] - 16),
				new THREE.Vector3(0, 0, PLATE_Z[2] + 2),
				new THREE.Vector3(0, -1, PLATE_Z[2] - 28),
				new THREE.Vector3(0, 5, PLATE_Z[3] - 6),
				new THREE.Vector3(0, 5, PLATE_Z[3] - 14)
			],
			false,
			'catmullrom',
			0.4
		);
		return [pos, look];
	}

	/* ---------- plate 00/01: starfield + constellation ---------- */

	private buildField() {
		const n = this.quality === 'high' ? 1400 : 650;
		const pos = new Float32Array(n * 3);
		const size = new Float32Array(n);
		const seed = new Float32Array(n);
		for (let i = 0; i < n; i++) {
			const r = 30 + Math.random() * 95;
			const th = Math.random() * Math.PI * 2;
			pos[i * 3] = Math.cos(th) * r;
			pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
			pos[i * 3 + 2] = -Math.random() * 270 + 16;
			size[i] = 0.7 + Math.pow(Math.random(), 3) * 2.4;
			seed[i] = Math.random() * 6.283;
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
		geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

		// quiet twinkle — a field notebook, not a screensaver
		this.starMat = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			uniforms: {
				uTime: { value: 0 },
				uPix: { value: this.renderer.getPixelRatio() },
				uColor: { value: this.starBase.clone() },
				uTex: { value: dotTexture() }
			},
			vertexShader: /* glsl */ `
				attribute float aSize;
				attribute float aSeed;
				uniform float uTime; uniform float uPix;
				varying float vA;
				void main() {
					vA = 0.5 + 0.5 * sin(uTime * 0.7 + aSeed * 9.0);
					vec4 mv = modelViewMatrix * vec4(position, 1.0);
					float near = smoothstep(9.0, 24.0, -mv.z);
					gl_PointSize = min(aSize * uPix * (22.0 / -mv.z), 5.5 * uPix) * near;
					gl_Position = projectionMatrix * mv;
				}`,
			fragmentShader: /* glsl */ `
				uniform vec3 uColor; uniform sampler2D uTex;
				varying float vA;
				void main() {
					float a = texture2D(uTex, gl_PointCoord).a;
					gl_FragColor = vec4(uColor, a * (0.35 + 0.4 * vA));
				}`
		});
		this.stars = new THREE.Points(geo, this.starMat);
		this.scene.add(this.stars);
	}

	setRepos(repos: GhRepo[]) {
		const list = repos
			.slice()
			.sort((a, b) => b.stars - a.stars || (a.updated < b.updated ? 1 : -1))
			.slice(0, this.quality === 'high' ? 60 : 30);

		this.suns = list.map((r, i) => {
			const phi = Math.acos(1 - (2 * (i + 0.5)) / list.length);
			const theta = Math.PI * (1 + Math.sqrt(5)) * i;
			const R = 14;
			return {
				name: r.name,
				url: r.url,
				stars: r.stars,
				x: Math.cos(theta) * Math.sin(phi) * R * 1.7,
				y: Math.cos(phi) * R * 0.7 + 2.5,
				z: PLATE_Z[1] + Math.sin(theta) * Math.sin(phi) * R * 0.55
			};
		});

		if (this.field) {
			this.scene.remove(this.field, this.links);
			this.field.geometry.dispose();
			this.links.geometry.dispose();
		}

		// constellation points sized by stars
		const g = new THREE.BufferGeometry();
		const p = new Float32Array(this.suns.length * 3);
		const s = new Float32Array(this.suns.length);
		this.suns.forEach((o, i) => {
			p[i * 3] = o.x;
			p[i * 3 + 1] = o.y;
			p[i * 3 + 2] = o.z;
			s[i] = 0.3 + Math.pow(Math.max(o.stars, 0.4), 0.45) * 0.5;
		});
		g.setAttribute('position', new THREE.BufferAttribute(p, 3));
		g.setAttribute('aSize', new THREE.BufferAttribute(s, 1));

		this.fieldMat = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			uniforms: {
				uTime: { value: 0 },
				uPix: { value: this.renderer.getPixelRatio() },
				uActive: { value: -1 },
				uColor: { value: new THREE.Color(css('--brass') || '#9a7422') },
				uInk: { value: new THREE.Color(css('--scene-1') || '#1e1b14') },
				uTex: { value: dotTexture() }
			},
			vertexShader: /* glsl */ `
				attribute float aSize;
				uniform float uTime; uniform float uPix;
				varying float vNear;
				void main() {
					vec4 mv = modelViewMatrix * vec4(position, 1.0);
					vNear = smoothstep(6.0, 30.0, -mv.z);
					float tw = 1.0 + 0.12 * sin(uTime * 1.3 + position.x * 2.0 + position.y);
					gl_PointSize = min(aSize * tw * uPix * (34.0 / -mv.z), 14.0 * uPix);
					gl_Position = projectionMatrix * mv;
				}`,
			fragmentShader: /* glsl */ `
				uniform vec3 uColor; uniform vec3 uInk; uniform sampler2D uTex;
				varying float vNear;
				void main() {
					vec4 t = texture2D(uTex, gl_PointCoord);
					vec3 c = mix(uColor, uInk, 0.25);
					gl_FragColor = vec4(c, t.a * 0.92 * vNear);
				}`
		});
		this.field = new THREE.Points(g, this.fieldMat);
		this.scene.add(this.field);

		// constellation links: connect each star to its nearest neighbour
		const lp: number[] = [];
		for (let i = 0; i < this.suns.length; i++) {
			const best = this.suns
				.map((o, j) => ({
					j,
					d: (o.x - this.suns[i].x) ** 2 + (o.y - this.suns[i].y) ** 2 + (o.z - this.suns[i].z) ** 2
				}))
				.filter((e) => e.j !== i)
				.sort((a, b) => a.d - b.d)
				.slice(0, 1)[0];
			if (best && best.j > i) {
				lp.push(
					this.suns[i].x,
					this.suns[i].y,
					this.suns[i].z,
					this.suns[best.j].x,
					this.suns[best.j].y,
					this.suns[best.j].z
				);
			}
		}
		const lg = new THREE.BufferGeometry();
		lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
		this.linkMat = new THREE.LineBasicMaterial({
			color: new THREE.Color(css('--brass') || '#9a7422'),
			transparent: true,
			opacity: 0.22
		});
		this.links = new THREE.LineSegments(lg, this.linkMat);
		this.scene.add(this.links);
	}

	/* ---------- plate 02: contribution ridge ---------- */

	private buildRidge() {
		const { counts, dates } = contributions;
		const max = Math.max(...counts, 1);
		const cell = 1.15;
		const cols = Math.ceil(counts.length / 7);
		const geo = new THREE.BoxGeometry(0.7, 1, 0.7);
		geo.translate(0, 0.5, 0);
		this.ridgeMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9 });
		this.ridge = new THREE.InstancedMesh(geo, this.ridgeMat, counts.length);
		const m = new THREE.Matrix4();
		const dayColors: THREE.Color[] = [];
		const bg = new THREE.Color(css('--plate') || '#f2ead8');
		const ink = new THREE.Color(css('--scene-1') || '#1e1b14');
		const brass = new THREE.Color(css('--brass') || '#9a7422');
		for (let i = 0; i < counts.length; i++) {
			const week = Math.floor(i / 7);
			const day = i % 7;
			const x = (week - cols / 2) * cell;
			const z = PLATE_Z[2] - (day - 3) * cell;
			const norm = Math.pow(counts[i] / max, 0.6);
			const h = 0.2 + norm * 10;
			m.makeScale(1, h, 1).setPosition(x, 0, z);
			this.ridge.setMatrixAt(i, m);
			const c = bg.clone().lerp(brass, 0.08 + Math.min(1, norm * 1.5) * 0.92);
			this.ridge.setColorAt(i, c);
			dayColors.push(c);
			this.dayGrid.push({ x, z, h, date: dates[i], count: counts[i] });
		}
		this.ridge.instanceMatrix.needsUpdate = true;
		if (this.ridge.instanceColor) this.ridge.instanceColor.needsUpdate = true;
		this.scene.add(this.ridge);

		const grid = new THREE.GridHelper(cols * cell + 16, 26, ink, ink);
		(grid.material as THREE.Material).transparent = true;
		(grid.material as THREE.Material).opacity = 0.12;
		grid.position.set(0, -0.02, PLATE_Z[2]);
		this.scene.add(grid);
	}

	/* ---------- plate 03: horizon sun ---------- */

	private buildSun() {
		this.sunMat = new THREE.MeshBasicMaterial({
			color: new THREE.Color(css('--brass') || '#9a7422'),
			transparent: true,
			opacity: 0.9
		});
		this.sun = new THREE.Mesh(new THREE.TorusGeometry(6.5, 0.05, 8, 96), this.sunMat);
		this.sun.position.set(0, 5, PLATE_Z[3] - 8);
		this.sun.rotation.x = Math.PI / 2.25;
		this.scene.add(this.sun);

		const glow = new THREE.SpriteMaterial({
			map: dotTexture('rgba(255,220,150,1)', 'rgba(255,190,90,0)'),
			color: new THREE.Color(css('--brass') || '#9a7422'),
			transparent: true,
			opacity: 0.35,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});
		this.sunGlow = new THREE.Sprite(glow);
		this.sunGlow.position.copy(this.sun.position);
		this.sunGlow.scale.setScalar(22);
		this.scene.add(this.sunGlow);
	}

	/* ---------- loop + interaction ---------- */

	private onPointer = (e: PointerEvent) => {
		this.mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
	};

	private computeP(): number {
		const se = document.documentElement;
		const maxScroll = se.scrollHeight - innerHeight;
		if (maxScroll <= 0) return 0;
		const f = scrollY / maxScroll;
		const kf = this.keyframes;
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
		if (map.length > 1) this.keyframes = map;
	}

	/** which plate is the camera in — Stage.svelte prints it to the HUD */
	currentPlate(): number {
		const p = this.p;
		if (p < 0.28) return 0;
		if (p < 0.56) return 1;
		if (p < 0.84) return 2;
		return 3;
	}

	/* ---------- hover picking, called from the loop at ~12 Hz ---------- */

	private loop = () => {
		if (this.disposed) return;
		this.raf = requestAnimationFrame(this.loop);
		if (document.hidden) return;

		const dt = Math.min(this.clock.getDelta(), 0.05);
		this.elapsed += dt;
		const t = this.elapsed;

		// ease scroll position and camera
		const target = this.computeP();
		this.p += (target - this.p) * Math.min(1, dt * 4);
		this.smooth.lerp(this.mouse, Math.min(1, dt * 3));

		const pos = this.posCurve.getPointAt(this.p);
		const look = this.lookCurve.getPointAt(Math.min(1, this.p + 0.002));
		this.camera.position.copy(pos);
		this.camera.position.x += this.smooth.x * 1.6;
		this.camera.position.y += this.smooth.y * 1.0;
		this.camera.lookAt(look);
		this.camera.rotation.z += this.smooth.x * -0.008;

		// gentle life: slow twinkle + sun pulse
		this.starMat.uniforms.uTime.value = t;
		if (this.fieldMat) this.fieldMat.uniforms.uTime.value = t;
		if (this.sun) {
			this.sun.rotation.z = t * 0.05;
			const k = 0.32 + 0.06 * Math.sin(t * 0.5);
			(this.sunGlow.material as THREE.SpriteMaterial).opacity = k;
		}

		// raycast throttled to ~12 Hz
		this.rayClock += dt;
		if (this.rayClock > 0.08) {
			this.rayClock = 0;
			this.raycastHover();
		}

		this.renderer.render(this.scene, this.camera);
	};

	private raycastHover() {
		if (this.quality === 'low') return;
		this.ray.setFromCamera(this.mouse, this.camera);
		const plate = this.currentPlate();

		if (plate === 1 && this.field) {
			// raycast points with threshold: closest sun under cursor
			const old = this.ray.params.Points.threshold;
			this.ray.params.Points.threshold = 1.4;
			const hit = this.ray.intersectObject(this.field, false)[0];
			this.ray.params.Points.threshold = old;
			const idx = hit?.index ?? -1;
			if (idx !== this.hoverStar) this.hoverStar = idx;
			if (idx >= 0) {
				const o = this.suns[idx];
				const v = new THREE.Vector3(o.x, o.y + 0.8, o.z).project(this.camera);
				this.cb.onStarHover?.({
					name: o.name,
					url: o.url,
					stars: o.stars,
					sx: (v.x * 0.5 + 0.5) * innerWidth,
					sy: (-v.y * 0.5 + 0.5) * innerHeight
				});
			} else this.cb.onStarHover?.(null);
			return;
		} else if (this.hoverStar !== -1) {
			this.hoverStar = -1;
			this.cb.onStarHover?.(null);
		}

		if (plate === 2 && this.ridge) {
			const hit = this.ray.intersectObject(this.ridge, false)[0];
			const idx = hit?.instanceId ?? -1;
			this.hoverDay = idx;
			if (idx >= 0) {
				const d = this.dayGrid[idx];
				const v = new THREE.Vector3(d.x, d.h + 0.4, d.z).project(this.camera);
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

	resize = () => {
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(innerWidth, innerHeight, false);
	};

	dispose() {
		this.disposed = true;
		cancelAnimationFrame(this.raf);
		removeEventListener('resize', this.resize);
		removeEventListener('pointermove', this.onPointer);
		this.scene.traverse((o) => {
			const mesh = o as THREE.Mesh;
			mesh.geometry?.dispose?.();
			const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
			const list = Array.isArray(mat) ? mat : mat ? [mat] : [];
			for (const mm of list) {
				mm.dispose();
				const withMap = mm as THREE.PointsMaterial;
				if ('map' in withMap) withMap.map?.dispose();
			}
		});
		this.renderer.dispose();
	}
}
