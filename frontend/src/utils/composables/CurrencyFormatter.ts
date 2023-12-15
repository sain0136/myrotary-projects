import { ref, computed, reactive } from "vue";
import Dinero from "dinero.js";
import { CustomErrors } from "@/utils/classes/CustomErrors";

const currencyFormatterFunding = (amountInCents: number) => {
  // Should come in as cents already
  const dineroAmount = Dinero({ amount: amountInCents });
  return dineroAmount.toFormat("$0,0.00");
};
const convertCentsToFloat = (amountInCents: number) => {
  return Number((amountInCents / 100).toFixed(2));
};
const convertFloatToCents = (amountInFloat: number | string) => {
  let parsedFloat = parseFloat(amountInFloat.toString());
  parsedFloat = Math.trunc(parsedFloat);
  parsedFloat = parseFloat(parsedFloat.toFixed(2)) * 100;
  const dineroAmount = Dinero({ amount: parsedFloat });
  const amountInCents = dineroAmount.getAmount();
  if (amountInCents || amountInCents === 0) {
    return amountInCents;
  } else {
    throw new CustomErrors(900, "Failed conversion ", {
      en: "Failed conversion, contact support and try again later",
      fr: "Echec de conversion, contactez le support et reessayez plus tard",
    });
  }
};
export const useCurrencyFormatter = () => {
  return {
    currencyFormatterFunding,
    convertCentsToFloat,
    convertFloatToCents,
  };
};
