import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import clerk from '@clerk/clerk-sdk-node';
import axios from 'axios';

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN
};

app.use(cors(corsOptions));

const hostReadableNames = {
    "acme-communities": "Acme Communities",
    "globex": "Globex"
};

app.use(express.json());

app.post('/invite', ClerkExpressRequireAuth(), function (req, res, next) {
    const { auth, body } = req;
    const { orgSlug, claims } = auth;
    const { host } = body;
    
    if (!claims.organization_groups.includes("property_manager")) {
        return res.status(401).send("Unauthorized");
    }

    if (host !== orgSlug) {
        return res.status(401).send("Unauthorized")
    }

    next();
});

app.post('/invite', async function (req, res) {
    const invitationParams = req.body;
    
    const invitedUser = await prepareUser(invitationParams);

    const signInTicket = await clerk.signInTokens.createSignInToken({
        userId: invitedUser.id,
        // 2 days
        expiresInSeconds: 172800
    });

    const welcomeUrl = `${process.env.APP_PROTOCOL}://${invitationParams.host}.${process.env.APP_HOST}/welcome?group=${invitationParams.group}&ticket=${signInTicket.token}`;
    await axios.post(`${process.env.CLERK_BACKEND_API_URL}/emails`, {
        from_email_name: "accounts",
        email_address_id: invitedUser.primaryEmailAddressId,
        subject: `Welcome to ${hostReadableNames[invitationParams.host]}`,
        body: `Welcome to ${hostReadableNames[invitationParams.host]}! Sign in to your account here: ${welcomeUrl}`
    }, {
        headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
        }
    });

    res.status(200).send();
});

async function prepareUser(invitationParams) {
    const { email, host, orgId, group } = invitationParams;

    const existingUser = (await clerk.users.getUserList({
        emailAddress: [email]
    }))[0];

    if (!existingUser) {
        const newUser = await provisionUser(invitationParams);
        return newUser;
    }

    await addExistingUser({ userId: existingUser.id, host, orgId, group });
    return existingUser;
}

async function provisionUser({ email, orgId, group }) {
    const user = await clerk.users.createUser({
        emailAddress: [email],
        skipPasswordRequirement: true
    });

    await createMembership({ userId: user.id, orgId, group });

    return user;
}

async function addExistingUser({ userId, host, orgId, group }) {
    const memberships = await clerk.users.getOrganizationMembershipList({
        userId
    });
    const membership = memberships.find(({ organization }) => organization.slug === host);

    if (membership) {
        const groups = membership.publicMetadata.groups;
        if (groups.includes(group)) {
            return;
        }
        
        const newGroups = [...groups, group];
        await clerk.organizations.updateOrganizationMembershipMetadata({
            organizationId: orgId,
            userId,
            publicMetadata: {
                groups: newGroups
            }
        });
        return;
    }

    await createMembership({ userId, orgId, group });
}

async function createMembership({ userId, orgId, group }) {
    await clerk.organizations.createOrganizationMembership({
        organizationId: orgId,
        userId: userId,
        role: "basic_member"
    });

    await clerk.organizations.updateOrganizationMembershipMetadata({
        organizationId: orgId,
        userId,
        publicMetadata: {
            groups: [group]
        }
    });
}

export default app;

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on :${port}`);
});