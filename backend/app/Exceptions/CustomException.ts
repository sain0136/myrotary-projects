import { Exception } from "@adonisjs/core/build/standalone";
import { customErrorType } from "App/Utils/CommonTypes";

export default class CustomException
  extends Exception
  implements customErrorType
{
  errno: number | undefined;
  sqlMessage: string | undefined;
  sqlCode: string | undefined | number;
  constructor({ message, errno, code, sqlMessage }: customErrorType) {
    super(message, 500);
    this.errno = errno ?? undefined;
    this.sqlMessage = sqlMessage ?? undefined;
    this.sqlCode = code ?? undefined;
  }
}
