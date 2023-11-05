import type { ToastMessageOptions } from "primevue/toast";
import { reactive, ref } from "vue";

type Severity = "success" | "info" | "warn" | "error" | undefined;
type toastLength = "5000" | "3000" | "1000";

const refCounter = ref(0);
const toastRecord = reactive({
  severity: "success",
  summary: "",
  detail: "",
  life: 3000,
} as ToastMessageOptions);

/**
 * Handles the display of a toast message with the specified severity, summary, detail, and life duration.
 *
 * @param {Severity} severity - The severity level of the toast message.
 * @param {string} summary - The summary text of the toast message.
 * @param {string} detail - The detailed text of the toast message.
 * @param {number} life - The duration in milliseconds that the toast message should be displayed.
 */
const handleToast = (
  severity: Severity,
  summary: string,
  detail: string,
  life: toastLength
) => {
  // `refCounter` is designed to force a re-render when the toast is displayed.
  refCounter.value = refCounter.value + 1;
  const lifeConversion = Number(life);
  toastRecord.severity = severity;
  toastRecord.summary = summary;
  toastRecord.detail = detail;
  toastRecord.life = lifeConversion;
};

export const toastHandler = () => {
  return {
    handleToast,
    toastRecord,
    refCounter,
  };
};
