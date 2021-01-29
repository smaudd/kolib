<template>
  <div>
    <div class="grid h-full grid-cols-4 grid-rows-4 gap-1 p-1 rounded-md bg-davys">
      <Pad
        v-for="(pad, index) in pads"
        :key="pad"
        :index="pad"
        :clip="{ file: clips[index] ? clips[index].file : null }"
        :preset="presets[index]"
      />
    </div>
  </div>
</template>

<script>
import Pad from "~/components/Pad.vue";
import { mapState } from "vuex";
export default {
  components: {
    Pad,
  },
  computed: {
    ...mapState({
      clips: (state) => {
        return state.generator.clips;
      },
      presets: (state) => {
        return state.generator.presets;
      },
      players: (state) => {
        return state.generator.players;
      },
    }),
  },
  created() {},
  methods: {
    getPadStructure() {
      const pads = [];
      for (let i = 0; i < 16; i++) {
        pads.push(i);
      }
      return pads;
    },
    toggleAutoTrim() {
      this.$store.commit(
        "generator/setAutoTrim",
        !this.$store.state.generator.autoTrimAll
      );
    },
  },
  data() {
    return {
      pads: this.getPadStructure(),
      allowedTypes: ["audio/wav", "audio/mp3"],
      loads: [],
    };
  },
};
</script>

