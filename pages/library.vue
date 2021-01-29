<template>
  <div class="flex flex-col items-center justify-center w-full select-none">
    <div
      v-for="content of list.contents"
      :key="content.key"
      class="flex flex-col"
    >
      {{ content.key }}
      <WaveformLib :src="content.src" />
    </div>
  </div>
</template>

<script>
import Generator from "~/components/Generator.vue";
import WaveformLib from "~/components/WaveformLib.vue";
import xmlToJson from "~/lib/xmlToJson";

export default {
  components: {
    Generator,
    WaveformLib,
  },
  created() {
    if (process.client) {
      document.addEventListener("drop", this.dropAvoidDefault);
      document.addEventListener("dragover", this.dropAvoidDefault);
      fetch("https://kolib.sfo3.digitaloceanspaces.com")
        .then((res) => {
          return res.text();
        })
        .then((a) => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(a, "application/xml");
          this.list = xmlToJson(doc);
        });
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
  transition: "page",
  data() {
    return {
      list: "",
    };
  },
};
</script>


