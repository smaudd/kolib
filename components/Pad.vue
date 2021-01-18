<template>
  <div
    @click="!clip.file ? openFile() : () => {}"
    class="flex items-center justify-center p-4 overflow-hidden transition-all duration-200 rounded-lg cursor-pointer h-14"
    :class="{
      'bg-secondary text-primary': over && !$store.state.generator.loading,
      'bg-quicksilver text-secondary hover:bg-light':
        !clip.file && !$store.state.generator.loading,
      'bg-melon':
        clip.file &&
        !playing &&
        !$store.state.generator.loading &&
        clipIndex !== index,
      'bg-ryb text-secondary': playing && !$store.state.generator.loading,
      'bg-light text-secondary animation-blink': $store.state.generator.loading,
      'bg-granny text-secondary': clipIndex === index && !playing,
      'pointer-events-none': $store.state.generator.loading,
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
import { ffmpegTrim } from "~/lib/ffmpeg";
export default {
  props: {
    index: Number,
    filled: Boolean,
    clip: Object,
    preset: Object,
  },
  computed: {
    ...mapState({
      autoTrimAll: (state) => {
        return state.generator.autoTrimAll;
      },
      clipIndex: (state) => {
        return state.generator.clipIndex;
      },
      trim: (state) => {
        return state.generator.trim;
      },
      undo: (state) => {
        return state.generator.undo;
      },
    }),
  },
  created() {
    if (process.browser) {
      // Remember workers just work in client?
      this.worker = this.$worker.createWorker(); // Instruction assigned in plugin
      this.worker.addEventListener("message", this.workerResponseHandler);
    }
    if (samplers[this.clipIndex]) {
      this.Tone = require("tone");
      this.sampler = samplers[this.index].sampler;
      this.initFX();
      this.sampler.onstop = () => {
        this.playing = false;
      };
      return;
    }
    if (process.client) {
      this.Tone = require("tone");
      this.sampler = new this.Tone.Player();
      this.initFX();
      this.sampler.onstop = () => {
        this.playing = false;
      };
      setSampler({
        sampler: this.sampler,
        fx: {
          reverb: this.reverb,
          pitchShift: this.pitchShift,
        },
      });
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
    trim: function ({ index, threshold }) {
      if (index === this.index) {
        this.fileCache = this.clip.file;
        this.upload([this.clip.file], {
          threshold,
          active: true,
        });
      }
    },
    undo: function ({ index }) {
      if (index === this.index) {
        this.$store.commit("generator/loading", true);
        this.upload([this.fileCache], { active: false });
      }
    },
  },
  methods: {
    initFX() {
      this.reverb = new this.Tone.Reverb().toDestination();
      this.pitchShift = new this.Tone.PitchShift().toDestination();
      // this.envelope = new this.Tone.AmplitudeEnvelope().toDestination();
      this.sampler.connect(this.pitchShift).connect(this.reverb);
    },
    async workerResponseHandler(event) {
      const { index, objectURL, file, length, trimmed } = event.data;
      try {
        await samplers[index].sampler.load(objectURL);
      } catch (err) {
        this.$store.commit("errors/set", this.$t("CANT_TRIM_FILE"));
        this.$store.commit("generator/loading", false);
        return;
      }
      // this.download(file.name, objectURL);
      this.$store.commit("generator/setClip", { index, file, trimmed });
      this.$store.commit("generator/triggerLoadEmitter");
      URL.revokeObjectURL(objectURL);
      this.$store.commit("generator/setClipIndex", index);
      if (index === length - 1 || length === 1) {
        this.$store.commit("generator/loading", false);
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
    async upload(files, trim) {
      let i = 0;
      this.$store.commit("generator/loading", true);
      if (files.length > 1) {
        this.$store.commit("generator/clearClips");
      }
      for await (let file of files) {
        if (i === this.clipIndex) {
          this.fileCache = file;
        }
        if (this.autoTrimAll.active || trim.active) {
          file = await ffmpegTrim({
            file,
            type: "edges",
            threshold: this.autoTrimAll.active
              ? this.autoTrimAll.threshold
              : trim.threshold,
          });
        }
        await this.loadSampler({
          file,
          index: files.length === 1 ? this.index : i, // If loads just one, use current index instead of iterator
          length: files.length,
          trimmed: this.autoTrimAll.active || trim.active,
        });
        i++;
      }
    },
    async onDrop(event) {
      this.$store.commit("generator/loading", true);
      event.preventDefault();
      event.stopPropagation();
      this.over = false;
      const files = event.dataTransfer.files;
      this.upload(files, { active: false });
    },
    async onFile(event) {
      this.$store.commit("generator/loading", true);
      const files = event.target.files;
      if (files.length === 0) {
        this.$store.commit("generator/loading", false);
        return;
      }
      this.upload(files, { active: false });
    },
    async onMousedown() {
      if (this.clip.file && !this.$store.state.generator.loading) {
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
      this.$store.commit("generator/setClipIndex", this.index);
    },
    download(fileName, objectURL) {
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.download = fileName;
      a.href = objectURL;
      a.click();
    },
    async loadSampler({ file, index, length, trimmed }) {
      // this.$store.commit("generator/setClip", null);
      this.worker.postMessage({ file, index, length, trimmed });
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
      allowedTypes: ["audio/wav", "audio/mp3"],
    };
  },
};
</script>
