import { Exception } from "@adonisjs/core/build/standalone";
import { CustomErrorType } from "App/Utils/CommonTypes";
import type { Translation } from "App/Utils/CommonTypes";

/**
 * CustomException class extends the base Exception class and implements the CustomErrorType interface.
 * This class is used to handle exceptions in the application
 *
 * Usage:
 * This class can be used to throw custom exceptions with detailed information about SQL errors or any specific errors,
 * making it easier to handle and log these errors in a consistent manner throughout the application. The ErrorHandler middleware
 * can be used to handle these exceptions and log them appropriately and return an appropriate response.
 */

export default class CustomException
  extends Exception
  implements CustomErrorType
{
  errorCode: number | string | undefined;
  sqlMessage: string | undefined;
  translatedMessage: Translation | undefined;
  errorData: { [key: string]: string | number } | undefined;
  constructor({
    message,
    status,
    errorCode,
    sqlMessage,
    translatedMessage,
    errorData,
  }: CustomErrorType) {
    super(message, status);
    this.errorCode = errorCode?.toString() ?? undefined;
    this.sqlMessage = sqlMessage ?? undefined;
    this.translatedMessage = translatedMessage ?? undefined;
    this.errorData = errorData ?? undefined;
  }
}
