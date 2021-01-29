<template>
  <div class="flex items-center justify-center h-screen">
    <div
      class="relative flex flex-col items-baseline rounded-md min-w-375px max-w-375px bg-davys"
      style="height: 500px; max-height: 500px"
    >
      <!-- <Nav /> -->
      <VerifyEmail />
      <nuxt />
    </div>
  </div>
</template>

<script>
import Nav from "~/components/Nav.vue";
import VerifyEmail from "~/components/VerifyEmail.vue";

export default {
  components: {
    Nav,
    VerifyEmail,
  },
  // async created() {
  //   if (process.client) {
  //     const usersCollection = this.$fire.firestore.collection("usernames");
  //     const data = {
  //       name: "mnyname",
  //     };
  //     await usersCollection.add(data);
  //   }
  // },
  middleware: "authenticated",
};
</script>
