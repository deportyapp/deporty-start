// Rotador de texto para la cabecera: Futbol -> Natacion -> App
(function(){
	const items = [
		{ text: 'Futbol', cls: 'futbol' },
		{ text: 'Natacion', cls: 'natacion' },
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
			// show
			requestAnimationFrame(() => el.classList.remove('hidden'));
		}, 120);
	};

	const intervalId = setInterval(rotate, 2000);
	// expose cleanup if needed
	if (window.__Deporty) window.__Deporty.brandRotator = { stop: () => clearInterval(intervalId) };
})();


