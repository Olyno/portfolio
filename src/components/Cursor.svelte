<script lang="ts">
	import { onMount } from 'svelte';

	let dot: HTMLDivElement;
	let ring: HTMLDivElement;

	onMount(() => {
		if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
		dot.style.display = '';
		ring.style.display = '';
		let x = innerWidth / 2,
			y = innerHeight / 2,
			rx = x,
			ry = y;
		const move = (e: PointerEvent) => {
			x = e.clientX;
			y = e.clientY;
			dot.style.transform = `translate(${x}px, ${y}px)`;
		};
		addEventListener('pointermove', move, { passive: true });
		let raf = 0;
		const follow = () => {
			rx += (x - rx) * 0.16;
			ry += (y - ry) * 0.16;
			ring.style.transform = `translate(${rx}px, ${ry}px)`;
			raf = requestAnimationFrame(follow);
		};
		raf = requestAnimationFrame(follow);

		// grow the ring over interactive elements
		const over = (e: PointerEvent) => {
			const t = e.target as Element;
			if (t.closest?.('a, button, input, [role="option"], .card-lift, [data-cursor]'))
				document.body.classList.add('cursor-active');
		};
		const out = (e: PointerEvent) => {
			const t = e.target as Element;
			if (t.closest?.('a, button, input, [role="option"], .card-lift, [data-cursor]'))
				document.body.classList.remove('cursor-active');
		};
		document.addEventListener('pointerover', over);
		document.addEventListener('pointerout', out);
		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('pointermove', move);
			document.removeEventListener('pointerover', over);
			document.removeEventListener('pointerout', out);
		};
	});
</script>

<div class="cursor-dot" bind:this={dot} style="display:none" aria-hidden="true"></div>
<div class="cursor-ring" bind:this={ring} style="display:none" aria-hidden="true"></div>
