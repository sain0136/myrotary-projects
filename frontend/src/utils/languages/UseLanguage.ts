import { ref, computed } from "vue";
import type { Ref } from "vue";
import { translations } from "@/utils/languages/Translations";

type lang = "en" | "fr";
// Reactive variable for the current language
const languagePref: Ref<lang> = ref("en");
const availabileLanguages: lang[] = ["en", "fr"];
// Function to change the language
const setLanguage = (lang: lang) => {
  languagePref.value = lang;
  localStorage.setItem("preferredLanguage", lang);
};

const setLocalLanguage = () => {
  const storedLanguage = localStorage.getItem("preferredLanguage");
  if (storedLanguage && availabileLanguages.includes(storedLanguage as lang)) {
    languagePref.value = storedLanguage as lang;
  } else {
    languagePref.value = "en";
    localStorage.setItem("preferredLanguage", "en");
  }
};
// Computed property that returns the translations for the current language
const langTranslations = computed(() => translations[languagePref.value]);

function customPrintf(formatString: string, ...args: string[]) {
  let formattedString = formatString;
  args.forEach((arg) => {
    formattedString = formattedString.replace(/\{.*?\}/, arg);
  });
  return formattedString;
}
export const useLanguage = () => {
  return {
    languagePref,
    setLanguage,
    langTranslations,
    customPrintf,
    availabileLanguages,
    setLocalLanguage,
  };
};
