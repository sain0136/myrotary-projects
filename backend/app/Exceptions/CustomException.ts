import { Exception } from "@adonisjs/core/build/standalone";
import { CustomErrorType } from "App/Utils/CommonTypes";
import type { Translation } from "App/Utils/CommonTypes";

export default class CustomException
  extends Exception
  implements CustomErrorType
{
  errno: number | undefined;
  sqlMessage: string | undefined;
  sqlCode: string | undefined | number;
  translatedMessage: Translation | undefined;
  constructor({
    message,
    status,
    errno,
    code,
    sqlMessage,
    translatedMessage,
  }: CustomErrorType) {
    super(message, status);
    this.errno = errno ?? undefined;
    this.sqlMessage = sqlMessage ?? undefined;
    this.sqlCode = code ?? undefined;
    this.translatedMessage = translatedMessage ?? undefined;
  }
}
