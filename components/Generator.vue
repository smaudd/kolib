<template>
  <div
    class="w-full p-2 rounded-lg max-h-566px max-w-375px bg-davys text-davys"
  >
    <Editor />
    <Grid />
  </div>
</template>

<script>
import Grid from "~/components/Grid.vue";
import Editor from "~/components/Editor.vue";
import Sequencer from "~/components/Sequencer.vue";

export default {
  components: {
    Grid,
    Editor,
    Sequencer,
  },
};
</script>

