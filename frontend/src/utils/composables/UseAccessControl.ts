import { ref, computed } from "vue";
import type { ClubRole, DistrictRole } from "@/utils/types/commonTypes";

type PermissionTypes =
  | "webadmin-settings-view"
  | "webadmin-district-settings-view"
  | "webadmin-club-settings-view"
  | "myprofile-view"
  | "districtadmin-district-settings-view"
  | "clubadmin-club-settings-view"
  | "clubadmin-clubmembers-view"
  | "districtadmin-clubadmin-view";

export type AllUserRoles = DistrictRole | ClubRole;

// Use a mapped type to define RolePermissions
type RolePermissions = {
  [Role in AllUserRoles]: PermissionTypes[];
};

const rolePermissions: RolePermissions = {
  // Define permissions for each role here
  Webmaster: [
    "webadmin-settings-view",
    "webadmin-club-settings-view",
    "webadmin-district-settings-view",
    "myprofile-view",
  ],
  "District Admin": [
    "myprofile-view",
    "districtadmin-district-settings-view",
    "districtadmin-clubadmin-view",
  ],
  "District Grants Chair": ["myprofile-view"],
  "District Foundations Chair": ["myprofile-view"],
  "District International Chair": ["myprofile-view"],
  "Club Admin": [
    "myprofile-view",
    "clubadmin-club-settings-view",
    "clubadmin-clubmembers-view",
  ],
  "Standard Member": ["myprofile-view"],
  Guest: [],
};

const hasAccess = (
  userRole: AllUserRoles,
  requiredPermission: PermissionTypes
): boolean => {
  const userPermissions = rolePermissions[userRole] || [];
  const hasPermission = userPermissions.includes(requiredPermission);
  return hasPermission;
};

export const useAccessControl = () => {
  return {
    hasAccess,
  };
};
