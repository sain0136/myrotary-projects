import type { ProjectStatus } from "@/utils/types/commonTypes";

import type { lang } from "@/utils/languages/UseLanguage";
import { useLanguage } from "@/utils/languages/UseLanguage";

export const translatedStatus: Record<ProjectStatus, Record<lang, string>> = {
  "Looking For Funding": {
    en: "Looking For Funding",
    fr: "En recherche de financement",
  },
  "Fully Funded": {
    en: "Fully Funded",
    fr: "Financement complet",
  },
  Completed: {
    en: "Completed",
    fr: "Termine",
  },
  Approved: {
    en: "Approved",
    fr: "Approuve",
  },
  "Pending Approval": {
    en: "Pending Approval",
    fr: "En attente d'approbation",
  },
  "Reports Due": {
    en: "Reports Due",
    fr: "Rapports à rendre",
  },
};


