import type { CustomError } from "@/utils/classes/CustomError";
import { toastHandler } from "@/utils/composables/ToastHandler";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";

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

const handleError = (
  error: CustomError,
  overrideTimeout?: boolean,
  handleRedirect?: { path: string; goback?: boolean }
) => {
  const errorBody = {
    en: '"error not translated": ' + error.message,
    fr: '"erreur non traduite": ' + error.message,
  };
  let message = errorBody[languagePref.value];
  if (error.translatedMessage?.en) {
    message = error.translatedMessage[languagePref.value];
  }
  const time = overrideTimeout ? "5000" : "3000";
  handleToast("error", errorName[languagePref.value], message, time);
  if (handleRedirect) {
    setTimeout(() => {
      if (handleRedirect.goback) {
        router.go(-1);
        return;
      } else if (handleRedirect.path) {
        router.push({ name: handleRedirect.path });
        return;
      }
    }, Number(time));
  }
};

const handleValidationForm = (errorMessage?: string) => {
  const formNotValid = {
    en: "Form Errors. Please correct and resubmit.",
    fr: "Erreurs du formulaire. Veuillez corriger et resubmitter.",
  };
  handleToast(
    "error",
    errorName[languagePref.value] ,
    `${formNotValid[languagePref.value]} ${errorMessage ? errorMessage : ""}`,
    "5000"
  );
};

const handleSuccess = (
  message: string,
  handleRedirect?: { path: string; goback?: boolean }
) => {
  handleToast("success", "Success", message, "3000");
  if (handleRedirect) {
    setTimeout(() => {
      if (handleRedirect.goback) {
        router.go(-1);
        return;
      } else if (handleRedirect.path) {
        router.push({ name: handleRedirect.path });
        return;
      }
    }, 3000);
  }
};
export const errorHandler = () => {
  return {
    handleError,
    handleSuccess,
    handleValidationForm,
  };
};
