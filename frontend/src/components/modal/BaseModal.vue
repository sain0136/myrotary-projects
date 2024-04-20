<script lang="ts">
export default {
  name: "BaseModal",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { modalHandler } from "@/utils/composables/ModalHandler";
import H3 from "@/components/headings/H3.vue";
import Paragraph from "@/components/paragraphs/DefaultParagraph.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
/* Data */
const {
  showModal,
  confirmValue,
  resetModal,
  changeShowModal,
  headerText,
  bodyText,
  confirmationModal,
} = modalHandler();
const { langTranslations, languagePref } = useLanguage();

/* Hooks */
onMounted(async () => {
});

/* Methods */
// const conformModal = () => {
//   changeShowModal();
//   confirmValue.value = true;
// };
const confirm = () => {
  window.dispatchEvent(new Event("confirmEvent"));
};

const cancel = () => {
  window.dispatchEvent(new Event("cancelEvent"));
};
</script>

<template>
  <!-- Main modal -->
  <div
    id="defaultModal"
    tabindex="-1"
    aria-hidden="true"
    v-if="showModal"
    :key="headerText"
    class="fixed flex text md:ml-32 align-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative w-full max-w-2xl max-h-full m-auto">
      <!-- Modal content -->
      <div
        class="relative flex flex-col items-center bg-white rounded-lg shadow"
      >
        <!-- Modal header -->
        <button
          @click="changeShowModal()"
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-nearBlack rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="defaultModal"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div
          class="w-full justify-center flex items-start p-4 border-b rounded-t"
        >
          <H3 class="" :content="headerText" />
        </div>
        <!-- Modal body -->
        <div class="p-4 space-y-6">
          <Paragraph :p1="bodyText + 'sdfddsf '" />
        </div>
        <!-- Modal footer -->
        <div
          class="flex w-full justify-center items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <RotaryButton
            v-if="confirmationModal"
            @click="confirm"
            :label="langTranslations.yesLabel"
            :theme="'primary'"
          />
          <RotaryButton @click="cancel" :label="'Close'" :theme="'primary'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
