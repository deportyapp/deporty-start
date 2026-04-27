<script lang="ts">
	export let machineTape: string[] = [];
	export let headIndex = 0;
	export let halted = false;
	export let dividerIndex = 0;
	export let currentState = 'qRead';
	export let pendingDecoded = '';
	export let blankSymbol = '_';

	$: activeZone = headIndex < dividerIndex ? 'input' : headIndex === dividerIndex ? 'divider' : 'output';
</script>

<div class="zone-strip" aria-label="Zonas de la cinta">
	<div class={`zone-chip ${activeZone === 'input' ? 'active input' : ''}`}>
		<span class="zone-name">Entrada</span>
		<span class="zone-help">Aqui se lee</span>
	</div>
	<div class={`zone-chip ${activeZone === 'divider' ? 'active divider' : ''}`}>
		<span class="zone-name">Separador</span>
		<span class="zone-help">Cambio de lado</span>
	</div>
	<div class={`zone-chip ${activeZone === 'output' ? 'active output' : ''}`}>
		<span class="zone-name">Salida</span>
		<span class="zone-help">Aqui aparece el texto</span>
	</div>
</div>

<div class="tape" aria-label="Cinta de traduccion de la maquina">
	{#if machineTape.length === 0}
		<div class="cell">
			<span class="enc">{blankSymbol}</span>
			<span class="dec">Vacio</span>
			<span class="index">0</span>
		</div>
	{:else}
		{#each machineTape as symbol, index}
			<div
				class={`cell ${index === headIndex && !halted ? 'head' : ''} ${index < dividerIndex ? 'input-zone' : index === dividerIndex ? 'divider-zone' : 'output-zone'} ${index === headIndex && currentState === 'qWrite' ? 'write-target' : ''}`}
			>
				{#if index === headIndex && !halted}
					<span class="marker">Cabezal</span>
				{/if}
				{#if index === headIndex && currentState === 'qWrite' && pendingDecoded}
					<span class="preview">Sale: {pendingDecoded}</span>
				{/if}
				<span class="enc">{symbol}</span>
				<span class="dec">
					{index < dividerIndex ? 'Entrada' : index === dividerIndex ? 'Separador' : 'Salida'}
				</span>
				<span class="index">{index}</span>
			</div>
		{/each}
	{/if}
</div>

<style>
	.zone-strip {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
		margin-top: 0.85rem;
	}

	.zone-chip {
		border: 1px solid #d2deef;
		border-radius: 14px;
		padding: 0.65rem 0.72rem;
		background: #f9fbff;
	}

	.zone-chip.active.input {
		background: #eef6ff;
		border-color: #93c5fd;
	}

	.zone-chip.active.divider {
		background: #fff5df;
		border-color: #f59e0b;
	}

	.zone-chip.active.output {
		background: #eaf7ef;
		border-color: #8cc8a0;
	}

	.zone-name,
	.zone-help {
		display: block;
	}

	.zone-name {
		font-weight: 800;
	}

	.zone-help {
		font-size: 0.82rem;
		color: #4f6078;
		margin-top: 0.12rem;
	}

	.tape {
		margin-top: 0.85rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(76px, 1fr));
		gap: 0.42rem;
	}

	.cell {
		position: relative;
		border: 1px solid #c6d2e8;
		border-radius: 10px;
		background: #f9fbff;
		text-align: center;
		padding: 0.58rem 0.25rem 0.42rem;
	}

	.cell.input-zone {
		background: #f7fbff;
	}

	.cell.divider-zone {
		background: #fffaf0;
	}

	.cell.output-zone {
		background: #f8fff9;
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
		color: #166534;
	}

	.cell .index {
		display: block;
		margin-top: 0.16rem;
		font-size: 0.75rem;
		color: #4f6078;
	}

	.cell.head {
		border-color: #f59e0b;
		background: #fff5df;
		box-shadow: inset 0 0 0 2px #ffe0ab;
	}

	.cell.write-target {
		box-shadow:
			inset 0 0 0 2px #c9f5cf,
			0 0 0 1px rgba(22, 101, 52, 0.08);
	}

	.marker,
	.preview {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		border-radius: 999px;
		padding: 0.1rem 0.42rem;
		font-size: 0.7rem;
		font-weight: 700;
	}

	.marker {
		top: -0.55rem;
		background: #f59e0b;
		color: #1c2233;
	}

	.preview {
		bottom: -0.58rem;
		background: #166534;
		color: #fff;
	}

	@media (max-width: 760px) {
		.zone-strip {
			grid-template-columns: 1fr;
		}
	}
</style>