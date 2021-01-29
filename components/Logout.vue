<template>
  <div class="w-full h-full p-1 rounded-md rounded-tl-none bg-davys">
    <div class="">
      <p
        class="p-1 mb-1 font-mono text-sm border rounded-md text-quicksilver border-quicksilver"
      >
        {{ $t("LOGOUT_MESSAGE") }}
      </p>
      <div class="mb-1">
        <Button :label="$t('LOGOUT')" v-on:click="onLogout" />
      </div>
      <div v-if="error" class="p-1 border rounded-md border-melon">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import Button from "~/components/Button";
export default {
  components: {
    Button,
  },
  methods: {
    async onLogout() {
      try {
        await this.$fire.auth.signOut();
        this.$store.commit("ON_SET_USER", null);
        this.$router.push("/");
      } catch (err) {
        console.log(err);
      }
    },
  },
  data() {
    return {
      error: null,
    };
  },
};
</script>