<template>
  <div class="flex flex-col flex-grow">
    <div class="flex justify-end">
      <div class="ml-1" v-for="(value, key) in fx" :key="key">
        <Snack
          v-on:click="toggleFx(key)"
          :label="value.label"
          :selected="currentFx === key"
        />
      </div>
    </div>
    <component :is="fx[currentFx].component" />
  </div>
</template>

<script>
import PitchShift from "~/components/FX/PitchShift.vue";
import Reverb from "~/components/FX/Reverb.vue";
import Snack from "~/components/Snack.vue";

import { mapState } from "vuex";

export default {
  components: {
    PitchShift,
    Reverb,
    Snack,
  },
  computed: {
    ...mapState({
      clipIndex: (state) => {
        if (state.clipIndex !== null) {
          const name = state.clips[state.clipIndex].file.name;
          return {
            index: state.clipIndex,
          };
        }
        return null;
      },
      clips: (state) => {
        return state.clips;
      },
    }),
  },
  methods: {
    toggleFx(next) {
      this.currentFx = next;
    },
  },
  data() {
    return {
      currentFx: "reverb",
      fx: {
        reverb: {
          component: Reverb,
          label: this.$t("REVERB"),
        },
        // pitchShift: {
        //   component: PitchShift,
        //   label: this.$t("PITCH_SHIFT"),
        // },
      },
    };
  },
};
</script>

<style>
.arrow-button {
  width: 25px;
  height: 25px;
  position: relative;
}
.clip-label {
  /* position: absolute; */
  border-top-right-radius: 7px;
  border-top-left-radius: 7px;
  /* top: .1rem;
  left: 0.25rem; */
  padding: 0px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  border-top-left-radius: 0px;
}
</style>