// Rotador de texto para la cabecera: Futbol -> Natacion -> App
(function(){
	const items = [
		{ text: 'Futbol', cls: 'futbol' },
		{ text: 'Natacion', cls: 'natacion' },
        { text: 'Waterpolo', cls: 'waterpolo'},
		{ text: 'App', cls: 'app' }
	];
	const el = document.querySelector('.brand-rotator .brand-text');
	if(!el) return;

	const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let i = 0;
	// initialize
	el.textContent = items[0].text;
	el.className = 'brand-text ' + items[0].cls;

	if (reduceMotion) {
		// Do not start rotations or animations when user prefers reduced motion
		return;
	}

	const rotate = () => {
		// hide
		el.classList.add('hidden');
		setTimeout(() => {
			i = (i + 1) % items.length;
			el.textContent = items[i].text;
			el.className = 'brand-text ' + items[i].cls;
			// apply same brand color to any signup buttons (header and mobile)
			try {
				const btns = document.querySelectorAll('a[href="signup.html"]');
				btns.forEach(b => {
					b.classList.remove('brand-btn--futbol', 'brand-btn--natacion', 'brand-btn--app', 'brand-btn--waterpolo');
					b.classList.add('brand-btn--' + items[i].cls);
				});
			} catch (e) { /* no-op if DOM missing */ }
			// show
			requestAnimationFrame(() => el.classList.remove('hidden'));
		}, 120);
	};

	// apply initial brand color to signup buttons
	try {
		const initBtns = document.querySelectorAll('a[href="signup.html"]');
		initBtns.forEach(b => {
			b.classList.remove('brand-btn--futbol', 'brand-btn--natacion', 'brand-btn--app', 'brand-btn--waterpolo');
			b.classList.add('brand-btn--' + items[0].cls);
		});
	} catch (e) {}

	const intervalId = setInterval(rotate, 2000);
	// expose cleanup if needed
	if (window.__Deporty) window.__Deporty.brandRotator = { stop: () => clearInterval(intervalId) };
})();


