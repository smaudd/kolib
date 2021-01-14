<template>
  <div class="flex items-center justify-center h-full select-none">
    <div>
      <Grid />
      <!-- <Editor /> -->
      <Sequencer />
    </div>
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

