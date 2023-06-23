This application demonstrates a multitenant property management application using Clerk. 

## Demo
This demo is available live! 

Click one of the links below to explore:
* [Property Manager Admin Portal](https://clerkexample.com)
    * username: `admin@acme.test` password: `clerkpassword123`
* [Resident Portal - Acme Communities](https://acme-communities.clerkexample.com/resident)
* [Owner Portal - Acme Communities](https://acme-communities.clerkexample.com/owner)

To invite a user to access the Resident or Owner portals, use the invitation button in the Admin Portal.

# About

As an imaginary property management software company, **Capsule Property Manager** provides its business customers with several branded portals:

* An Admin Portal for employees of the property management companies to manage their properties and residents
* Consumer-facing portals for property residents and owners to perform tasks such as viewing and managing their bills, documents and maintenance requests.



## Multitenancy

Capsule Property Manager is used by property management companies, each of which gets its own set of portals that can be accessed by that company's employees and customers.

To achieve this, each property management company is represented as an [Organization](https://clerk.com/docs/organizations/overview) in Clerk. Users can belong to one or more Organizations, based on whether they are an employee or a customer of a particular property management company.

## User groups

There are three types of users in Capsule Property Manager: property managers, residents and owners.

Users can belong to different groups in different Organizations. This is represented by a `groups` array in the user's [Organization membership public metadata](https://clerk.com/docs/organizations/organization-metadata#organization-membership-metadata):

```
organization_membership.public_metadata.groups = 
[
    "property_manager", 
    "resident", 
    "owner"
]

```

#### Property Managers

* Sign into the Property Manager admin portal
* Can invite owners or residents

#### Residents

* Sign into a property management company's resident portal

#### Owners

* Sign into a property management company's resident portal
* Are required to set up an additional factor for 2FA


# Setup

## Clerk
Start by creating a new Clerk application:


1) Sign up for a Clerk account at https://clerk.com.
2) Follow the onboarding steps to create a Clerk application.


You will need to create the following resources in your Clerk application:

1) Create an email/password user in the dashboard.
2) Create an [Organization](https://clerk.com/docs/organizations/overview) in the dashboard. This will represent a customer of Capsule. Use the slug `acme-communities` to use the branding and configuration pre-defined in this demo.
    * If you want property owners to enroll in MFA for this organization, add this to the organization metadata: `{ "owner_mfa_required": true }`. Choose the user you created earlier as the organization admin.
3) Add the user to the `property_manager` group. To do this, [PATCH the user's organization metadata](https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/UpdateOrganizationMembershipMetadata) with the following payload:
    ```
    {
        "public_metadata": 
        { 
            "groups": ["property_manager"] 
        }
    }
    ```

Once you complete these steps, your user should be able to login to the Admin Portal and invite more users. 

Optionally, you can enable the Google and Apple social connections.

## Environment
Refer to the `.env.example` files in each repository to set up your environment variables.

## Running locally

The application uses [Traefik](https://doc.traefik.io/traefik/getting-started/install-traefik/) to run on *localhost:3000* with a custom domain. You will need to configure the custom domain locally. 

By default, the application is configured to use the following domains:
* `clerkexample.test` for the admin portal 
* `*.clerkexample.test` for the individual property management companies' consumer portals

After you have configured the custom domain and installed Traefik, start Traefik and run the app from the demo app directory:
```
traefik
npm run start
```

Then run the API from the API directory:
```
npm run start
```

## Deploying to Vercel
To deploy this sample to Vercel, deploy the SPA as a **create-react-app** project and the API as a **serverless function**.

Make sure to set up the subdomain for Acme-Communities as `acme-communities.<your_domain>`.