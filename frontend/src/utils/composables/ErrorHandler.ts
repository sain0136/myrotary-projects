import type { CustomError } from "@/utils/classes/CustomError";
import { toastHandler } from "@/utils/composables/ToastHandler";
import { useLanguage } from "@/utils/languages/UseLanguage";

const { handleToast } = toastHandler();
const { languagePref } = useLanguage();
const errorName = {
  en: "Error",
  fr: "Erreur",
};

const success = {
  en: "Success",
  fr: "Succès",
};

const handleError = (error: CustomError) => {
  handleToast(
    "error",
    errorName[languagePref.value],
    error.translatedMessage[languagePref.value],
    "3000"
  );
};

const handleValidationForm = () => {
  const formNotValid = {
    en: "Form Errors. Please correct and resubmit.",
    fr: "Erreurs du formulaire. Veuillez corriger et resubmitter.",
  };
  handleToast(
    "error",
    errorName[languagePref.value],
    formNotValid[languagePref.value],
    "3000"
  );
};

const handleSuccess = (message: string) => {
  handleToast("success", "Success", message, "3000");
};
export const errorHandler = () => {
  return {
    handleError,
    handleSuccess,
    handleValidationForm,
  };
};
