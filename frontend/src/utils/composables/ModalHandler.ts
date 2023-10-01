import { reactive, ref, watch } from "vue";

const showModal = ref(false);
const headerText = ref("Example Header");
const bodyText = ref("lorem ipsum dolor sit amet  lorem ipsum dolor sit amet");
const confirmationModal = ref(false);
const confirmValue = ref(false);
const changeShowModal = (
  confirmation: boolean = false
): void | Promise<boolean> => {
  showModal.value = !showModal.value;
  if (confirmation) {
    confirmationModal.value = confirmation;
    return new Promise<boolean>((resolve) => {
      watch(confirmValue, () => {
        if (confirmValue.value) {
          resolve(confirmValue.value);
        }
      });
    });
  }
};

const setModal = (header: string, body: string) => {
  headerText.value = header;
  bodyText.value = body;
};

const resetModal = () => {
  headerText.value = "";
  bodyText.value = "";
  confirmationModal.value = false;
};

export const modalHandler = () => {
  return {
    showModal,
    headerText,
    bodyText,
    resetModal,
    changeShowModal,
    setModal,
    confirmationModal,
    confirmValue,
  };
};
