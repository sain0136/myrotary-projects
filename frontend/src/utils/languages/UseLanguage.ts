import { ref, computed } from "vue";
import type { Ref } from "vue";
import { translations } from "@/utils/languages/Translations";
import type { ProjectStatus } from "@/utils/types/commonTypes";
import ResourceList from "@/utils/classes/ResourceList";
import { translatedStatus} from "@/utils/languages/TranslationConversions"
export type lang = "en" | "fr";
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



function translateProjectStatus(status: ProjectStatus, lang: lang): string {
  return translatedStatus[status][lang];
}

function translateProjectTypeList(lang: lang): string[] {
  return [
    "",
    ...Object.values(ResourceList.projectTypeMap).map(
      (projectType) => projectType[lang]
    ),
  ];
}

function translateProjectStatusList(lang: lang): string[] {
  return [
    "",
    ...Object.values(translatedStatus).map(
      (projectStatus) => projectStatus[lang]
    ),
  ];
}

function translateRegionList(lang: lang): string[] {
  return [
    "",
    ...Object.values(ResourceList.regionMap).map((region) => region[lang]),
  ];
}

function translateAreaOfFocusList(lang: lang): string[] {
  return [
    "",
    ...Object.values(ResourceList.areaOfFocusMap).map((aof) => aof[lang]),
  ];
}

function convertAreaOfFocusLang(type: string) {
  const areaOfFocus = Object.values(ResourceList.areaOfFocusMap).find(
    (aof) => aof.en === type || aof.fr === type
  );
  return areaOfFocus?.en || "";
}

function convertRegionLang(type: string) {
  const region = Object.values(ResourceList.regionMap).find(
    (region) => region.en === type || region.fr === type
  );
  return region?.en || "";
}
function convertProjectStatusLang(type: string) {
  const projectStatus = Object.values(translatedStatus).find(
    (projectStatus) => projectStatus.en === type || projectStatus.fr === type
  );
  return projectStatus?.en || "";
}

function convertProjectLang(type: string) {
  const projectType = Object.values(ResourceList.projectTypeMap).find(
    (projectType) => projectType.en === type || projectType.fr === type
  );
  return projectType?.en || "";
}

export const useLanguage = () => {
  return {
    languagePref,
    setLanguage,
    langTranslations,
    customPrintf,
    availabileLanguages,
    setLocalLanguage,
    translateProjectStatus,
    translateProjectTypeList,
    convertProjectLang,
    translateProjectStatusList,
    translateRegionList,
    convertRegionLang,
    convertProjectStatusLang,
    translateAreaOfFocusList,
    convertAreaOfFocusLang,
  };
};
