import router from "@/router";
import { useLoggedInClub } from "@/stores/LoggedInClub";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import {
  grantType,
  projectStatus,
  type ProjectStatus,
} from "@/utils/types/commonTypes";
const userStore = useLoggedInUserStore();
const districtStore = useLoggedInDistrict();
const clubStore = useLoggedInClub();
export const hideAprovalTab = (projectId: number | null) => {
  if (!projectId) {
    return true;
  }
  if (
    useLoggedInUserStore().loggedInUser.role !== "District Grants Chair" &&
    useLoggedInUserStore().loggedInUser.role !== "District Admin"
  ) {
    return true;
  }
  return false;
};

export const logoutUser = () => {
  router.push({ name: "Home" });
  userStore.logOut();
  districtStore.resetDistrict();
  clubStore.resetClub();
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
