import { OrganizationMembershipResource, OrganizationResource } from "@clerk/types";
import { useOrganization, useOrganizationList } from "@clerk/clerk-react";
import { PropsWithChildren, useEffect, useState } from "react";

export type OrganizationId = string;

export function OrganizationMode({selectOrganization = selectDefaultOrg, children}: PropsWithChildren<{ 
    selectOrganization?: (organizationList: {
        membership: OrganizationMembershipResource;
        organization: OrganizationResource;
    }[]) => OrganizationResource | undefined
}>) {
    return (
        <div>
            <InOrganizationMode>
                {children}
            </InOrganizationMode>
            <NotInOrganizationMode>
                <AssumeOrganization selectOrganization={selectOrganization} />
            </NotInOrganizationMode>
        </div>
    );
}

export function AssumeOrganization({ selectOrganization = selectDefaultOrg }: { 
    selectOrganization?: (organizationList: {
        membership: OrganizationMembershipResource;
        organization: OrganizationResource;
    }[]) => OrganizationResource | undefined
}) {
    const { setActive, organizationList, isLoaded } = useOrganizationList();
    
    useEffect(() => {
        if (isLoaded && organizationList?.length) {
            const selectedOrg = selectOrganization(organizationList) || selectDefaultOrg(organizationList);
            setActive({ organization: selectedOrg.id });
        }
    }, [setActive, organizationList, isLoaded]);

    return <></>;
}

export function InOrganizationMode({ children }: PropsWithChildren) {
    const { isLoaded, organization } = useOrganization()

    if (!isLoaded) {
        return <></>
    }

    if (organization === null) {
        return <></>
    }

    return <>{children}</>
}

export function NotInOrganizationMode({ children }: PropsWithChildren) {
    const { isLoaded, organization } = useOrganization()

    if (!isLoaded) {
        return <></>
    }

    if (organization !== null) {
        return <></>
    }

    return <>{children}</>
}

function selectDefaultOrg(organizationList: {
    membership: OrganizationMembershipResource;
    organization: OrganizationResource;
}[]) {
    return organizationList[0].organization;
}
