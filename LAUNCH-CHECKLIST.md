# Bikini Burger Launch Checklist

Use this checklist after Stripe test keys are added and before switching to live payments.

## Environment

- `NEXT_PUBLIC_SITE_URL` points to the production domain.
- `STRIPE_SECRET_KEY` is set in Vercel.
- `STRIPE_WEBHOOK_SECRET` is set in Vercel.
- `ADMIN_PASSWORD` is set in Vercel.
- `RESEND_API_KEY` is set in Vercel.
- `ORDER_ALERT_EMAIL` is set to the owner email.
- `ORDERING_PAUSED=false` for launch.
- `PICKUP_ENABLED=true` and `NEXT_PUBLIC_PICKUP_ENABLED=true`.
- `DELIVERY_ENABLED=true` and `NEXT_PUBLIC_DELIVERY_ENABLED=true`, unless delivery should launch later.
- Delivery fee, minimum and ZIPs are confirmed.
- Admin password is private and different from the temporary local testing password.

## Customer Checkout Tests

- Pickup order with one burger, side and drink.
- Delivery order with valid ZIP code.
- Pickup toggle works when pickup is enabled.
- Delivery toggle works when delivery is enabled.
- Delivery order below minimum shows the minimum-order warning.
- Delivery order outside ZIP is rejected.
- Item-level special instructions are saved.
- General order notes are saved.
- Customer email is required before checkout.
- Tip options update the total.
- Custom tip updates the total.
- Merch item asks for size preference.
- Canceling Stripe checkout returns to the saved cart.
- Successful Stripe payment clears the cart.

## Owner/Admin Tests

- Admin password logs into `/admin`.
- Paid order appears in admin.
- Customer name, phone, email and requested time appear.
- Delivery address appears with map link.
- Item notes and general notes appear.
- Tip line appears.
- Status updates from new to preparing, ready and completed.
- Print ticket opens a clean kitchen ticket.
- CSV export downloads filtered orders.
- Auto-refresh works.
- Sound alerts can be enabled.

## Notification Tests

- Owner email alert is received.
- Customer confirmation email is received.
- Optional SMS alert is received if Twilio is configured.
- Stripe webhook logs show successful `checkout.session.completed`.

## Go-Live

- Replace Stripe test secret with live secret.
- Replace webhook secret with live webhook secret.
- Redeploy production.
- Place one small live order with the owner watching.
- Confirm the owner can refund from Stripe if needed.
