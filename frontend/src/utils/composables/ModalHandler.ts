import { reactive, ref } from "vue";

const showModal = ref(false);
const headerText = ref("Example Header");
const bodyText = ref("lorem ipsum dolor sit amet  lorem ipsum dolor sit amet");

const changeShowModal = () => {
  showModal.value = !showModal.value;
};

const setModal = (header: string, body: string) => {
  headerText.value = header;
  bodyText.value = body;
};

const resetModal = () => {
  headerText.value = "";
  bodyText.value = "";
};

export const modalHandler = () => {
  return {
    showModal,
    headerText,
    bodyText,
    resetModal,
    changeShowModal,
    setModal,
  };
};
