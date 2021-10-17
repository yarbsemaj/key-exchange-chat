<script type="ts">
    import type Message from "../libs/Message";

    export let message: Message;
</script>

<div class="flex w-full">
    <div class="rounded {!message.remote ? 'bg-blue-500 ml-auto' : 'bg-gray-500'} px-2 my-1 text-white" >
        {message.message}
    </div>
</div>
