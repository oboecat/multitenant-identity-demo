import { UserButton, useOrganization } from "@clerk/clerk-react";
import { LogoView } from "./Logo";
import { useContext } from "react";
import { HostStyleContext } from "../utils/HostStyleProvider";

export function Header({ appDisplayName }: { appDisplayName: string }) {
  const { organization } = useOrganization();
  const hostStyle = useContext(HostStyleContext);

  const bgColor = hostStyle ? hostStyle.bgTheme : "bg-blue-600";

  return (
    <div className={`mast ${bgColor}`}>
      <header className="flex container mx-auto items-center h-16">
        <a className="inline-block" href="/">
          {hostStyle ? (
            <h1 className="text-white text-2xl font-bold tracking-wider">
              {hostStyle.displayName}
            </h1>
          ) : (
            <LogoView width={120} />
          )}
        </a>
        <div className="flex-grow"></div>
        {organization && (
          <h1 className="text-lg mx-5 p-2 my-3 text-white font-medium">
            {organization.name} | {appDisplayName}
          </h1>
        )}
        <UserButton />
      </header>
    </div>
  );
}
