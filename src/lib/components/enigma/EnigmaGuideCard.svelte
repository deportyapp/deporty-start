<section class="card guide-card" aria-labelledby="guide-title">
	<h2 id="guide-title">Lee la pantalla asi</h2>
	<p>La explicacion esta en el movimiento. Mira estas pistas mientras la maquina avanza.</p>

	<div class="guide-grid">
		<article class="guide-item tone-blue">
			<span class="guide-mark">1</span>
			<h3>Cabezal</h3>
			<p>La celda resaltada marca donde esta trabajando ahora.</p>
		</article>

		<article class="guide-item tone-amber">
			<span class="guide-mark">2</span>
			<h3>Zonas</h3>
			<p>Izquierda: lee. Centro: cruza. Derecha: escribe el resultado.</p>
		</article>

		<article class="guide-item tone-green">
			<span class="guide-mark">3</span>
			<h3>Ruta</h3>
			<p>La fila de etapas muestra en que parte del proceso va la maquina.</p>
		</article>

		<article class="guide-item tone-slate">
			<span class="guide-mark">4</span>
			<h3>Traza</h3>
			<p>La ultima linea siempre resume lo que acaba de pasar.</p>
		</article>
	</div>

	<div class="control-legend" aria-label="Acciones recomendadas">
		<span>Paso: mira el detalle</span>
		<span>Ejecutar: mira el recorrido completo</span>
		<span>Reiniciar: vuelve a empezar</span>
	</div>
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

	.guide-card {
		position: sticky;
		top: 1rem;
	}

	h2 {
		margin: 0 0 0.8rem;
		font-size: 1.04rem;
	}

	.guide-card p {
		margin: 0 0 1rem;
		color: var(--muted, #4f6078);
	}

	.guide-grid {
		display: grid;
		gap: 0.7rem;
	}

	.guide-item {
		position: relative;
		border: 1px solid var(--line, #d2deef);
		border-radius: 14px;
		padding: 0.9rem 0.8rem 0.75rem;
		background: #f9fbff;
	}

	.guide-item h3 {
		margin: 0 0 0.25rem;
		font-size: 0.96rem;
	}

	.guide-item p {
		margin: 0;
		font-size: 0.92rem;
	}

	.guide-mark {
		position: absolute;
		top: 0.7rem;
		right: 0.7rem;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 999px;
		display: grid;
		place-items: center;
		font-size: 0.76rem;
		font-weight: 800;
		background: rgba(255, 255, 255, 0.65);
	}

	.tone-blue {
		background: #eff6ff;
		border-color: #bfdbfe;
	}

	.tone-amber {
		background: #fff7e8;
		border-color: #f8d59a;
	}

	.tone-green {
		background: #eefbf1;
		border-color: #b8e0c1;
	}

	.tone-slate {
		background: #f8fafc;
		border-color: #cbd5e1;
	}

	.control-legend {
		margin-top: 0.85rem;
		display: grid;
		gap: 0.45rem;
	}

	.control-legend span {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.65rem;
		border-radius: 999px;
		background: #f7fbff;
		border: 1px solid var(--line, #d2deef);
		font-size: 0.88rem;
	}

	@media (max-width: 760px) {
		.guide-card {
			position: static;
		}
	}
</style>