export interface Translation {
  welcome: string;
  goodbye: string;
  english: string;
  french: string;
  toastError: string;
  toastSuccess: string;
  toastWarning: string;
  toastInfo: string;
}

export const translations: Record<string, Translation> = {
  en: {
    welcome: "Welcome!",
    goodbye: "Goodbye!",
    english: "English",
    french: "French",
    toastError: "Error occurred",
    toastSuccess: "Operation successful",
    toastWarning: "Warning",
    toastInfo: "Information",
  },
  fr: {
    welcome: "Bienvenue!",
    goodbye: "Au revoir!",
    english: "Anglais",
    french: "Français",
    toastError: "Une erreur s'est produite",
    toastSuccess: "Opération réussie",
    toastWarning: "Avertissement",
    toastInfo: "Information",
  },
};
