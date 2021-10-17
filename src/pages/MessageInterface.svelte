<script type="ts">
    import type ChatClient from "../libs/ChatClient";
    import Message from "../components/Message.svelte";
    import { beforeUpdate, afterUpdate } from "svelte";
    import { Chat } from "../stores/state";
    export let client: ChatClient;

    let message;

    let div;
    let autoscroll;

    let showKeys = false;

    beforeUpdate(() => {
        autoscroll =
            div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
    });

    afterUpdate(() => {
        if(!div) return;
        if (autoscroll) div.scrollTo(0, div.scrollHeight);
    });
    function send(e) {
        e.preventDefault();
        client.sendMessage(message);
        message = "";
    }

    function doShowKeys(value) {
        showKeys = value;
    }
</script>

<div
    class="bg-green-100 w-full h-full flex flex-col justify-center items-center absolute p-3"
>
    {#if !showKeys}
        <div
            class="bg-white h-full shadow-lg flex flex-col md:w-1/3 w-full transition-all flex"
        >
            <div class="w-full bg-green-50 p-2 flex flex-row-reverse">
                <button
                    on:click={() => doShowKeys(true)}
                    type="submit"
                    class="bg-blue-500 rounded hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                >
                    Show Keys
                </button>
            </div>
            <div class="overflow-y-scroll flex-grow h-full p-3" bind:this={div}>
                {#each $Chat.messages as message}
                    <Message {message} />
                {/each}
            </div>
            <form class="flex w-full rounded px-3 pb-3" on:submit={send}>
                <input
                    class="flex-grow w-full rounded-l-lg m-1"
                    placeholder="Message..."
                    bind:value={message}
                />
                <button
                    type="submit"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                >
                    Send
                </button>
            </form>
        </div>
    {:else}
        <div
            class="bg-white shadow-lg flex flex-col md:w-1/2 w-full transition-all flex absolute"
        >
            <div class="w-full bg-green-50 p-2 flex flex-row-reverse">
                <button
                    on:click={() => doShowKeys(false)}
                    type="submit"
                    class="bg-red-500 rounded hover:bg-red-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                >
                    Close
                </button>
            </div>
            <div class="m-3">
                <h4 class="text-lg font-medium	">My Public Key</h4>
                <code
                    class="bg-gray-800 text-white rounded p-2 block whitespace-pre overflow-x-scroll"
                    >{$Chat.publicKey}</code
                >
                <h4 class="text-lg font-medium	">Remote Public Key</h4>
                <code
                    class="bg-gray-800 text-white rounded p-2 block whitespace-pre overflow-x-scroll"
                    >{$Chat.remotePublicKey}</code
                >
                <h4 class="text-lg font-medium	">Shared Secret</h4>
                <code
                    class="bg-gray-800 text-white rounded p-2 block whitespace-pre overflow-x-scroll"
                    >{$Chat.sharedSecret.toString(16)}</code
                >
            </div>
        </div>
    {/if}
</div>
