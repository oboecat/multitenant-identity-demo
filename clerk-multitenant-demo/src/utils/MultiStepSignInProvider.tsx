import { useSignIn } from "@clerk/clerk-react";
import {
  SignInStatus,
  SignInSecondFactor,
  AttemptSecondFactorParams,
} from "@clerk/types";
import { PropsWithChildren, createContext, useCallback, useState } from "react";

export interface MultiStepSignIn {
  status: SignInStatus | null;
  availableSecondFactors: SignInSecondFactor[];
  submitTicket: (ticket: string) => Promise<void>;
  send2faChallenge: ({
    phoneNumberId,
  }: {
    phoneNumberId: string;
  }) => Promise<void>;
  verify2faCredential: (
    params: AttemptSecondFactorParams
  ) => Promise<"success" | "failed">;
}

export const MultiStepSignInContext = createContext<MultiStepSignIn>(
  undefined as unknown as MultiStepSignIn
);

export function MultiStepSignInProvider({ children }: PropsWithChildren) {
  const { signIn, setActive } = useSignIn();
  const [status, updateStatus] = useState(signIn!.status);
  const [availableSecondFactors, updateAvailableSecondFactors] = useState(
    signIn!.supportedSecondFactors
  );

  const submitTicket = useCallback(
    async (ticket: string) => {
      const next = await signIn!.create({ strategy: "ticket", ticket });

      updateStatus(next.status);
      updateAvailableSecondFactors(next.supportedSecondFactors);
      setActive!({ session: next.createdSessionId });
    },
    [updateStatus, updateAvailableSecondFactors, signIn, setActive]
  );

  const send2faChallenge = useCallback(
    async ({ phoneNumberId }: { phoneNumberId: string }) => {
      const next = await signIn!.prepareSecondFactor({
        strategy: "phone_code",
        phoneNumberId,
      });

      updateStatus(next.status);
      updateAvailableSecondFactors(next.supportedSecondFactors);
    },
    [updateStatus, updateAvailableSecondFactors, signIn]
  );

  const verify2faCredential = useCallback(
    async (params: AttemptSecondFactorParams) => {
      const next = await signIn!.attemptSecondFactor(params);

      updateStatus(next.status);
      updateAvailableSecondFactors(next.supportedSecondFactors);

      console.log(next);

      if (next.status !== "complete") {
        return "failed";
      }
      setActive!({ session: next.createdSessionId });
      return "success";
    },
    [updateStatus, updateAvailableSecondFactors, signIn]
  );

  return (
    <MultiStepSignInContext.Provider
      value={{
        status,
        availableSecondFactors,
        submitTicket,
        send2faChallenge,
        verify2faCredential,
      }}
    >
      {children}
    </MultiStepSignInContext.Provider>
  );
}
