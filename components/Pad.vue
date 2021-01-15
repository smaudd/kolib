<template>
  <div
    @click="!clip.file ? openFile() : () => {}"
    class="flex items-center justify-center p-4 overflow-hidden transition-all duration-200 rounded-lg h-14"
    :class="{
      'bg-secondary text-primary': over && !loading,
      'bg-quicksilver text-secondary': !clip.file && !loading,
      'bg-melon': clip.file && !playing && !loading && clipIndex !== index,
      'bg-ryb text-secondary': playing && !loading,
      'bg-light text-secondary animation-blink': loading || loadingMany,
      'bg-granny text-secondary': clipIndex === index && !playing,

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
      autoTrimAll: (state) => {
        return state.autoTrimAll;
      },
      clipIndex: (state) => {
        return state.clipIndex;
      },
    }),
  },
  created() {
    if (process.client) {
      this.Tone = require("tone");
      this.sampler = new this.Tone.Player();
      this.sampler.onstop = () => {
        this.playing = false;
      };
      this.reverb = new this.Tone.Reverb().toDestination();
      this.pitchShift = new this.Tone.PitchShift().toDestination();
      // this.envelope = new this.Tone.AmplitudeEnvelope().toDestination();
      this.sampler.connect(this.pitchShift).connect(this.reverb);
      setSampler({
        sampler: this.sampler,
        fx: {
          reverb: this.reverb,
          pitchShift: this.pitchShift,
        },
      });
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
      // this.envelope.attack = this.preset.envelope.attack;
      // this.envelope.decay = this.preset.envelope.decay;
      // this.envelope.sustain = this.preset.envelope.sustain;
      // this.envelope.release = this.preset.envelope.release;
    },
  },
  methods: {
    async workerResponseHandler(event) {
      const { index, objectURL, file, length } = event.data;
      await samplers[index].sampler.load(objectURL);
      // this.download(file.name, objectURL);
      this.$store.commit("setClip", { index, file });
      this.$store.commit("triggerLoadEmitter");
      this.loading = false;
      URL.revokeObjectURL(objectURL);
      this.$store.commit("setClipIndex", index);
      if (index === length - 1) {
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
    async upload(files) {
      if (files.length === 1) {
        let file = files[0];
        if (this.autoTrimAll) {
          file = await trim({ file: files[0], type: "edges" });
        }
        await this.loadSampler({
          file,
          index: this.index,
          length: files.length,
        });
        return;
      }
      let i = 0;
      this.$store.commit("loadingMany", true);
      for await (let file of files) {
        if (this.autoTrimAll) {
          file = await trim({ file, type: "edges" });
        }
        await this.loadSampler({
          file,
          index: i,
          length: files.length,
        });
        i++;
      }
    },
    async onDrop(event) {
      this.loading = true;
      event.preventDefault();
      event.stopPropagation();
      this.over = false;
      const files = event.dataTransfer.files;
      this.upload(files);
    },
    async onFile(event) {
      this.loading = true;
      const files = event.target.files;
      this.upload(files);
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
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.download = fileName;
      a.href = objectURL;
      a.click();
      // URL.revokeObjectURL(objectURL);
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
