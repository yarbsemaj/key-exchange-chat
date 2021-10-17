<script lang="ts">
	import type ChatClient from "./libs/ChatClient";
	import { fade } from "svelte/transition";
	
	import Loading from "./pages/Loading.svelte";
	import JoinChat from "./pages/JoinChat.svelte";
	import MessageInterface from "./pages/MessageInterface.svelte";
	import AlertList from "./components/alerts/AlertList.svelte";

	import { Chat } from "./stores/state";


	export let client: ChatClient;
</script>

<main>
	{#if !$Chat.publicKey}
		<div transition:fade>
			<Loading />
		</div>
	{:else if $Chat.participants && $Chat.participants.length === 2}
		<MessageInterface {client} />
	{:else}
		<JoinChat {client} />
	{/if}
	<AlertList />
</main>
