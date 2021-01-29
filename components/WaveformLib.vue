<template>
  <div id="waveform" ref="waveform" />
</template>

<script>
export default {
  props: {
    src: String,
  },
  mounted() {
    const WaveSurfer = require("wavesurfer.js");
    this.wavesurfer = WaveSurfer.create({
      container: this.$refs.waveform,
      waveColor: "#FFBFB7",
      progressColor: "purple",
      cursorColor: "transparent",
      hideScrollbar: true,
      interact: false,
      height: 50,
    });
    this.wavesurfer.load(this.src);
  },
};
</script>