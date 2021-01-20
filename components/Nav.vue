<template>
  <nav class="fixed inset-0 flex items-center px-4" style="height: 50px">
    <div
      class="flex items-center p-2 px-4 font-mono transition-colors duration-150 rounded-md cursor-pointer text-quicksilver hover:text-melon"
      :class="{ 'text-melon': $route.fullPath === '/' }"
    >
      <NuxtLink to="/">{{ $t("CREATE") }}</NuxtLink>
    </div>
    <div
      class="flex items-center p-2 px-4 font-mono transition-colors duration-150 rounded-md cursor-pointer text-quicksilver hover:text-melon"
      :class="{ 'text-melon': $route.fullPath === '/library' }"
    >
      <NuxtLink to="/library">{{ $t("LIBRARY") }}</NuxtLink>
    </div>
    <div class="flex-1" />
    <div
      class="flex items-center p-2 font-mono transition-colors duration-150 rounded-md cursor-pointer text-quicksilver hover:text-melon"
      :class="{ 'text-melon': $route.fullPath === '/login' }"
    >
      <NuxtLink to="/login" v-if="!user">{{ $t("LOGIN") }}</NuxtLink>
      <NuxtLink to="/profile" v-else>{{ user.displayName }}</NuxtLink>
    </div>
  </nav>
</template>

<script>
import Snack from "~/components/Snack";
export default {
  components: {
    Snack,
  },
  computed: {
    user() {
      console.log(this.$store.user, 'EL PUTO AMO')
      return this.$fire.auth.currentUser;
    },
  },
  created() {
    console.log(
      this.$fire.auth.currentUser,
      this.$fire.auth.currentUser === null
    );
  },
};
</script>