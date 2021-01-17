<template>
  <div
    class="flex flex-col items-center w-full p-1 border rounded-md border-quicksilver"
    style="margin-top: 7px"
  >
    <div
      class="flex self-stretch justify-between flex-grow mb-2 font-mono text-sm text-quicksilver"
    >
      <div
        class="flex justify-between"
        :class="{ 'w-1/2': $slots.default, 'w-full': !$slots.default }"
      >
        <span>{{ title }}</span
        ><span
          >{{ value }}<span v-if="unit">{{ unit }}</span></span
        >
      </div>
      <slot></slot>
    </div>
    <input
      class="mb-2"
      type="range"
      :step="step"
      :min="min"
      :max="max"
      :value="value"
      :id="unit"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    value: Number,
    min: Number,
    max: Number,
    step: Number,
    unit: String,
  },
};
</script>

<style>
input[type="range"] {
  appearance: none;
  width: 100%;
  background: transparent;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type="range"]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border-radius: 20%;
  width: 10px;
  height: 10px;
  background-color: #a5a5a5ff;
  margin-top: -5px;
}

input[type="range"]::-webkit-slider-thumb:active,
input[type="range"]::-webkit-slider-thumb:hover {
  background-color: #595959ff;
  transition: background-color 0.3s;
  border: 1px solid #a5a5a5ff;
}

input[type="range"]::-moz-range-thumb {
  -webkit-appearance: none;
  border-radius: 100%;
  width: 10px;
  height: 10px;
  background-color: #a5a5a5ff;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 1px;
  cursor: pointer;
  border-radius: 50px;
  background: #a5a5a5ff;
}
</style>