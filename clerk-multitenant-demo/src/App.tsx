import "./App.css";
import PropertyManagerApp from "./property-manager/PropertyManagerApp";
import HostPortalApp from "./host-portal/HostPortalApp";
import UsersApp from "./users/UsersApp";
import { getHost } from "./utils/getHost";
import { HostStyleProvider } from "./utils/HostStyleProvider";

function App() {
  const host = getHost();
  return (
    <>
      {host && host === "users" && <UsersApp />}
      {host && host !== "users" &&
        <HostStyleProvider host={host}>
          <HostPortalApp />
        </HostStyleProvider>}
      {!host && <PropertyManagerApp />}
    </>
  );
}

export default App;
