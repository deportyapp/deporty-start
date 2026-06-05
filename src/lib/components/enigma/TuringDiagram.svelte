<script lang="ts">
	interface Props {
		currentState?: string;
		headIndex?: number;
		encryptedTape?: string[];
		decodedTape?: string[];
		halted?: boolean;
	}

	let {
		currentState = 'qRead',
		headIndex = 0,
		encryptedTape = [],
		decodedTape = [],
		halted = false
	}: Props = $props();

	/* ── helpers ── */
	const VISIBLE_CELLS = 7;

	let tapeWindow = $derived.by(() => {
		const half = Math.floor(VISIBLE_CELLS / 2);
		const start = Math.max(0, headIndex - half);
		const cells: { enc: string; dec: string; idx: number; isHead: boolean }[] = [];
		for (let i = 0; i < VISIBLE_CELLS; i++) {
			const idx = start + i;
			cells.push({
				enc: encryptedTape[idx] ?? '_',
				dec: decodedTape[idx] ?? '_',
				idx,
				isHead: idx === headIndex
			});
		}
		return cells;
	});

	/* Which transition arrow is "active" right now? */
	let activeEdge = $derived.by(() => {
		if (halted) return 'none';
		switch (currentState) {
			case 'qRead':
				return 'read-decode';
			case 'qDecode':
				return 'decode-write';
			case 'qWrite':
				return 'write-move';
			case 'qMove':
				return 'move-read';
			default:
				return 'none';
		}
	});

	/* State-node layout (clock-wise pentagonal) */
	const nodes = [
		{ id: 'qRead',   label: 'Leer',      sub: 'qRead',   cx: 400, cy: 230, color: '#0ca678', bg: '#e6fcf5', stroke: '#0ca678' },
		{ id: 'qDecode', label: 'Descifrar',  sub: 'qDecode', cx: 700, cy: 380, color: '#228be6', bg: '#e7f5ff', stroke: '#228be6' },
		{ id: 'qWrite',  label: 'Escribir',   sub: 'qWrite',  cx: 620, cy: 600, color: '#4c6ef5', bg: '#edf2ff', stroke: '#4c6ef5' },
		{ id: 'qMove',   label: 'Avanzar',    sub: 'qMove',   cx: 180, cy: 600, color: '#f59f00', bg: '#fff9db', stroke: '#f59f00' },
		{ id: 'qH',      label: 'Fin',        sub: 'qH',      cx: 100, cy: 380, color: '#e64980', bg: '#fff0f6', stroke: '#e64980' }
	];

	const NODE_R = 68;

	/* Head pointer pixel position (computed here so we avoid @const outside a block) */
	let headCellIndex = $derived(
		Math.min(headIndex - Math.max(0, headIndex - Math.floor(VISIBLE_CELLS / 2)), VISIBLE_CELLS - 1)
	);
	let headPixelX = $derived(
		100 + headCellIndex * (600 / VISIBLE_CELLS) + (600 / VISIBLE_CELLS) / 2
	);

	/* Transition edges – each with a cubic-bézier path */
	const edges = [
		{
			id: 'read-decode',
			from: 'qRead', to: 'qDecode',
			path: 'M 460,260 C 560,270 640,310 670,350',
			label: 'Lee símbolo', labelX: 580, labelY: 280
		},
		{
			id: 'decode-write',
			from: 'qDecode', to: 'qWrite',
			path: 'M 700,450 C 700,510 670,560 650,570',
			label: 'Aplica clave', labelX: 710, labelY: 510
		},
		{
			id: 'write-move',
			from: 'qWrite', to: 'qMove',
			path: 'M 550,610 C 440,620 320,620 250,610',
			label: 'Escribe resultado', labelX: 400, labelY: 645
		},
		{
			id: 'move-read',
			from: 'qMove', to: 'qRead',
			path: 'M 180,530 C 170,420 230,290 340,240',
			label: '¿Más letras? → Sí', labelX: 195, labelY: 400,
			dashed: true
		},
		{
			id: 'move-halt',
			from: 'qMove', to: 'qH',
			path: 'M 145,535 C 130,500 115,450 108,420',
			label: 'No → Fin', labelX: 70, labelY: 480,
			halt: true
		}
	];
</script>

