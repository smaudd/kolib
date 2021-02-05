<template>
  <div class="h-full p-1 border rounded-md border-quicksilver text-quicksilver">
    <canvas ref="canvas" class="h-full" v-show="!error"></canvas>
    <div v-if="error" class="flex flex-col flex-grow h-full text-sm">
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
  props: {
    audio: Object,
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
      this.process(this.$store.state.generator.clips[this.clipIndex].file);
    },
    clips() {
      const currentClip = this.$store.state.generator.clips[
        this.$store.state.generator.clipIndex
      ];
      if (currentClip.file) {
        this.process(currentClip.file);
      }
    },
  },
  methods: {
    flushError() {
      this.$store.commit("errors/clear");
    },
    scaleY(amplitude, height) {
      const range = 256;
      const offset = 128;
      return height - ((amplitude + offset) * height) / range;
    },
    async process(file) {
      if (process.client) {
        const canvas = this.$refs.canvas;
        const ctx = this.$refs.canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const WaveformData = require("waveform-data");
        WaveformData.createFromAudio(
          {
            audio_context: new AudioContext(),
            scale: 32,
            array_buffer: await file.arrayBuffer(),
          },
          (err, waveform) => {
            this.$emit("load", waveform.duration);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (err) {
              console.log(err);
            }
            ctx.beginPath();

            const channel = waveform.channel(0);

            // Loop forwards, drawing the upper half of the waveform
            for (let x = 0; x < waveform.length; x++) {
              const val = channel.max_sample(x);
              ctx.lineTo(x + 0.5, this.scaleY(val, canvas.height));
            }
            // Loop backwards, drawing the lower half of the waveform
            for (let x = waveform.length - 1; x >= 0; x--) {
              const val = channel.min_sample(x);
              ctx.lineTo(x + 0.5, this.scaleY(val, canvas.height));
            }

            ctx.closePath();
            ctx.fillStyle = "#FFBFB7";
            ctx.strokeStyle = "#FFBFB7";
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.fill();
          }
        );
      }
    },
  },
};
</script>