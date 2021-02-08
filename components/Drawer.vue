<template>
  <div class="h-full p-1 border rounded-md border-quicksilver text-quicksilver">
    <canvas ref="canvas" class="h-full" v-show="!error"></canvas>
    <div v-if="error" class="flex flex-col flex-grow h-full text-md">
      <div class="flex-grow">{{ error }}</div>
      <div><Snack :label="$t('OK')" v-on:click="flushError" /></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import drawWaveform from "~/lib/drawWaveform";
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
      const currentClip = this.$store.state.generator.clips[this.clipIndex];
      if (currentClip && currentClip.file) {
        this.process(currentClip.file);
      }
    },
    clips() {
      const currentClip = this.$store.state.generator.clips[
        this.$store.state.generator.clipIndex
      ];
      if (currentClip && currentClip.file) {
        this.process(currentClip.file);
      }
    },
  },
  methods: {
    flushError() {
      this.$store.commit("errors/clear");
    },
    async process(file) {
      const arrayBuffer = await file.arrayBuffer();
      const { duration } = await drawWaveform({
        canvas: this.$refs.canvas,
        arrayBuffer,
      });
      this.$emit("load", duration);
    },
  },
};
</script>
