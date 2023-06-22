import { useContext, useEffect, useState } from "react";
import { Button } from "./Button";
import { SplitLogoView } from "../views/SplitLogoView";
import { useNavigate } from "react-router-dom";
import { MultiStepSignInContext } from "../utils/MultiStepSignInProvider";

export function MFAChallengeView({ redirectTo }: { redirectTo?: string }) {
  return (
    <SplitLogoView>
      <MFAChallenge redirectTo={redirectTo} />
    </SplitLogoView>
  );
}

export function MFAChallenge({ redirectTo }: { redirectTo?: string }) {
  const navigate = useNavigate();
  const {
    status,
    availableSecondFactors,
    send2faChallenge,
    verify2faCredential,
  } = useContext(MultiStepSignInContext);
  const [didAutoSendCode, updateDidAutoSendCode] = useState(false);

  useEffect(() => {
    let timer = -1;
    function startTimer() {
      timer = setTimeout(
        () => {
          if (status === "needs_second_factor" && !didAutoSendCode) {
            updateDidAutoSendCode(true);
            sendOtp();
          }
        },
        100,
        0
      );
    }
    function cancel() {
      if (timer !== -1) {
        clearTimeout(timer);
        timer = -1;
      }
    }
    startTimer();
    return () => {
      cancel();
    };
  }, [status, didAutoSendCode]);

  if (status !== "needs_second_factor") {
    return <></>;
  }

  // Force Downcast.
  const secondFactor = availableSecondFactors[0] as {
    strategy: "phone_code";
    phoneNumberId: string;
    safeIdentifier: string;
  };
  const { phoneNumberId, safeIdentifier, strategy } = secondFactor;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const { otp } = Object.fromEntries(formData.entries()) as {
      otp: string;
    };
    await handleSubmitOtp(otp);
  }

  async function sendOtp() {
    if (status !== "needs_second_factor") {
      return;
    }
    await send2faChallenge({ phoneNumberId });
  }

  async function handleSubmitOtp(otp: string) {
    if (status !== "needs_second_factor") {
      return;
    }
    const result = await verify2faCredential({ strategy, code: otp });
    if (result === "failed") {
      return;
    }
    if (redirectTo) {
      navigate(redirectTo);
    }
  }

  return (
    <div className="bg-white p-10 pb-8 rounded-xl drop-shadow-xl m-4 max-w-md">
      <form onSubmit={handleSubmit}>
        <h1 className="text-lg text-center">Perform 2-Factor Verification</h1>
        <p className="my-5 text-sm">
          To ensure your security, we will perform 2fa as your settings require
        </p>
        <div className="my-3">
          <label className="text-xs uppercase font-medium my-2">
            Phone Number
          </label>
          <div className="w-full rounded border border-gray-300 bg-gray-50 text-sm p-2">
            {safeIdentifier}
          </div>
        </div>
        <div className="my-3">
          <label className="text-xs uppercase font-medium my-2">
            Verification Code
          </label>
          <input
            className="w-full rounded border border-gray-900 text-lg p-2"
            name="otp"
            required={true}
            inputMode="numeric"
            placeholder="Enter your one-time verification code"
          />
        </div>
        <div className="mt-6 mb-2">
          <Button type="submit">Verify</Button>
          <p className="mt-10 text-sm text-gray-800">
            Didn't receive a code?{" "}
            <button
              className="text-blue-700 underline font-medium"
              onClick={sendOtp}
            >
              Resend
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
