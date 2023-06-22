import { useOrganizationList } from "@clerk/clerk-react";

export function SelectHost() {
  const { isLoaded, organizationList, setActive } = useOrganizationList();

  if (!isLoaded) {
    return <></>;
  }

  const appsList = organizationList.flatMap(({ organization, membership }) => {
    const groups = membership.publicMetadata["groups"] as string[];
    return groups.map((group) => ({ organization, group }));
  });

  return (
    <div>
      <div className="container max-w-md mx-auto my-5 p-6 bg-white rounded-xl drop-shadow-xl">
        <h3 className="text-3xl mb-3">Your Applications</h3>
        <hr />
        <div className="my-3">
          <ul>
            {appsList.map(({ organization, group }) => (
              <li key={organization.id}>
                <div className="py-2">
                  <a
                    href={`https://${organization.slug}.clerkexample.com/${group}`}
                  >
                    <AppListItem hostName={organization.name} appName={appNamesMap[group]} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AppListItem({hostName, appName}: { hostName: string, appName: string }) {
  return (
    <div className="flex w-full border p-3 rounded-md">
        <p className="text-lg w-44">{appName}</p>
        <p className="text-lg">{hostName}</p>
        <div className="flex-grow" />
        <p className="text-lg ml-5">{">"}</p>
    </div>
  );
}

const appNamesMap: { [key: string]: string } = {
  resident: "Resident Portal",
  owner: "Owner Portal",
};
