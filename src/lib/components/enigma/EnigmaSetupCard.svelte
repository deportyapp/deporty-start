<script lang="ts">
	export let referenceDate = '';
	export let generatedCode = '';
	export let codeExplanation = '';
	export let originalMessage = '';
	export let encryptedMessage = '';
	export let finalMessage = '';
	export let running = false;
	export let encryptionSummary = '';
	export let encryptionDetailSteps: string[] = [];
	export let status = '';
	export let statusMatch = false;
	export let onGenerateCode: () => void = () => {};
	export let onEncrypt: () => void = () => {};
	export let onLoadMachine: () => void = () => {};
</script>

<section class="card" aria-labelledby="setup-title">
	<h2 id="setup-title">Configuracion</h2>
	<div class="grid-2">
		<div>
			<label for="reference-date">Fecha de referencia (UTC)</label>
			<div class="input-row">
				<input id="reference-date" type="date" bind:value={referenceDate} on:change={onGenerateCode} required />
			</div>
		</div>
		<div>
			<label for="generated-code">Codigo generado</label>
			<input id="generated-code" type="text" bind:value={generatedCode} readonly aria-live="polite" />
			<p id="code-explanation" class="code-explanation" aria-live="polite">{codeExplanation}</p>
		</div>
	</div>

	<label for="original-message">Mensaje original</label>
	<textarea id="original-message" rows="3" bind:value={originalMessage} disabled={running}></textarea>

	<div class="visual-flow" aria-label="Resumen visual del proceso">
		<div class="flow-card">
			<span class="flow-label">Fecha</span>
			<strong>{referenceDate || 'Sin fecha'}</strong>
		</div>
		<div class="flow-arrow" aria-hidden="true">→</div>
		<div class="flow-card accent">
			<span class="flow-label">Codigo</span>
			<strong>{generatedCode || '--'}</strong>
		</div>
		<div class="flow-arrow" aria-hidden="true">→</div>
		<div class="flow-card">
			<span class="flow-label">Cifrado</span>
			<strong>{encryptedMessage ? 'Listo' : 'Pendiente'}</strong>
		</div>
	</div>

	<div class="encrypt-controls">
		<div class="encrypt-main">
			<button id="encrypt-btn" type="button" on:click={onEncrypt} disabled={running}>Encriptar</button>
			<div class="encrypted-result">
				<label for="encrypted-message">Mensaje resultante (encriptado)</label>
				<textarea id="encrypted-message" rows="3" bind:value={encryptedMessage} readonly disabled={running}></textarea>
			</div>
			<button id="load-machine-btn" type="button" on:click={onLoadMachine} disabled={running}>Cargar en maquina</button>
		</div>
	</div>

	<section class="inline-process" aria-labelledby="encryption-title">
		<h2 id="encryption-title">Lo que esta pasando</h2>
		<p id="encryption-summary" class="process-summary">{encryptionSummary}</p>
		<div class="process-pills" aria-live="polite">
			{#each encryptionDetailSteps.slice(0, 3) as step}
				<span class="process-pill">{step}</span>
			{/each}
		</div>
	</section>

	<label for="final-message">Mensaje final (descifrado por la maquina)</label>
	<textarea id="final-message" rows="3" bind:value={finalMessage} readonly></textarea>

	<p id="status" class={`status ${statusMatch ? 'match' : ''}`} role="status" aria-live="polite">{status}</p>
</section>

<style>
	.card {
		background: var(--card, #ffffff);
		border: 1px solid var(--line, #d2deef);
		border-radius: var(--radius, 16px);
		box-shadow: var(--shadow, 0 14px 36px rgba(26, 34, 50, 0.12));
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
		color: var(--ink, #1c2233);
	}

	textarea {
		resize: vertical;
		min-height: 84px;
		margin-bottom: 0.65rem;
	}

	button {
		border: 1px solid transparent;
		border-radius: 10px;
		background: var(--accent, #0f766e);
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

	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	input:focus-visible,
	textarea:focus-visible,
	button:focus-visible {
		outline: 3px solid var(--focus, #1d4ed8);
		outline-offset: 2px;
	}

	.encrypt-controls {
		margin-top: 0.75rem;
		display: block;
	}

	.encrypt-main {
		display: grid;
		gap: 0.5rem;
		max-width: 540px;
	}

	.encrypt-main button {
		justify-self: start;
	}

	.encrypted-result {
		border: 1px solid var(--line, #d2deef);
		border-radius: 12px;
		background: #f7fbff;
		padding: 0.6rem;
	}

	.encrypted-result label {
		display: block;
		margin-bottom: 0.4rem;
	}

	.encrypted-result textarea {
		margin-bottom: 0;
	}

	.status {
		margin: 0.72rem 0 0;
		min-height: 1.5rem;
		color: var(--muted, #4f6078);
	}

	.code-explanation {
		margin: 0.45rem 0 0;
		font-size: 0.92rem;
		color: var(--muted, #4f6078);
		line-height: 1.45;
	}

	.visual-flow {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
		gap: 0.55rem;
		align-items: center;
		margin: 0.15rem 0 0.85rem;
	}

	.flow-card {
		border: 1px solid var(--line, #d2deef);
		border-radius: 14px;
		padding: 0.72rem;
		background: #f9fbff;
		min-width: 0;
	}

	.flow-card.accent {
		background: #e7f6f4;
		border-color: #9ed5cf;
	}

	.flow-card strong,
	.flow-label {
		display: block;
	}

	.flow-label {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted, #4f6078);
		margin-bottom: 0.2rem;
	}

	.flow-card strong {
		font-size: 1.05rem;
		word-break: break-word;
	}

	.flow-arrow {
		font-size: 1.35rem;
		font-weight: 800;
		color: var(--accent, #0f766e);
	}

	.process-summary {
		margin: 0 0 0.65rem;
		color: var(--muted, #4f6078);
	}

	.process-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.process-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.65rem;
		border-radius: 999px;
		background: linear-gradient(180deg, #fbfdff, #eef6ff);
		border: 1px solid var(--line, #d2deef);
		color: var(--muted, #4f6078);
		font-size: 0.88rem;
	}

	.match {
		color: var(--ok, #166534);
		font-weight: 700;
	}

	@media (max-width: 760px) {
		.grid-2 {
			grid-template-columns: 1fr;
		}

		.input-row {
			grid-template-columns: 1fr;
		}

		.visual-flow {
			grid-template-columns: 1fr;
		}

		.flow-arrow {
			display: none;
		}
	}
</style>