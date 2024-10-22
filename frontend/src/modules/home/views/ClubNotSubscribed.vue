<script lang="ts">
export default {
  name: "ClubNotSubscribed",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import Card from "primevue/card";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import router from "@/router";
import { ApiClient } from "@/api/ApiClient";
import { UsersApi } from "@/api/services/UserApi";

/* Data */
const { langTranslations, languagePref } = useLanguage();
const checkoutStatus = ref<"success" | "">("");
const userId = ref<string>("");
const clubId = ref<string>("");
const usersApi = new UsersApi(new ApiClient());
const stripeCheckoutLink = ref<string>("");

/* Hooks */
onMounted(async () => {
  const url = window.location.href;
  const urlParams = new URLSearchParams(url.split("?")[1]);
  const status = urlParams.get("status");
  const uid = urlParams.get("userId");
  const cid = urlParams.get("clubId");
  if (cid && uid) {
    userId.value = uid;
    clubId.value = cid;

    const response = await usersApi.stripeRegistration(
      uid,
      cid,
      languagePref.value
    );
    stripeCheckoutLink.value = response.url;
  }
  if (status === "success") {
    checkoutStatus.value = "success";
  }
});

/* Methods */
const redirectToStripeCheckout = () => {
  window.location.href = stripeCheckoutLink.value;
};
</script>

<template>
  <div class="fluid-container flex flex-col justify-center items-center">
    <Card class="w-1/2 m-auto my-8">
      <template #title
        ><h1 class="text-center">
          {{
            checkoutStatus === "success"
              ? langTranslations.stripeSubscription.cardTitleSuccess
              : langTranslations.stripeSubscription.cardTitle
          }}
        </h1>
      </template>
      <template #content>
        <div class="flex flex-col gap-8">
          <p
            :class="
              `text-center` +
              (checkoutStatus === 'success'
                ? ' text-green-500 px-4'
                : ' text-red-500')
            "
          >
            {{
              checkoutStatus === "success"
                ? langTranslations.stripeSubscription.cardSubtitleSuccess
                : langTranslations.stripeSubscription.cardSubtitle
            }}
          </p>
          <div class="flex gap-2 px-24">
            <RotaryButton
              v-if="checkoutStatus !== 'success'"
              :label="langTranslations.stripeSubscription.contactSupportButton"
              theme="secondary"
              class="w-full"
              type="submit"
              @click="
                () => {
                  router.push({ name: 'Contact' });
                }
              "
            />
            <RotaryButton
              :label="langTranslations.stripeSubscription.returnHomeButton"
              theme="primary"
              class="w-full"
              type="submit"
              @click="
                () => {
                  router.push({ name: 'Home' });
                }
              "
            />
          </div>
          <div v-if="checkoutStatus !== 'success'" class="flex gap-2 px-48">
            <RotaryButton
              :label="langTranslations.stripeSubscription.checkoutButton"
              theme="black"
              class="w-full"
              type="submit"
              @click="redirectToStripeCheckout"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
