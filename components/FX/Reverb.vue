<template>
  <div class="flex flex-col items-center w-full">
    <Slider
      type="range"
      :step="1"
      :min="0.001"
      :max="10"
      :title="$t('DECAY')"
      :value="presets[clipIndex].reverb.decay"
      v-on:input="onReverbDecayChange"
    />
    <Slider
      type="range"
      :step="0.1"
      :min="0"
      :max="1"
      :title="$t('WET')"
      :value="presets[clipIndex].reverb.wet"
      v-on:input="onReverbWetChange"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Slider from "~/components/Slider";

export default {
  components: {
    Slider,
  },
  computed: {
    ...mapState({
      presets: (state) => {
        return state.presets;
      },
      clipIndex: (state) => {
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