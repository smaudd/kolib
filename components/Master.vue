<template>
  <div class="flex-grow">
    <div class="flex-grow mt-1">
      <Input
        :label="$t('KIT_NAME')"
        :value="name"
        :placeholder="$t('KIT_NAME')"
        v-on:focus="name = ''"
      />
    </div>
    <Slider
      type="range"
      :step="0.1"
      :min="0"
      :max="1"
      :title="$t('SAMPLE_SPACE')"
      unit="s"
      :value="sampleSpace"
      v-on:input="onSampleSpaceChange"
    />
    <div class="mb-1">
      <Slider
        :min="-100"
        :max="-15"
        :step="1"
        :value="trimThreshold"
        :title="$t('THRESHOLD')"
        unit="dB"
        v-on:input="trimThreshold = +$event.target.value"
      >
        <div class="flex justify-evenly">
          <Snack
            :label="$t('AUTO_TRIM')"
            :secondary="autoTrim"
            v-on:click="toggleAutoTrim"
          />
        </div>
      </Slider>
    </div>
    <div class="flex-grow mt-1">
      <Sequencer :space="sampleSpace" :name="name" />
    </div>
  </div>
</template>

<script>
import Slider from "~/components/Slider";
import Sequencer from "~/components/Sequencer";
import Snack from "~/components/Snack";
import Input from "~/components/Input";
import generateName from "~/lib/generateName";

export default {
  components: {
    Slider,
    Sequencer,
    Input,
    Snack,
  },
  methods: {
    onSampleSpaceChange({ target }) {
      this.sampleSpace = +target.value;
    },
    onAutoTrimThresholdChange({ target }) {
      this.trimThreshold = +target.value;
      this.setAutoTrim();
    },
    toggleAutoTrim() {
      this.autoTrim = !this.autoTrim;
      this.setAutoTrim();
    },
    setAutoTrim() {
      this.$store.commit("generator/setAutoTrim", {
        threshold: this.trimThreshold,
        active: this.autoTrim,
      });
    },
  },
  data() {
    return {
      sampleSpace: 0.2,
      name: generateName(),
      trimThreshold: -20,
      autoTrim: false,
    };
  },
};
</script>