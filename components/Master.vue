<template>
  <div class="flex-grow p-1">
    <div ref="wave" v-show="false"></div>
    <div v-if="!shareData">
      <div class="flex-grow mt-1">
        <Input
          :label="$t('KIT_NAME')"
          :value="name"
          :placeholder="$t('KIT_NAME')"
          v-on:input="name = $event.target.value"
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
      <p>share to library {{ shareData.file.name }}??</p>
      <div class="flex flex-wrap">
        <div v-for="tag of shareData.tags" :key="tag" class="mb-1 mr-1">
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
            v-on:click="shareData = null"
            :loading="loading"
          />
        </div>
      </div>
      <div v-if="errors">
        {{ errors }}
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
import { setKit } from "~/lib/firebaseQueries";

export default {
  components: {
    Slider,
    Sequencer,
    Input,
    Snack,
    InputTag,
    Button,
  },
  mounted() {
    this.setKit = setKit;
    if (process.client) {
      const WaveSurfer = require("wavesurfer.js");
      this.wavesurfer = WaveSurfer.create({
        container: this.$refs.wave,
        waveColor: "#FFBFB7",
        progressColor: "purple",
        cursorColor: "transparent",
        hideScrollbar: true,
        interact: false,
        height: 100,
      });
      this.wavesurfer.on("waveform-ready", this.onWaveLoad);
    }
  },
  methods: {
    async onWaveLoad() {
      setTimeout(async () => {
        const image = await this.wavesurfer.exportImage("image/png", 1);
        const img = document.createElement("img");
        img.src = image;
        document.body.append(img);
        await this.setKit({
          kitData: {
            name: this.shareData.file.name.split(".")[0],
            tags: this.tags,
            path: `${this.$store.state.user.uid}/${
              this.shareData.file.name.split(".")[0]
            }`,
            image,
          },
        });
        this.loading = false;
      }, 5000);
    },
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
      this.tags = values;
    },
    onShare(file) {
      const doc = {
        file,
        tags: this.tags,
        name: file.name,
      };
      this.shareData = doc;
    },
    async confirmShare() {
      this.loading = true;
      try {
        console.log(this.shareData.file);
        const signedUrls = await getSignedUrl({
          files: [
            {
              folder: "wavs",
              name: `${this.$store.state.user.uid}/${this.shareData.file.name}`,
              type: "audio/wav",
            },
            {
              folder: "mp3s",
              name: `${
                this.$store.state.user.uid
              }/${this.shareData.file.name.replace("wav", "mp3")}`,
              type: "audio/mp3",
            },
          ],
        });
        for await (const url of signedUrls) {
          await this.uploadFile({
            signedUrl: url,
            compression: url.includes("mp3"),
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async uploadFile({ signedUrl, compression }) {
      try {
        const id = `${this.$store.state.user.uid}/${this.shareData.file.name}`;
        let file = this.shareData.file;

        if (compression) {
          file = await ffmpegCompressMP3({
            file: this.shareData.file,
          });
        }
        const res = await fetch(signedUrl, {
          method: "PUT",
          body: new File([file], id, { type: file.type }), // rename with id
          headers: {
            "Content-Type": file.type,
            "x-amz-acl": "public-read",
          },
        });
        if (compression) {
          console.log(this.wavesurfer);
          this.wavesurfer.load(URL.createObjectURL(file));
        }
        return res;
      } catch (err) {
        this.errors = err;
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
      shareData: null,
      loading: false,
      errors: null,
      image: null,
    };
  },
};
</script>