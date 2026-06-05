<main class="layout" aria-labelledby="diagram-title">
	<section class="card">
		<h1 id="diagram-title">¿Cómo funciona nuestra máquina descifrado?</h1>

		<div class="diagram-container">
			<div class="diagram-left">
				<p>Este diagrama muestra paso a paso cómo la máquina toma un mensaje cifrado y lo convierte de vuelta al mensaje original. Cada círculo es una tarea que la máquina realiza, y las flechas indican el orden en que las ejecuta.</p>

				<div class="diagram-visual" role="img" aria-label="Diagrama de estados de la máquina de Turing">
			<svg viewBox="0 0 950 820" aria-hidden="true">
				<defs>
					<marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="6" orient="auto">
						<path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
					</marker>
					<marker id="arrow-red" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="6" orient="auto">
						<path d="M 0 0 L 10 5 L 0 10 z" fill="#e64980" />
					</marker>
				</defs>

				<!-- ══════ TAPE ILLUSTRATION (top) ══════ -->
				<rect x="220" y="15" width="510" height="55" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
				<line x1="305" y1="15" x2="305" y2="70" stroke="#cbd5e1" stroke-width="1" />
				<line x1="390" y1="15" x2="390" y2="70" stroke="#cbd5e1" stroke-width="1" />
				<line x1="475" y1="15" x2="475" y2="70" stroke="#cbd5e1" stroke-width="1" />
				<line x1="560" y1="15" x2="560" y2="70" stroke="#cbd5e1" stroke-width="1" />
				<line x1="645" y1="15" x2="645" y2="70" stroke="#cbd5e1" stroke-width="1" />
				<text x="262" y="48" text-anchor="middle" class="tape-char">H</text>
				<text x="347" y="48" text-anchor="middle" class="tape-char">O</text>
				<text x="432" y="48" text-anchor="middle" class="tape-char active">L</text>
				<text x="517" y="48" text-anchor="middle" class="tape-char">A</text>
				<text x="602" y="48" text-anchor="middle" class="tape-char">!</text>
				<text x="687" y="48" text-anchor="middle" class="tape-char">_</text>
				<!-- Head pointer -->
				<polygon points="432,78 422,94 442,94" fill="#0ca678" />
				<text x="432" y="112" text-anchor="middle" class="head-label">cabezal</text>
				<text x="120" y="48" text-anchor="middle" class="tape-label">Mensaje cifrado</text>

				<!-- ══════ STATE NODES ══════ -->

				<!-- Leer (top-center) — initial state -->
				<g class="node-group start">
					<circle cx="475" cy="200" r="65" class="node start" />
					<text x="475" y="192" text-anchor="middle" class="node-label">Leer</text>
					<text x="475" y="214" text-anchor="middle" class="node-sub">Mira la letra</text>
					<!-- Start indicator -->
					<polygon points="388,200 405,191 405,209" fill="#0ca678" />
					<text x="370" y="204" text-anchor="end" class="start-text">inicio</text>
				</g>

				<!-- Descifrar (right) -->
				<g class="node-group decode">
					<circle cx="780" cy="370" r="65" class="node decode" />
					<text x="780" y="362" text-anchor="middle" class="node-label">Descifrar</text>
					<text x="780" y="384" text-anchor="middle" class="node-sub">Aplica la clave</text>
				</g>

				<!-- Escribir (bottom-right) -->
				<g class="node-group write">
					<circle cx="630" cy="580" r="65" class="node write" />
					<text x="630" y="572" text-anchor="middle" class="node-label">Escribir</text>
					<text x="630" y="594" text-anchor="middle" class="node-sub">Guarda resultado</text>
				</g>

				<!-- Avanzar (bottom-left) -->
				<g class="node-group move">
					<circle cx="280" cy="580" r="65" class="node move" />
					<text x="280" y="572" text-anchor="middle" class="node-label">Avanzar</text>
					<text x="280" y="594" text-anchor="middle" class="node-sub">Siguiente letra</text>
				</g>

				<!-- Fin (Halt — far left, double circle) -->
				<g class="node-group aux">
					<circle cx="110" cy="370" r="65" class="node aux" />
					<circle cx="110" cy="370" r="55" fill="none" stroke="#e64980" stroke-width="2" />
					<text x="110" y="365" text-anchor="middle" class="node-label">Fin</text>
					<text x="110" y="387" text-anchor="middle" class="node-sub">¡Terminó!</text>
				</g>

				<!-- ══════ TRANSITIONS ══════ -->

				<!-- Leer → Descifrar -->
				<path d="M 530,230 Q 670,240 755,315" fill="none" stroke="#475569" stroke-width="2.5" marker-end="url(#arrow)" />
				<text x="665" y="250" class="edge-label" text-anchor="middle">
					<tspan x="665" dy="0">Mira la letra señalada</tspan>
					<tspan x="665" dy="16" class="edge-action">y pasa a descifrarla</tspan>
				</text>

				<!-- Descifrar → Escribir -->
				<path d="M 755,428 Q 725,500 685,530" fill="none" stroke="#475569" stroke-width="2.5" marker-end="url(#arrow)" />
				<text x="780" y="495" class="edge-label" text-anchor="start">
					<tspan x="780" dy="0">Aplica la clave secreta</tspan>
					<tspan x="780" dy="16" class="edge-action">y obtiene la letra real</tspan>
				</text>

				<!-- Escribir → Avanzar -->
				<line x1="565" y1="580" x2="345" y2="580" stroke="#475569" stroke-width="2.5" marker-end="url(#arrow)" />
				<text x="455" y="620" class="edge-label" text-anchor="middle">
					<tspan x="455" dy="0">Anota la letra descifrada</tspan>
					<tspan x="455" dy="16" class="edge-action">en el mensaje de salida</tspan>
				</text>

				<!-- Avanzar → Leer (loop back) -->
				<path d="M 245,520 Q 215,380 430,258" fill="none" stroke="#0ca678" stroke-width="2.5" stroke-dasharray="8,4" marker-end="url(#arrow)" />
				<text x="250" y="400" class="edge-label loop-label" text-anchor="end">
					<tspan x="250" dy="0">¿Hay más letras?</tspan>
					<tspan x="250" dy="16" class="edge-action">Sí → vuelve a Leer</tspan>
				</text>

				<!-- Avanzar → Fin (halt condition) -->
				<path d="M 222,555 Q 160,500 130,432" fill="none" stroke="#e64980" stroke-width="2.5" marker-end="url(#arrow-red)" />
				<text x="120" y="505" class="edge-label halt-label" text-anchor="end">
					<tspan x="120" dy="0">¿Ya no quedan</tspan>
					<tspan x="120" dy="16" class="edge-action halt-action">letras? → ¡Fin!</tspan>
				</text>

				<!-- ══════ LEGEND ══════ -->
				<rect x="15" y="700" width="920" height="105" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
				<text x="40" y="730" class="legend-title">Leyenda:</text>
				<!-- Cycle arrow -->
				<line x1="40" y1="755" x2="80" y2="755" stroke="#475569" stroke-width="2.5" />
				<text x="92" y="759" class="legend-text">Paso normal</text>
				<!-- Loop arrow -->
				<line x1="310" y1="755" x2="350" y2="755" stroke="#0ca678" stroke-width="2.5" stroke-dasharray="8,4" />
				<text x="362" y="759" class="legend-text">Repite con la siguiente letra</text>
				<!-- Halt arrow -->
				<line x1="620" y1="755" x2="660" y2="755" stroke="#e64980" stroke-width="2.5" />
				<text x="672" y="759" class="legend-text">Se acabaron las letras</text>
				<!-- Double circle -->
				<circle cx="55" cy="785" r="9" fill="none" stroke="#e64980" stroke-width="2" />
				<circle cx="55" cy="785" r="6" fill="none" stroke="#e64980" stroke-width="1" />
				<text x="92" y="789" class="legend-text">La máquina se detiene aquí</text>
				<!-- Start arrow -->
				<polygon points="330,785 342,779 342,791" fill="#0ca678" />
				<text x="362" y="789" class="legend-text">Por aquí empieza todo</text>
			</svg>
		</div>
			</div>

			<div class="diagram-right">
				<h2>Explicación paso a paso</h2>
				<p>
					Imagina que tienes un mensaje secreto escrito en una tira de papel, letra por letra. 
					La máquina va recorriendo esa tira de izquierda a derecha y traduce cada letra una por una.
				</p>

				<h3>¿Qué hace en cada letra?</h3>
				<ol class="states-list">
					<li>
						<strong>Leer:</strong> La máquina mira la letra cifrada que tiene delante. 
						Por ejemplo, si ve una "H", la toma y la guarda en su memoria.
					</li>
					<li>
						<strong>Descifrar:</strong> Usa la clave del día (un número) para convertir esa letra cifrada 
						en la letra original. Es como girar una rueda de letras hacia atrás.
					</li>
					<li>
						<strong>Escribir:</strong> Anota la letra ya descifrada en una nueva tira de papel, 
						que es donde se va armando el mensaje traducido.
					</li>
					<li>
						<strong>Avanzar:</strong> Mueve su "dedo" una posición a la derecha para pasar a la siguiente letra. 
						Si todavía hay letras, repite todo desde el paso 1. Si ya no hay más, se detiene.
					</li>
				</ol>

				<h3>¿Cuándo termina?</h3>
				<p>
					<strong>Fin:</strong> Cuando la máquina llega al final del mensaje cifrado y ya no hay más letras por leer, 
					se detiene automáticamente. En ese momento, compara el mensaje traducido con el original 
					para confirmar que todo salió bien.
				</p>

				<h3>¿Por qué funciona siempre?</h3>
				<p>
					Cada letra se descifra usando siempre la misma clave, así que el resultado es exacto. 
					Es como si alguien hubiera girado cada letra 5 posiciones al cifrar, y la máquina 
					simplemente las gira 5 posiciones de vuelta.
				</p>

				<a class="button" href="/Enigma_Project_Ibero">Volver a la máquina</a>
			</div>
		</div>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: "Trebuchet MS", "Gill Sans", "Segoe UI", sans-serif;
		background: #f3f7fb;
		color: #1c2233;
	}

	.layout {
		width: min(1350px, 96vw);
		margin: 1.6rem auto 2rem;
	}

	.card {
		background: #ffffff;
		border: 1px solid #d2deef;
		border-radius: 18px;
		box-shadow: 0 16px 40px rgba(20, 40, 70, 0.08);
		padding: 2rem 2.5rem;
	}

	h1 {
		margin: 0 0 1.2rem;
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


	.diagram-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.diagram-left {
		min-width: 0;
	}

	.diagram-left > p {
		font-size: 0.88rem;
		margin-bottom: 0.3rem;
	}

	.diagram-right {
		min-width: 0;
		padding: 1.3rem 1.5rem;
		background: #f9fbfd;
		border-radius: 14px;
		border-left: 4px solid #0f766e;
	}

	.diagram-visual {
		margin: 0.6rem 0 0;
		overflow: hidden;
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 14px;
		padding: 1rem;
		max-width: 850px;
		margin-left: auto;
		margin-right: auto;
	}

	svg {
		width: 100%;
		height: auto;
		display: block;
	}

	/* ── Nodes ── */
	.node { stroke-width: 4; }

	.node.start { fill: #e6fcf5; stroke: #0ca678; }
	.node-group.start .node-label { fill: #0ca678; }
	.node-group.start .node-sub { fill: #097957; }

	.node.decode { fill: #e7f5ff; stroke: #228be6; }
	.node-group.decode .node-label { fill: #228be6; }
	.node-group.decode .node-sub { fill: #1864ab; }

	.node.write { fill: #edf2ff; stroke: #4c6ef5; }
	.node-group.write .node-label { fill: #4c6ef5; }
	.node-group.write .node-sub { fill: #364fc7; }

	.node.move { fill: #fff9db; stroke: #f59f00; }
	.node-group.move .node-label { fill: #f59f00; }
	.node-group.move .node-sub { fill: #b27b00; }

	.node.aux { fill: #fff0f6; stroke: #e64980; }
	.node-group.aux .node-label { fill: #e64980; }
	.node-group.aux .node-sub { fill: #a61e4d; }

	.node-label { font: 700 28px "Inter", sans-serif; }
	.node-sub { font: 400 18px "Inter", sans-serif; }

	/* ── Edge labels ── */
	.edge-label { font: 500 18px "Inter", sans-serif; fill: #475569; }
	.edge-action { font: 400 16px "Inter", sans-serif; fill: #64748b; }
	.loop-label { fill: #087f5b; }
	.halt-label { fill: #c2255c; }
	.halt-action { fill: #e64980; }

	/* ── Tape illustration ── */
	.tape-char { font: 700 24px "Inter", monospace; fill: #334155; }
	.tape-char.active { fill: #0ca678; }
	.tape-label { font: 600 16px "Inter", sans-serif; fill: #94a3b8; }
	.head-label { font: 600 16px "Inter", sans-serif; fill: #0ca678; }
	.start-text { font: 600 18px "Inter", sans-serif; fill: #0ca678; }

	/* ── Legend ── */
	.legend-title { font: 700 18px "Inter", sans-serif; fill: #334155; }
	.legend-text { font: 400 16px "Inter", sans-serif; fill: #64748b; }


	/* ── Right panel ── */
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

	.button {
		display: inline-block;
		margin-top: 0.8rem;
		padding: 0.6rem 1rem;
		background: #0f766e;
		color: #fff;
		text-decoration: none;
		border-radius: 10px;
		font-weight: 500;
		font-size: 0.92rem;
		transition: background 0.2s;
	}

	.button:hover {
		background: #0d665c;
	}

	@media (max-width: 960px) {
		.diagram-container {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.card {
			padding: 1.2rem;
		}

		.diagram-right {
			padding: 1rem;
		}
	}
</style>
