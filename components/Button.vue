<template>
  <a
    class="flex justify-center w-full p-2 font-mono transition-colors duration-150 border rounded-lg outline-none cursor-pointer select-none border-quicksilver text-quicksilver hover:bg-melon hover:text-davys"
    @click="$emit('click')"
    :type="type || 'button'"
    :disabled="loading"
    :class="{ 'animation-blink bg-granny': loading }"
  >
    {{ label }}
  </a>
</template>

<script>
export default {
  props: {
    label: String,
    type: String,
    loading: Boolean,
  },
};
</script>