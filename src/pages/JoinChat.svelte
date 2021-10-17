<script type="ts">
	import type ChatClient from "../libs/ChatClient";
	import { Chat } from "../stores/state";

	export let client: ChatClient;

	let chatKey = "";

	function newChat() {
		client.newChat();
	}

	function joinChat() {
		client.joinChat(chatKey);
	}
</script>

<div
	class="bg-green-100 w-full h-full flex flex-col justify-center items-center absolute p-3"
>
	<div
		class="bg-white shadow-lg flex flex-col p-3 sm:w-96 w-full transition-all"
	>
		<h1 class="text-6xl	text-center mb-2">
			Chat <img alt="logo" class="inline" style="height: 1em;" src="./logo.svg" />
		</h1>
		{#if !$Chat.chatID}
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-3 mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
				on:click={newChat}
			>
				New Chat
			</button>
			<input
				class="w-full shadow appearance-none border rounded my-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				bind:value={chatKey}
				placeholder="Chat key"
			/>
			<button
				disabled={!chatKey.length}
				class="{!chatKey.length
					? 'bg-gray-300'
					: 'bg-gray-500 hover:bg-gray-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
				on:click={joinChat}
			>
				Join Chat
			</button>
		{:else}
			<h2 class="text-xl p-2 rounded text-center">Chat ID</h2>
			<h2
				class="text-3xl p-4 rounded bg-blue-100	text-center mb-2 shadow-inner"
			>
				{$Chat.chatID}
			</h2>
			<h3 class="animate-pulse text-center pt-3">
				Wating for participants
			</h3>
		{/if}
	</div>
</div>
