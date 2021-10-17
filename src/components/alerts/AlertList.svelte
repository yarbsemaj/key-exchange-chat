<script>
	import { alerts } from "../../stores/alerts";
	import Alert from "./Alert.svelte";
	import { slide } from "svelte/transition";

	let alertsToShow = [];

	alerts.subscribe((alertList) => {
		alertsToShow = alertList;
	});
</script>

<div
	class="absolute"
	style="z-index: 100000;"
>
	{#each alertsToShow as alert}
		<div transition:slide={{ duration: 100 }}>
			<Alert index={alert.id} type={alert.type} text={alert.text} />
		</div>
	{/each}
</div>
