<template>
  <nav class="flex items-center w-full p-2 pb-0">
    <div
      class="flex items-center p-1 mr-2 font-mono transition-colors duration-150 border rounded-md cursor-pointer text-quicksilver hover:text-melon hover:bg-davys border-quicksilver"
      :class="{ 'text-melon': $route.fullPath === '/' }"
    >
      <NuxtLink to="/">{{ $t("CREATE") }}</NuxtLink>
    </div>
    <div
      class="flex items-center p-1 font-mono transition-colors duration-150 border rounded-md cursor-pointer text-quicksilver hover:text-melon hover:bg-davys border-quicksilver"
      :class="{ 'text-melon': $route.fullPath === '/library' }"
    >
      <NuxtLink to="/library">{{ $t("LIBRARY") }}</NuxtLink>
    </div>
    <div class="flex-1" />
    <div
      class="flex items-center p-1 font-mono transition-colors duration-150 border rounded-md cursor-pointer text-quicksilver hover:text-melon hover:bg-davys border-quicksilver"
      :class="{
        'text-melon': ['/login', '/profile'].includes($route.fullPath),
      }"
    >
      <!-- <NuxtLink to="/profile" v-if="$store.state.user">{{
        displayName
      }}</NuxtLink>
      <NuxtLink to="/login" v-else>{{ $t("LOGIN") }}</NuxtLink> -->
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
    displayName() {
      if (this.$store.state.user.displayName) {
        const displayName = this.$store.state.user.displayName;
        if (displayName.length > 8) {
          return displayName.substring(0, 8).trim() + "..";
        }
        return displayName;
      }
    },
  },
  created() {
    if (
      this.$store.state.user &&
      this.redirectRoutes.includes(this.$router.currentRoute.path)
    ) {
      this.$router.push("/profile");
    }
  },
  data() {
    return {
      redirectRoutes: ["/login", "singup"],
    };
  },
};
</script>