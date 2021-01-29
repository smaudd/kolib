<template>
  <div class="relative flex items-center justify-center h-full">
    <Container
      :slides="containerSlides"
      :currentPage="currentPage"
      v-on:click="togglePage($event)"
    />
  </div>
</template>

<script>
import Container from "~/components/Container";
import Profile from "~/components/Profile";
import Logout from "~/components/Logout";

export default {
  components: {
    Container,
    Profile,
    Logout,
  },
  methods: {
    togglePage(next) {
      this.currentPage = next;
    },
  },
  data() {
    return {
      containerSlides: [
        {
          name: "profile",
          component: Profile,
          label: this.$t("PROFILE"),
        },
        {
          name: "logout",
          component: Logout,
          label: this.$t("LOGOUT"),
        },
      ],
      currentPage: "logout",
    };
  },
};
</script>