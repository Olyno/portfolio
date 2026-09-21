type Cleanup = void | (() => void);

/** Magnetic hover factory: element drifts toward the pointer, springs back on leave. */
export function magnetic(strength = 0.24) {
	return (el: HTMLElement): Cleanup => {
		if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const onMove = (e: PointerEvent) => {
			const r = el.getBoundingClientRect();
			const dx = e.clientX - (r.left + r.width / 2);
			const dy = e.clientY - (r.top + r.height / 2);
			el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
			el.style.setProperty('--mx', `${e.clientX - r.left}px`);
			el.style.setProperty('--my', `${e.clientY - r.top}px`);
		};
		const onLeave = () => (el.style.transform = '');
		el.addEventListener('pointermove', onMove);
		el.addEventListener('pointerleave', onLeave);
		return () => {
			el.removeEventListener('pointermove', onMove);
			el.removeEventListener('pointerleave', onLeave);
		};
	};
}

/** Reveal-on-scroll factory: fade+rise the element when it enters the viewport. */
export function reveal(delay = 0) {
	return (el: HTMLElement): Cleanup => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		el.style.opacity = '0';
		el.style.transform = 'translateY(26px)';
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (!e.isIntersecting) continue;
					setTimeout(() => {
						el.style.transition =
							'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)';
						el.style.opacity = '1';
						el.style.transform = 'none';
					}, delay);
					io.unobserve(el);
				}
			},
			{ threshold: 0.12 }
		);
		io.observe(el);
		return () => io.disconnect();
	};
}

/** Counts 0 → target once the element scrolls into view. */
export function counter(target: number, duration = 1400) {
	return (el: HTMLElement): Cleanup => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			el.textContent = target.toLocaleString('en');
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				const t0 = performance.now();
				const step = (t: number) => {
					const p = Math.min(1, (t - t0) / duration);
					const eased = 1 - Math.pow(1 - p, 4);
					el.textContent = Math.round(target * eased).toLocaleString('en');
					if (p < 1) requestAnimationFrame(step);
				};
				requestAnimationFrame(step);
			},
			{ threshold: 0.5 }
		);
		io.observe(el);
		return () => io.disconnect();
	};
}
