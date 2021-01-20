<template>
  <div class="relative flex items-center justify-center px-4 mt-header">
    <div class="flex items-stretch p-2 rounded-md bg-davys">
      <div class="flex flex-col flex-1 h-full p-1 rounded-md bg-quicksilver">
        <div class="flex">
          <div
            @click="togglePage('login')"
            class="w-1/4 font-mono text-xs cursor-pointer select-none label text-davys"
            :class="{
              'bg-davys text-quicksilver': currentPage === 'login',
              'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
                currentPage !== 'login',
            }"
          >
            {{ $t("LOGIN") }}
          </div>
          <div
            @click="togglePage('signup')"
            class="w-1/4 font-mono text-xs cursor-pointer select-none label text-davys"
            :class="{
              'bg-davys text-quicksilver': currentPage === 'signup',
              'bg-quicksilver border-t border-l border-r border-davys hover:bg-davys hover:text-quicksilver transition-colors duration-150':
                currentPage !== 'signup',
            }"
          >
            {{ $t("SIGNUP") }}
          </div>
        </div>
        <div class="flex">
          <Login v-if="currentPage === 'login'" />
          <Signup v-if="currentPage === 'signup'" />
        </div>
      </div>
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
  methods: {
    togglePage(next) {
      console.log(next);
      this.currentPage = next;
    },
  },
  data() {
    return {
      currentPage: "login",
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