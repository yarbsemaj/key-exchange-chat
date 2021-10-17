const production = !process.env.ROLLUP_WATCH;
module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [
  ],
  purge: {
    content: [
     "./src/App.svelte",
     "./src/pages/Loading.svelte",
     "./src/pages/JoinChat.svelte",
     "./src/pages/MessageInterface.svelte",
     "./src/components/Message.svelte",
     "./src/components/alerts/Alert.svelte",
     "./src/components/alerts/AlertList.svelte"
    ],
    enabled: production // disable purge in dev
  },
};