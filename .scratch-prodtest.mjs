import { chromium } from 'playwright';

const outDir = '/tmp/claude-1000/-mnt-d-deporty-deporty/6e4acf72-1984-4c78-8ae9-5249bbb2635c/scratchpad';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const logs = [];
page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => logs.push(`[pageerror] ${String(err)}`));
page.on('requestfailed', (req) => logs.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`));

await page.goto('https://www.deporty.com/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/40-prod-initial.png`, fullPage: true });

// Inspect interactive elements
const info = await page.evaluate(() => {
	const buttons = Array.from(document.querySelectorAll('button')).map((b) => ({
		text: b.textContent?.trim(),
		disabled: b.disabled,
		pointerEvents: getComputedStyle(b).pointerEvents,
		visible: b.offsetParent !== null
	}));
	const links = Array.from(document.querySelectorAll('a')).map((a) => ({
		text: a.textContent?.trim(),
		href: a.getAttribute('href')
	}));
	return { buttons, links, bodyHTML_length: document.body.innerHTML.length };
});
console.log('INFO', JSON.stringify(info, null, 2));

// Try clicking the PT language button
try {
	await page.click('button:has-text("PT")', { timeout: 5000 });
	await page.waitForTimeout(500);
	const afterClick = await page.evaluate(() => document.querySelector('h1')?.textContent);
	console.log('AFTER CLICK PT, h1 text:', afterClick);
} catch (e) {
	console.log('CLICK PT FAILED:', String(e));
}

await page.screenshot({ path: `${outDir}/41-prod-after-click.png`, fullPage: true });

console.log('CONSOLE LOGS:', JSON.stringify(logs, null, 2));

await browser.close();
