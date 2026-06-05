<main class="layout" aria-labelledby="diagram-title">
	<section class="card">
		<h1 id="diagram-title">Diagrama gráfico de la máquina de Turing</h1>

		<div class="diagram-container">
			<div class="diagram-left">
				<p>Este diagrama muestra cómo la máquina procesa cada símbolo del mensaje encriptado usando los estados internos qRead, qDecode, qWrite, qMove y qH.</p>

				<div class="diagram-visual" role="img" aria-label="Diagrama de estados de la máquina de Turing">
			<svg viewBox="50 10 900 800" aria-hidden="true">
				<defs>
					<marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="6" orient="auto">
						<path d="M 0 0 L 10 5 L 0 10 z" fill="#0f766e" />
					</marker>
				</defs>

				<!-- Estados principales en línea vertical central -->
				<circle cx="560" cy="100" r="90" class="node start" />
				<text x="560" y="90" text-anchor="middle" class="node-label">qRead</text>
				<text x="560" y="115" text-anchor="middle" class="node-sub">Lee símbolo</text>

				<circle cx="560" cy="250" r="90" class="node" />
				<text x="560" y="240" text-anchor="middle" class="node-label">qDecode</text>
				<text x="560" y="265" text-anchor="middle" class="node-sub">Descifra</text>

				<circle cx="560" cy="400" r="90" class="node" />
				<text x="560" y="390" text-anchor="middle" class="node-label">qWrite</text>
				<text x="560" y="415" text-anchor="middle" class="node-sub">Escribe</text>

				<circle cx="560" cy="550" r="90" class="node end" />
				<text x="560" y="540" text-anchor="middle" class="node-label">qMove</text>
				<text x="560" y="565" text-anchor="middle" class="node-sub">Avanza</text>

				<!-- Estado halt a la izquierda -->
				<circle cx="200" cy="350" r="90" class="node aux" />
				<text x="200" y="340" text-anchor="middle" class="node-label">qH</text>
				<text x="200" y="365" text-anchor="middle" class="node-sub">Parada</text>

				<!-- Transiciones verticales centrales -->
				<line x1="560" y1="175" x2="560" y2="205" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />
				<line x1="560" y1="325" x2="560" y2="355" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />
				<line x1="560" y1="475" x2="560" y2="505" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />

				<!-- Transición desde qMove a qH (abajo izquierda) -->
				<path d="M 500 620 C 350 680 250 680 280 440" fill="none" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />

				<!-- Transición desde qH de vuelta a qRead (arriba) -->
				<path d="M 280 260 C 350 150 450 130 480 100" fill="none" stroke="#0f766e" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)" />

				<!-- Etiquetas de transiciones -->
				<text x="680" y="190" class="arrow-text">Decodifica</text>
				<text x="680" y="330" class="arrow-text">Escribe</text>
				<text x="680" y="490" class="arrow-text">
					<tspan x="680" dy="0">Avanza a la</tspan>
					<tspan x="680" dy="1.5em">siguiente celda</tspan>
				</text>
				<text x="330" y="530" class="arrow-text">Fin de cinta</text>
				<text x="330" y="545" class="arrow-text">→ qH</text>
				<text x="380" y="80" class="arrow-text-lg">
					<tspan x="380" dy="0">Carga inicial /</tspan>
					<tspan x="380" dy="1.6em">reinicio</tspan>
				</text>
			</svg>
		</div>
			</div>

			<div class="diagram-right">
				<h2>Cómo funciona esta máquina</h2>
				<p>
					La máquina de Turing implementada aquí procesa mensajes encriptados de manera secuencial y determinista. 
					En cada ciclo, realiza exactamente cinco operaciones en orden fijo para recuperar un símbolo del mensaje original.
				</p>

				<h3>Los cinco estados de operación</h3>
				<ul class="states-list">
					<li>
						<strong>qRead:</strong> La máquina lee el símbolo encriptado actualmente en la posición del cabezal.
						Este símbolo se mantiene en memoria para los pasos siguientes.
					</li>
					<li>
						<strong>qDecode:</strong> La máquina aplica la clave diaria al símbolo leído, invirtiendo exactamente 
						el desplazamiento que se aplicó durante el encriptado. Calcula la posición original del símbolo.
					</li>
					<li>
						<strong>qWrite:</strong> La máquina guarda el símbolo descifrado en la cinta de salida, asignándolo a la 
						misma posición del cabezal. Esta es la contribución del ciclo actual al mensaje final.
					</li>
					<li>
						<strong>qMove:</strong> La máquina avanza el cabezal una posición hacia la derecha y reinicia el ciclo 
						volviendo a qRead para procesar el siguiente símbolo encriptado.
					</li>
					<li>
						<strong>qH (Halt):</strong> Cuando el cabezal intenta moverse más allá del final de la cinta encriptada, 
						la máquina entra en estado de parada y finaliza la ejecución.
					</li>
				</ul>

				<h3>Garantía de exactitud</h3>
				<p>
					Cada símbolo del mensaje se descifra de forma independiente pero consistente. La máquina aplica siempre 
					la misma clave diaria a cada carácter, por lo que el resultado final coincide exactamente con el mensaje 
					original que fue encriptado.
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
		width: min(1400px, 98vw);
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
		margin: 0 0 1.6rem;
		font-size: clamp(1.6rem, 2.5vw, 2.2rem);
	}

	h2 {
		margin: 0 0 1rem;
		font-size: 1.4rem;
		color: #0f766e;
	}

	h3 {
		margin: 1.2rem 0 0.8rem;
		font-size: 1.1rem;
		color: #134e4a;
		font-weight: 600;
	}

	p {
		margin: 0 0 1rem;
		line-height: 1.7;
		color: #45546e;
	}

	.diagram-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: stretch;
	}

	.diagram-left {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.diagram-right {
		min-width: 0;
		padding: 1.2rem;
		background: #f9fbfd;
		border-radius: 14px;
		border-left: 4px solid #0f766e;
	}

	.diagram-visual {
		margin: 1.6rem 0 0 0;
		flex: 1;
		overflow: auto;
		background: #eef7ff;
		border-radius: 18px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 600px;
	}

	svg {
		width: 100%;
		height: auto;
		min-width: 600px;
		min-height: 600px;
	}

	.node {
		fill: #dbeff6;
		stroke: #0f766e;
		stroke-width: 6;
	}

	.node-label {
		font: 700 28px "Inter", sans-serif;
		fill: #0f766e;
	}

	.node-sub {
		font: 400 20px "Inter", sans-serif;
		fill: #134e4a;
	}

	.arrow-text {
		font: 600 18px "Inter", sans-serif;
		fill: #115e59;
	}

	.arrow-text-lg {
		font: 700 20px "Inter", sans-serif;
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

	.states-list {
		padding-left: 1.2rem;
		margin: 0.8rem 0 1rem 0;
	}

	.states-list li {
		margin-bottom: 1rem;
		line-height: 1.6;
		color: #45546e;
	}

	.states-list strong {
		color: #0f766e;
		font-weight: 600;
	}

	.button {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.75rem 1.1rem;
		background: #0f766e;
		color: #fff;
		text-decoration: none;
		border-radius: 10px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.button:hover {
		background: #0d665c;
	}

	@media (max-width: 900px) {
		.diagram-container {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.diagram-right {
			padding: 1rem;
		}
	}
</style>
