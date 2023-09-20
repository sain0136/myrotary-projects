export interface Translation {
  welcome: string;
  goodbye: string;
  english: string;
  french: string;
  toastError: string;
  toastSuccess: string;
  toastWarning: string;
  toastInfo: string;
  notfoundText: string;
  home: string;
  contactUs: string;
  opps: string;
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
    notfoundText: "The page you are looking for couldn’t be found",
    home: "Home",
    contactUs: "Contact Us",
    opps: "Opps!",
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
    notfoundText: "La page que vous cherchez n'a pas pu être trouvée",
    home: "Accueil",
    contactUs: "Contactez-nous",
    opps: "Opps!",
  },
};
