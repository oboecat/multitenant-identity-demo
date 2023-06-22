import { PhoneNumberResource } from "@clerk/types";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { Button } from "./Button";
import { SplitLogoView } from "../views/SplitLogoView";
import { useNavigate } from "react-router-dom";

export function MFAEnrollmentView({ redirectTo }: { redirectTo?: string }) {
    return (
        <SplitLogoView>
            <MFAEnrollment redirectTo={redirectTo} />
        </SplitLogoView>
    );
}

export function MFAEnrollment({ redirectTo }: { redirectTo?: string }) {
    const navigate = useNavigate();
    const { user } = useUser();
    const [phoneNumberResource, updatePhoneNumberResource] =
        useState<PhoneNumberResource | null>(null);
    
    const hasPhoneNumberResource = phoneNumberResource !== null;

    if (!user) {
        return <></>;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        if (!hasPhoneNumberResource) {
            const { phoneNumber } = Object.fromEntries(formData.entries()) as {
                phoneNumber: string
            };
            await handleSubmitPhone(phoneNumber);
        } else {
            const { otp } = Object.fromEntries(formData.entries()) as {
                otp: string
            };
            await handleSubmitOtp(otp);
        }
    }

    async function handleSubmitPhone(phoneNumber: string) {
        if (!user) {
            return;
        }
        const resource = await user.createPhoneNumber({ phoneNumber });
        await resource.prepareVerification();
        updatePhoneNumberResource(resource);
    }

    async function handleSubmitOtp(otp: string) {
        if (!user || !phoneNumberResource) {
            return;
        }
        const resource = await phoneNumberResource.attemptVerification({ code: otp });
        if (resource.verification.status !== "verified") {
            return;
        }
        await resource.setReservedForSecondFactor({ reserved: true });
        updatePhoneNumberResource(resource);
        if (redirectTo) {
            navigate(redirectTo);
        }
    }

    return (
        <div className="bg-white p-10 pb-8 rounded-xl drop-shadow-xl m-4 max-w-md">
            <form onSubmit={handleSubmit}>
                <h1 className="text-lg text-center">Enable 2-Factor Verification</h1>
                <p className="my-5 text-sm">
                    To protect your account, your admin has required you to enable 2-factor verification. Register a phone number to receive a secure code.
                </p>
                <div className="my-3">
                    <label className="text-xs uppercase font-medium my-2">
                        Phone Number
                    </label>
                    {hasPhoneNumberResource ? (
                        <div className="w-full rounded border border-gray-300 bg-gray-50 text-sm p-2">
                            {phoneNumberResource.phoneNumber}
                        </div>
                    )
                    : (
                        <input
                            className="w-full rounded border border-gray-900 text-lg p-2"
                            name="phoneNumber"
                            required={true}
                            inputMode="tel"
                            disabled={hasPhoneNumberResource}
                            placeholder="+1234..."
                        />
                    )}
                </div>
                {hasPhoneNumberResource && (
                    <div className="my-3">
                        <label className="text-xs uppercase font-medium my-2">
                            Verification Code
                        </label>
                        <input
                            className="w-full rounded border border-gray-900 text-lg p-2"
                            name="otp"
                            required={true}
                            inputMode="numeric"
                            disabled={!hasPhoneNumberResource}
                            placeholder="Enter your one-time verification code"
                        />

                    </div>
                )} 
                <div className="mt-6 mb-2">
                    {hasPhoneNumberResource ? (<>
                        <Button type="submit">
                            Verify
                        </Button>
                        <p className="mt-10 text-sm text-gray-800">
                            Didn't receive a code? <button 
                                className="text-blue-700 underline font-medium"
                                onClick={() => phoneNumberResource.prepareVerification()}
                            >
                                Resend
                            </button>
                        </p>
                    </>) : (
                        <Button type="submit">
                            Send code
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
