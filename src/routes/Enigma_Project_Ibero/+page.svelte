<script lang="ts">
	import { onMount } from 'svelte';

	const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789 .,;:!?()-";
	const RUN_DELAY_MS = 280;
	const MS_PER_DAY = 86400000;
	const CODE_MODULUS = 46;

	// DOM references using state
	let referenceDate = '1970-01-13';
	let generatedCode = '';
	let codeExplanation = 'El codigo se obtiene a partir de los dias UTC transcurridos desde la fecha elegida con la formula (dias mod 46) + 1.';
	let originalMessage = 'Vamos a encriptar un mensaje para toda la clase.';
	let encryptedMessage = '';
	let finalMessage = '';
	let encryptionSummary = 'Todavia no se ha generado el recorrido del cifrado.';
	let encryptionDetail = '';
	let status = '';
	let statusMatch = false;

	let currentState = 'qRead';
	let headIndex = 0;
	let readSymbol = '-';
	let writtenSymbol = '-';
	let stepCount = 0;

	let machineEncryptedTape: string[] = [];
	let machineDecodedTape: string[] = [];
	let machineHead = 0;
	let machineHalted = false;
	let machineRunningId: ReturnType<typeof setInterval> | null = null;
	let machineCurrentRead = '-';
	let machineCurrentWritten = '-';
	let machineOriginalText = '';
	let machineEncryptedText = '';
	let machineKey = 1;
	let traceLines: string[] = [];

	let runningUI = false;

	const getTodayUtcStartMs = () => {
		const now = new Date();
		return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
	};

	const parseIsoDateToUtcStartMs = (dateStr: string) => {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
			return null;
		}

		const [yearStr, monthStr, dayStr] = dateStr.split('-');
		const year = Number(yearStr);
		const month = Number(monthStr);
		const day = Number(dayStr);
		const utcMs = Date.UTC(year, month - 1, day);
		const checkDate = new Date(utcMs);

		if (
			checkDate.getUTCFullYear() !== year ||
			checkDate.getUTCMonth() !== month - 1 ||
			checkDate.getUTCDate() !== day
		) {
			return null;
		}

		return utcMs;
	};

	const getDailyNumber = (referenceDateStr: string) => {
		const refMs = parseIsoDateToUtcStartMs(referenceDateStr);
		if (refMs === null) {
			throw new TypeError('Fecha invalida. Usa YYYY-MM-DD.');
		}

		return Math.floor((getTodayUtcStartMs() - refMs) / MS_PER_DAY);
	};

	const normalizeMessage = (value: string) =>
		value
			.toUpperCase()
			.replace(/[ÁÀÄÂ]/g, 'A')
			.replace(/[ÉÈËÊ]/g, 'E')
			.replace(/[ÍÌÏÎ]/g, 'I')
			.replace(/[ÓÒÖÔ]/g, 'O')
			.replace(/[ÚÙÜÛ]/g, 'U');

	const getCodeFromDate = (referenceDateStr: string) => {
		const daily = getDailyNumber(referenceDateStr);
		return ((daily % CODE_MODULUS) + CODE_MODULUS) % CODE_MODULUS + 1;
	};

	const renderCodeExplanation = (referenceDateStr: string, dailyNumber: number, code: number) => {
		return `Dias UTC transcurridos desde ${referenceDateStr}: ${dailyNumber}. Formula usada: (dias mod ${CODE_MODULUS}) + 1. Resultado: codigo ${code}, que desplaza ${code} posiciones cada simbolo del alfabeto.`;
	};

	const renderEncryptionProcess = (key: number | null) => {
		if (key === null || Number.isNaN(key)) {
			return {
				summary: 'Todavia no se ha generado el recorrido del cifrado.',
				detail: ''
			};
		}

		const summary = `El codigo ${key} define un desplazamiento uniforme para todos los simbolos validos del mensaje.`;
		const detail = `
    <p>Cada letra, numero o signo que pertenezca al alfabeto interno se procesa de la misma manera: la maquina toma el simbolo original, localiza su posicion en el alfabeto y lo mueve ${key} posiciones hacia delante.</p>
    <ul>
      <li>Si el simbolo forma parte del alfabeto, se sustituye por otro simbolo desplazado ${key} posiciones.</li>
      <li>Si el desplazamiento supera el final del alfabeto, el proceso vuelve al inicio y continua desde ahi.</li>
      <li>Todos los caracteres del mensaje se transforman con la misma regla, por eso el cifrado es consistente.</li>
      <li>Durante el descifrado, la maquina aplica el movimiento inverso para recuperar exactamente el mensaje original.</li>
    </ul>
  `;

		return { summary, detail };
	};

	const setStatus = (message: string, isMatch = false) => {
		status = message;
		statusMatch = isMatch;
	};

	const shiftChar = (char: string, shift: number) => {
		const index = ALPHABET.indexOf(char);
		if (index === -1) {
			return char;
		}

		const size = ALPHABET.length;
		const shifted = ((index + shift) % size + size) % size;
		return ALPHABET[shifted];
	};

	const encryptMessage = (message: string, key: number) => {
		const normalized = normalizeMessage(message);
		return Array.from(normalized, (char) => shiftChar(char, key)).join('');
	};

	const decryptChar = (char: string, key: number) => shiftChar(char, -key);

	const appendTrace = (line: string) => {
		traceLines = [...traceLines, line];
	};

	const clearTrace = () => {
		traceLines = [];
	};

	const ensureGeneratedCode = () => {
		try {
			const dailyNumber = getDailyNumber(referenceDate);
			const key = getCodeFromDate(referenceDate);
			generatedCode = String(key);
			codeExplanation = renderCodeExplanation(referenceDate, dailyNumber, key);
			const { summary, detail } = renderEncryptionProcess(key);
			encryptionSummary = summary;
			encryptionDetail = detail;
			return key;
		} catch {
			setStatus('Fecha invalida. Corrige la fecha para generar el codigo.');
			generatedCode = '';
			codeExplanation = 'No se pudo calcular el codigo. Revisa la fecha para obtener los dias UTC y el desplazamiento resultante.';
			encryptionSummary = 'Todavia no se ha generado el recorrido del cifrado.';
			encryptionDetail = '';
			return null;
		}
	};

	const prepareEncryption = () => {
		const key = ensureGeneratedCode();
		if (key === null) {
			return null;
		}

		const original = normalizeMessage(originalMessage.trim());
		if (!original) {
			setStatus('Escribe un mensaje original antes de encriptar.');
			return null;
		}

		const encrypted = encryptMessage(original, key);
		originalMessage = original;
		encryptedMessage = encrypted;
		finalMessage = '';
		const { summary, detail } = renderEncryptionProcess(key);
		encryptionSummary = summary;
		encryptionDetail = detail;

		setStatus(`Mensaje encriptado con codigo ${key}.`);
		return { original, encrypted, key };
	};

	const resetMachineRuntime = () => {
		machineHead = 0;
		currentState = 'qRead';
		stepCount = 0;
		machineHalted = false;
		machineCurrentRead = '-';
		machineCurrentWritten = '-';
	};

	const stopAutoRun = () => {
		if (machineRunningId !== null) {
			clearInterval(machineRunningId);
			machineRunningId = null;
		}

		runningUI = false;
	};

	const loadMachine = () => {
		const encrypted = encryptedMessage;
		const original = originalMessage;
		const key = Number(generatedCode || '0');

		if (!encrypted) {
			setStatus('Primero encripta el mensaje para cargar la maquina.');
			return;
		}

		stopAutoRun();
		machineEncryptedText = encrypted;
		machineOriginalText = original;
		machineKey = key || ensureGeneratedCode() || 1;
		machineEncryptedTape = Array.from(encrypted);
		machineDecodedTape = Array(machineEncryptedTape.length).fill('_');
		resetMachineRuntime();
		clearTrace();
		appendTrace(`Inicio: cinta encriptada '${encrypted}'.`);
		setStatus('Maquina cargada. Lista para traducir.');
	};

	const haltMachine = (message: string) => {
		machineHalted = true;
		stopAutoRun();
		const final = machineDecodedTape.join('').replace(/_+$/g, '');
		finalMessage = final;
		const matches = final === machineOriginalText;
		setStatus(matches ? `${message} Mensaje final coincide con el original.` : `${message} Mensaje final no coincide.`, matches);
		appendTrace(matches ? 'Verificacion: el resultado final coincide con el mensaje original.' : 'Verificacion: el resultado final NO coincide con el mensaje original.');
	};

	const stepMachine = () => {
		if (machineHalted || machineEncryptedTape.length === 0) {
			return;
		}

		if (machineHead >= machineEncryptedTape.length) {
			currentState = 'qH';
			haltMachine('Traduccion terminada.');
			return;
		}

		if (currentState === 'qRead') {
			machineCurrentRead = machineEncryptedTape[machineHead];
			machineCurrentWritten = '-';
			currentState = 'qDecode';
			stepCount += 1;
			appendTrace(`Paso ${stepCount}: qRead lee '${machineCurrentRead}' en celda ${machineHead}.`);
		} else if (currentState === 'qDecode') {
			const decrypted = decryptChar(machineCurrentRead, machineKey);
			machineCurrentWritten = decrypted;
			currentState = 'qWrite';
			appendTrace(`Paso ${stepCount}: qDecode descifra '${machineCurrentRead}' con codigo ${machineKey} -> '${decrypted}'.`);
		} else if (currentState === 'qWrite') {
			machineDecodedTape[machineHead] = machineCurrentWritten;
			currentState = 'qMove';
			appendTrace(`Paso ${stepCount}: qWrite escribe '${machineCurrentWritten}' en celda ${machineHead}.`);
		} else if (currentState === 'qMove') {
			machineHead += 1;
			machineCurrentRead = '-';
			machineCurrentWritten = '-';
			currentState = 'qRead';
			appendTrace(`Paso ${stepCount}: qMove avanza cabezal a celda ${machineHead}.`);
		}

		finalMessage = machineDecodedTape.join('').replace(/_+$/g, '');
	};

	const runMachine = () => {
		if (machineHalted || machineRunningId !== null || machineEncryptedTape.length === 0) {
			return;
		}

		setStatus('Maquina ejecutando traduccion...');
		runningUI = true;
		machineRunningId = setInterval(() => {
			stepMachine();
			if (machineHalted) {
				stopAutoRun();
			}
		}, RUN_DELAY_MS);
	};

	const pauseMachine = () => {
		stopAutoRun();
		if (!machineHalted) {
			setStatus('Ejecucion pausada.');
		}
	};

	const resetMachine = () => {
		if (!machineEncryptedText) {
			setStatus('Carga un mensaje encriptado en la maquina antes de reiniciar.');
			return;
		}

		stopAutoRun();
		machineEncryptedTape = Array.from(machineEncryptedText);
		machineDecodedTape = Array(machineEncryptedTape.length).fill('_');
		resetMachineRuntime();
		clearTrace();
		appendTrace(`Reinicio: cinta encriptada '${machineEncryptedText}'.`);
		finalMessage = '';
		setStatus('Maquina reiniciada.');
	};

	onMount(() => {
		ensureGeneratedCode();
		const result = prepareEncryption();
		if (result) {
			loadMachine();
		}
	});
