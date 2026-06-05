<main class="layout" aria-labelledby="diagram-title">
	<section class="card">
		<h1 id="diagram-title">Diagrama gráfico de la máquina de Turing</h1>
		<p>Este diagrama muestra cómo la máquina procesa cada símbolo del mensaje encriptado usando los estados internos qRead, qDecode, qWrite, qMove y qH.</p>

		<div class="diagram-visual" role="img" aria-label="Diagrama de estados de la máquina de Turing">
			<svg viewBox="0 0 1020 820" aria-hidden="true">
				<defs>
					<marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="6" orient="auto">
						<path d="M 0 0 L 10 5 L 0 10 z" fill="#0f766e" />
					</marker>
				</defs>

				<circle cx="560" cy="120" r="68" class="node start" />
				<text x="560" y="100" text-anchor="middle" class="node-label">qRead</text>
				<text x="560" y="132" text-anchor="middle" class="node-sub">Lee símbolo</text>

				<circle cx="560" cy="290" r="68" class="node" />
				<text x="560" y="270" text-anchor="middle" class="node-label">qDecode</text>
				<text x="560" y="302" text-anchor="middle" class="node-sub">Descifra</text>

				<circle cx="560" cy="460" r="68" class="node" />
				<text x="560" y="440" text-anchor="middle" class="node-label">qWrite</text>
				<text x="560" y="472" text-anchor="middle" class="node-sub">Escribe</text>

				<circle cx="560" cy="630" r="68" class="node end" />
				<text x="560" y="610" text-anchor="middle" class="node-label">qMove</text>
				<text x="560" y="642" text-anchor="middle" class="node-sub">Avanza</text>

				<circle cx="180" cy="380" r="70" class="node aux" />
				<text x="180" y="360" text-anchor="middle" class="node-label">qH</text>
				<text x="180" y="398" text-anchor="middle" class="node-sub">Parada</text>

				<line x1="560" y1="188" x2="560" y2="222" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />
				<line x1="560" y1="358" x2="560" y2="392" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />
				<line x1="560" y1="528" x2="560" y2="562" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />
				<path d="M 520 698 C 460 760 280 760 220 430" fill="none" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />
				<path d="M 220 330 C 240 220 400 180 520 180" fill="none" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />

				<text x="650" y="240" class="arrow-text">Decodifica</text>
				<text x="650" y="410" class="arrow-text">Escribe</text>
				<text x="650" y="590" class="arrow-text">
					<tspan x="650" dy="0">Avanza a la siguiente</tspan>
					<tspan x="650" dy="1.5em">celda</tspan>
				</text>
				<text x="290" y="570" class="arrow-text">Fin de cinta → qH</text>
				<text x="310" y="70" class="arrow-text-lg">
					<tspan x="310" dy="0">Carga inicial /</tspan>
					<tspan x="310" dy="1.6em">reinicio</tspan>
				</text>
			</svg>
		</div>

		<section class="diagram-description">
			<h2>Cómo funciona esta máquina</h2>
			<ol>
				<li><strong>qRead:</strong> lee el símbolo actual del mensaje encriptado desde la cinta.</li>
				<li><strong>qDecode:</strong> aplica la clave diaria para revertir el desplazamiento de cada símbolo.</li>
				<li><strong>qWrite:</strong> escribe el símbolo descifrado en la cinta de salida.</li>
				<li><strong>qMove:</strong> avanza el cabezal a la siguiente posición y vuelve a qRead.</li>
				<li><strong>qH:</strong> cuando el cabezal supera la longitud de la cinta, la máquina se detiene.</li>
			</ol>
			<p>La transición es secuencial: cada símbolo se procesa de forma independiente, aplicando siempre la misma regla de desplazamiento inverso para recuperar el mensaje original.</p>
			<a class="button" href="/Enigma_Project_Ibero">Volver a la máquina</a>
		</section>
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
		width: min(980px, 92vw);
		margin: 1.6rem auto 2rem;
	}

	.card {
		background: #ffffff;
		border: 1px solid #d2deef;
		border-radius: 18px;
		box-shadow: 0 16px 40px rgba(20, 40, 70, 0.08);
		padding: 1.6rem;
	}

	h1 {
		margin: 0 0 1rem;
		font-size: clamp(1.6rem, 2.5vw, 2.2rem);
	}

	p {
		margin: 0 0 1rem;
		line-height: 1.7;
		color: #45546e;
	}

	.diagram-visual {
		margin: 1.6rem 0;
		overflow: auto;
		background: #eef7ff;
		border-radius: 18px;
		padding: 1.4rem;
	}

	svg {
		width: 100%;
		min-height: 820px;
	}

	.node {
		fill: #dbeff6;
		stroke: #0f766e;
		stroke-width: 6;
	}

	.node-label {
		font: 700 22px "Inter", sans-serif;
		fill: #0f766e;
	}

	.node-sub {
		font: 400 16px "Inter", sans-serif;
		fill: #134e4a;
	}

	.arrow-text {
		font: 600 15px "Inter", sans-serif;
		fill: #115e59;
	}

	.arrow-text-lg {
		font: 700 16px "Inter", sans-serif;
		fill: #0d665c;
		font-weight: 700;
	}

	.node.start {
		fill: #d6f5f0;
	}

	.node.end {
		fill: #fef3c7;
	}

	.node.aux {
		fill: #f5d9f3;
	}

	.diagram-description {
		margin-top: 1.4rem;
	}

	.diagram-description h2 {
		margin-top: 0;
	}

	.diagram-description ol {
		padding-left: 1.2rem;
	}

	.diagram-description li {
		margin-bottom: 0.8rem;
	}

	.button {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.75rem 1.1rem;
		background: #0f766e;
		color: #fff;
		text-decoration: none;
		border-radius: 10px;
	}

	.button:hover {
		background: #0d665c;
	}
</style>
