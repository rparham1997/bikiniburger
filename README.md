# Bikini Burger

Premium responsive website and custom ordering portal for Bikini Burger in Ardmore, PA.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main Routes

- `/` - homepage
- `/menu` - full menu
- `/order` - custom pickup and delivery checkout
- `/merch` - merch shop
- `/catering` - catering inquiry page
- `/contact` - contact form and location
- `/admin` - owner order portal

## Affordable V1 Scope

V1 is focused on direct website ordering without building an expensive delivery platform all at once.

Included in V1:

- Direct website ordering so customers order without leaving Bikini Burger's website
- Menu, cart, item notes, tip selection and basic modifiers
- Pickup and in-house delivery fulfillment options
- Delivery rules, ZIP restrictions, minimums and fees
- Store-hours guard and temporary pause-ordering switch
- Secure online checkout through Stripe
- Custom owner-controlled ordering flow for the restaurant ecosystem
- Owner order email/SMS alerts
- Customer email confirmation after successful payment
- Basic order status flow in the admin portal
- Launch testing for the full customer-to-restaurant workflow

Not included in V1:

- Separate driver mobile app
- Live GPS driver tracking
- Loyalty/rewards program
- Advanced inventory management
- Custom kitchen display system
- Large analytics suite

Those can be added later without changing the core direct-ordering foundation.

## Production Environment Variables

Copy `.env.example` into Vercel project settings and fill in the private values:

```env
NEXT_PUBLIC_SITE_URL=https://bikiniburger.shop
NEXT_PUBLIC_CONTACT_EMAIL=jimmyspence1@gmail.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_PASSWORD=use-a-private-owner-password
RESEND_API_KEY=re_...
ORDER_ALERT_EMAIL=jimmyspence1@gmail.com
ORDER_ALERT_FROM=Bikini Burger Orders <orders@bikiniburger.shop>
ORDERING_PAUSED=false
ORDERING_PAUSED_MESSAGE=Online ordering is paused right now. Please call the shop or use a delivery app.
PICKUP_ENABLED=true
NEXT_PUBLIC_PICKUP_ENABLED=true
DELIVERY_ENABLED=true
NEXT_PUBLIC_DELIVERY_ENABLED=true
DELIVERY_FEE_CENTS=500
NEXT_PUBLIC_DELIVERY_FEE_CENTS=500
DELIVERY_MINIMUM_CENTS=1500
NEXT_PUBLIC_DELIVERY_MINIMUM_CENTS=1500
DELIVERY_ZIPS=19003
NEXT_PUBLIC_DELIVERY_ZIPS=19003
```

Twilio SMS alerts are optional:

```env
ORDER_ALERT_PHONE=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_PHONE=
```

## Stripe Setup

1. Create or log into the owner's Stripe account.
2. Add `STRIPE_SECRET_KEY` to Vercel using the live secret key.
3. Add a Stripe webhook endpoint:

```text
https://bikiniburger.shop/api/stripe/webhook
```

4. Subscribe the webhook to `checkout.session.completed`.
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
6. Redeploy the site after saving env vars.

Until Stripe is connected, checkout is intentionally disabled and the admin portal shows demo orders.

This V1 does not depend on Clover. Orders are handled through the custom website checkout, Stripe payments, owner alerts and the admin portal.

## Ordering Availability

Online ordering follows Bikini Burger's published hours:

- Monday-Saturday: 11 AM-11 PM
- Sunday: 12 PM-10 PM

Checkout is blocked outside those hours. To temporarily pause online ordering during a rush, set this Vercel environment variable and redeploy:

```env
ORDERING_PAUSED=true
ORDERING_PAUSED_MESSAGE=Online ordering is paused right now. Please call the shop or use a delivery app.
```

Set `ORDERING_PAUSED=false` and redeploy to resume online ordering.

Pickup and delivery can also be paused independently:

```env
PICKUP_ENABLED=true
NEXT_PUBLIC_PICKUP_ENABLED=true
DELIVERY_ENABLED=false
NEXT_PUBLIC_DELIVERY_ENABLED=false
```

Set both the server variable and matching `NEXT_PUBLIC_` variable together so the checkout UI and checkout API enforce the same rule.

## Customer Checkout Policy

- Customer name, phone number and receipt email are required.
- Delivery orders require a full address and approved delivery ZIP code.
- Customers should call the shop quickly for changes, cancellations or refund questions after payment.
- Merch is pickup-confirmed because size availability can change in store.

## Admin Portal

Owner URL:

```text
https://bikiniburger.shop/admin
```

The admin portal can:

- View recent paid pickup and delivery orders
- Update order status
- Search orders
- Filter by status and fulfillment type
- Print kitchen tickets
- Export filtered orders to CSV
- Open delivery addresses in Google Maps
- Keep the dashboard open during service for auto-refresh and new-order alerts

## Deployment Checks

Run before deploying:

```bash
npm run lint
npm run build
```

After Stripe test keys are connected, run through `LAUNCH-CHECKLIST.md` before switching to live payments.
