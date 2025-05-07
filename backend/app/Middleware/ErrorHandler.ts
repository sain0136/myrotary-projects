import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import { Translation } from "App/Utils/CommonTypes";

/**
 * Middleware for handling exceptions. All Errors are handled here.
 *
 * @param {HttpContextContract} request
 * @param {() => Promise<void>} next
 * @return {Promise<void>}
 */
export default class ErrorHandler {
  /**
   * Handles the incoming HTTP request and response for exceptions.
   */
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ): Promise<void> {
    try {
      await next();
    } catch (error) {
      if (error instanceof CustomException) {
        const translatedMessage =
          error.translatedMessage ??
          this.getTranslatedMessage(error, request.url());

        // Handle the response
        response.status(error.status).send({
          statusCode: error.status,
          translatedMessage,
          errorData: error.errorData ?? undefined,
        });
      }
    }
  }

  /**
   * Retrieves the translated message based on the provided custom exception.
   */
  private getTranslatedMessage(
    { status, errorCode, errno }: CustomException,
    url: string
  ): Translation {
    if (errorCode && errorTranslations[errorCode]) {
      // Handle specific errors i.e known handled db errors or custom errors
      return getErrorTranslation(errorCode.toString(), url);
    } else if (errorCode || errno) {
      // Handle all non handled database/custom errors
      // TODO: Actually send a report to the admin
      return {
        en: "Something went wrong. A report was sent to the administrator",
        fr: "Quelque chose s'est mal passé. Un rapport a été envoyée à l'administrateur",
      };
    } else {
      // Handle all other errors based on the HTTP status
      return getErrorTranslationByStatus(status);
    }
  }
}

/**
 * Maps a database error number to a generic translated error message, handle known and specific database errors
 */
const getErrorTranslation = (errorCode: string, url: string): Translation => {
  if (errorCode === "1062" && url.includes("user")) {
    return errorTranslations["1062-users"];
  } else if (errorCode === "1062" && url.includes("project")) {
    return errorTranslations["1062-projects"];
  } else if (errorCode === "1062" && url.includes("district")) {
    return errorTranslations["1062-districts"];
  } else {
    return errorTranslations[errorCode];
  }
};

/**
 *  Database error messages - We dont send a verbose/SQL raw message rather use these generic ones
 *  Custom Db errors should start in the 900000 range
 */
const errorTranslations: Record<string, Translation> = {
  "1062": {
    en: "Duplicate record entry",
    fr: "Entrée d'enregistrement en double",
  },
  "1062-users": {
    en: "This email is already registered",
    fr: "Cette adresse email est déjà enregistrée",
  },
  "1062-projects": {
    en: "A Project with this name already exists",
    fr: "Un projet avec ce nom existe d'ét",
  },
  "1062-districts": {
    en: "A District with this name/number already exists",
    fr: "Un district avec ce nom/numéro existe d'ét",
  },
  "1451": {
    en: "Cannot delete or update a parent row",
    fr: "Impossible de supprimer ou de mettre à jour une ligne parent",
  },
  "1452": {
    en: "Cannot delete or update this record contact the administrator",
    fr: "Impossible de supprimer ou de mettre à jour cet enregistrement, contactez l'administrateur",
  },
  "901000": {
    en: "Error deleting Pledge. Please contact the administrator",
    fr: "Erreur de suppression de Pledge. Contactez l'administrateur",
  },
  PROJECT_HAS_ADMINS: {
    en: "You cannot delete this project because it has other admins assigned. Please remove the admins before deleting the project.",
    fr: "Vous ne pouvez pas supprimer ce projet car il a d'autres administrateurs assignés. Veuillez supprimer les administrateurs avant de supprimer le projet.",
  },
};

/**
 * Retrieves the translated message based on the provided HTTP status code for all non database exceptions
 */
function getErrorTranslationByStatus(status: number): Translation {
  switch (status) {
    case 400:
      return {
        en: "Bad Request",
        fr: "Mauvaise requête",
      };
    case 401:
      return {
        en: "Unauthorized. Please login to continue ",
        fr: "Non autorisé. Veuillez vous connecter pour continuer",
      };
    case 422:
      return {
        en: "Unprocessable Entity",
        fr: "Entité non traitable",
      };
    case 403:
      return {
        en: "Forbidden",
        fr: "Interdit",
      };
    case 601:
      return {
        en: "You were logged out due to inactivity. Please login again.",
        fr: "Vous avez été déconnecté suite à l'inactivité. Veuillez vous reconnecter",
      };
    case 500:
      return {
        en: "Internal Server Error. Please try again later",
        fr: "Erreur interne du serveur",
      };
    default:
      return {
        en: "Something went wrong. Contact us at your earliest convenience",
        fr: "Quelque chose s'est mal passé. Contactez-nous au plus vite",
      };
  }
}
