<template>
  <div class="flex items-center justify-center h-screen select-none">
    <div class="w-2/4 max-w-xs p-2 rounded-lg max-h-566px bg-davys text-davys">
      <Editor />
      <Grid />
      <!-- <Sequencer /> -->
    </div>
  </div>
</template>

<script>
import Grid from "~/components/Grid.vue";
import Editor from "~/components/Editor.vue";
import Sequencer from "~/components/Sequencer.vue";
import Waveform from "~/components/Waveform.vue";

export default {
  components: {
    Grid,
    Editor,
    Sequencer,
    Waveform,
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
};
</script>

