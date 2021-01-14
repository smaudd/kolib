<template>
  <a
    class="flex justify-center w-full p-2 rounded-lg outline-none cursor-pointer select-none text-secondary bg-primary active:bg-green-700"
    @click="$emit('click')"
  >
    {{ label }}
  </a>
</template>

<script>
export default {
  props: {
    label: String,
  },
};
</script>