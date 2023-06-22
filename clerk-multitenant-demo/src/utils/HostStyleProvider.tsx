import { Theme as SignInTheme } from '@clerk/types';
import { PropsWithChildren, createContext } from "react";

export const HostStyleContext = createContext<HostStyle>(
  null as unknown as HostStyle
);

export interface HostStyle {
  bgTheme: string;
  displayName: string;
  signInAppearance: SignInTheme
}

export function HostStyleProvider({ host, children }: PropsWithChildren<{ host: string }>) {
  const style = hostStyleMap[host];
  return (
    <HostStyleContext.Provider value={style}>{children}</HostStyleContext.Provider>
  );
}

const hostStyleMap: { [key: string]: HostStyle } = {
  "acme-communities": {
    displayName: "Acme Communities",
    bgTheme: "bg-[#a0322a]",
    signInAppearance: {
      variables: {
        colorPrimary: "#ba321c"
      }
    }
  },
  "globex": {
    displayName: "Globex",
    bgTheme: "bg-[#0f1d3b]",
    signInAppearance: {
      variables: {
        colorPrimary: "#1d61b5"
      }
    }
  },
};