<div class="turing-diagram" role="img" aria-label="Diagrama de estados de la máquina de Turing">
	<svg viewBox="0 0 800 720" aria-hidden="true">
		<defs>
			<marker id="td-arrow" viewBox="0 0 10 10" refX="10" refY="5"
				markerUnits="strokeWidth" markerWidth="7" markerHeight="5" orient="auto">
				<path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
			</marker>
			<marker id="td-arrow-active" viewBox="0 0 10 10" refX="10" refY="5"
				markerUnits="strokeWidth" markerWidth="7" markerHeight="5" orient="auto">
				<path d="M 0 0 L 10 5 L 0 10 z" fill="#0ca678" />
			</marker>
			<marker id="td-arrow-halt" viewBox="0 0 10 10" refX="10" refY="5"
				markerUnits="strokeWidth" markerWidth="7" markerHeight="5" orient="auto">
				<path d="M 0 0 L 10 5 L 0 10 z" fill="#e64980" />
			</marker>
			<!-- glow filter for the active node -->
			<filter id="glow">
				<feGaussianBlur stdDeviation="6" result="blur"/>
				<feMerge>
					<feMergeNode in="blur"/>
					<feMergeNode in="SourceGraphic"/>
				</feMerge>
			</filter>
		</defs>

		<!-- ══════ TAPE (top) ══════ -->
		<rect x="100" y="20" width="600" height="80" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
		{#each tapeWindow as cell, i}
			{@const cellX = 100 + i * (600 / VISIBLE_CELLS)}
			{@const cellW = 600 / VISIBLE_CELLS}
			<!-- divider -->
			{#if i > 0}
				<line x1={cellX} y1="20" x2={cellX} y2="100" stroke="#cbd5e1" stroke-width="1"/>
			{/if}
			<!-- highlight head cell -->
			{#if cell.isHead && !halted}
				<rect x={cellX + 1} y="21" width={cellW - 2} height="78" rx="4" fill="#fff5df" />
			{/if}
			<text x={cellX + cellW / 2} y="52" text-anchor="middle" class="tape-enc">{cell.enc}</text>
			<text x={cellX + cellW / 2} y="78" text-anchor="middle" class="tape-dec">{cell.dec}</text>
			<text x={cellX + cellW / 2} y="95" text-anchor="middle" class="tape-idx">{cell.idx}</text>
		{/each}
		<!-- head pointer -->
		<polygon points="{headPixelX},110 {headPixelX - 10},128 {headPixelX + 10},128" fill="#0ca678" />
		<text x={headPixelX} y="148" text-anchor="middle" class="head-label">cabezal ({headIndex})</text>
		<!-- tape label -->
		<text x="50" y="65" text-anchor="middle" class="tape-side-label">Cinta</text>

		<!-- ══════ EDGES (draw behind nodes) ══════ -->
		{#each edges as edge}
			{@const isActive = activeEdge === edge.id}
			<path
				d={edge.path}
				fill="none"
				stroke={edge.halt ? '#e64980' : isActive ? '#0ca678' : '#94a3b8'}
				stroke-width={isActive ? 3.5 : 2}
				stroke-dasharray={edge.dashed ? '8,4' : isActive ? '12,4' : 'none'}
				marker-end={edge.halt ? 'url(#td-arrow-halt)' : isActive ? 'url(#td-arrow-active)' : 'url(#td-arrow)'}
				class:edge-marching={isActive}
			/>
			<text x={edge.labelX} y={edge.labelY} text-anchor="middle"
				class="edge-text" class:edge-text-active={isActive} class:edge-text-halt={edge.halt ?? false}>
				{edge.label}
			</text>
		{/each}

		<!-- ══════ STATE NODES ══════ -->
		{#each nodes as node}
			{@const isActive = currentState === node.id}
			{@const isDone = halted && node.id === 'qH'}

			<!-- outer glow when active -->
			{#if isActive}
				<circle cx={node.cx} cy={node.cy} r={NODE_R + 8}
					fill="none" stroke={node.stroke} stroke-width="3" opacity="0.35"
					class="pulse-ring" filter="url(#glow)" />
			{/if}

			<!-- main circle -->
			<circle cx={node.cx} cy={node.cy} r={NODE_R}
				fill={isActive ? node.bg : '#f8fafc'}
				stroke={isActive ? node.stroke : '#cbd5e1'}
				stroke-width={isActive ? 4 : 2}
			/>

			<!-- double circle for halt state -->
			{#if node.id === 'qH'}
				<circle cx={node.cx} cy={node.cy} r={NODE_R - 10}
					fill="none" stroke={isDone ? '#e64980' : '#fcc2d7'} stroke-width="2" />
			{/if}

			<!-- label -->
			<text x={node.cx} y={node.cy - 6} text-anchor="middle"
				class="node-label" fill={isActive ? node.color : '#64748b'}>
				{node.label}
			</text>
			<text x={node.cx} y={node.cy + 18} text-anchor="middle"
				class="node-sub" fill={isActive ? node.color : '#94a3b8'}>
				{node.sub}
			</text>
		{/each}

		<!-- start indicator arrow → qRead -->
		<polygon points="310,230 330,218 330,242" fill="#0ca678" />
		<text x="295" y="235" text-anchor="end" class="start-label">inicio</text>

		<!-- ══════ LEGEND ══════ -->
		<rect x="20" y="665" width="760" height="45" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
		<line x1="40" y1="688" x2="80" y2="688" stroke="#94a3b8" stroke-width="2" />
		<text x="90" y="692" class="legend-text">Transición</text>
		<line x1="210" y1="688" x2="250" y2="688" stroke="#0ca678" stroke-width="3" stroke-dasharray="8,4" />
		<text x="260" y="692" class="legend-text">Bucle activo</text>
		<line x1="420" y1="688" x2="460" y2="688" stroke="#e64980" stroke-width="2" />
		<text x="470" y="692" class="legend-text">Parada</text>
		<circle cx="600" cy="688" r="8" fill="none" stroke="#e64980" stroke-width="2"/>
		<circle cx="600" cy="688" r="5" fill="none" stroke="#e64980" stroke-width="1"/>
		<text x="618" y="692" class="legend-text">Fin</text>
		<polygon points="688,688 698,682 698,694" fill="#0ca678" />
		<text x="708" y="692" class="legend-text">Inicio</text>
	</svg>
</div>

<style>
	.turing-diagram {
		width: 100%;
		overflow: hidden;
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 14px;
		padding: 0.5rem;
	}

	svg {
		width: 100%;
		height: auto;
		display: block;
	}

	/* ── Tape ── */
	.tape-enc {
		font: 700 16px 'Inter', 'Segoe UI', monospace;
		fill: #334155;
	}
	.tape-dec {
		font: 700 13px 'Inter', 'Segoe UI', monospace;
		fill: #166534;
	}
	.tape-idx {
		font: 400 10px 'Inter', 'Segoe UI', sans-serif;
		fill: #94a3b8;
	}
	.tape-side-label {
		font: 600 13px 'Inter', 'Segoe UI', sans-serif;
		fill: #94a3b8;
	}
	.head-label {
		font: 600 13px 'Inter', 'Segoe UI', sans-serif;
		fill: #0ca678;
	}

	/* ── Nodes ── */
	.node-label {
		font: 700 20px 'Inter', 'Segoe UI', sans-serif;
	}
	.node-sub {
		font: 400 13px 'Inter', 'Segoe UI', monospace;
	}
	.start-label {
		font: 600 15px 'Inter', 'Segoe UI', sans-serif;
		fill: #0ca678;
	}

	/* pulse ring animation */
	.pulse-ring {
		animation: pulse 1.4s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 0.35; transform: scale(1); }
		50%      { opacity: 0.12; transform: scale(1.15); }
	}

	/* ── Edges ── */
	.edge-text {
		font: 500 12px 'Inter', 'Segoe UI', sans-serif;
		fill: #64748b;
	}
	.edge-text-active {
		fill: #0ca678;
		font-weight: 700;
	}
	.edge-text-halt {
		fill: #e64980;
	}

	/* marching-ants animation on the active edge */
	.edge-marching {
		animation: march 0.6s linear infinite;
	}
	@keyframes march {
		to { stroke-dashoffset: -16; }
	}

	/* ── Legend ── */
	.legend-text {
		font: 400 12px 'Inter', 'Segoe UI', sans-serif;
		fill: #64748b;
	}
</style>
