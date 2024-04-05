# nextjs14-shadcn-event-management-app
A Simple and responsive event manager app using nextjs14 with shadcn and tailwind for styling,
stripe for payment, clerk for authentication and zod for form validation.

I have a demo video of this project in this [link](https://youtu.be/pMVWLpk30h8)

# Technologies Used
* **Typescript**
* **NextJS 14**
* **Shadcn**
* **Stripe**
* **Clerk**
* **Tailwind**
* **Zod**

# Testing this project
You can clone this project and test it for yourself. However, you need to create .env files
and add these following variables:

**NEXT_PUBLIC_SERVER_URL** -> base URL of your app. e.g. `http://localhost:3000`  

**NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** -> Public key that can be found in your clerk dashboard in developers section.  
**CLERK_SECRET_KEY** -> Secret key that can be found in your clerk dashboard in developers section.   
**CLERK_WEBHOOK_SECRET** -> Secret webhook key that can be found in your clerk dashboard in webhooks section. 
You must create a webhook first in order to get this key.  

**MONGO_DB_URI** -> If you're using atlas, look at your mongodb dashboard to get this URI, it starts with: 'mongodb+srv://'.  

**STRIPE_SECRET_KEY** -> Stripe secret key. You can get this in your stripe dashboard under developers section.  
**NEXT_PUBLIC_STRIPE_PUBLIC_KEY** -> Stripe public key. You can get this in your stripe dashboard under developers section.  
**STRIPE_WEBHOOK_SECRET** -> Secret key stripe event webhooks. You can get this in your stripe dashboard in the webhooks section.  

**NEXT_PUBLIC_CLERK_SIGN_IN_URL** -> Redirect URL when user tries to login. Example: /login  
**NEXT_PUBLIC_CLERK_SIGN_UP_URL** -> Redirect URL when user tries to register. Example: /register  
**NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL** -> Redirect URL when user has logged in. Example: '/' which is equivalent to root page.  
**NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL** -> Redirect URL when user has logged out. Example: '/' which is equivalent to root page.  

**UPLOADTHING_SECRET** -> Secret key that can be found in uploadthing dashboard under 'API keys' section.  
**UPLOADTHING_APP_ID** -> Secret APP ID that can be found in uploadthing dashboard under 'API keys' section  

## Webhooks
This project uses stripe and clerk webhooks. Create webhooks in each
respective platform. Then, to test webhooks, open ngrok and create a tunnel between your
app and ngrok.

