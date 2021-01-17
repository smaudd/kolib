<template>
  <div class="flex flex-col flex-grow overflow-hidden">
    <template v-if="!clipIndex">
      <p class="flex-grow text-sm text-quicksilver">
        {{ $t("LOAD_SAMPLE") }}
      </p>
    </template>
    <template v-else>
      <p class="text-sm whitespace-no-wrap text-quicksilver">
        {{ clipIndex.name }}
      </p>
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
              :label="$t('UNDO')"
              v-on:click="onUndo"
              v-if="clipIndex.trimmed"
            />
            <div class="w-1" />
            <Snack :label="$t('TRIM')" :secondary="true" v-on:click="onTrim" />
          </div>
        </Slider>
      </div>
      <Waveform v-on:load="setSeconds($event)" />
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Waveform from "~/components/Waveform.vue";
import Snack from "~/components/Snack.vue";
import Slider from "~/components/Slider.vue";

export default {
  components: {
    Waveform,
    Snack,
    Slider,
  },
  computed: {
    ...mapState({
      clipIndex: (state) => {
        if (state.clipIndex !== null) {
          const name = state.clips[state.clipIndex].file.name;
          return {
            name: name.substring(0, 50).toLowerCase() + "...",
            index: state.clipIndex,
            trimmed: state.clips[state.clipIndex].trimmed,
          };
        }
        return null;
      },
      clips: (state) => {
        return state.clips;
      },
    }),
    error() {
      return this.$store.state.errors.message;
    },
  },
  methods: {
    onTrim() {
      this.$store.commit("triggerTrim", {
        index: this.clipIndex.index,
        threshold: this.trimThreshold,
      });
    },
    onUndo() {
      this.$store.commit("triggerUndo", {
        index: this.clipIndex.index,
        signature: new Date().getTime(),
      });
    },
    setSeconds(seconds) {
      this.duration = seconds;
      this.$store.commit("setDuration", {
        duration: seconds,
        index: this.clipIndex.index,
      });
    },
  },
  data() {
    return {
      duration: "",
      trimThreshold: -10,
    };
  },
};
</script>
