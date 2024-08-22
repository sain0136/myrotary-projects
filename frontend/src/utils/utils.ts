import router from "@/router";
import { useLoggedInClub } from "@/stores/LoggedInClub";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import {
  projectStatus,
  type IAreaOfFocus,
  type ProjectStatus,
} from "@/utils/types/commonTypes";
import ResourceList from "@/utils/classes/ResourceList";
import { useLanguage } from "@/utils/languages/UseLanguage";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { CustomErrors } from "@/utils/classes/CustomErrors";

// Initialize stores and other dependencies
const userStore = useLoggedInUserStore();
const districtStore = useLoggedInDistrict();
const clubStore = useLoggedInClub();
const { languagePref } = useLanguage();
const { handleError } = errorHandler();

export const hideAprovalTab = (projectId: number | null) => {
  if (!projectId) {
    return true;
  }
  if (
    userStore.loggedInUser.role !== "District Grants Chair" &&
    userStore.loggedInUser.role !== "District Admin"
  ) {
    return true;
  }
  return false;
};

export const logoutUser = async (route = "UserLogin") => {
  try {
    await districtStore.resetDistrict();
    await clubStore.resetClub();
    router.push({ name: route });
    await userStore.logOut();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

export const projectDisabledStatus = (status: ProjectStatus): boolean => {
  if (
    status !== projectStatus.LOOKINGFORFUNDING &&
    status !== projectStatus.FULLYFUNDED &&
    status !== projectStatus.PENDINGAPPROVAL
  ) {
    return true;
  }
  return false;
};

export const loggedInRoleForAccessControl = (): string => {
  if (
    userStore.loggedInUser.user_id === 2 ||
    userStore.loggedInUser.user_id === 10
  ) {
    return "Webmaster";
  } else if (userStore.loggedInUser.user_type === "SUPER") {
    return "SuperAdmin";
  } else if (userStore.loggedInUser.role) {
    return userStore.loggedInUser.role;
  } else {
    return "guest";
  }
};

export const processAreaOfFocus = (areaFocus: IAreaOfFocus) => {
  const procesessedAreaFocus = [];
  const processerMap = ResourceList.reverseTermConversionMap();
  for (const [key, value] of Object.entries(areaFocus)) {
    let i;
    if (languagePref.value === "en") {
      i = processerMap.get(key)?.en ?? key;
    } else {
      i = processerMap.get(key)?.fr ?? key;
    }
    procesessedAreaFocus.push({
      key: key,
      label: i,
      value: value,
      imgLink: processerMap.get(key)?.imgLink,
    });
  }
  return procesessedAreaFocus;
};
