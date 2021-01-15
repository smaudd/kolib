<template>
  <div id="waveform"></div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      clipIndex: (state) => {
        return state.clipIndex;
      },
    }),
  },
  watch: {
    clipIndex() {
      this.worker.postMessage({
        file: this.$store.state.clips[this.clipIndex].file,
      });
    },
  },
  created() {
    if (process.client) {
      const WaveSurfer = require("wavesurfer.js");
      this.wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: "violet",
        progressColor: "purple",
        cursorColor: "transparent",
        hideScrollbar: true,
        interact: false,
      });
      if (process.browser) {
        // Remember workers just work in client?
        this.worker = this.$worker.createWorker(); // Instruction assigned in plugin
        this.worker.addEventListener("message", this.workerResponseHandler);
      }
    }
  },
  methods: {
    workerResponseHandler(event) {
      const { objectURL } = event.data;
      this.wavesurfer.load(objectURL);
    },
  },
};
</script>