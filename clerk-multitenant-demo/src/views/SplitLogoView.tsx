import { PropsWithChildren, useContext } from "react";
import { LogoView } from "../components/Logo";
import { HostStyleContext } from "../utils/HostStyleProvider";

export function SplitLogoView({ children }: PropsWithChildren) {
  const hostStyle = useContext(HostStyleContext);

  const splashColor = hostStyle
    ? hostStyle.bgTheme
    : "bg-blue-600";

  return (
    <div className="grid grid-cols-2 w-screen h-screen">
      <div className={`h-full flex items-center justify-center ${splashColor}`}>
        {hostStyle ? (
            <h1 className="text-white text-5xl font-bold tracking-wider ">
                {hostStyle.displayName}
            </h1>
        )
        : <LogoView width={240} />}
      </div>
      <div className="h-full flex items-center justify-center relative">
        <div className="absolute w-full top-0 h-full left-0 z-0 bg-cover bg-[url('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80')]"></div>
        <div className="z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
