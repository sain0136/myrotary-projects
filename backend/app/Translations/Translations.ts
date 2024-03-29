import type { Translation } from "App/Utils/CommonTypes";

type apiError = "emailAlreadyExists" | "badCredentials" | "projectHasPledges";

export const errorTranslations: Record<apiError, Translation> = {
  emailAlreadyExists: {
    en: "The email address you entered is not associated with any account. Please try again.",
    fr: "L'adresse e-mail que vous avez indiquée n'est pas associée à aucune compte. Veuillez réessayer.",
  },
  badCredentials: {
    en: "Unable to log you in. Please verify your credentials.",
    fr: "Impossible de vous connecter. Veuillez vérifier vos identifiants.",
  },
  projectHasPledges: {
    en: "Cannot delete project, it has pledges associated",
    fr: "Impossible de supprimer le projet, il y a des engagements associés",
  },
};
