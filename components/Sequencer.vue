<template>
  <div @click="toggleSequencer">PLAY</div>
</template>

<script>
import { Recorder } from "tone";
import { mapState } from "vuex";
import { samplers } from "~/store/samplers";
import { trim } from "~/lib/ffmpeg";

export default {
  created() {
    this.parts = samplers
      .filter((sampler) => sampler.buffer.loaded)
      .map((sampler) => ({
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
      this.parts = samplers
        .filter((sampler) => sampler.buffer.loaded)
        .map((sampler, index, self) => ({
          time:
            index === 0
              ? 0
              : self
                  .filter((_, i) => i < index)
                  .reduce(
                    (acc, current) => (acc += current.buffer.duration + 0.2),
                    0
                  ),
          duration: sampler.buffer.duration,
          note: "C4",
          velocity: 1,
        }));
    },
  },
  methods: {
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
      console.log("REgistered");
    },
    async download(chunks) {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const buffer = await blob.arrayBuffer();
      console.log(buffer);
      let file = new File([buffer], "mash.wav", {
        type: "audio/wav",
      });
      file = await trim({ file, type: "start" });
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "mash.wav";
      a.click();
      URL.revokeObjectURL(url);
    },
    async toggleSequencer() {
      console.log(this.recorder);
      let index = 0;
      this.recorder.start();
      const part = new this.Tone.Part((time, value) => {
        samplers[index].connect(this.dest);
        samplers[index].start(time);
        index++;
      }, this.parts);
      part.start();
      this.Tone.start();
      this.Tone.Transport.start();
      setTimeout(() => {
        this.recorder.stop();
        this.recorder = null;
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