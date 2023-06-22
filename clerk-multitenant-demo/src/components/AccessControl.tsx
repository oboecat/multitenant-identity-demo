import { useOrganization, useOrganizationList, useUser } from "@clerk/clerk-react";
import { PropsWithChildren } from "react";

export type Host = string
export type Group = "property_manager" | "owner" | "resident" | "vendor"

export function AccessControl({ host, group, accessDenied, requiresMfa = false, children }: PropsWithChildren<{
    host?: Host
    group: Group
    requiresMfa?: boolean
    accessDenied: JSX.Element
}>) {
    const { user } = useUser();
    const { organization, membership } = useOrganization();
    const { isLoaded } = useOrganizationList();

    if (!user || !isLoaded) {
        return <></>;
    }

    if (requiresMfa && !user.twoFactorEnabled) {
        console.error("Need MFA not set");
        return accessDenied;
    }

    let groups: string[] | null = null;
    try {
        if (typeof membership!.publicMetadata.groups === "string") {
            groups = JSON.parse(
                membership!.publicMetadata.groups as string
            ) as string[];
        } else {
            groups = membership!.publicMetadata.groups as string[]
        }
    } catch (e) {
        console.error("Failed to parse Groups");
    }

    // user should belong to a group
    if (!groups) {
        console.error("No Groups");
        return accessDenied;
    }

    if (host) {
        console.error("Host found");
        if (organization!.slug !== host) {
            console.error("Host != Slug");
            return accessDenied;
        }
    }

    if (!groups.includes(group)) {
        console.error("Groups not included", groups, group);
        return accessDenied;
    }

    console.info("Granted");
    return <>{children}</>;
}