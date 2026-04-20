<script lang="ts">
	import { onMount } from 'svelte';

	const ALPHABET = 'ABCDEFGHIJKLMN\u00D1OPQRSTUVWXYZ0123456789 .,;:!?()-';
	const RUN_DELAY_MS = 280;
	const MS_PER_DAY = 86400000;

	type MachineState = 'qRead' | 'qDecode' | 'qWrite' | 'qMove' | 'qH';

	let referenceDate = '1970-01-01';
	let generatedCode = '';
	let codeExplanation =
		'El codigo se obtiene contando los dias UTC transcurridos desde la fecha elegida y reduciendo ese valor a un numero del alfabeto.';

	let originalMessage = 'HOLA EQUIPO, HOY EXPLICAMOS TURING.';
	let encryptedMessage = '';
	let finalMessage = '';

	let encryptionSummary = 'Todavia no se ha generado el recorrido del cifrado.';
	let encryptionDetailIntro = '';
	let encryptionDetailSteps: string[] = [];

	let status = '';
	let statusMatch = false;

	let currentState: MachineState = 'qRead';
	let headIndex = 0;
	let readSymbol = '-';
	let writtenSymbol = '-';
	let stepCount = 0;

	let encryptedTape: string[] = [];
	let decodedTape: string[] = [];
	let trace: string[] = [];

	let halted = false;
	let running = false;
	let runTimer: ReturnType<typeof setInterval> | null = null;
	let pendingDecoded = '';
	let machineKey = 1;
	let machineOriginalText = '';
	let machineEncryptedText = '';

	const normalizeMessage = (value: string) =>
		value
			.toUpperCase()
			.replace(/[\u00C1\u00C0\u00C4\u00C2]/g, 'A')
			.replace(/[\u00C9\u00C8\u00CB\u00CA]/g, 'E')
			.replace(/[\u00CD\u00CC\u00CF\u00CE]/g, 'I')
			.replace(/[\u00D3\u00D2\u00D6\u00D4]/g, 'O')
			.replace(/[\u00DA\u00D9\u00DC\u00DB]/g, 'U');

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

	const getCodeFromDate = (referenceDateStr: string) => {
		const daily = getDailyNumber(referenceDateStr);
		const range = ALPHABET.length - 1;
		return (daily % range) + 1;
	};

	const shiftChar = (char: string, shift: number) => {
		const index = ALPHABET.indexOf(char);
		if (index === -1) {
			return char;
		}

		const size = ALPHABET.length;
		const shifted = (((index + shift) % size) + size) % size;
		return ALPHABET[shifted];
	};

	const encryptMessage = (message: string, key: number) => {
		const normalized = normalizeMessage(message);
		return Array.from(normalized, (char) => shiftChar(char, key)).join('');
	};

	const decryptChar = (char: string, key: number) => shiftChar(char, -key);

	const setStatus = (message: string, isMatch = false) => {
		status = message;
		statusMatch = isMatch;
	};

	const renderEncryptionProcess = (key: number | null) => {
		if (key === null || Number.isNaN(key)) {
			encryptionSummary = 'Todavia no se ha generado el recorrido del cifrado.';
			encryptionDetailIntro = '';
			encryptionDetailSteps = [];
			return;
		}

		encryptionSummary = `El codigo ${key} sale del conteo de dias y define un desplazamiento uniforme para todos los simbolos validos del mensaje.`;
		encryptionDetailIntro = `Primero se cuentan los dias UTC transcurridos desde la fecha elegida. Luego ese total se reduce a un numero valido del alfabeto, y la maquina usa ese resultado para mover ${key} posiciones cada simbolo del mensaje.`;
		encryptionDetailSteps = [
			`Se toma el numero total de dias transcurridos y se convierte en el codigo ${key}.`,
			`Si el simbolo forma parte del alfabeto, se sustituye por otro simbolo desplazado ${key} posiciones.`,
			'Si el desplazamiento supera el final del alfabeto, el proceso vuelve al inicio y continua desde ahi.',
			'Todos los caracteres del mensaje se transforman con la misma regla, por eso el cifrado es consistente.',
			'Durante el descifrado, la maquina aplica el movimiento inverso para recuperar exactamente el mensaje original.'
		];
	};

	const renderCodeExplanation = (referenceDateStr: string, dailyNumber: number, code: number) => {
		codeExplanation = `Dias UTC transcurridos desde ${referenceDateStr}: ${dailyNumber}. Formula usada: (dias mod ${ALPHABET.length - 1}) + 1. Resultado: codigo ${code}, que desplaza ${code} posiciones cada simbolo del alfabeto.`;
	};

	const ensureGeneratedCode = () => {
		try {
			const dailyNumber = getDailyNumber(referenceDate);
			const key = getCodeFromDate(referenceDate);
			generatedCode = String(key);
			renderCodeExplanation(referenceDate, dailyNumber, key);
			renderEncryptionProcess(key);
			return key;
		} catch {
			setStatus('Fecha invalida. Corrige la fecha para generar el codigo.');
			codeExplanation =
				'No se pudo calcular el codigo. Revisa la fecha para obtener los dias UTC y convertirlos en un desplazamiento valido.';
			renderEncryptionProcess(null);
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
		renderEncryptionProcess(key);

		setStatus(`Mensaje encriptado con codigo ${key}.`);
		return { original, encrypted, key };
	};

	const resetMachineRuntime = () => {
		headIndex = 0;
		currentState = 'qRead';
		stepCount = 0;
		halted = false;
		readSymbol = '-';
		writtenSymbol = '-';
		pendingDecoded = '';
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
		encryptedTape = Array.from(encrypted);
		decodedTape = Array(encryptedTape.length).fill('_');
		resetMachineRuntime();
		trace = [];
		appendTrace(`Inicio: cinta encriptada '${encrypted}'.`);
		setStatus('Maquina cargada. Lista para traducir.');
	};

	const appendTrace = (line: string) => {
		trace = [...trace, line];
	};

	const haltMachine = (message: string) => {
		halted = true;
		stopAutoRun();
		const final = decodedTape.join('').replace(/_+$/g, '');
		finalMessage = final;
		const matches = final === machineOriginalText;
		setStatus(
			matches
				? `${message} Mensaje final coincide con el original.`
				: `${message} Mensaje final no coincide.`,
			matches
		);
		appendTrace(
			matches
				? 'Verificacion: el resultado final coincide con el mensaje original.'
				: 'Verificacion: el resultado final NO coincide con el mensaje original.'
		);
	};

	const stepMachine = () => {
		if (halted || encryptedTape.length === 0) {
			return;
		}

		if (headIndex >= encryptedTape.length) {
			currentState = 'qH';
			haltMachine('Traduccion terminada.');
			return;
		}

		if (currentState === 'qRead') {
			readSymbol = encryptedTape[headIndex];
			writtenSymbol = '-';
			currentState = 'qDecode';
			stepCount += 1;
			appendTrace(`Paso ${stepCount}: qRead lee '${readSymbol}' en celda ${headIndex}.`);
		} else if (currentState === 'qDecode') {
			pendingDecoded = decryptChar(readSymbol, machineKey);
			currentState = 'qWrite';
			stepCount += 1;
			appendTrace(
				`Paso ${stepCount}: qDecode aplica codigo ${machineKey} y obtiene '${pendingDecoded}'.`
			);
		} else if (currentState === 'qWrite') {
			decodedTape[headIndex] = pendingDecoded;
			decodedTape = [...decodedTape];
			writtenSymbol = pendingDecoded;
			currentState = 'qMove';
			stepCount += 1;
			appendTrace(`Paso ${stepCount}: qWrite escribe '${pendingDecoded}' en salida.`);
		} else if (currentState === 'qMove') {
			headIndex += 1;
			readSymbol = '-';
			writtenSymbol = '-';
			currentState = headIndex >= encryptedTape.length ? 'qH' : 'qRead';
			stepCount += 1;
			appendTrace(`Paso ${stepCount}: qMove desplaza el cabezal a ${headIndex}.`);
			if (currentState === 'qH') {
				haltMachine('Traduccion terminada.');
				return;
			}
		}

		finalMessage = decodedTape.join('').replace(/_+$/g, '');
	};

	const runMachine = () => {
		if (halted || runTimer !== null || encryptedTape.length === 0) {
			return;
		}

		setStatus('Maquina ejecutando traduccion...');
		running = true;
		runTimer = setInterval(() => {
			stepMachine();
			if (halted) {
				stopAutoRun();
			}
		}, RUN_DELAY_MS);
	};

	const stopAutoRun = () => {
		if (runTimer !== null) {
			clearInterval(runTimer);
			runTimer = null;
		}
		running = false;
	};

	const pauseMachine = () => {
		stopAutoRun();
		if (!halted) {
			setStatus('Ejecucion pausada.');
		}
	};

	const resetMachine = () => {
		if (!machineEncryptedText) {
			loadMachine();
			return;
		}

		stopAutoRun();
		encryptedTape = Array.from(machineEncryptedText);
		decodedTape = Array(encryptedTape.length).fill('_');
		resetMachineRuntime();
		trace = [];
		appendTrace(`Reinicio: cinta encriptada '${machineEncryptedText}'.`);
		finalMessage = '';
		setStatus('Maquina reiniciada.');
	};

	const handleEncryptAndLoad = () => {
		const result = prepareEncryption();
		if (!result) {
			return;
		}

		loadMachine();
	};

	onMount(() => {
		ensureGeneratedCode();
		handleEncryptAndLoad();

		return () => {
			stopAutoRun();
		};
	});
</script>

<svelte:head>
	<title>Turing: cifrado y traduccion visual</title>
	<meta
		name="description"
		content="Maquina de Turing didactica para cifrar y descifrar frases con un codigo obtenido a partir de los dias UTC transcurridos."
	/>
</svelte:head>

<main class="layout" aria-labelledby="title">
	<header class="hero">
		<p class="tag">Laboratorio didactico</p>
		<h1 id="title">Maquina de Turing para mensajes</h1>
		<p class="subtitle">
			Introduce una fecha, genera un codigo a partir de los dias transcurridos y observa como la maquina traduce el mensaje
			encriptado hasta recuperar el texto original.
		</p>
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
						<input
							id="generated-code"
							type="text"
							bind:value={generatedCode}
							readonly
							aria-live="polite"
						/>
						<p id="code-explanation" class="code-explanation" aria-live="polite">
							{codeExplanation}
						</p>
					</div>
				</div>

				<label for="original-message">Mensaje original</label>
				<textarea id="original-message" rows="3" bind:value={originalMessage} disabled={running}
				></textarea>

				<div class="buttons">
					<button id="encrypt-btn" type="button" on:click={prepareEncryption} disabled={running}
						>Encriptar</button
					>
					<button id="load-machine-btn" type="button" on:click={loadMachine} disabled={running}
						>Cargar en maquina</button
					>
				</div>

				<section class="inline-process" aria-labelledby="encryption-title">
					<h2 id="encryption-title">Proceso de encriptado</h2>
					<p id="encryption-summary" class="process-summary">{encryptionSummary}</p>
					<div id="encryption-detail" class="process-detail" aria-live="polite">
						{#if encryptionDetailIntro}
							<p>{encryptionDetailIntro}</p>
						{/if}
						{#if encryptionDetailSteps.length > 0}
							<ul>
								{#each encryptionDetailSteps as step}
									<li>{step}</li>
								{/each}
							</ul>
						{/if}
					</div>
				</section>

				<label for="encrypted-message">Mensaje resultante (encriptado)</label>
				<textarea
					id="encrypted-message"
					rows="3"
					bind:value={encryptedMessage}
					readonly
					disabled={running}
				></textarea>

				<label for="final-message">Mensaje final (descifrado por la maquina)</label>
				<textarea id="final-message" rows="3" bind:value={finalMessage} readonly></textarea>

				<p
					id="status"
					class={`status ${statusMatch ? 'match' : ''}`}
					role="status"
					aria-live="polite"
				>
					{status}
				</p>
			</section>

			<section class="card" aria-labelledby="machine-title">
				<h2 id="machine-title">Ejecucion interna de la maquina</h2>

				<div class="buttons">
					<button
						id="step-btn"
						type="button"
						class="secondary"
						on:click={stepMachine}
						disabled={running || halted}>Paso</button
					>
					<button
						id="run-btn"
						type="button"
						class="secondary"
						on:click={runMachine}
						disabled={running || halted}>Ejecutar</button
					>
					<button
						id="pause-btn"
						type="button"
						class="secondary"
						on:click={pauseMachine}
						disabled={!running}>Pausar</button
					>
					<button id="reset-btn" type="button" class="secondary" on:click={resetMachine}
						>Reiniciar</button
					>
				</div>

				<dl class="state-grid">
					<div>
						<dt>Estado</dt>
						<dd id="current-state">{currentState}</dd>
					</div>
					<div>
						<dt>Cabezal</dt>
						<dd id="head-index">{headIndex}</dd>
					</div>
					<div>
						<dt>Simbolo leido</dt>
						<dd id="read-symbol">{readSymbol}</dd>
					</div>
					<div>
						<dt>Simbolo escrito</dt>
						<dd id="written-symbol">{writtenSymbol}</dd>
					</div>
					<div>
						<dt>Pasos</dt>
						<dd id="step-count">{stepCount}</dd>
					</div>
				</dl>

				<div class="tape" aria-label="Cinta de traduccion de la maquina">
					{#if encryptedTape.length === 0}
						<div class="cell">
							<span class="enc">E: _</span><span class="dec">D: _</span><span class="index">0</span>
						</div>
					{:else}
						{#each encryptedTape as encChar, index}
							<div class={`cell ${index === headIndex && !halted ? 'head' : ''}`}>
								<span class="enc">E: {encChar}</span>
								<span class="dec">D: {decodedTape[index] || '_'}</span>
								<span class="index">{index}</span>
							</div>
						{/each}
					{/if}
				</div>
			</section>

			<section class="card" aria-labelledby="trace-title">
				<h2 id="trace-title">Traza de transiciones</h2>
				<ol id="trace" class="trace" aria-live="polite">
					{#each trace as line}
						<li>{line}</li>
					{/each}
				</ol>
			</section>
		</div>

		<aside class="side-panel" aria-labelledby="guide-title">
			<section class="card guide-card">
				<h2 id="guide-title">Como funciona</h2>
				<p>
					La aplicacion combina dos ideas: un codigo derivado de los dias transcurridos desde una fecha UTC y una maquina
					didactica que recorre el mensaje encriptado caracter por caracter para reconstruir el
					original.
				</p>

				<h3>Proceso general</h3>
				<ol class="guide-list">
					<li>Eliges una fecha de referencia.</li>
					<li>Se cuentan los dias exactos transcurridos en UTC desde esa fecha hasta hoy.</li>
					<li>Ese total se reduce a un codigo de desplazamiento entre 1 y {ALPHABET.length - 1}.</li>
					<li>El mensaje original se transforma en un mensaje encriptado.</li>
					<li>La maquina lee el texto encriptado y lo traduce paso a paso.</li>
					<li>El mensaje final debe coincidir con el mensaje original.</li>
				</ol>

				<h3>Que significa el codigo generado</h3>
				<ul class="guide-list plain-list">
					<li>Parte de los dias exactos transcurridos en UTC desde la fecha elegida hasta hoy.</li>
					<li>
						Ese valor se reduce con una regla simple para obtener un desplazamiento estable dentro del alfabeto.
					</li>
					<li>
						El resultado final indica cuantas posiciones se mueve cada simbolo dentro del alfabeto
						del sistema.
					</li>
				</ul>

				<h3>Estados de la maquina</h3>
				<ul class="guide-list plain-list">
					<li><strong>qRead</strong>: lee el simbolo encriptado de la cinta.</li>
					<li><strong>qDecode</strong>: aplica el codigo generado para descifrar.</li>
					<li><strong>qWrite</strong>: escribe el caracter traducido en la salida.</li>
					<li><strong>qMove</strong>: mueve el cabezal a la siguiente posicion.</li>
					<li><strong>qH</strong>: estado final de parada.</li>
				</ul>

				<h3>Como usarlo</h3>
				<ol class="guide-list">
					<li>Introduce la fecha.</li>
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
	:global(:root) {
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

	:global(body) {
		background:
			radial-gradient(circle at 10% 12%, #ffe0af 0%, transparent 34%),
			radial-gradient(circle at 92% 94%, #cae8ff 0%, transparent 37%),
			linear-gradient(145deg, var(--bg-1), var(--bg-2));
	}

	.layout {
		width: min(1000px, 92vw);
		margin: 0 auto;
		padding: 1.8rem 0 2.5rem;
		color: var(--ink);
		font-family: 'Trebuchet MS', 'Gill Sans', 'Segoe UI', sans-serif;
		line-height: 1.5;
	}

	.split-view {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.95fr);
		gap: 1rem;
		align-items: start;
	}

	.work-area,
	.side-panel {
		min-width: 0;
	}

	.hero {
		margin-bottom: 1rem;
	}

	.tag {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.74rem;
		color: var(--muted);
	}

	h1 {
		margin: 0.3rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
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

	h2 {
		margin: 0 0 0.8rem;
		font-size: 1.04rem;
	}

	label {
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

	input,
	textarea,
	button {
		font: inherit;
	}

	input,
	textarea {
		width: 100%;
		border: 1px solid #9aa9c4;
		border-radius: 10px;
		padding: 0.55rem 0.68rem;
		color: var(--ink);
	}

	textarea {
		resize: vertical;
		min-height: 84px;
		margin-bottom: 0.65rem;
	}

	button {
		border: 1px solid transparent;
		border-radius: 10px;
		background: var(--accent);
		color: #fff;
		padding: 0.55rem 0.9rem;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			transform 150ms ease;
	}

	button:hover {
		background: #0d5b54;
	}

	button:active {
		transform: translateY(1px);
	}

	button.secondary {
		background: var(--accent-soft);
		color: var(--ink);
		border-color: #9ed5cf;
	}

	button.secondary:hover {
		background: #cdeae6;
	}

	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	input:focus-visible,
	textarea:focus-visible,
	button:focus-visible {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
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

	.process-detail :global(p) {
		margin: 0 0 0.55rem;
	}

	.process-detail :global(ul) {
		margin: 0;
		padding-left: 1.15rem;
	}

	.process-detail :global(li) {
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

	dt {
		font-size: 0.82rem;
		color: var(--muted);
	}

	dd {
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

	.cell .enc {
		display: block;
		font-size: 1rem;
		font-weight: 700;
	}

	.cell .dec {
		display: block;
		margin-top: 0.08rem;
		font-size: 1rem;
		font-weight: 800;
		color: var(--ok);
	}

	.cell .index {
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

	.trace li {
		padding: 0.28rem 0;
	}

	.guide-card {
		position: sticky;
		top: 1rem;
	}

	.guide-card p {
		margin: 0 0 1rem;
		color: var(--muted);
	}

	.guide-card h3 {
		margin: 1rem 0 0.55rem;
		font-size: 0.96rem;
	}

	.guide-list {
		margin: 0;
		padding-left: 1.2rem;
	}

	.guide-list li {
		margin-bottom: 0.45rem;
	}

	.plain-list {
		list-style: disc;
	}

	.match {
		color: var(--ok);
		font-weight: 700;
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
