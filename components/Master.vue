<template>
  <div class="flex-grow p-1">
    <div v-if="!shareConfirmation">
      <div class="flex-grow mt-1">
        <Input
          :label="$t('KIT_NAME')"
          :value="name"
          :placeholder="$t('KIT_NAME')"
        />
      </div>
      <div class="flex-grow mt-1">
        <InputTag
          :label="$t('TAGS')"
          :items="tags"
          :placeholder="$t('TAGS_CATEGORY')"
          v-on:change="onTagsChange"
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
          :max="-5"
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
        <Sequencer :space="sampleSpace" :name="name" v-on:share="onShare" />
      </div>
    </div>
    <div
      class="p-1 text-sm border rounded-md text-quicksilver border-quicksilver"
      v-else
    >
      <p>share to library {{ shareConfirmation.file.name }}??</p>
      <div class="flex flex-wrap">
        <div v-for="tag of shareConfirmation.tags" :key="tag" class="mb-1 mr-1">
          <Snack :label="`#${tag}`" />
        </div>
      </div>
      <div class="flex">
        <div class="w-1/2 mr-1">
          <Button
            :label="$t('OK')"
            v-on:click="confirmShare"
            :loading="loading"
          />
        </div>
        <div class="w-1/2 ml-1">
          <Button
            :label="$t('CANCEL')"
            v-on:click="shareConfirmation = null"
            :loading="loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "~/components/Slider";
import Sequencer from "~/components/Sequencer";
import Snack from "~/components/Snack";
import Button from "~/components/Button";
import Input from "~/components/Input";
import InputTag from "~/components/InputTag";
import generateName from "~/lib/generateName";
import getSignedUrl from "~/lib/getSignedUrl";
import { ffmpegCompressMP3 } from "~/lib/ffmpeg";

export default {
  components: {
    Slider,
    Sequencer,
    Input,
    Snack,
    InputTag,
    Button,
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
    onTagsChange(values) {
      console.log("values");
      this.tags = values;
    },
    onShare(file) {
      const doc = {
        file,
        tags: this.tags,
        name: file.name,
      };
      this.shareConfirmation = doc;
    },
    async confirmShare() {
      this.loading = true;
      try {
        const signedUrl = await getSignedUrl(this.shareConfirmation.file);
        const res = await this.uploadFile(signedUrl);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    },
    async uploadFile(signedUrl) {
      try {
        const mp3 = await ffmpegCompressMP3({
          file: this.shareConfirmation.file,
        });
        const res = await fetch(signedUrl, {
          method: "PUT",
          body: mp3,
          headers: {
            "Content-Type": this.shareConfirmation.file.type,
            "x-amz-acl": "public-read",
          },
        });
        return res;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
  data() {
    return {
      sampleSpace: 0.2,
      name: generateName().toLowerCase(),
      trimThreshold: -20,
      autoTrim: false,
      tags: [],
      shareConfirmation: null,
      loading: false,
    };
  },
};
</script>