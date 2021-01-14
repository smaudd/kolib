<template>
  <transition name="fade">
    <div
      v-if="error"
      class="fixed inset-0 flex items-center justify-center overlay"
    >
      <div class="w-1/3 p-4 bg-white rounded-lg">
        <div class="mb-4 text-center">
          {{ error }}
        </div>
        <Button :label="$t('OK')" v-on:click="flushError" />
      </div>
    </div>
  </transition>
</template>

<script>
import Button from "./Button.vue";
export default {
  components: {
    Button,
  },
  computed: {
    error() {
      return this.$store.state.errors.message;
    },
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