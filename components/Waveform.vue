<template>
  <div
    ref="container"
    class="flex-grow p-1 border rounded-md border-quicksilver text-quicksilver"
    :class="{ 'animation-blink': $store.state.generator.loading }"
  >
    <div id="waveform" ref="waveform" v-show="!error"></div>
    <div v-if="error" class="flex flex-col flex-grow h-full text-md">
      <div class="flex-grow">{{ error }}</div>
      <div><Snack :label="$t('OK')" v-on:click="flushError" /></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Snack from "~/components/Snack";

export default {
  components: {
    Snack,
  },
  computed: {
    ...mapState({
      clipIndex: (state) => {
        return state.generator.clipIndex;
      },
      clips: (state) => {
        return state.generator.clips;
      },
    }),
    error() {
      return this.$store.state.errors.message;
    },
  },
  watch: {
    clipIndex() {
      this.worker.postMessage({
        file: this.$store.state.generator.clips[this.clipIndex].file,
      });
    },
    clips() {
      const currentClip = this.$store.state.generator.clips[
        this.$store.state.generator.clipIndex
      ];
      this.worker.postMessage({
        file: currentClip ? currentClip.file : "",
      });
    },
  },
  mounted() {
    if (process.client) {
      const parentEl = this.$refs.container.parentElement;
      const previousSibling = this.$refs.container.previousElementSibling;
      const { height: parentElHeight } = parentEl.getBoundingClientRect();
      const {
        height: previousSiblingElHeight,
      } = previousSibling.getBoundingClientRect();

      const height = parentElHeight - previousSiblingElHeight;
      const WaveSurfer = require("wavesurfer.js");
      this.wavesurfer = WaveSurfer.create({
        container: this.$refs.waveform,
        waveColor: "#FFBFB7",
        progressColor: "purple",
        cursorColor: "transparent",
        hideScrollbar: true,
        interact: false,
        height: height - 16 * 6 * 0.5,
      });
      this.wavesurfer.on("ready", () => {
        this.$emit("load", {
          duration: this.wavesurfer.getDuration().toFixed(2),
        });
      });
      this.worker = this.$worker.createWorker(); // Instruction assigned in plugin
      this.worker.addEventListener("message", this.workerResponseHandler);
      if (this.clipIndex !== null) {
        this.worker.postMessage({
          file: this.$store.state.generator.clips[this.clipIndex].file,
        });
      }
    }
  },
  destroyed() {
    // this.wavesurfer.destroy();
  },
  methods: {
    workerResponseHandler(event) {
      const { objectURL } = event.data;
      this.wavesurfer.load(objectURL);
    },
    flushError() {
      this.$store.commit("errors/clear");
    },
  },
  data() {
    return {
      duration: "",
    };
  },
};
</script>
