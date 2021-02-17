<template>
  <div class="flex items-center justify-center h-screen flex-col">
    <div
      class="relative flex flex-col items-baseline rounded-md min-w-375px max-w-375px bg-davys"
      style="height: 500px; max-height: 500px"
    >
      <Generator />
      <nuxt />
    </div>
    <div class="text-quicksilver text-mono mt-4">
      this tool was made with ❤️ by
      <a
        id="ig"
        href="https://instagram.com/sayesito"
        class="hover:text-melon text-melon transition-transform duration-500"
        target="_blank"
        >sayesito</a
      >
    </div>
  </div>
</template>

<script>
import Generator from "~/components/Generator.vue";

export default {
  components: {
    Generator,
  },
  head() {
    return {
      title: "kolib - create your po33 kits with ease",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "kolib",
          content: "generate pocket operator sample kits with this tool with ease.",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    };
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
