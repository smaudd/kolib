<template>
  <div class="flex items-center justify-center h-screen">
    <div
      class="relative flex flex-col items-baseline rounded-md min-w-375px max-w-375px bg-davys"
      style="height: 500px; max-height: 500px"
    >
      <Nav />
      <Generator v-show="showGenerator" />
      <!-- <VerifyEmail /> -->
      <nuxt />
    </div>
  </div>
</template>

<script>
import Nav from "~/components/Nav.vue";
import VerifyEmail from "~/components/VerifyEmail.vue";
import Generator from "~/components/Generator.vue";

export default {
  components: {
    Nav,
    VerifyEmail,
    Generator,
  },
  created() {
    console.log(this.$route);
  },
  watch: {
    $route() {
      if (this.$route.path === "/") {
        setTimeout(() => {
          this.showGenerator = true;
        }, 100);
        return;
      }
      this.showGenerator = false;
    },
  },
  middleware: "authenticated",
  data() {
    return {
      showGenerator: this.$route.path === "/",
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
