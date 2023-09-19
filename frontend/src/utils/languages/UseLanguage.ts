import { ref, computed } from "vue";
import type { Ref } from "vue";
import { translations } from "@/utils/languages/Translations";

 type lang = "en" | "fr";
// Reactive variable for the current language
const languagePref: Ref<lang> = ref("en");

// Function to change the language
const setLanguage = (lang: lang) => {
  languagePref.value = lang;
};

// Computed property that returns the translations for the current language
const langTranslations = computed(() => translations[languagePref.value]);

export const useLanguage = () => {
  return {
    languagePref,
    setLanguage,
    langTranslations,
  };
};