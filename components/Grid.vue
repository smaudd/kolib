<template>
  <div>
    <div class="grid grid-cols-4 grid-rows-4 gap-1 rounded-md bg-davys">
      <Pad
        v-for="(pad, index) in pads"
        :key="pad"
        :index="pad"
        v-on:drop="onPadDrop"
        :clip="{ file: clips[index] ? clips[index].file : null }"
        :preset="presets[index]"
      />
      <!-- <div
        @click="toggleAutoTrim()"
        :class="{ 'bg-black': $store.state.autoTrimAll }"
      >
        AUTO TRIM
      </div> -->
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
        return state.clips;
      },
      presets: (state) => {
        return state.presets;
      },
      players: (state) => {
        return state.players;
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
      this.$store.commit("setAutoTrim", !this.$store.state.autoTrimAll);
    },
    onPadDrop({ event, index }) {
      //   if (event.dataTransfer.files.length > 1) {
      //     this.$store.commit("errors/set", this.$t("ONE_FILE_ALLOWED"));
      //     return;
      //   }
      //   const file = event.dataTransfer.files[0];
      //   if (file) {
      //     if (!this.allowedTypes.includes(file.type)) {
      //       this.$store.commit("errors/set", this.$t("ONLY_AUDIO_ALLOWED"));
      //       return;
      //     }
      //     this.$store.commit("setClip", { index, file });
      //   }
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

