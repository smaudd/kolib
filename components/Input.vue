<template>
  <div class="border rounded-md border-quicksilver text-quicksilver bg-davys">
    <span v-if="label" class="pl-1 font-mono text-xs text-quicksilver">{{
      label
    }}</span>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @focus="$emit('focus', $event)"
      @input="$emit('input', $event)"
      class="w-full p-1 font-mono text-sm font-bold rounded-md outline-none appearance-none text-melon bg-davys"
    />
  </div>
</template>
<script>
export default {
  props: {
    type: String,
    placeholder: String,
    value: String,
    label: String,
  },
};
</script>