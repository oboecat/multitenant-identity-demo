import { InviteableGroupDropdown } from "./InviteableGroupDropdown";
import { Group } from "../components/AccessControl";
import { useState } from "react";
import { Button } from "../components/Button";
import { useAuth, useOrganization } from "@clerk/clerk-react";

export type InviteableGroup = Exclude<Group, "property_manager" | "vendor">;

export function InviteUserForm() {
  const { organization } = useOrganization();
  const { getToken } = useAuth();
  const [groupSelection, setGroupSelection] =
  useState<InviteableGroup>("resident");
  const [submitting, updateSubmitting] = useState(false);
  const [error, updateError] = useState<Error | null>(null);

  async function handleSubmitInvitation(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!organization) {
        return;
      }
      updateSubmitting(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const { email, group } = Object.fromEntries(formData.entries()) as {
        email: string;
        group: InviteableGroup;
      };

      const data = {
        email,
        group,
        host: organization.slug,
        orgId: organization.id,
      };

      const accessToken = await getToken();
      if (!accessToken) {
        throw new Error("Unable to get access token");
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      updateSubmitting(false);
    } catch (e) {
      updateError(e as Error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmitInvitation} className="p-2">
        {!!error && <p className="bg-red-400 p-1">Error: {error.message}</p>}
        <div className="my-2">
          <label className="block">Email</label>
          <input
            className="w-full rounded border-2 border-black p-2"
            name="email"
            required={true}
            inputMode="email"
            placeholder="joe@example.org"
          />
        </div>
        <div className="my-2">
          <label className="block">Role</label>
          <InviteableGroupDropdown
            selection={groupSelection}
            onSelect={(group) => setGroupSelection(group)}
          />
        </div>
        <div className="my-2">
          <Button disabled={submitting} type="submit">
            📧 Send Invite
          </Button>
        </div>
      </form>
    </div>
  );
}
