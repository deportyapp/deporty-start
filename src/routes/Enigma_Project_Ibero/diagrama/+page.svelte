<script lang="ts">
	import TuringDiagram from '$lib/components/enigma/TuringDiagram.svelte';
	import { onDestroy } from 'svelte';

	/* ══════ Cipher logic ══════ */
	const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789 .,;:!?()-";
	const RUN_DELAY_MS = 280;

	const normalizeMessage = (value: string) =>
		value
			.toUpperCase()
			.replace(/[ÁÀÄÂ]/g, 'A')
			.replace(/[ÉÈËÊ]/g, 'E')
			.replace(/[ÍÌÏÎ]/g, 'I')
			.replace(/[ÓÒÖÔ]/g, 'O')
			.replace(/[ÚÙÜÛ]/g, 'U');

	const shiftChar = (char: string, shift: number) => {
		const index = ALPHABET.indexOf(char);
		if (index === -1) return char;
		const size = ALPHABET.length;
		return ALPHABET[((index + shift) % size + size) % size];
	};

	const encryptMessage = (message: string, key: number) => {
		const normalized = normalizeMessage(message);
		return Array.from(normalized, (char) => shiftChar(char, key)).join('');
	};

	const decryptChar = (char: string, key: number) => shiftChar(char, -key);

	/* ══════ State ══════ */
	let messageInput = $state('HOLA MUNDO');
	let cipherKey = $state(5);

	let currentState: string = $state('qRead');
	let machineHead = $state(0);
	let encryptedTape: string[] = $state([]);
	let decodedTape: string[] = $state([]);
	let machineHalted = $state(false);
	let machineRunningId: ReturnType<typeof setInterval> | null = $state(null);
	let machineCurrentRead = $state('-');
	let machineKey = $state(5);
	let status = $state('Escribe un mensaje y pulsa "Encriptar y cargar".');
	let runningUI = $state(false);

	/* ══════ State label map ══════ */
	const stateLabels: Record<string, string> = {
		qRead: '📖 Leer',
		qDecode: '🔓 Descifrar',
		qWrite: '✏️ Escribir',
		qMove: '➡️ Avanzar',
		qH: '🏁 Fin'
	};

	let stateLabel = $derived(stateLabels[currentState] ?? currentState);

	/* ══════ Machine logic ══════ */

	function encryptAndLoad() {
		pauseMachine();
		const normalized = normalizeMessage(messageInput);
		const encrypted = encryptMessage(messageInput, cipherKey);
		encryptedTape = encrypted.split('');
		decodedTape = Array(encryptedTape.length).fill('_');
		machineHead = 0;
		currentState = 'qRead';
		machineHalted = false;
		machineCurrentRead = '-';
		machineKey = cipherKey;
		status = `Cinta cargada con ${encryptedTape.length} símbolos. Clave: ${machineKey}.`;
	}

	function stepMachine() {
		if (machineHalted || encryptedTape.length === 0) return;

		switch (currentState) {
			case 'qRead': {
				const ch = encryptedTape[machineHead] ?? '_';
				machineCurrentRead = ch;
				currentState = 'qDecode';
				status = `Leyendo símbolo «${ch}» en posición ${machineHead}.`;
				break;
			}
			case 'qDecode': {
				const decoded = decryptChar(machineCurrentRead, machineKey);
				machineCurrentRead = decoded;
				currentState = 'qWrite';
				status = `Descifrado: «${encryptedTape[machineHead]}» → «${decoded}» (clave ${machineKey}).`;
				break;
			}
			case 'qWrite': {
				decodedTape[machineHead] = machineCurrentRead;
				decodedTape = [...decodedTape]; // trigger reactivity
				currentState = 'qMove';
				status = `Escribiendo «${machineCurrentRead}» en posición ${machineHead}.`;
				break;
			}
			case 'qMove': {
				machineHead++;
				if (machineHead >= encryptedTape.length) {
					currentState = 'qH';
					machineHalted = true;
					pauseMachine();
					status = `✅ ¡Descifrado completo! Resultado: ${decodedTape.join('')}`;
				} else {
					currentState = 'qRead';
					status = `Avanzando al símbolo ${machineHead} de ${encryptedTape.length}.`;
				}
				break;
			}
			default:
				break;
		}
	}

	function runMachine() {
		if (machineHalted || encryptedTape.length === 0) return;
		runningUI = true;
		machineRunningId = setInterval(() => {
			stepMachine();
			if (machineHalted) pauseMachine();
		}, RUN_DELAY_MS);
	}

	function pauseMachine() {
		if (machineRunningId !== null) {
			clearInterval(machineRunningId);
			machineRunningId = null;
		}
		runningUI = false;
	}

	function resetMachine() {
		pauseMachine();
		if (encryptedTape.length > 0) {
			decodedTape = Array(encryptedTape.length).fill('_');
			machineHead = 0;
			currentState = 'qRead';
			machineHalted = false;
			machineCurrentRead = '-';
			status = `Reiniciado. Cinta con ${encryptedTape.length} símbolos lista.`;
		} else {
			status = 'Escribe un mensaje y pulsa "Encriptar y cargar".';
		}
	}

	onDestroy(() => {
		pauseMachine();
	});
