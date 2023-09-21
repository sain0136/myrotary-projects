<script lang="ts">
export default {
  name: "AdminLoginForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, onUnmounted, ref } from "vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import H3 from "@/components/headings/H3.vue";
import H2 from "@/components/headings/H2.vue";
const show = ref(false);

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 500);
});

/* Data */
const { langTranslations } = useLanguage();
const email = ref("");
const password = ref("");
const logo = ref("");

/* Methods */
const yourSubmitMethod = () => {
  console.log(email.value);
};
</script>

<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary to-secondary"
  >
    <Transition>
      <form
        v-if="show"
        @submit.prevent
        class="bg-nearWhite p-5 rounded-lg shadow-2xl"
      >
        <div class="flex items-center flex-col mb-5 format">
          <img src="/test.png" alt="Image" class="h-auto max-w-1/2 mx-auto" />
          <H2 :content="langTranslations.welcome" />
          <H3
            class="text-gray-600"
            :content="langTranslations.adminLoginForm.subHeading"
          ></H3>
        </div>

        <div>
          <BaseInput
            v-model="email"
            :label="langTranslations.email"
            :type="'email'"
            :required="true"
          />
          <BaseInput
            v-model="password"
            :label="langTranslations.password"
            :type="'password'"
            :required="true"
          />
          <RotaryButton
            @click="yourSubmitMethod"
            :label="langTranslations.adminLoginForm.signIn"
            theme="primary"
            class="w-full"
          />
        </div>
      </form>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
