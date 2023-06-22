import "../App.css";
import { ClerkLoaded, SignedIn, SignedOut } from "@clerk/clerk-react";
import { SignInMethod, SignInWrapped } from "../components/SignInWrapped";
import { OrganizationMode } from "../components/OrganizationControlComponents";
import { AccessControl } from "../components/AccessControl";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { WelcomeView } from "../views/WelcomeView";
import { ResidentLayout } from "./ResidentLayout";
import { getHostConfiguration } from "../utils/getHostConfiguration";
import { SplitLogoView } from "../views/SplitLogoView";
import { MFAEnrollmentView } from "../components/MFAEnrollment";
import { AccessDeniedCard } from "../components/AccessDeniedCard";
import { OwnerLayout } from "./OwnerLayout";
import { HostStyleContext } from "../utils/HostStyleProvider";
import { isInGroup } from "../utils/isInGroup";
import { useContext } from "react";

const host = window.location.host.split(".")[0];

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedAppRootLayout />,
    children: [
      {
        path: "/resident",
        element: (
          <OrganizationMode
            selectOrganization={(orgList) => {
              const found = orgList.find(({ membership }) =>
                isInGroup("resident", membership)
              );
              return found?.organization;
            }}
          >
            <AccessControl
              host={host}
              group="resident"
              accessDenied={<AccessDeniedCard />}
            >
              <ResidentLayout />
            </AccessControl>
          </OrganizationMode>
        ),
      },
      {
        path: "/owner",
        element: (
          <OrganizationMode
            selectOrganization={(orgList) => {
              const found = orgList.find(({ membership }) =>
                isInGroup("owner", membership)
              );
              return found?.organization;
            }}
          >
            <AccessControl
              host={host}
              group="owner"
              requiresMfa={getHostConfiguration(host).ownerMfaRequired}
              accessDenied={<AccessDeniedCard />}
            >
              <OwnerLayout />
            </AccessControl>
          </OrganizationMode>
        ),
      },
      {
        path: "/enroll-mfa",
        element: <MFAEnrollmentView redirectTo="/" />,
      },
    ],
  },
  {
    path: "/welcome",
    element: <WelcomeView host={host} />,
  },
]);

function ProtectedAppRootLayout() {
  const { signInAppearance } = useContext(HostStyleContext);
  const allowedProviders: SignInMethod[] = ["password", "apple", "google"];
  const location = useLocation();

  return (
    <div className="App">
      <SignedOut>
        <SplitLogoView>
          <SignInWrapped
            enabledSignInMethods={allowedProviders}
            redirectUrl={location.pathname}
            appearance={signInAppearance}
          />
        </SplitLogoView>
      </SignedOut>
      <SignedIn>
        <Outlet />
      </SignedIn>
    </div>
  );
}

function App() {
  return (
    <ClerkLoaded>
      <RouterProvider router={router} />
    </ClerkLoaded>
  );
}

export default App;