</script>

<main class="layout" aria-labelledby="diagram-title">
	<section class="card header-card">
		<h1 id="diagram-title">¿Cómo funciona nuestra máquina de descifrado?</h1>
		<p class="intro-text">
			Este diagrama muestra paso a paso cómo la máquina toma un mensaje cifrado y lo convierte de
			vuelta al mensaje original. Usa los controles para ver la simulación en vivo.
		</p>
	</section>

	<div class="simulator-grid">
		<!-- ── Left: Interactive diagram ── -->
		<section class="card diagram-card">
			<TuringDiagram
				{currentState}
				headIndex={machineHead}
				{encryptedTape}
				{decodedTape}
				halted={machineHalted}
			/>
		</section>

		<!-- ── Right: Controls ── -->
		<aside class="card controls-card">
			<h2>🎛️ Panel de control</h2>

			<div class="control-group">
				<label for="msg-input">Mensaje a cifrar</label>
				<input
					id="msg-input"
					type="text"
					bind:value={messageInput}
					placeholder="Ej: HOLA MUNDO"
					maxlength="60"
				/>
			</div>

			<div class="control-group">
				<label for="key-input">Clave de cifrado (1–46)</label>
				<input
					id="key-input"
					type="number"
					bind:value={cipherKey}
					min="1"
					max="46"
				/>
			</div>

			<div class="btn-row">
				<button class="btn btn-primary" onclick={encryptAndLoad}>
					🔐 Encriptar y cargar
				</button>
			</div>

			<hr class="separator" />

			<div class="btn-row">
				<button
					class="btn btn-step"
					onclick={stepMachine}
					disabled={machineHalted || encryptedTape.length === 0}
				>
					⏭️ Paso
				</button>
				{#if runningUI}
					<button class="btn btn-pause" onclick={pauseMachine}>
						⏸️ Pausar
					</button>
				{:else}
					<button
						class="btn btn-run"
						onclick={runMachine}
						disabled={machineHalted || encryptedTape.length === 0}
					>
						▶️ Ejecutar
					</button>
				{/if}
				<button
					class="btn btn-reset"
					onclick={resetMachine}
					disabled={encryptedTape.length === 0}
				>
					🔄 Reiniciar
				</button>
			</div>

			<hr class="separator" />

			<!-- Status display -->
			<div class="status-panel">
				<div class="status-row">
					<span class="status-key">Estado:</span>
					<span class="status-value state-badge">{stateLabel}</span>
				</div>
				<div class="status-row">
					<span class="status-key">Cabezal:</span>
					<span class="status-value">{machineHead} / {encryptedTape.length}</span>
				</div>
				<div class="status-row">
					<span class="status-key">Último leído:</span>
					<span class="status-value mono">{machineCurrentRead}</span>
				</div>
			</div>

			<p class="status-message">{status}</p>

			{#if machineHalted}
				<div class="result-box">
					<strong>Resultado:</strong>
					<code>{decodedTape.join('')}</code>
				</div>
			{/if}
		</aside>
	</div>

	<!-- ── Bottom: Educational explanation ── -->
	<section class="card explanation-card">
		<h2>📚 Explicación paso a paso</h2>
		<p>
			Imagina que tienes un mensaje secreto escrito en una tira de papel, letra por letra. La
			máquina va recorriendo esa tira de izquierda a derecha y traduce cada letra una por una.
		</p>

		<h3>¿Qué hace en cada letra?</h3>
		<ol class="states-list">
			<li>
				<strong>Leer:</strong> La máquina mira la letra cifrada que tiene delante. Por ejemplo, si ve
				una «H», la toma y la guarda en su memoria.
			</li>
			<li>
				<strong>Descifrar:</strong> Usa la clave del día (un número) para convertir esa letra cifrada
				en la letra original. Es como girar una rueda de letras hacia atrás.
			</li>
			<li>
				<strong>Escribir:</strong> Anota la letra ya descifrada en una nueva tira de papel, que es
				donde se va armando el mensaje traducido.
			</li>
			<li>
				<strong>Avanzar:</strong> Mueve su «dedo» una posición a la derecha para pasar a la siguiente
				letra. Si todavía hay letras, repite todo desde el paso 1. Si ya no hay más, se detiene.
			</li>
		</ol>

		<h3>¿Cuándo termina?</h3>
		<p>
			<strong>Fin:</strong> Cuando la máquina llega al final del mensaje cifrado y ya no hay más letras
			por leer, se detiene automáticamente. En ese momento, compara el mensaje traducido con el
			original para confirmar que todo salió bien.
		</p>

		<h3>¿Por qué funciona siempre?</h3>
		<p>
			Cada letra se descifra usando siempre la misma clave, así que el resultado es exacto. Es como
			si alguien hubiera girado cada letra 5 posiciones al cifrar, y la máquina simplemente las
			gira 5 posiciones de vuelta.
		</p>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Trebuchet MS', 'Gill Sans', 'Segoe UI', sans-serif;
		background: #f3f7fb;
		color: #1c2233;
	}

	.layout {
		width: min(1600px, 98vw);
		margin: 1.6rem auto 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.card {
		background: #ffffff;
		border: 1px solid #d2deef;
		border-radius: 18px;
		box-shadow: 0 16px 40px rgba(20, 40, 70, 0.08);
		padding: 2rem 2.5rem;
	}

	/* ── Header ── */
	.header-card {
		padding-bottom: 1.2rem;
	}

	h1 {
		margin: 0 0 0.8rem;
		font-size: clamp(1.4rem, 2.5vw, 1.9rem);
	}

	h2 {
		margin: 0 0 0.8rem;
		font-size: 1.2rem;
		color: #0f766e;
	}

	h3 {
		margin: 1rem 0 0.5rem;
		font-size: 1rem;
		color: #134e4a;
		font-weight: 600;
	}

	p {
		margin: 0 0 0.7rem;
		line-height: 1.6;
		color: #45546e;
		font-size: 0.9rem;
	}

	.intro-text {
		margin-bottom: 0;
		font-size: 0.95rem;
		color: #45546e;
		max-width: 900px;
	}

	/* ── Simulator grid ── */
	.simulator-grid {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 1.5rem;
		align-items: start;
	}

	.diagram-card {
		padding: 1rem 1.5rem;
		min-width: 0;
	}

	/* ── Controls ── */
	.controls-card {
		min-width: 0;
		background: #fafcfe;
		border-left: 4px solid #0f766e;
	}

	.control-group {
		margin-bottom: 0.8rem;
	}

	.control-group label {
		display: block;
		font-size: 0.82rem;
		font-weight: 600;
		color: #334155;
		margin-bottom: 0.25rem;
	}

	.control-group input[type='text'],
	.control-group input[type='number'] {
		width: 100%;
		padding: 0.55rem 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 10px;
		font-size: 0.9rem;
		font-family: inherit;
		background: #ffffff;
		color: #1e293b;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	.control-group input:focus {
		outline: none;
		border-color: #0f766e;
		box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
	}

	.separator {
		border: none;
		border-top: 1px solid #e2e8f0;
		margin: 0.8rem 0;
	}

	/* ── Buttons ── */
	.btn-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 0.9rem;
		border: none;
		border-radius: 10px;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		font-family: inherit;
		transition:
			background 0.2s,
			transform 0.1s,
			box-shadow 0.2s;
	}

	.btn:active:not(:disabled) {
		transform: scale(0.96);
	}

	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-primary {
		background: linear-gradient(135deg, #0f766e, #0d9488);
		color: #ffffff;
		box-shadow: 0 2px 8px rgba(15, 118, 110, 0.25);
		width: 100%;
	}
	.btn-primary:hover:not(:disabled) {
		background: linear-gradient(135deg, #0d9488, #14b8a6);
	}

	.btn-step {
		background: #edf2ff;
		color: #3b5bdb;
	}
	.btn-step:hover:not(:disabled) {
		background: #dbe4ff;
	}

	.btn-run {
		background: #e6fcf5;
		color: #087f5b;
	}
	.btn-run:hover:not(:disabled) {
		background: #c3fae8;
	}

	.btn-pause {
		background: #fff9db;
		color: #e67700;
	}
	.btn-pause:hover:not(:disabled) {
		background: #fff3bf;
	}

	.btn-reset {
		background: #f1f3f5;
		color: #495057;
	}
	.btn-reset:hover:not(:disabled) {
		background: #e9ecef;
	}

	/* ── Status ── */
	.status-panel {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.status-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
	}

	.status-key {
		color: #64748b;
		font-weight: 500;
	}

	.status-value {
		color: #1e293b;
		font-weight: 600;
	}

	.state-badge {
		background: #e6fcf5;
		color: #087f5b;
		padding: 0.15rem 0.6rem;
		border-radius: 20px;
		font-size: 0.8rem;
	}

	.mono {
		font-family: 'Cascadia Mono', 'Fira Code', monospace;
	}

	.status-message {
		margin-top: 0.6rem;
		font-size: 0.82rem;
		color: #475569;
		background: #f8fafc;
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		border-left: 3px solid #0d9488;
		line-height: 1.5;
	}

	.result-box {
		margin-top: 0.6rem;
		background: linear-gradient(135deg, #e6fcf5, #d3f9d8);
		border: 1px solid #51cf66;
		border-radius: 10px;
		padding: 0.65rem 0.9rem;
		font-size: 0.85rem;
		color: #2b8a3e;
	}

	.result-box code {
		display: block;
		margin-top: 0.3rem;
		font-family: 'Cascadia Mono', 'Fira Code', monospace;
		font-size: 0.95rem;
		font-weight: 700;
		color: #087f5b;
		word-break: break-all;
	}

	/* ── Explanation ── */
	.explanation-card {
		background: #fafcfe;
	}

	.states-list {
		padding-left: 1.2rem;
		margin: 0.5rem 0 0.7rem 0;
	}

	.states-list li {
		margin-bottom: 0.55rem;
		line-height: 1.5;
		color: #45546e;
		font-size: 0.88rem;
	}

	.states-list strong {
		color: #0f766e;
		font-weight: 600;
	}

	/* ── Responsive ── */
	@media (max-width: 960px) {
		.simulator-grid {
			grid-template-columns: 1fr;
			gap: 1.2rem;
		}

		.card {
			padding: 1.2rem;
		}

		.controls-card {
			border-left: none;
			border-top: 4px solid #0f766e;
		}
	}
</style>
