<template>
  <div v-if="clipIndex !== null && clipIndex !== undefined">
    <Envelope />
    <div class="">
      PITCH
      <div class="flex">
        <input
          type="range"
          step="1"
          min="-24"
          max="24"
          :value="presets[clipIndex].pitch.value"
          @input="onPitchChange"
        />
        <div>{{ presets[clipIndex].pitch.value }}</div>
      </div>
      <div>
        <input
          type="range"
          step="0.1"
          min="0"
          max="1"
          :value="presets[clipIndex].pitch.wet"
          @input="onPitchWetChange"
        />
        <div>{{ presets[clipIndex].pitch.wet }}</div>
      </div>
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
  </div>
</template>

<script>
import Envelope from "~/components/Envelope.vue";
import { mapState } from "vuex";

export default {
  components: {
    Envelope,
  },

  props: {
    pitch: Number,
  },
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
    onPitchChange({ target }) {
      const { value } = target;
      this.$store.commit("setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          pitch: { ...this.presets[this.clipIndex].pitch, value: +value },
        },
      });
    },
    onPitchWetChange({ target }) {
      const { value } = target;
      this.$store.commit("setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          pitch: { ...this.presets[this.clipIndex].pitch, wet: +value },
        },
      });
    },
    onReverbDecayChange({ target }) {
      const { value } = target;
      this.$store.commit("setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          reverb: { ...this.presets[this.clipIndex].reverb, decay: +value },
        },
      });
    },
    onReverbWetChange({ target }) {
      const { value } = target;
      this.$store.commit("setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          reverb: { ...this.presets[this.clipIndex].reverb, wet: +value },
        },
      });
    },
  },
  data() {
    return {
      // pitchTickmarks: this.getPitchTickmarks(),
    };
  },
};
</script>