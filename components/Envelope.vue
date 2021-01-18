<template>
  <div v-if="clipIndex !== null && clipIndex !== undefined">
    <div class="">
      <div class="flex">
        ATTACK
        <input
          type="range"
          step="0.1"
          min="0"
          max="1"
          :value="presets[clipIndex].envelope.attack"
          @input="onAttackChange"
        />
        <div>{{ presets[clipIndex].envelope.attack }}</div>
      </div>
      <div class="flex">
        DECAY
        <input
          type="range"
          step="0.1"
          min="0"
          max="1"
          :value="presets[clipIndex].envelope.decay"
          @input="onDecayChange"
        />
        <div>{{ presets[clipIndex].envelope.decay }}</div>
      </div>
      <div class="flex">
        SUSTAIN
        <input
          type="range"
          step="0.1"
          min="0"
          max="1"
          :value="presets[clipIndex].envelope.sustain"
          @input="onSustainChange"
        />
        <div>{{ presets[clipIndex].envelope.sustain }}</div>
      </div>
      <div class="flex">
        RELEASE
        <input
          type="range"
          step="0.1"
          min="0"
          max="1"
          :value="presets[clipIndex].envelope.release"
          @input="onReleaseChange"
        />
        <div>{{ presets[clipIndex].envelope.release }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
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
    onAttackChange({ target }) {
      const { value } = target;
      this.$store.commit("generator/setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          envelope: {
            ...this.presets[this.clipIndex].envelope,
            attack: +value,
          },
        },
      });
    },
    onDecayChange({ target }) {
      const { value } = target;
      this.$store.commit("generator/setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          envelope: {
            ...this.presets[this.clipIndex].envelope,
            decay: +value,
          },
        },
      });
    },
    onSustainChange({ target }) {
      const { value } = target;
      this.$store.commit("generator/setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          envelope: {
            ...this.presets[this.clipIndex].envelope,
            sustain: +value,
          },
        },
      });
    },
    onReleaseChange({ target }) {
      const { value } = target;
      this.$store.commit("generator/setPreset", {
        index: this.clipIndex,
        preset: {
          ...this.presets[this.clipIndex],
          envelope: {
            ...this.presets[this.clipIndex].envelope,
            release: +value,
          },
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