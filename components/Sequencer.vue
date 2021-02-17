<template>
  <div>
    <div class="flex">
      <div
        @click="toggleSequencer({ record: true })"
        class="flex items-center justify-center flex-1 w-1/2 p-1 text-md transition-colors duration-150 border rounded-md cursor-pointer border-quicksilver text-quicksilver hover:bg-granny hover:text-davys"
        :class="{
          'pointer-events-none bg-ryb animation-blink text-light': playing,
        }"
      >
        {{ $t("PLAY") }}
      </div>
    </div>
    <div v-if="file && !$store.state.generator.loading">
      <div
        @click="download"
        class="flex items-center justify-center flex-1 w-full p-1 mt-1 text-md transition-colors duration-150 border rounded-md cursor-pointer border-quicksilver text-quicksilver hover:bg-granny hover:text-davys"
        :class="{
          'pointer-events-none animation-blink text-light': playing,
        }"
        :disabled="playing"
      >
        {{ $t("DOWNLOAD") }}
      </div>
    </div>
    <div
      v-else-if="!playing"
      class="p-1 mt-1 font-mono text-md border rounded-md text-quicksilver border-quicksilver"
    >
      {{ stateMessage }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { samplers } from "~/store/samplers";
import { ffmpegTrim } from "~/lib/ffmpeg";
import drawWaveform from "~/lib/drawWaveform";

export default {
  props: {
    space: Number,
    name: String,
  },
  created() {
    this.parts = samplers
      .filter(({ sampler }) => sampler.buffer.loaded)
      .map(({ sampler }) => ({
        time: sampler.buffer.duration,
        note: "C4",
        velocity: 1,
      }));
    this.setParts();
    if (process.client) {
      this.registerEncoder();
    }
  },
  computed: {
    ...mapState({
      clips: (state) => {
        return clips;
      },
    }),
    stateMessage() {
      if (this.$store.state.generator.loading) {
        return this.$t("PROCESSING");
      }
      return this.$t("PLAY_TO_DOWNLOAD");
    },
  },
  watch: {
    "$store.state.generator.loadEmitter": function() {
      this.setParts();
    },
    space() {
      this.setParts();
    },
    name() {
      this.file = new File([this.file], `${this.name}.wav`, {
        type: this.file.type,
      });
    },
  },
  methods: {
    setParts() {
      this.parts = samplers
        .filter((item) => item.sampler.buffer.loaded)
        .map((item, index, self) => ({
          time:
            index === 0
              ? 0
              : self
                  .filter((_, i) => i < index)
                  .reduce(
                    (acc, current) =>
                      (acc += current.sampler.buffer.duration + this.space),
                    0
                  ),
          duration: item.sampler.buffer.duration,
          note: "C4",
          velocity: 1,
        }));
    },
    async registerEncoder() {
      // require order is important
      if (!window.registeredWavEnconder) {
        const { register } = require("extendable-media-recorder");
        const { connect } = require("extendable-media-recorder-wav-encoder");
        await register(await connect());
        window.registeredWavEnconder = true;
      }
      this.MediaRecorder = require("extendable-media-recorder").MediaRecorder;
      this.registerRecorder();
    },
    async registerRecorder() {
      this.Tone = require("tone");
      this.dest = this.Tone.context.createMediaStreamDestination();
      this.recorder = new this.MediaRecorder(this.dest.stream, {
        mimeType: "audio/wav",
      });
      const chunks = [];
      this.recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          this.$store.commit("generator/loading", true);
          const blob = new Blob(chunks, { type: "audio/wav" });
          const buffer = await blob.arrayBuffer();
          this.file = new File([buffer], `${this.name}.wav`, {
            type: "audio/wav",
          });
          this.file = await ffmpegTrim({ file: this.file, type: "start" });
          this.$store.commit("generator/loading", false);
        }
      };
    },
    async download() {
      const url = URL.createObjectURL(this.file);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = `${this.name}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    },
    async toggleSequencer({ record }) {
      if (
        this.$store.state.generator.clips.every((clip) => clip === undefined)
      ) {
        return;
      }
      this.playing = true;
      let index = 0;
      if (record) {
        this.recorder.start();
      }
      const part = new this.Tone.Part((time, value) => {
        if (!samplers[index].sampler.loaded) {
          return;
        }
        samplers[index].sampler
          .connect(samplers[index].fx.reverb.connect(this.dest))
          // .connect(samplers[index].fx.pitchShift.connect(this.dest))
          .connect(this.dest)
          .start(time);
        index++;
      }, this.parts);
      part.start();
      this.Tone.start();
      this.Tone.Transport.start();
      setTimeout(() => {
        this.recorder.stop();
        this.recorder = null;
        this.playing = false;
        this.registerRecorder();
      }, this.parts[this.parts.length - 1].time * 1000 + 1000);
    },
  },
  data() {
    return {
      playing: false,
      file: null,
    };
  },
};
</script>
