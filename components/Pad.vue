<template>
  <div
    class="flex items-center justify-center p-4 border rounded-lg bg-primary text-secondary"
    :class="{ 'bg-black': over }"
    v-on:dragover="onDragover"
  >
    {{ index + 1 }}
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
  },
  methods: {
    onDragover(e) {
      e.preventDefault()
      e.stopPropagation()
      console.log('pinga')
      this.over = true
    },
  },
  data() {
    return {
      over: false,
    };
  },
};
</script>
