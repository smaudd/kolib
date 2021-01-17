<template>
  <div
    @click="$emit('click', $event)"
    class="flex items-center justify-center px-1 text-xs duration-150 rounded-md cursor-pointer transition-background bg-quicksilver hover:bg-granny hover:border border-quicksilver text-davys"
    :class="{ 'bg-granny text-davys': selected, 'bg-melon': secondary }"
  >
    {{ label }}
  </div>
</template>

<script>
export default {
  props: {
    selected: Boolean,
    label: String,
    secondary: Boolean,
  },
};
</script>