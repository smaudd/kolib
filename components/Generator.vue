<template>
  <div
    class="w-full h-full p-2 rounded-lg max-w-375px bg-davys text-davys"
    :class="{
      'animation-blink pointer-events-none': $store.state.generator.loading,
    }"
  >
    <Editor />
  </div>
</template>

<script>
import Editor from "~/components/Editor.vue";

export default {
  components: {
    Editor,
  },
};
</script>

