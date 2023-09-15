
export type customErrorType = {
    message: string;
    errno?: number;
    sqlMessage?: string;
    sqlCode?: string | number;
    code?: number | string;
};