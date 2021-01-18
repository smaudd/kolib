<template>
  <transition name="fade"> </transition>
</template>

<script>
import Button from "./Button.vue";
export default {
  components: {
    Button,
  },
  computed: {
    // error() {
    //   return this.$store.state.errors.message;
    // },
  },
  methods: {
    flushError() {
      this.$store.commit("errors/clear");
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.overlay {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>