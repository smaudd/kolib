<template>
  <div
    class="w-full h-full p-2 overflow-y-scroll"
    :class="{ 'animation-blink': !kits }"
    v-show="$route.path !== '/'"
  >
    <div
      class="flex flex-col w-full h-full p-1 rounded-md select-none library bg-quicksilver"
    >
      <div class="overflow-y-scroll">
        <div
          v-for="kit of kits"
          :key="kit.name"
          :class="{
            'animation-blink pointer-events-none':
              loading === `${kit.name}-load`,
          }"
          class="flex flex-col p-1 mb-1 font-mono border rounded-md cursor-pointer border-quicksilver text-quicksilver bg-davys"
          @click="playKit(kit)"
        >
          <div class="flex">
            <span>{{ kit.name }} </span>/
            <span class="text-melon"> {{ kit.ownerUsername }}</span>
          </div>
          <img :src="kit.image" />
          <div
            class="w-full h-1 rounded-sm bg-granny"
            style="background-color: rgba(136, 209, 138, 0.2)"
          >
            <div
              v-if="playing === `${kit.name}-loading`"
              class="h-1 rounded-sm bg-granny"
              :style="{ width: `${progressWidth}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <audio
      style="display: none"
      ref="player"
      @loadeddata="onPlayerLoad"
      @timeupdate="onPlayerUpdate"
      @ended="onPlayerEnd"
    ></audio>
  </div>
</template>

<script>
import Generator from "~/components/Generator.vue";
import WaveformLib from "~/components/WaveformLib.vue";
import { getKits } from "~/lib/firebaseQueries";

export default {
  components: {
    Generator,
    WaveformLib,
  },
  async mounted() {
    this.getKits = getKits;
    this.kits = await this.getKits({});
    console.log(this.$route.path);
  },
  destroyed() {
    if (process.client) {
      document.removeEventListener("drop", this.dropAvoidDefault);
      document.removeEventListener("dragover", this.dropAvoidDefault);
    }
  },
  methods: {
    dropAvoidDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    playKit(kit) {
      this.loading = `${kit.name}-load`;
      this.playing = `${kit.name}-loading`;
      const player = this.$refs.player;
      player.src = encodeURI(
        `https://kolib.sfo3.digitaloceanspaces.com/mp3s/${kit.path}.mp3`
      );
    },
    onPlayerUpdate() {
      const { currentTime, duration } = this.$refs.player;
      const progress = (currentTime * 100) / duration;
      this.progressWidth = progress;
    },
    onPlayerLoad() {
      this.loading = false;
      this.$refs.player.play();
    },
    onPlayerEnd() {
      this.progressWidth = 0;
      this.playing = false;
    },
  },
  // transition: "page",
  data() {
    return {
      list: "",
      kits: null,
      loading: false,
      progressWidth: 0,
      playing: false,
    };
  },
};
</script>

<style>
div::-webkit-scrollbar {
  width: 0;
}
</style>


