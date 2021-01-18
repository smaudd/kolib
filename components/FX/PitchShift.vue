<template>
  <div class="flex flex-col items-center">
    <Slider
      :step="1"
      :min="-24"
      :max="24"
      :title="$t('PITCH')"
      :value="presets[clipIndex].pitch.value"
      v-on:input="onPitchChange"
    />
    <Slider
      type="range"
      :step="0.1"
      :min="0"
      :max="1"
      :title="$t('WET')"
      :value="presets[clipIndex].pitch.wet"
      v-on:input="onPitchWetChange"
    />
  </div>
</template>

<script>
import Envelope from "~/components/Envelope.vue";
import Slider from "~/components/Slider.vue";

import { mapState } from "vuex";

export default {
  components: {
    Envelope,
    Slider,
  },

  props: {
    pitch: Number,
  },
  computed: {
    ...mapState({
      presets: (state) => {
        return state.generator.presets;
      },
      clipIndex: (state) => {
        return state.generator.clipIndex;
      },
    }),
  },
  methods: {
    changeValue(param, value) {
      this.$store.commit("generator/setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          pitch: { ...this.presets[this.clipIndex].pitch, [param]: +value },
        },
      });
    },
    onPitchChange({ target }) {
      const { value } = target;
      this.changeValue("value", value);
    },
    onPitchWetChange({ target }) {
      const { value } = target;
      this.changeValue("wet", value);
    },
  },
};
</script>