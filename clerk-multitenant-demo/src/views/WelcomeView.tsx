import { useUser } from "@clerk/clerk-react";
import { Button } from "../components/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { SplitLogoView } from "./SplitLogoView";
import { InviteableGroup } from "../property-manager/InviteUserForm";
import { getHost } from "../utils/getHost";
import { MFAChallenge } from "../components/MFAChallenge";
import { getHostConfiguration } from "../utils/getHostConfiguration";
import { MFAEnrollment } from "../components/MFAEnrollment";
import {
  MultiStepSignInContext,
  MultiStepSignInProvider,
} from "../utils/MultiStepSignInProvider";

enum WelcomeFlowStatus {
  INITIAL = "initial",
  SHOULD_ENROLL_MFA = "should_enroll_mfa",
  SHOULD_COMPLETE_MFA_CHALLENGE = "should_complete_mfa_challenge",
  COMPLETE = "complete",
  ERROR = "error",
  LOADING = "loading",
}

export function WelcomeView({ host }: { host: string }) {
  return (
    <MultiStepSignInProvider>
      <InvitationSignIn host={host} />
    </MultiStepSignInProvider>
  );
}

export function InvitationSignIn({ host }: { host: string }) {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { status: signInStatus } = useContext(MultiStepSignInContext);
  const [acceptedInvitation, setAcceptedInvitation] = useState(false);

  const group = searchParams.get("group") as InviteableGroup;
  const redirectUrl = `/${group}`;

  const getCurrentStatus = useCallback(
    function computeCurrentStatus(): WelcomeFlowStatus {
      if (!acceptedInvitation) {
        return WelcomeFlowStatus.INITIAL;
      }
      if (acceptedInvitation && signInStatus === "needs_second_factor") {
        return WelcomeFlowStatus.SHOULD_COMPLETE_MFA_CHALLENGE;
      }
      if (!user) {
        return WelcomeFlowStatus.LOADING;
      } else {
        if (
          acceptedInvitation &&
          signInStatus === "complete" &&
          group === "owner" &&
          !user.twoFactorEnabled &&
          getHostConfiguration(host).ownerMfaRequired
        ) {
          return WelcomeFlowStatus.SHOULD_ENROLL_MFA;
        }
        if (acceptedInvitation && signInStatus === "complete") {
          return WelcomeFlowStatus.COMPLETE;
        }
      }
      return WelcomeFlowStatus.ERROR;
    },
    [acceptedInvitation, signInStatus, host, user]
  );
  const currentStatus = getCurrentStatus();

  useEffect(() => {
    if (currentStatus === WelcomeFlowStatus.COMPLETE) {
      navigate(redirectUrl);
    }
  }, [currentStatus]);

  return (
    <SplitLogoView>
      <div>
        {(() => {
          switch (currentStatus) {
            case WelcomeFlowStatus.INITIAL:
              return (
                <AcceptInvitation
                  onComplete={() => {
                    setAcceptedInvitation(true);
                  }}
                />
              );
            case WelcomeFlowStatus.SHOULD_COMPLETE_MFA_CHALLENGE:
              return <MFAChallenge />;
            case WelcomeFlowStatus.SHOULD_ENROLL_MFA:
                return <MFAEnrollment />;
            case WelcomeFlowStatus.LOADING:
                return (
                    <div>
                        Loading....
                    </div>
                );
            case WelcomeFlowStatus.ERROR:
                return (
                    <div className="container max-w-md bg-white mx-auto my-5 p-3 rounded">
                        <h3>Error</h3>
                        <p>An unexpected error occurred!</p>
                    </div>
                );
            default:
                return <div></div>;
          }
        })()}
      </div>
    </SplitLogoView>
  );
}

export function AcceptInvitation({ onComplete }: { onComplete: () => void }) {
  const [searchParams, _] = useSearchParams();
  const { submitTicket } = useContext(MultiStepSignInContext);
  const [isSubmitting, updateIsSubmitting] = useState(false);

  const ticket = searchParams.get("ticket");
  const group = searchParams.get("group") as InviteableGroup;
  const host = getHost();

  if (!group || !ticket || !host) {
    return (
      <div className="container max-w-md bg-white mx-auto my-5 p-3 rounded-xl drop-shadow-xl">
        <h3>Error</h3>
        <p>
          There may have been an error or your welcome URL is malformed. Please
          contact your admin.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-md bg-white mx-auto my-5 p-6 rounded-xl drop-shadow-xl">
      <h3 className="text-3xl">Welcome!</h3>
      <hr />
      <div className="my-3">
        <p>
          Transylvania Ave has invited you to join as{" "}
          {group === "resident" ? "a resident" : "an owner"} and manage all your
          home with Capsule. Before continuing please review the{" "}
          <a
            className="text-blue underline"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          >
            terms and conditions
          </a>{" "}
          and the{" "}
          <a
            className="text-blue underline"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          >
            privacy policy
          </a>{" "}
        </p>
      </div>
      <div className="my-4">
        <p>
          If you have any questions or trouble signing in, please reach out to
          your host.
        </p>
      </div>
      <Button
        disabled={isSubmitting}
        onClick={async () => {
          updateIsSubmitting(true);
          await submitTicket(ticket);
          updateIsSubmitting(false);
          onComplete();
        }}
      >
        Continue
      </Button>
    </div>
  );
}
