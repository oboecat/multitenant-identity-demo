import { Header } from "../components/Header";

const links = [
  {
    label: "🏠 Home",
  },
  {
    label: "📒 Statements",
  },
  {
    label: "📄 Documents",
  },
  {
    label: "💰 Payments",
  },
];

export function OwnerLayout() {
  return (
    <div>
      <Header appDisplayName="Owner Portal" />
      <div className="container mx-auto">
        <h1 className="text-3xl p-2 my-3">Your Owner Portal | 8481 Transylvania Ave.</h1>
        <div className="w-full flex">
          <div className="vertical-navigation w-3/12 my-3 mr-3">
            <nav className="bg-white rounded-lg">
              <ul>{links.map((link) => AppLinkView(link))}</ul>
            </nav>
          </div>
          <div className="actual-app-view w-9/12 my-3 rounded-lg bg-white">
            <p className="my-3 p-3">
              You have no service requests, payments due, or community events. Have a peaceful day!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppLinkView(link: { label: string }) {
  return (
    <li key={link.label}>
      <a
        className="p-2 inline-block hover:text-blue-400 active:text-blue-900"
        href="#"
      >
        {link.label}
      </a>
    </li>
  );
}
