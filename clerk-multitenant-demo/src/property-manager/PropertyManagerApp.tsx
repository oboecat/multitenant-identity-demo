import "../App.css";
import { ClerkLoaded, SignedIn, SignedOut } from "@clerk/clerk-react";
import { SignInMethod, SignInWrapped } from "../components/SignInWrapped";
import { OrganizationMode } from "../components/OrganizationControlComponents";
import { AccessControl } from "../components/AccessControl";
import { AdminLayout } from "./AdminLayout";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ResidentsListView } from "./ResidentsListView";
import { MFAEnrollmentView } from "../components/MFAEnrollment";
import { SplitLogoView } from "../views/SplitLogoView";
import { AccessDeniedCard } from "../components/AccessDeniedCard";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <ProtectedAppRootLayout />
    ),
    children: [
      {
        path: "/admin",
        element: (
          <AccessControl
            group="property_manager"
            // requiresMfa={true}
            accessDenied={<AccessDeniedCard />}
          >
            <AdminLayout />
          </AccessControl>
        ),
        children: [
          {
            path: "/admin/residents",
            element: <ResidentsListView />,
          },
        ],
      },
      {
        path: "/enroll-mfa",
        element: <MFAEnrollmentView redirectTo="/admin/residents" />,
      },
    ],
  },
]);

function ProtectedAppRootLayout() {
  const allowedProviders: SignInMethod[] = ["password"];

  return (
    <div className="App">
      <SignedOut>
        <SplitLogoView>
          <SignInWrapped
            enabledSignInMethods={allowedProviders}
            redirectUrl={"/admin/residents"}
          />
        </SplitLogoView>
      </SignedOut>
      <SignedIn>
        <OrganizationMode>
          <Outlet />
        </OrganizationMode>
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
