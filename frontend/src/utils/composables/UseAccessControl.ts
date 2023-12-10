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
  | "approvals-view"
  | "superadmin-view"
  | "approve-projects"
  | "approve-projects-reports";

export type AllUserRoles = DistrictRole | ClubRole | "SuperAdmin";

// Use a mapped type to define RolePermissions
type RolePermissions = {
  [Role in AllUserRoles]: PermissionTypes[];
};

const rolePermissions: RolePermissions = {
  // Define permissions for each role here
  SuperAdmin: [
    "webadmin-settings-view",
    "webadmin-club-settings-view",
    "webadmin-district-settings-view",
    "myprofile-view",
    "myprojects-view",
    "approvals-view",
    "superadmin-view",
  ],
  Webmaster: [
    "webadmin-settings-view",
    "webadmin-club-settings-view",
    "webadmin-district-settings-view",
    "myprofile-view",
    "myprojects-view",
    "approvals-view",
    "approve-projects",
    "approve-projects-reports",
  ],
  "District Admin": [
    "myprofile-view",
    "districtadmin-district-settings-view",
    "districtadmin-clubadmin-view",
    "myprojects-view",
    "approvals-view",
    "approve-projects",
    "approve-projects-reports",
  ],
  "District Grants Chair": [
    "myprofile-view",
    "myprojects-view",
    "approvals-view",
    "approve-projects",
    "approve-projects-reports",
  ],
  "District Foundations Chair": [
    "myprofile-view",
    "myprojects-view",
    "approvals-view",
  ],
  "District Stewardship": [
    "myprofile-view",
    "myprojects-view",
    "approvals-view",
    "approve-projects-reports",
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
