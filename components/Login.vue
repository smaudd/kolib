<template>
  <div class="w-full h-full p-1 rounded-md rounded-tl-none bg-davys">
    <form class="flex flex-col justify-between">
      <div>
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
        <div
          v-if="errors"
          v-html="errors"
          class="p-1 my-1 font-mono text-md border rounded-md text-melon border-melon"
        ></div>
      </div>
      <div class="">
        <Button
          :label="$t('LOGIN')"
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
      this.errors = null;
      const validation = this.validate(this.form);
      if (validation.valid) {
        try {
          const user = await this.$fire.auth.signInWithEmailAndPassword(
            this.form.email,
            this.form.password
          );
          this.$store.commit("ON_SET_USER", this.$fire.auth.currentUser);
          this.$router.push("/");
        } catch (err) {
          this.errors = err.message.toLowerCase();
        }
        this.loading = false;
        return;
      }
      this.loading = false;
      this.errors = Object.keys(validation).reduce((acc, current) => {
        if (typeof validation[current] === "string") {
          return `${validation[current]}<br>${acc}`;
        }
        return acc;
      }, "");
      console.log(this.errors);
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
