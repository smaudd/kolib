<template>
  <div
    class="relative flex flex-col h-64 p-1 mb-2 overflow-hidden font-mono font-black rounded-lg bg-quicksilver"
  >
    <div class="flex">
      <div
        @click="togglePage('clip')"
        class="w-1/4 text-xs cursor-pointer clip-label"
        :class="{
          'bg-davys text-quicksilver': currentPage === 'clip',
          'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
            currentPage !== 'clip',
        }"
      >
        {{ clipIndex ? clipIndex.label : "zzz" }}
      </div>
      <div
        @click="togglePage('fx')"
        class="w-1/4 text-xs cursor-pointer clip-label"
        :class="{
          'pointer-events-none': clipIndex === null,
          'bg-davys text-quicksilver': currentPage === 'fx',
          'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
            currentPage !== 'fx',
        }"
      >
        {{ "fx" }}
      </div>
      <div
        @click="togglePage('master')"
        class="w-1/4 text-xs cursor-pointer clip-label"
        :class="{
          'bg-davys text-quicksilver': currentPage === 'master',
          'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
            currentPage !== 'master',
        }"
      >
        {{ "master" }}
      </div>
      <div class="flex justify-end flex-1 mr-1 text-sm text-right">
        {{ totalDuration }}s
      </div>
    </div>
    <div class="flex justify-between flex-grow p-1 rounded-lg bg-davys box">
      <FX v-if="clipIndex" v-show="currentPage === 'fx'" />
      <Clip v-show="currentPage === 'clip'" />
      <Master v-show="currentPage === 'master'" />
    </div>
  </div>
</template>

<script>
import PitchShift from "~/components/FX/PitchShift.vue";
import Reverb from "~/components/FX/Reverb.vue";
import Clip from "~/components/Clip.vue";
import Master from "~/components/Master.vue";
import FX from "~/components/FX/FX.vue";
import { mapState } from "vuex";

export default {
  components: {
    PitchShift,
    Reverb,
    Clip,
    FX,
    Master,
  },
  computed: {
    ...mapState({
      clipIndex: (state) => {
        if (state.clipIndex !== null) {
          const name = state.clips[state.clipIndex].file.name;
          return {
            name: name.substring(0, 50).toLowerCase() + "...",
            index: state.clipIndex,
            label: `clip ${state.clipIndex + 1}`,
          };
        }
        return null;
      },
      clips: (state) => {
        return state.clips;
      },
    }),
    error() {
      this.togglePage("clip");
      return this.$store.state.errors.message;
    },
    totalDuration() {
      return this.$store.state.durations
        .reduce((acc, current) => (acc += +current.duration), 0)
        .toFixed(1);
    },
  },
  watch: {
    "$store.state.loading": function () {
      this.togglePage("clip");
    },
  },
  methods: {
    togglePage(next) {
      this.currentPage = next;
    },
  },
  data() {
    return {
      currentPage: "clip",
      page: {
        clip: Clip,
        fx: FX,
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