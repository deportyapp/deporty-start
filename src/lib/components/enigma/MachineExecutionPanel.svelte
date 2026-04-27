<script lang="ts">
	export let running = false;
	export let halted = false;
	export let currentState = 'qRead';
	export let currentStateLabel = '';
	export let headIndex = 0;
	export let readSymbol = '-';
	export let writtenSymbol = '-';
	export let stepCount = 0;
	export let currentRuleText = '';
	export let nextActionText = '';
	export let onStep: () => void = () => {};
	export let onRun: () => void = () => {};
	export let onPause: () => void = () => {};
	export let onReset: () => void = () => {};

	const flowSteps = [
		{ id: 'qRead', label: 'Leer' },
		{ id: 'qDecode', label: 'Descifrar' },
		{ id: 'qSeekDivider', label: 'Cruzar' },
		{ id: 'qSeekOutput', label: 'Buscar hueco' },
		{ id: 'qWrite', label: 'Escribir' },
		{ id: 'qReturn', label: 'Volver' },
		{ id: 'qMove', label: 'Siguiente' },
		{ id: 'qH', label: 'Fin' }
	];

	$: activeFlowIndex = flowSteps.findIndex((step) => step.id === currentState);
	$: movementArrow = currentState === 'qReturn' ? '←' : currentState === 'qH' ? '■' : '→';
	$: movementLabel =
		halted || currentState === 'qH'
			? 'Proceso detenido'
			: currentState === 'qReturn'
				? 'Regresando a la izquierda'
				: currentState === 'qWrite'
					? 'Escribiendo en salida'
					: 'Avanzando por la cinta';
</script>

<div class="flow-strip" aria-label="Etapas visuales de la maquina">
	{#each flowSteps as step, index}
		<div class={`flow-chip ${index === activeFlowIndex ? 'active' : ''} ${index < activeFlowIndex || (halted && step.id === 'qH') ? 'done' : ''}`}>
			<span class="flow-index">{index + 1}</span>
			<span>{step.label}</span>
		</div>
	{/each}
</div>

<div class="buttons">
	<button id="step-btn" type="button" class="secondary" on:click={onStep} disabled={running || halted}
		>Paso</button
	>
	<button id="run-btn" type="button" class="secondary" on:click={onRun} disabled={running || halted}
		>Ejecutar</button
	>
	<button id="pause-btn" type="button" class="secondary" on:click={onPause} disabled={!running}
		>Pausar</button
	>
	<button id="reset-btn" type="button" class="secondary" on:click={onReset}>Reiniciar</button>
</div>

<div class="rule-box" aria-live="polite">
	<div class="live-now">
		<div>
			<p class="rule-title">Ahora</p>
			<p id="didactic-rule" class="rule-copy">{currentRuleText}</p>
		</div>
		<div class="movement" aria-hidden="true">
			<span class="movement-arrow">{movementArrow}</span>
			<span class="movement-label">{movementLabel}</span>
		</div>
	</div>
	<div class="next-box">
		<p class="rule-title soft">Despues</p>
		<p id="didactic-action" class="rule-next">{nextActionText}</p>
	</div>
</div>

<dl class="state-grid">
	<div>
		<dt>Estado</dt>
		<dd id="current-state">{currentStateLabel}</dd>
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

<style>
	button {
		font: inherit;
		border: 1px solid transparent;
		border-radius: 10px;
		background: #0f766e;
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
		background: #e7f6f4;
		color: #1c2233;
		border-color: #9ed5cf;
	}

	button.secondary:hover {
		background: #cdeae6;
	}

	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	button:focus-visible {
		outline: 3px solid #1d4ed8;
		outline-offset: 2px;
	}

	.buttons {
		margin-top: 0.9rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.flow-strip {
		display: grid;
		grid-template-columns: repeat(8, minmax(0, 1fr));
		gap: 0.42rem;
	}

	.flow-chip {
		border: 1px solid #d2deef;
		border-radius: 999px;
		padding: 0.45rem 0.5rem;
		background: #f8fbff;
		font-size: 0.82rem;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		justify-content: center;
		text-align: center;
	}

	.flow-chip.active {
		background: #fff5df;
		border-color: #f59e0b;
		box-shadow: inset 0 0 0 1px #ffd690;
	}

	.flow-chip.done {
		background: #eaf7ef;
		border-color: #9fd3ad;
	}

	.flow-index {
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 999px;
		display: inline-grid;
		place-items: center;
		background: rgba(15, 118, 110, 0.12);
		font-weight: 800;
		font-size: 0.72rem;
	}

	.rule-box {
		margin-top: 0.85rem;
		border: 1px solid #b6c9e8;
		border-radius: 12px;
		background: linear-gradient(180deg, #f7fbff, #eef6ff);
		padding: 0.8rem;
	}

	.live-now {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.8rem;
		align-items: center;
	}

	.rule-title {
		margin: 0 0 0.35rem;
		font-weight: 800;
	}

	.rule-title.soft {
		margin-top: 0.7rem;
	}

	.rule-copy {
		margin: 0;
		color: #1c2233;
	}

	.rule-next {
		margin: 0;
		color: #4f6078;
		font-size: 0.92rem;
	}

	.movement {
		min-width: 132px;
		padding: 0.65rem 0.7rem;
		border-radius: 12px;
		background: rgba(15, 118, 110, 0.08);
		text-align: center;
	}

	.movement-arrow {
		display: block;
		font-size: 1.4rem;
		font-weight: 800;
		line-height: 1;
	}

	.movement-label {
		display: block;
		margin-top: 0.18rem;
		font-size: 0.8rem;
		color: #4f6078;
	}

	.next-box {
		margin-top: 0.7rem;
		padding-top: 0.7rem;
		border-top: 1px solid rgba(79, 96, 120, 0.16);
	}

	.state-grid {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(120px, 1fr));
		gap: 0.55rem;
		margin-top: 0.85rem;
	}

	.state-grid div {
		border: 1px solid #d2deef;
		border-radius: 10px;
		padding: 0.52rem;
		background: #f9fbff;
	}

	dt {
		font-size: 0.82rem;
		color: #4f6078;
	}

	dd {
		margin: 0.25rem 0 0;
		font-weight: 800;
		font-size: 1.1rem;
	}

	@media (max-width: 760px) {
		.flow-strip {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.live-now {
			grid-template-columns: 1fr;
		}

		.state-grid {
			grid-template-columns: repeat(2, minmax(120px, 1fr));
		}
	}
</style>