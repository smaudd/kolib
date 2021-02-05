<template>
  <div class="h-full p-1 rounded-md rounded-t rounded-tl-none bg-davys">
    <div
      class="p-1 mb-1 font-mono text-sm border rounded-md bg-davys border-quicksilver text-quicksilver sm:max-w-sm"
    >
      {{ $t("UPDATE_USER_INFO") }}
    </div>
    <form>
      <div class="mb-1">
        <Input
          :label="$t('USERNAME')"
          :value="form.username"
          v-on:input="form.username = $event.target.value"
        />
      </div>
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
      <div class="mb-1">
        <Input
          :label="$t('NEW_PASSWORD')"
          type="password"
          v-on:input="form.newPassword = $event.target.value"
          :value="form.newPassword"
        />
      </div>
      <div class="">
        <Button
          :label="$t('UPDATE_PROFILE')"
          type="submit"
          v-on:click="onSubmit"
          :loading="loading"
        />
      </div>
      <div
        v-if="errors || success"
        class="p-1 my-1 font-mono text-xs border rounded-md text-melon border-melon"
      >
        <div v-if="errors" v-html="errors" />
        <div v-if="success">{{ $t("USER_UPDATED") }}</div>
      </div>
    </form>
  </div>
</template>

<script>
import Input from "~/components/Input";
import Button from "~/components/Button";
import { verifyUsername, updateUsername } from "~/lib/firebaseQueries";

export default {
  components: {
    Input,
    Button,
  },
  created() {
    this.verifyUsername = verifyUsername;
    this.updateUsername = updateUsername;
  },
  methods: {
    async onSubmit() {
      this.success = false;
      this.loading = true;
      const errors = [];
      const fields = this.validate(this.form);
      try {
        // Valid change of email
        if (fields.email === true) {
          await this.$fire.auth.signInWithEmailAndPassword(
            this.$store.state.user.email,
            this.form.password
          );
          await this.$fire.auth.currentUser.updateEmail(this.form.email);
          this.$store.commit("ON_SET_USER", this.$fire.auth.currentUser);
        } else if (typeof fields.email === "string") {
          errors.push(fields.email);
        }
        // Valid change of password
        if (fields.password === true) {
          await this.$fire.auth.signInWithEmailAndPassword(
            this.$store.state.user.email,
            this.form.password
          );
          await this.$fire.auth.currentUser.updatePassword(this.form.password);
        } else if (typeof fields.password === "string") {
          errors.push(fields.password);
        }
        // Valid change of username
        if (fields.username === true) {
          await this.verifyUsername({ username: this.form.username });
          const res = await this.$fire.auth.currentUser.updateProfile({
            displayName: this.form.username,
          });
          await this.updateUsername({
            username: this.form.username,
            email: fields.email,
            uid: this.$fire.auth.currentUser.uid,
          });
          this.$store.commit("ON_SET_USER", this.$fire.auth.currentUser);
        } else if (typeof fields.username === "string") {
          errors.push(fields.username);
        }
        this.loading = false;
        if (errors.length > 0) {
          this.success = false;
          this.errors = errors.join("<br>");
          return;
        }
        this.success = true;
        this.errors = null;
        this.form.password = "";
        this.form.newPassword = "";
      } catch (err) {
        this.loading = false;
        if (err.message) {
          this.errors = err.message.toLowerCase();
          return;
        }
        this.errors = err;
      }
    },
    validate(form) {
      const fields = {};
      if (form.email !== this.$store.state.user.email) {
        if (/.+@.+\..+/.test(form.email)) {
          fields.email = true;
        } else {
          fields.email = this.$t("ENTER_VALID_EMAIL");
        }
      }
      if (form.username !== this.$store.state.user.displayName) {
        if (form.username.length > 3) {
          fields.username = true;
        } else {
          fields.username = this.$t("ENTER_VALID_USERNAME");
        }
      }
      if (form.password) {
        if (form.password.length > 6) {
          fields.password = true;
        } else {
          fields.password = this.$t("ENTER_VALID_PASSWORD");
        }
      }
      return fields;
    },
  },
  data() {
    return {
      form: {
        username: this.$store.state.user.displayName,
        email: this.$store.state.user.email,
        password: "",
        newPassword: "",
      },
      success: false,
      errors: null,
      loading: false,
    };
  },
};
</script>