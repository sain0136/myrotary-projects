import { useLoggedInUserStore } from "@/stores/LoggedInUser";

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
