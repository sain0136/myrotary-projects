import { ref, computed, reactive } from "vue";
import Dinero from "dinero.js";

const currencyFormatterFunding = (amountInCents: number) => {
  // Should come in as cents already
  const dineroAmount = Dinero({ amount: amountInCents });
  return dineroAmount.toFormat("$0,0.00");
};

export const useCurrencyFormatter = () => {
  return {
    currencyFormatterFunding,
  };
};
