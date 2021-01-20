<template>
  <div class="items-stretch h-full p-1 rounded-md rounded-t rounded-tl-none bg-davys">
    <form>
      <div class="mb-1">
        <Input
          :label="$t('EMAIL')"
          v-on:input="form.email = $event.target.value"
          :value="form.email"
        />
      </div>
      <div class="mb-1">
        <Input
          :label="$t('PASSWORD')"
          type="password"
          v-on:input="form.password = $event.target.value"
          :value="form.password"
        />
      </div>
      <div class="">
        <Button
          :label="$t('LOGIN')"
          type="submit"
          v-on:click="onSubmit"
          :loading="loading"
        />
      </div>
      <div
        v-if="errors"
        v-html="errors"
        class="p-1 my-1 font-mono text-xs border rounded-md text-melon border-melon"
      ></div>
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
      this.errors = null;
      const validation = this.validate(this.form);
      if (validation.valid) {
        try {
          const user = await this.$fire.auth.signInWithEmailAndPassword(
            this.form.email,
            this.form.password
          );
          const result = await this.$fire.auth.currentUser.updateProfile({
            displayName: this.form.username,
          });
        } catch (err) {
          alert(err);
        }
        this.loading = false;
        return;
      }
      this.loading = false;
      // Object.keys(validation).filter(v => v !== 'valid' && !validation[v]).join( // wtf
      this.errors = `${validation.email}<br/>${validation.password}`;
    },
    validate(form) {
      const email =
        /.+@.+\..+/.test(form.email) || this.$t("ENTER_VALID_EMAIL");
      const password =
        form.password.length >= 6 || this.$t("ENTER_VALID_PASSWORD");
      return {
        email,
        password,
        valid: email === true && password === true,
      };
    },
  },
  data() {
    return {
      form: {
        username: "",
        email: "",
        password: "",
      },
      errors: null,
      loading: false,
    };
  },
};
</script>