<template>
  <div
    class="relative h-64 p-1 mb-2 overflow-hidden font-mono font-black rounded-lg bg-quicksilver"
  >
    <div class="flex">
      <div
        @click="pageToggle('clip')"
        class="w-1/5 text-xs cursor-pointer clip-label"
        :class="{
          'bg-davys text-quicksilver': page === 'clip',
          'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
            page === 'fx',
        }"
      >
        {{ clipIndex ? "clip" : "zzz" }}
      </div>
      <div
        @click="pageToggle('fx')"
        class="w-1/5 text-xs cursor-pointer clip-label"
        :class="{
          'pointer-events-none': clipIndex === null,
          'bg-davys text-quicksilver': page === 'fx',
          'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
            page === 'clip',
        }"
      >
        {{ clipIndex && "fx" }}
      </div>
    </div>
    <div class="flex items-center justify-between p-1 rounded-lg bg-davys box">
      <p class="text-sm text-web" v-if="page !== 'fx'">
        {{ clipIndex || $t("LOAD_SAMPLE") }}
      </p>
      <div v-if="clipIndex !== null && page === 'fx'" class="w-full">
        <div class="flex justify-end">
          <div
            @click="fxToggle(key)"
            v-for="(value, key) in fx"
            :key="key"
            class="px-1 mr-1 text-xs transition-colors duration-150 rounded-md cursor-pointer bg-quicksilver hover:bg-granny hover:border border-quicksilver"
            :class="{ 'bg-granny text-davys': currentFx === key }"
          >
            {{ value.label }}
          </div>
        </div>
        <!-- Deberias hacer esto mismo con el if else que tienes de clip/fx. -->
        <component :is="fx[currentFx].component" />
      </div>
    </div>
  </div>
</template>

<script>
import PitchShift from "~/components/FX/PitchShift.vue";
import Reverb from "~/components/FX/Reverb.vue";

import { mapState } from "vuex";

export default {
  components: {
    PitchShift,
    Reverb,
  },
  computed: {
    ...mapState({
      clipIndex: (state) => {
        if (state.clipIndex !== null) {
          const name = state.clips[state.clipIndex].file.name;
          return name.substring(0, 50).toLowerCase() + "...";
        }
        return null;
      },
      clips: (state) => {
        return state.clips;
      },
    }),
  },
  methods: {
    pageToggle(next) {
      this.page = next;
    },
    fxToggle(next) {
      this.currentFx = next;
    },
  },
  data() {
    return {
      page: "clip",
      fx: {
        pitchShift: {
          component: PitchShift,
          label: this.$t("PITCH_SHIFT"),
        },
        reverb: {
          component: Reverb,
          label: this.$t("REVERB"),
        },
      },
      currentFx: "reverb",
      // pitchTickmarks: this.getPitchTickmarks(),
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
.arrow-right {
  clip-path: polygon(100% 50%, 0 0, 0 100%);
  width: 20px;
  height: 20px;
}

.arrow-left {
  clip-path: polygon(100% 0, 0 50%, 100% 100%);
  width: 20px;
  height: 20px;
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