import App from './App.svelte';
import ChatClient from './libs/ChatClient';

const app = new App({
	target: document.body,
	props:{
		client : new ChatClient(process.env.WEB_SOCKET_URL)
	}
});

export default app;