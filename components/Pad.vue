<template>
  <div
    @click="!clip.file ? openFile() : () => {}"
    class="flex items-center justify-center h-24 p-4 overflow-hidden transition-all duration-200 border rounded-lg"
    :class="{
      'bg-secondary text-primary': over && !loading,
      'bg-primary text-secondary': !clip.file && !loading,
      'bg-orange-600 text-secondary': clip.file && !playing && !loading,
      'bg-red-600 text-secondary': playing && !loading,
      'bg-gray-600 text-secondary animation-blink': loading || loadingMany,
      'pointer-events-none': loading || loadingMany,

    }"
    v-on:dragover="onDragover"
    v-on:dragleave="onDragleave"
    v-on:drop="onDrop"
    v-on:mousedown="onMousedown"
    v-on:mouseup="onMouseup"
  >
    <input
      type="file"
      ref="file"
      accept="audio/*"
      v-show="false"
      v-on:change="onFile"
    />
    <div v-if="clip.file" class="text-xs">
      <p>{{ clip.file && clip.file.name }}</p>
    </div>
    <div v-else>{{ index + 1 }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { setSampler, samplers } from "~/store/samplers.js";
import { trim } from "~/lib/ffmpeg";
export default {
  props: {
    index: Number,
    filled: Boolean,
    clip: Object,
    preset: Object,
  },
  computed: {
    ...mapState({
      loadingMany: (state) => {
        return state.loadingMany;
      },
    }),
  },
  created() {
    if (process.client) {
      this.Tone = require("tone");
      this.sampler = new this.Tone.Player().toDestination();
      this.sampler.onstop = () => {
        this.playing = false;
      };
      // this.reverb = new this.Tone.Reverb().toDestination();
      // this.pitchShift = new this.Tone.PitchShift().toDestination();
      // this.envelope = new this.Tone.AmplitudeEnvelope().toDestination();
      // this.player.connect(this.pitchShift).connect(this.reverb);
      setSampler(this.sampler);
      if (process.browser) {
        // Remember workers just work in client?
        this.worker = this.$worker.createWorker(); // Instruction assigned in plugin
        this.worker.addEventListener("message", this.workerResponseHandler);
      }
    }
  },
  watch: {
    preset() {
      this.pitchShift.set({
        wet: this.preset.pitch.wet,
        pitch: this.preset.pitch.value,
      });
      this.reverb.set({
        wet: this.preset.reverb.wet,
        decay: this.preset.reverb.decay,
      });
      this.envelope.attack = this.preset.envelope.attack;
      this.envelope.decay = this.preset.envelope.decay;
      this.envelope.sustain = this.preset.envelope.sustain;
      this.envelope.release = this.preset.envelope.release;
    },
  },
  methods: {
    async workerResponseHandler(event) {
      const { index, objectURL, file, length } = event.data;
      await samplers[index].load(objectURL);
      this.$store.commit("setClip", { index, file });
      this.$store.commit("triggerLoadEmitter");
      this.loading = false;
      URL.revokeObjectURL(objectURL);
      console.log("loading maby commit", index, length);
      if (index === length - 1) {
        console.log("commited");
        this.$store.commit("loadingMany", false);
      }
    },
    onDragover(e) {
      e.preventDefault();
      e.stopPropagation();
      this.over = true;
    },
    onDragleave() {
      this.over = false;
    },
    async onDrop(event) {
      this.loading = true;
      event.preventDefault();
      event.stopPropagation();
      this.over = false;
      const files = event.dataTransfer.files;
      if (files.length === 1) {
        const trimmedFile = await trim({ file: files[0], type: "edges" });
        await this.loadSampler({
          file: trimmedFile,
          index: this.index,
          length: files.length,
        });
        return;
      }
      let i = 0;
      this.$store.commit("loadingMany", true);
      for await (const file of files) {
        const trimmedFile = await trim({ file, type: "edges" });
        await this.loadSampler({
          file: trimmedFile,
          index: i,
          length: files.length,
        });
        i++;
      }
    },
    async onFile({ target }) {
      const files = target.files;
      if (files.length === 1) {
        const trimmedFile = await trim({ file: files[0], type: "edges" });
        await this.loadSampler({ file: trimmedFile, index: this.index });
        return;
      }
      let i = 0;
      this.$store.commit("loadingMany", true);
      for await (const file of files) {
        const trimmedFile = await trim({ file, type: "edges" });
        await this.loadSampler({
          file: trimmedFile,
          index: i,
          length: files.length,
        });
        i++;
      }
    },
    async onMousedown() {
      if (this.clip.file && !this.loading) {
        await this.play();
      }
      this.longPressTimeout = setTimeout(() => {
        this.$refs.file.click();
      }, 1500);
    },
    onMouseup() {
      clearInterval(this.longPressTimeout);
    },
    async play() {
      this.playing = true;
      await this.Tone.start();
      this.sampler.start();
      this.$store.commit("setClipIndex", this.index);
    },
    download(fileName, objectURL) {
      const url = objectURL;
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    },
    async loadSampler({ file, index, length }) {
      try {
        this.loading = true;
        this.worker.postMessage({ file, index, length });
      } catch (err) {
        this.loading = false;
        this.$store.commit("errors/set", err.toString());
      }
    },
    openFile() {
      this.$refs.file.click();
      this.loading = true;
    },
  },
  data() {
    return {
      over: false,
      playing: false,
      longPressTimeout: null,
      loading: false,
      allowedTypes: ["audio/wav", "audio/mp3"],
    };
  },
};
</script>
