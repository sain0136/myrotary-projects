import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import { Translation, DatabaseError } from "App/Utils/CommonTypes";
import { LogTools } from "App/Utils/AppLogger";
import { LogManager } from "App/Utils/AppLogger";
const databaseErrors: { [key: string]: DatabaseError } = {
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
};

const logger = new LogManager()

const handleDatabaseError = (errno: number, url: string): Translation => {
  if (errno === 1062 && url.includes("user")) {
    return databaseErrors["1062-users"];
  } else if (errno === 1062 && url.includes("project")) {
    return databaseErrors["1062-projects"];
  } else if (errno === 1062 && url.includes("district")) {
    return databaseErrors["1062-districts"];
  } else {
    return databaseErrors[errno];
  }
};

/**
 * Handles the HTTP request and response.
 *
 * @param {HttpContextContract} request - The HTTP context contract.
 * @param {() => Promise<void>} next - The next function to be called.
 * @return {Promise<void>} A promise that resolves when the function completes.
 */
export default class ErrorHandler {
  /**
   * Handles the incoming HTTP request and response for exceptions.
   *
   * @param {HttpContextContract} request - The HTTP context contract containing the request and response objects.
   * @param {() => Promise<void>} next - The next function in the middleware chain.
   */
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    try {
      // console.log(`-> ${request.method()}: ${request.url()}`);
      await next();
    } catch (error) {
      if (error instanceof CustomException) {
        const errorType = error.sqlMessage
          ? LogTools.LogTypes.DATABASE_ERROR
          : LogTools.LogTypes.EXCEPTION_ERROR;
        logger.log(errorType,{error: error})
        // Handle the response
        response.status(error.status).send({
          statusCode: error.status,
          rawMessage: error.sqlMessage ? error.sqlMessage : error.message,
          translatedMessage:
            error.translatedMessage ??
            this.getTranslatedMessage(error, request.url()),
        });
      }
    }
  }

  /**
   * Retrieves the translated message based on the provided custom exception.
   *
   * @param {CustomException} exception - The custom exception object containing status, errno, sqlMessage, stack, and message properties.
   * @return {Translation} The translated message based on the exception.
   */
  private getTranslatedMessage(
    { status, errno }: CustomException,
    url: string
  ): Translation {
    if (errno && databaseErrors[errno]) {
      return handleDatabaseError(errno, url);
    } else if (errno) {
      return {
        en: "Something went wrong. A report was sent to the administrator",
        fr: "Quelque chose s'est mal passé. Un rapport a été envoyée à l'administrateur",
      };
    }
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
}
