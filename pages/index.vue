<template>
  <!-- <Generator /> -->
  <div></div>
</template>

<script>
import Generator from "~/components/Generator.vue";

export default {
  components: {
    Generator,
  },
  created() {
    if (process.client) {
      document.addEventListener("drop", this.dropAvoidDefault);
      document.addEventListener("dragover", this.dropAvoidDefault);
    }
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
  },
  // transition: "page",
};
</script>
