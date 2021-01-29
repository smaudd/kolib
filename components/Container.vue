<template>
  <div
    class="flex h-full p-2 rounded-md bg-davys min-w-375px max-w-375px"
  >
    <div class="flex flex-col flex-1 h-full p-1 rounded-md bg-quicksilver">
      <div class="flex">
        <div
          v-for="slide of slides"
          :key="slide.name"
          @click="$emit('click', slide.name)"
          class="w-1/4 font-mono text-xs cursor-pointer select-none label text-davys"
          :class="{
            'bg-davys text-quicksilver': currentPage === slide.name,
            'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
              currentPage !== slide.name,
          }"
        >
          {{ slide.label }}
        </div>
      </div>
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script>
import Login from "~/components/Login";
import Signup from "~/components/Signup";

export default {
  components: {
    Login,
    Signup,
  },
  props: {
    slides: Array,
    currentPage: String,
  },
  watch: {
    currentPage() {
      this.currentComponent = this.slides.find(
        (slide) => slide.name === this.currentPage
      ).component;
    },
  },
  data() {
    return {
      currentComponent: this.slides.find(
        (slide) => slide.name === this.currentPage
      ).component,
    };
  },
};
</script>

<style>
.label {
  /* position: absolute; */
  border-top-right-radius: 7px;
  border-top-left-radius: 7px;
  /* top: .1rem;
  left: 0.25rem; */
  padding: 0px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>