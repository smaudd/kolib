<template>
  <div>
    <div class="grid grid-cols-4 grid-rows-4 gap-1">
      <Pad v-for="pad in pads" :key="pad" :index="pad" />
    </div>
  </div>
</template>

<script>
import Pad from "~/components/Pad.vue";

export default {
  components: {
    Pad,
  },
  methods: {
    getPads() {
      const pads = [];
      for (let i = 0; i < 16; i++) {
        pads.push(i);
      }
      return pads;
    },
  },
  data() {
    return {
      pads: this.getPads(),
    };
  },
};
</script>

