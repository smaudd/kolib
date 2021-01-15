<template>
  <div class="bg-web">
    <nuxt />
    <ErrorModal />
  </div>
</template>

<script>
import ErrorModal from "~/components/ErrorModal.vue";
export default {
  components: {
    ErrorModal,
  },
};
</script>