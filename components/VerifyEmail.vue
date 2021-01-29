<template>
  <client-only>
    <div>
      <div
        class="absolute bottom-0 left-0 right-0 z-10 p-2 px-3 pb-0 mb-2"
        v-if="open"
      >
        <div
          class="w-full p-1 font-mono text-sm border rounded-md text-melon border-melon bg-davys"
        >
          <div class="mb-1" v-if="!message">{{ $t("VERIFY_EMAIL") }}</div>
          <div class="mb-1" v-else>{{ message }}</div>
          <div class="flex">
            <Button :label="$t('RESEND_EMAIL')" v-on:click="sendVerification" />
            <div class="w-2" />
            <Button :label="$t('CLOSE')" v-on:click="toggleWindow" />
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Button from "~/components/Button";
export default {
  components: {
    Button,
  },
  methods: {
    toggleWindow() {
      this.open = false;
    },
    async sendVerification() {
      try {
        const res = await this.$fire.auth.currentUser.sendEmailVerification();
        this.message = this.$t("EMAIL_SENT");
        setTimeout(() => {
          this.open = false;
        }, 1200);
      } catch (err) {
        this.message = err.message.toLowerCase();
      }
    },
  },
  watch: {
    "$store.state.user": function () {
      this.open =
        this.$store.state.user && !this.$store.state.user.emailVerified;
    },
  },
  data() {
    return {
      open: this.$store.state.user && !this.$store.state.user.emailVerified,
      message: null,
    };
  },
};
</script>