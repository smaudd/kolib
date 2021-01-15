<template>
  <div class="">
    REVERB
    <div class="flex">
      <input
        type="range"
        step="1"
        min="0.001"
        max="10"
        :value="presets[clipIndex].reverb.decay"
        @input="onReverbDecayChange"
      />
      <div>{{ presets[clipIndex].reverb.decay }}</div>
    </div>
    <div>
      <input
        type="range"
        step="0.1"
        min="0"
        max="1"
        :value="presets[clipIndex].reverb.wet"
        @input="onReverbWetChange"
      />
      <div>{{ presets[clipIndex].reverb.wet }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      presets: (state) => {
        return state.presets;
      },
      clipIndex: (state) => {
        console.log(state);
        return state.clipIndex;
      },
    }),
  },
  methods: {
    changeValue(param, value) {
      this.$store.commit("setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          reverb: { ...this.presets[this.clipIndex].reverb, [param]: +value },
        },
      });
    },
    onReverbDecayChange({ target }) {
      const { value } = target;
      this.changeValue("decay", value);
    },
    onReverbWetChange({ target }) {
      const { value } = target;
      this.changeValue("wet", value);
    },
  },
};
</script>