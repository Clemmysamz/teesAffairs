This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Dashboard

Open [http://localhost:3000/admin-dashboard](http://localhost:3000/admin-dashboard) to manage products. Admin credentials are read server-side from the ignored `.env.local` file.

In local development, products are stored in the ignored `data/admin-products.json` file and uploaded images are stored in `public/uploads/`. For a multi-instance or production deployment, replace this local file storage with a persistent database and object storage.

Orders are available at [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders) and stored locally in the ignored `data/orders.json` file. Nigerian checkouts use Paystack hosted checkout; the server verifies the transaction reference, NGN amount, and currency before marking an order paid or sending notifications. The NGN conversion rate is `USD_TO_NGN_RATE` in `lib/currency.ts`. Set `APP_URL` to the public origin when deployed. Enable card, bank transfer, USSD, or mobile-money channels in the Paystack merchant account as needed. Other destinations remain payment-pending because no gateway is configured for them.

Add `PAYSTACK_SECRET_KEY` to the server's ignored `.env.local` file for Paystack. For email alerts, add `RESEND_API_KEY` and a verified `RESEND_FROM` sender; for SMS, add `TERMII_API_KEY`. The admin notification destinations are configured as `ADMIN_NOTIFICATION_EMAIL` and `ADMIN_PHONE`. Orders and product uploads currently use local files, so production deployment needs a durable database and object storage.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# tees-affairs
