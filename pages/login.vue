<template>
  <div class="h-full" v-show="$route.path !== '/'">
    <Container
      :slides="containerSlides"
      :currentPage="currentPage"
      v-on:click="togglePage($event)"
    />
  </div>
</template>

<script>
import Login from "~/components/Login";
import Signup from "~/components/Signup";
import Container from "~/components/Container";
import ForgotPassword from "~/components/ForgotPassword";

export default {
  components: {
    Login,
    Signup,
    Container,
    ForgotPassword,
  },
  methods: {
    togglePage(next) {
      this.currentPage = next;
    },
  },
  data() {
    return {
      currentPage: "login",
      containerSlides: [
        {
          name: "login",
          component: Login,
          label: this.$t("LOGIN"),
        },
        {
          name: "signup",
          component: Signup,
          label: this.$t("SIGNUP"),
        },
        {
          name: "forgot-password",
          component: ForgotPassword,
          label: this.$t("FORGOT_PASSWORD"),
        },
      ],
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