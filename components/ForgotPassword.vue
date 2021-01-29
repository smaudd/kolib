<template>
  <div class="w-full h-full p-1 rounded-md rounded-tl-none bg-davys">
    <div
      class="p-1 mb-1 font-mono text-sm border rounded-md bg-davys border-quicksilver text-quicksilver sm:max-w-sm"
    >
      {{ $t("FORGOT_PASSWORD_EMAIL") }}
    </div>
    <form class="flex flex-col justify-between">
      <div>
        <div class="mb-1">
          <Input
            :label="$t('EMAIL')"
            v-on:input="form.email = $event.target.value"
            :value="form.email"
          />
        </div>
        <div
          v-if="errors || success"
          class="p-1 my-1 font-mono text-xs border rounded-md text-melon border-melon"
        >
          <div v-if="errors" v-html="errors" />
          <div v-if="success">{{ $t("FORGOT_EMAIL_SENT") }}</div>
        </div>
      </div>
      <div class="">
        <Button
          :label="$t('RECOVER')"
          type="submit"
          v-on:click="onSubmit"
          :loading="loading"
        />
      </div>
    </form>
  </div>
</template>

<script>
import Input from "~/components/Input";
import Button from "~/components/Button";

export default {
  components: {
    Input,
    Button,
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      this.success = false;
      this.errors = null;
      const validation = this.validate(this.form);
      if (validation.valid) {
        try {
          console.log("aki");
          const result = await this.$fire.auth.sendPasswordResetEmail(
            this.form.email
          );
          this.loading = false;
          this.success = true;
        } catch (err) {
          this.loading = false;
          if (err.code === "auth/user-not-found") {
            this.success = true;
            return;
          }
          this.errors = err.message.toLowerCase();
        }
        return;
      }
      this.loading = false;
      this.errors = Object.keys(validation).reduce((acc, current) => {
        if (typeof validation[current] === "string") {
          return `${validation[current]}<br>${acc}`;
        }
        return acc;
      }, "");
    },
    validate(form) {
      const email =
        /.+@.+\..+/.test(form.email) || this.$t("ENTER_VALID_EMAIL");
      return {
        email,
        valid: email === true,
      };
    },
  },
  data() {
    return {
      form: {
        email: "",
      },
      errors: null,
      loading: false,
      success: false,
    };
  },
};
</script>