import { ref, computed, reactive } from "vue";

const formatter = reactive(
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
);
const currencyFormatterFunding = (amount: number) => {
  return formatter.format(amount);
};

export const useCurrencyFormatter = () => {
  return {
    currencyFormatterFunding,
  };
};
