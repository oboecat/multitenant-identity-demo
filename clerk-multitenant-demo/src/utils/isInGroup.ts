import { OrganizationMembershipResource } from "@clerk/types";
import { Group } from "../components/AccessControl";

export function isInGroup(group: Group, orgMembership: OrganizationMembershipResource) {
    const groups = orgMembership.publicMetadata["groups"] as string[] | undefined;
    if (!groups) {
        return false;
    }
    return groups.includes(group);
}