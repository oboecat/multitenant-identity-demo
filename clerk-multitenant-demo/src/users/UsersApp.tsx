import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { SignInWrapped } from "../components/SignInWrapped";
import { SplitLogoView } from "../views/SplitLogoView";
import { ClerkLoaded, SignedIn, SignedOut } from "@clerk/clerk-react";
import { MFAEnrollmentView } from "../components/MFAEnrollment";
import { SelectHost } from "./SelectHost";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <ProtectedAppRootLayout />,
    children: [
      {
        path: "/sign-in/select-host",
        element: <SelectHost />,
      },
      {
        path: "/sign-in/enroll-mfa",
        element: <MFAEnrollmentView redirectTo="/select-host" />,
      },
    ],
  },
]);

function ProtectedAppRootLayout() {
  return (
    <div className="App">
      <SplitLogoView>
        <SignedOut>
          <SignInWrapped
            redirectUrl={"https://users.clerkexample.com/sign-in/select-host"}
          />
        </SignedOut>
        <SignedIn>
          <Outlet />
        </SignedIn>
      </SplitLogoView>
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
