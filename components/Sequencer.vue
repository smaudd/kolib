<template>
  <div class="flex">
    <div
      @click="toggleSequencer({ record: false })"
      class="flex-1 w-1/2 p-1 text-sm transition-colors duration-150 border rounded-md cursor-pointer border-quicksilver text-quicksilver hover:bg-granny hover:text-davys"
      style="margin-right: 0.125rem"
      :class="{
        'pointer-events-none bg-ryb animation-blink text-light': playing,
      }"
    >
      {{ $t("PLAY") }}
    </div>
    <div
      @click="toggleSequencer({ record: true })"
      class="flex-1 w-1/2 p-1 ml-1 text-sm transition-colors duration-150 border rounded-md cursor-pointer border-quicksilver text-quicksilver hover:bg-granny hover:text-davys"
      style="margin-left: 0.125rem"
      :class="{
        'pointer-events-none bg-ryb animation-blink text-light': playing,
      }"
    >
      {{ $t("PLAY_SAVE") }}
    </div>
  </div>
</template>

<script>
import { Recorder } from "tone";
import { mapState } from "vuex";
import { samplers } from "~/store/samplers";
import { ffmpegTrim } from "~/lib/ffmpeg";

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
    this.registerEncoder();
  },
  computed: {
    ...mapState({
      clips: (state) => {
        return clips;
      },
    }),
  },
  watch: {
    "$store.state.loadEmitter": function () {
      this.setParts();
    },
    space: function () {
      this.setParts();
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
      const { MediaRecorder, register } = require("extendable-media-recorder");
      const { connect } = require("extendable-media-recorder-wav-encoder");
      await register(await connect());
      this.MediaRecorder = MediaRecorder;
      this.registerRecorder();
    },
    async registerRecorder() {
      this.Tone = require("tone");
      this.dest = this.Tone.context.createMediaStreamDestination();
      this.recorder = new this.MediaRecorder(this.dest.stream, {
        mimeType: "audio/wav",
      });
      const chunks = [];
      this.recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          this.download(chunks);
        }
      };
    },
    async download(chunks) {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const buffer = await blob.arrayBuffer();
      let file = new File([buffer], `${this.name}.wav`, {
        type: "audio/wav",
      });
      file = await ffmpegTrim({ file, type: "start" });
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = `${this.name}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    },
    async toggleSequencer({ record }) {
      if (this.$store.state.clips.every((clip) => clip === undefined)) {
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
    };
  },
};
</script>