<template>
  <div class="flex flex-col items-center" style="margin-top: 7px">
    <div class="mb-2 font-mono text-sm text-quicksilver">{{ title }}</div>
    <input
      type="range"
      :step="step"
      :min="min"
      :max="max"
      :value="value"
      @input="$emit('input', $event)"
    />
    <div class="mt-2 text-sm text-quicksilver">{{ value }}</div>
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
  margin-top: -4px;
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