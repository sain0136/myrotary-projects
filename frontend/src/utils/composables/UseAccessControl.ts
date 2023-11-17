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
  | "myprojects-view"
  | "districtadmin-clubadmin-view"
  | "approvals-view";

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
    "myprojects-view",
    "approvals-view",
  ],
  "District Admin": [
    "myprofile-view",
    "districtadmin-district-settings-view",
    "districtadmin-clubadmin-view",
    "myprojects-view",
    "approvals-view",
  ],
  "District Grants Chair": [
    "myprofile-view",
    "myprojects-view",
    "approvals-view",
  ],
  "District Foundations Chair": [
    "myprofile-view",
    "myprojects-view",
    "approvals-view",
  ],
  "District International Chair": [
    "myprofile-view",
    "myprojects-view",
    "approvals-view",
  ],
  "Club Admin": [
    "myprojects-view",
    "myprofile-view",
    "clubadmin-club-settings-view",
    "clubadmin-clubmembers-view",
  ],
  "Standard Member": ["myprofile-view", "myprojects-view"],
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
