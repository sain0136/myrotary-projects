import type { Translation } from "App/Utils/CommonTypes";

type apiError = "emailAlreadyExists" | "badCredentials" | "projectHasPledges" | "loginNotAllowed";

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
  loginNotAllowed: {
    en: "It looks like your account isn't ready for login yet. Please contact us if you believe this is an error",
    fr: "Il semble que votre compte ne soit pas encore prêt pour la connexion. Veuillez nous contacter si vous pensez qu’il s’agit d’une erreur",
  },
};
