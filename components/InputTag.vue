<template>
  <div
    class="max-w-full border rounded-md border-quicksilver text-quicksilver bg-davys"
    id="input-tag"
  >
    <span v-if="label" class="pl-1 font-mono text-md text-quicksilver">{{
      label
    }}</span>
    <div class="flex flex-wrap items-center p-1">
      <div
        v-for="(item, index) of items"
        :key="item"
        class="flex p-1 mb-1 mr-1 text-md rounded-md bg-melon text-davys"
      >
        <span>{{ item }}</span>
        <span class="mx-1 cursor-pointer" @click="removeItem(index)">x</span>
      </div>
      <input
        :type="type"
        :placeholder="placeholder"
        @keydown.enter="addItem"
        @keydown.188="addItem"
        @keydown.delete="removeLast"
        @focus="$emit('focus', $event)"
        @input="$emit('input', $event)"
        class="w-full p-1 font-mono text-md font-bold rounded-md outline-none appearance-none text-melon bg-davys"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: String,
    placeholder: String,
    label: String,
    items: Array,
  },
  methods: {
    addItem(e) {
      e.preventDefault();
      const value = e.target.value.trim();
      if (
        value.length > 0 &&
        value.length <= 10 &&
        !this.items.includes(value)
      ) {
        this.$emit("change", [...this.items, value]);
        e.target.value = "";
      }
    },
    removeItem(index) {
      console.log(index);
      const values = this.items;
      values.splice(index, 1);
      this.$emit("change", values);
    },
    removeLast(e) {
      if (e.target.value === "") {
        this.removeItem(this.items.length - 1);
      }
    },
  },
};
</script>

<style scoped>
#input-tag {
  max-height: 120px;
  overflow: scroll;
}
#input-tag::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
