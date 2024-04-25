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
    en: "Your account is pending admin approval. Please check your email for updates and reach out to us if you encounter any issues",
    fr: "Votre compte est en attente d’approbation par l’administrateur. Veuillez consulter votre courriel pour obtenir des mises à jour et communiquer avec nous si vous rencontrez des problèmes",
  },
};
