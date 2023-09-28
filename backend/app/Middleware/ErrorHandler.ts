import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import Logger from "@ioc:Adonis/Core/Logger";
import { Translation, DatabaseError } from "App/Utils/CommonTypes";

const databaseErrors: { [key: string]: DatabaseError } = {
  "1062": {
    en: "Duplicate record entry ",
    fr: "Entrée d'enregistrement en double",
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
      console.log(`-> ${request.method()}: ${request.url()}`);
      await next();
    } catch (error) {
      if (error instanceof CustomException) {
        // Log or send the statusCode and type to a monitoring service

        // Handle the response
        response.status(error.status).send({
          statusCode: error.status,
          rawMessage: error.sqlMessage ? error.sqlMessage : error.message,
          translatedMessage:
            error.translatedMessage ?? this.getTranslatedMessage(error),
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
  private getTranslatedMessage({
    status,
    errno,
    sqlMessage,
    stack,
    message,
  }: CustomException): Translation {
    if (errno && databaseErrors[errno]) {
      return databaseErrors[errno];
    } else {
      Logger.error(`Unknown database error code: ${errno} `);
      Logger.error(`Error message: ${message}`);
      Logger.error(`Sql message: ${sqlMessage}`);
      Logger.error(`Stack trace: ${stack}`);
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
          en: "Internal Server Error",
          fr: "Erreur interne du serveur",
        };
      default:
        return {
          en: "Something went wrong",
          fr: "Quelque chose s'est mal passé",
        };
    }
  }
}
