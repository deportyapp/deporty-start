<script lang="ts">
	export let trace: string[] = [];
</script>

<ol id="trace" class="trace" aria-live="polite">
	{#each trace as line, index}
		<li class:latest={index === trace.length - 1}>
			<span class="trace-dot" aria-hidden="true"></span>
			<div>
				{#if index === trace.length - 1}
					<strong class="trace-badge">Ahora</strong>
				{/if}
				<span>{line}</span>
			</div>
		</li>
	{/each}
</ol>

<style>
	.trace {
		margin: 0;
		padding-left: 0;
		list-style: none;
		max-height: 220px;
		overflow: auto;
	}

	.trace li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.6rem;
		padding: 0.55rem 0.1rem;
		border-bottom: 1px solid rgba(210, 222, 239, 0.7);
	}

	.trace li.latest {
		background: linear-gradient(90deg, rgba(255, 245, 223, 0.85), transparent);
	}

	.trace-dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 999px;
		background: #9aa9c4;
		margin-top: 0.25rem;
	}

	.trace li.latest .trace-dot {
		background: #f59e0b;
	}

	.trace-badge {
		display: inline-block;
		margin-right: 0.45rem;
		padding: 0.08rem 0.4rem;
		border-radius: 999px;
		background: #fff1cc;
		font-size: 0.72rem;
	}

	.trace li:last-child {
		border-bottom: 0;
	}
</style>