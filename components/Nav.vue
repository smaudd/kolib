<template>
  <nav class="fixed inset-0 flex items-center px-4" style="height: 50px">
    <div
      class="flex items-center p-2 px-4 font-mono transition-colors duration-150 rounded-md cursor-pointer text-quicksilver hover:text-melon"
      :class="{ 'text-melon': $route.fullPath === '/' }"
    >
      <NuxtLink to="/">create</NuxtLink>
    </div>
    <div
      class="flex items-center p-2 px-4 font-mono transition-colors duration-150 rounded-md cursor-pointer text-quicksilver hover:text-melon"
      :class="{ 'text-melon': $route.fullPath === '/library' }"
    >
      <NuxtLink to="/library">library</NuxtLink>
    </div>
    <div class="flex-1" />
    <div
      class="flex items-center p-2 font-mono transition-colors duration-150 rounded-md cursor-pointer text-quicksilver hover:text-melon"
      :class="{ 'text-melon': $route.fullPath === '/login' }"
    >
      login
    </div>
  </nav>
</template>

<script>
import Snack from "~/components/Snack";
export default {
  components: {
    Snack,
  },
  created() {
    console.log(this.$route);
  },
};
</script>