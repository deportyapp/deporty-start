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

// Register service worker for PWA
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js').then(reg => {
			console.log('ServiceWorker registered', reg.scope);
		}).catch(err => {
			console.warn('ServiceWorker registration failed:', err);
		});
	});
}

// Listen for beforeinstallprompt but do NOT call preventDefault so browser can show native install UI
window.addEventListener('beforeinstallprompt', (e) => {
	console.log('beforeinstallprompt event fired');
	// store event for optional later use, but do not prevent default
	window.deferredPWAInstallEvent = e;
});

// Optional: react to appinstalled
window.addEventListener('appinstalled', (evt) => {
	console.log('PWA was installed.', evt);
	// Clear stored event
	window.deferredPWAInstallEvent = null;
});

// --- Manual install CTA handling ---
function __updateInstallUI() {
	const btn = document.getElementById('install-button');
	if (!btn) return;
	if (window.deferredPWAInstallEvent) {
		btn.hidden = false;
		btn.setAttribute('aria-hidden', 'false');
	} else {
		btn.hidden = true;
		btn.setAttribute('aria-hidden', 'true');
	}
}

window.addEventListener('beforeinstallprompt', (e) => {
	// store event for optional later use, but do not prevent default
	console.log('beforeinstallprompt event fired (stored)');
	window.deferredPWAInstallEvent = e;
	// update any UI if present
	try { __updateInstallUI(); } catch (err) { /* ignore */ }
});

document.addEventListener('DOMContentLoaded', () => {
	const btn = document.getElementById('install-button');
	if (!btn) return;
	btn.addEventListener('click', async (ev) => {
		const evt = window.deferredPWAInstallEvent;
		if (!evt) return;
		try {
			// Show the browser install prompt
			evt.prompt();
			const choice = await evt.userChoice;
			console.log('UserChoice', choice);
		} catch (e) {
			console.warn('Install prompt failed', e);
		} finally {
			// Clear stored event and update UI
			window.deferredPWAInstallEvent = null;
			__updateInstallUI();
		}
	});
	// initial sync in case event already fired
	__updateInstallUI();
});


