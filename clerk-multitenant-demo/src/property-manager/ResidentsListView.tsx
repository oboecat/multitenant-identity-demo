import { useState } from "react";
import { Button, SmallButton } from "../components/Button";
import { Dialog } from "@headlessui/react";
import { InviteUserForm } from "./InviteUserForm";

export function ResidentsListView() {
  const [inviteModalIsOpen, updateInviteModalIsOpen] = useState(false);

  return (
    <div>
      <header className="p-3">
        <h3 className="text-xl">Residents</h3>
        <form action="#" className="flex space-x-2">
          <div className="flex-grow">
            <input
              className="p-2 w-full border-black border-2 rounded"
              placeholder="Search for Residents Larry Otter"
              type="search"
            />
          </div>
          <Button>🔎 Search</Button>
          <Button onClick={() => updateInviteModalIsOpen(true)}>➕ Invite</Button>
        </form>
      </header>
      <Dialog
        as="div"
        className="absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
        open={inviteModalIsOpen}
        onClose={() => updateInviteModalIsOpen(false)}
      >
        <Dialog.Panel className="bg-white p-2 rounded-lg">
          <Dialog.Title>Invite New Resident</Dialog.Title>
          <InviteUserForm />
        </Dialog.Panel>
      </Dialog>
      <main className="p-3">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Unit</th>
              <th className="text-left">Name</th>
              <th className="text-left">Resident Since</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-left p-2">110</td>
              <td>Jessica Smith</td>
              <td>Dec 2022</td>
              <td>
                <div className="space-x-2">
                  <SmallButton>📧</SmallButton>
                  <SmallButton>👩🏻‍⚖️</SmallButton>
                  <SmallButton>🚚</SmallButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
