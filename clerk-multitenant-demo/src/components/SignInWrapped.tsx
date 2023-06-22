import { SignInProps } from '@clerk/types';
import { SignIn } from '@clerk/clerk-react';

export type SignInMethod = "google" | "apple" | "password";

const signInElements: { [key in SignInMethod]: string} = {
    google: "socialButtonsBlockButton__google",
    apple: "socialButtonsBlockButton__apple",
    password: "formFieldRow__identifier"
};

export type CustomSignInProps = SignInProps & { enabledSignInMethods?: SignInMethod[] };

export function SignInWrapped({enabledSignInMethods, ...signInOptions }: CustomSignInProps) {
    const disabledElements: string[] = [];
    disabledElements.push("footerAction__signIn");

    if (enabledSignInMethods) {
        for (const [method, element] of Object.entries(signInElements)) {
            if (!enabledSignInMethods.includes(method as SignInMethod)) {
                disabledElements.push(element);
            }
        }
        
        if (shouldHideDivider(enabledSignInMethods)) {
            disabledElements.push("dividerRow");
        }
    }

    const disabledElementsCSS: {[key: string]: string} = {};
    for (const element of disabledElements) {
        disabledElementsCSS[element] = "hidden";
    }

    const { appearance, ...configOptions } = signInOptions;
    return (
        <SignIn {...configOptions} appearance={{
            ...appearance,
            elements: {
                ...appearance?.elements,
                ...disabledElementsCSS
            }
        }} />
    )
}

function shouldHideDivider(enabledMethods: SignInMethod[]) {
    if (!enabledMethods.includes("password")) {
        return true;
    }

    if (enabledMethods.length === 1) {
        return true;
    }

    return false;
}