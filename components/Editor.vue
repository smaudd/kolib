<template>
  <div
    class="relative flex flex-col h-full p-1 overflow-hidden font-mono font-black rounded-lg b-2 bg-quicksilver"
  >
    <div class="flex">
      <div
        @click="togglePage('clip')"
        class="w-1/4 text-md cursor-pointer clip-label"
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
        class="w-1/4 text-md cursor-pointer clip-label"
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
        class="w-1/4 text-md cursor-pointer clip-label"
        :class="{
          'bg-davys text-quicksilver': currentPage === 'master',
          'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
            currentPage !== 'master',
        }"
      >
        {{ "master" }}
      </div>
      <div class="flex justify-end flex-1 mr-1 text-md text-right">
        {{ totalDuration }}s
      </div>
    </div>
    <div class="flex justify-between flex-grow mb-1 rounded-lg bg-davys box">
      <FX v-if="clipIndex" v-show="currentPage === 'fx'" />
      <Clip v-show="currentPage === 'clip'" />
      <Master v-show="currentPage === 'master'" />
    </div>
    <Grid v-show="currentPage !== 'master'" />
  </div>
</template>

<script>
import PitchShift from "~/components/FX/PitchShift.vue";
import Reverb from "~/components/FX/Reverb.vue";
import Clip from "~/components/Clip.vue";
import Master from "~/components/Master.vue";
import Grid from "~/components/Grid.vue";
import FX from "~/components/FX/FX.vue";
import { mapState } from "vuex";

export default {
  components: {
    PitchShift,
    Reverb,
    Clip,
    FX,
    Master,
    Grid,
  },
  computed: {
    ...mapState({
      clipIndex: (state) => {
        if (state.generator.clipIndex !== null) {
          const currentClip = state.generator.clips[state.generator.clipIndex];
          const name = currentClip ? currentClip.file.name : "";
          return {
            name: name.substring(0, 50).toLowerCase() + "...",
            index: state.generator.clipIndex,
            label: `clip ${state.generator.clipIndex + 1}`,
          };
        }
        return null;
      },
      clips: (state) => {
        return state.generator.clips;
      },
    }),
    error() {
      this.togglePage("clip");
      return this.$store.state.generator.errors.message;
    },
    // totalDuration() {
    //   console.log(this.$store.state.generator.duration);
    //   return this.$store.state.generator.durations
    //     .reduce((acc, current) => (acc += +current.duration), 0)
    //     .toFixed(1);
    // },
  },
  watch: {
    "$store.state.generator.durations": function() {
      this.totalDuration = this.$store.state.generator.durations
        .reduce((acc, current) => (acc += +current), 0)
        .toFixed(1);
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
      totalDuration: 0,
    };
  },
};
</script>

<style>
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