</script>

<main class="layout" aria-labelledby="title">
	<header class="hero">
		<div class="hero-content">
			<div>
				<p class="tag">Laboratorio didactico</p>
				<h1 id="title">Maquina de Turing para mensajes</h1>
				<p class="subtitle">Introduce una fecha, genera un codigo diario y observa como la maquina traduce el mensaje encriptado hasta recuperar el texto original.</p>
			</div>
			<div class="authors">
				<p class="authors-label">Taller realizado por:</p>
				<ul class="authors-list">
					<li>Manuel Buitrago</li>
					<li>Jimena Gallego</li>
					<li>Sergio Zapata</li>
				</ul>
			</div>
		</div>
	</header>

	<div class="split-view">
		<div class="work-area">
			<section class="card" aria-labelledby="setup-title">
				<h2 id="setup-title">Configuracion</h2>
				<div class="grid-2">
					<div>
						<label for="reference-date">Fecha de referencia (UTC)</label>
						<div class="input-row">
							<input
								id="reference-date"
								type="date"
								bind:value={referenceDate}
								on:change={ensureGeneratedCode}
								required
							/>
						</div>
					</div>
					<div>
						<label for="generated-code">Codigo generado</label>
						<input id="generated-code" type="text" readonly value={generatedCode} aria-live="polite" />
						<p id="code-explanation" class="code-explanation" aria-live="polite">{codeExplanation}</p>
					</div>
				</div>

				<label for="original-message">Mensaje original</label>
				<textarea id="original-message" rows="3" bind:value={originalMessage}></textarea>

				<div class="buttons">
					<button id="encrypt-btn" type="button" on:click={prepareEncryption}>Encriptar</button>
					<button id="load-machine-btn" type="button" on:click={loadMachine}>Cargar en maquina</button>
				</div>

				<section class="inline-process" aria-labelledby="encryption-title">
					<h2 id="encryption-title">Proceso de encriptado</h2>
					<p id="encryption-summary" class="process-summary">{encryptionSummary}</p>
					<div id="encryption-detail" class="process-detail" aria-live="polite">{@html encryptionDetail}</div>
				</section>

				<label for="encrypted-message">Mensaje resultante (encriptado con codigo <span data-code-instance>{generatedCode || '-'}</span>)</label>
				<textarea id="encrypted-message" rows="3" readonly value={encryptedMessage}></textarea>

				<label for="final-message">Mensaje final (descifrado por la maquina con codigo <span data-code-instance>{generatedCode || '-'}</span>)</label>
				<textarea id="final-message" rows="3" readonly value={finalMessage}></textarea>

				<p id="status" class="status" role="status" aria-live="polite" class:match={statusMatch}>{status}</p>
			</section>

			<section class="card" aria-labelledby="machine-title">
				<h2 id="machine-title">Ejecucion interna de la maquina (codigo <span data-code-instance>{generatedCode || '-'}</span>)</h2>

				<div class="buttons">
					<button id="step-btn" type="button" class="secondary" on:click={stepMachine} disabled={runningUI || machineHalted}>Paso</button>
					<button id="run-btn" type="button" class="secondary" on:click={runMachine} disabled={runningUI || machineHalted}>Ejecutar</button>
					<button id="pause-btn" type="button" class="secondary" on:click={pauseMachine} disabled={!runningUI}>Pausar</button>
					<button id="reset-btn" type="button" class="secondary" on:click={resetMachine}>Reiniciar</button>
				</div>

				<dl class="state-grid">
					<div><dt>Estado</dt><dd id="current-state">{currentState}</dd></div>
					<div><dt>Cabezal</dt><dd id="head-index">{machineHead}</dd></div>
					<div><dt>Simbolo leido</dt><dd id="read-symbol">{machineCurrentRead}</dd></div>
					<div><dt>Simbolo escrito</dt><dd id="written-symbol">{machineCurrentWritten}</dd></div>
					<div><dt>Pasos</dt><dd id="step-count">{stepCount}</dd></div>
				</dl>

				<div id="tape" class="tape" aria-label="Cinta de traduccion de la maquina">
					{#each machineEncryptedTape as encChar, index}
						<div class="cell" class:head={index === machineHead && !machineHalted}>
							<span class="enc">E: {encChar}</span>
							<span class="dec">D: {machineDecodedTape[index] || '_'}</span>
							<span class="index">{index}</span>
						</div>
					{:else}
						<div class="cell"><span class="enc">E: _</span><span class="dec">D: _</span><span class="index">0</span></div>
					{/each}
				</div>
			</section>

			<section class="card" aria-labelledby="trace-title">
				<h2 id="trace-title">Traza de transiciones</h2>
				<ol id="trace" class="trace" aria-live="polite">
					{#each traceLines as line}
						<li>{line}</li>
					{/each}
				</ol>
			</section>
		</div>

		<aside class="side-panel" aria-labelledby="guide-title">
			<section class="card guide-card">
				<h2 id="guide-title">Como funciona</h2>
				<p>La aplicacion combina dos ideas: un codigo diario derivado de una fecha UTC y una maquina didactica que recorre el mensaje encriptado caracter por caracter para reconstruir el original.</p>

				<h3>Proceso general</h3>
				<ol class="guide-list">
					<li>Eliges una fecha de referencia.</li>
					<li>Se calcula un numero diario usando UTC y la formula (dias mod 46) + 1.</li>
					<li>Ese numero se convierte en el codigo de desplazamiento.</li>
					<li>El mensaje original se transforma en un mensaje encriptado.</li>
					<li>La maquina lee el texto encriptado y lo traduce paso a paso.</li>
					<li>El mensaje final debe coincidir con el mensaje original.</li>
				</ol>

				<h3>Que significa el codigo generado</h3>
				<ul class="guide-list plain-list">
					<li>Parte de los dias exactos transcurridos en UTC desde la fecha elegida hasta hoy.</li>
					<li>Ese valor se transforma con la formula (dias mod 46) + 1 para obtener un desplazamiento estable.</li>
					<li>El resultado final indica cuantas posiciones se mueve cada simbolo dentro del alfabeto del sistema.</li>
				</ul>

				<h3>Estados de la maquina</h3>
				<ul class="guide-list plain-list">
					<li><strong>qRead</strong>: lee el simbolo encriptado de la cinta.</li>
					<li><strong>qDecode</strong>: aplica el codigo generado (<span data-code-instance>{generatedCode || '-'}</span>) para descifrar.</li>
					<li><strong>qWrite</strong>: escribe el caracter traducido en la salida.</li>
					<li><strong>qMove</strong>: mueve el cabezal a la siguiente posicion.</li>
					<li><strong>qH</strong>: estado final de parada.</li>
				</ul>

				<h3>Como usarlo</h3>
				<ol class="guide-list">
					<li>Introduce la fecha y pulsa Generar codigo.</li>
					<li>Escribe el mensaje original.</li>
					<li>Pulsa Encriptar para producir el texto cifrado.</li>
					<li>Pulsa Cargar en maquina para preparar la cinta.</li>
					<li>Usa Paso para avanzar manualmente o Ejecutar para verlo seguido.</li>
					<li>Consulta la traza y el mensaje final para verificar el resultado.</li>
				</ol>
			</section>
		</aside>
	</div>
</main>

<style>
	:root {
		--bg-1: #fff7e5;
		--bg-2: #ecf8ff;
		--ink: #1c2233;
		--muted: #4f6078;
		--card: #ffffff;
		--line: #d2deef;
		--accent: #0f766e;
		--accent-2: #f59e0b;
		--accent-soft: #e7f6f4;
		--focus: #1d4ed8;
		--ok: #166534;
		--shadow: 0 14px 36px rgba(26, 34, 50, 0.12);
		--radius: 16px;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(html, body) {
		margin: 0;
		padding: 0;
	}

	:global(body) {
		min-height: 100vh;
		color: var(--ink);
		font-family: "Trebuchet MS", "Gill Sans", "Segoe UI", sans-serif;
		background:
			radial-gradient(circle at 10% 12%, #ffe0af 0%, transparent 34%),
			radial-gradient(circle at 92% 94%, #cae8ff 0%, transparent 37%),
			linear-gradient(145deg, var(--bg-1), var(--bg-2));
		line-height: 1.5;
	}

	.layout {
		width: min(1000px, 92vw);
		margin: 0 auto;
		padding: 1.8rem 0 2.5rem;
	}

	.split-view {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.95fr);
		gap: 1rem;
		align-items: start;
	}

	.work-area {
		min-width: 0;
	}

	.side-panel {
		min-width: 0;
	}

	.hero {
		margin-bottom: 1rem;
	}

	.hero-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
	}

	.authors {
		text-align: right;
		flex-shrink: 0;
	}

	.authors-label {
		margin: 0 0 0.5rem 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.authors-list {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 0.9rem;
		color: var(--ink);
		line-height: 1.6;
	}

	.authors-list li {
		margin: 0;
		font-weight: 500;
	}

	.tag {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.74rem;
		color: var(--muted);
	}

	:global(h1) {
		margin: 0.3rem 0 0;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(1.8rem, 3.5vw, 2.7rem);
		line-height: 1.1;
	}

	.subtitle {
		margin: 0.6rem 0 0.2rem;
		color: var(--muted);
		max-width: 62ch;
	}

	.card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 1rem;
		margin-bottom: 0.95rem;
	}

	:global(h2) {
		margin: 0 0 0.8rem;
		font-size: 1.04rem;
	}

	:global(label) {
		display: inline-block;
		margin-bottom: 0.45rem;
		font-weight: 700;
	}

	.input-row {
		display: grid;
		gap: 0.55rem;
		grid-template-columns: 1fr auto;
	}

	.grid-2 {
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 1fr));
		gap: 0.8rem;
		margin-bottom: 0.65rem;
	}

	:global(input, textarea, button) {
		font: inherit;
	}

	:global(input, textarea) {
		width: 100%;
		border: 1px solid #9aa9c4;
		border-radius: 10px;
		padding: 0.55rem 0.68rem;
		color: var(--ink);
	}

	:global(textarea) {
		resize: vertical;
		min-height: 84px;
		margin-bottom: 0.65rem;
	}

	:global(button) {
		border: 1px solid transparent;
		border-radius: 10px;
		background: var(--accent);
		color: #fff;
		padding: 0.55rem 0.9rem;
		cursor: pointer;
		transition: background-color 150ms ease, transform 150ms ease;
	}

	:global(button:hover) {
		background: #0d5b54;
	}

	:global(button:active) {
		transform: translateY(1px);
	}

	:global(button.secondary) {
		background: var(--accent-soft);
		color: var(--ink);
		border-color: #9ed5cf;
	}

	:global(button.secondary:hover) {
		background: #cdeae6;
	}

	:global(button:disabled) {
		opacity: 0.55;
		cursor: not-allowed;
	}

	:global(input:focus-visible, textarea:focus-visible, button:focus-visible) {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}

	.help {
		margin: 0.5rem 0 0;
		color: var(--muted);
		font-size: 0.92rem;
	}

	.buttons {
		margin-top: 0.75rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.status {
		margin: 0.72rem 0 0;
		min-height: 1.5rem;
		color: var(--muted);
	}

	.status.match {
		color: var(--ok);
		font-weight: 700;
	}

	.code-explanation {
		margin: 0.45rem 0 0;
		font-size: 0.92rem;
		color: var(--muted);
		line-height: 1.45;
	}

	.process-summary {
		margin: 0 0 0.8rem;
		color: var(--muted);
	}

	.process-detail {
		border: 1px solid var(--line);
		border-radius: 12px;
		background: linear-gradient(180deg, #fbfdff, #f3f8ff);
		padding: 0.75rem 0.8rem;
		color: var(--muted);
	}

	:global(.process-detail p) {
		margin: 0 0 0.55rem;
	}

	:global(.process-detail ul) {
		margin: 0;
		padding-left: 1.15rem;
	}

	:global(.process-detail li) {
		margin-bottom: 0.38rem;
	}

	.state-grid {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(120px, 1fr));
		gap: 0.55rem;
		margin-top: 0.85rem;
	}

	.state-grid div {
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 0.52rem;
		background: #f9fbff;
	}

	:global(dt) {
		font-size: 0.82rem;
		color: var(--muted);
	}

	:global(dd) {
		margin: 0.25rem 0 0;
		font-weight: 800;
		font-size: 1.1rem;
	}

	.tape {
		margin-top: 0.85rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(76px, 1fr));
		gap: 0.42rem;
	}

	.cell {
		border: 1px solid #c6d2e8;
		border-radius: 10px;
		background: #f9fbff;
		text-align: center;
		padding: 0.42rem 0.25rem;
	}

	.cell :global(.enc) {
		display: block;
		font-size: 1rem;
		font-weight: 700;
	}

	.cell :global(.dec) {
		display: block;
		margin-top: 0.08rem;
		font-size: 1rem;
		font-weight: 800;
		color: var(--ok);
	}

	.cell :global(.index) {
		display: block;
		margin-top: 0.16rem;
		font-size: 0.75rem;
		color: var(--muted);
	}

	.cell.head {
		border-color: var(--accent-2);
		background: #fff5df;
		box-shadow: inset 0 0 0 2px #ffe0ab;
	}

	.trace {
		margin: 0;
		padding-left: 1.2rem;
		max-height: 220px;
		overflow: auto;
	}

	:global(.trace li) {
		padding: 0.28rem 0;
	}

	.guide-card {
		position: sticky;
		top: 1rem;
	}

	:global(.guide-card p) {
		margin: 0 0 1rem;
		color: var(--muted);
	}

	:global(.guide-card h3) {
		margin: 1rem 0 0.55rem;
		font-size: 0.96rem;
	}

	.guide-list {
		margin: 0;
		padding-left: 1.2rem;
	}

	:global(.guide-list li) {
		margin-bottom: 0.45rem;
	}

	.plain-list {
		list-style: disc;
	}

	@media (max-width: 760px) {
		.split-view {
			grid-template-columns: 1fr;
		}

		.guide-card {
			position: static;
		}

		.grid-2 {
			grid-template-columns: 1fr;
		}

		.state-grid {
			grid-template-columns: repeat(2, minmax(120px, 1fr));
		}

		.input-row {
			grid-template-columns: 1fr;
		}
	}
</style>
