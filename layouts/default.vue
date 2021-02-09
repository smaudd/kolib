<template>
  <div class="flex items-center justify-center h-screen">
    <div
      class="relative flex flex-col items-baseline rounded-md min-w-375px max-w-375px bg-davys"
      style="height: 500px; max-height: 500px"
    >
      <Generator />
      <nuxt />
    </div>
  </div>
</template>

<script>
import Generator from "~/components/Generator.vue";

export default {
  components: {
    Generator,
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
