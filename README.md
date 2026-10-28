# Skipline: Demo Pass App (Class Project)

Skipline is a demo web app for a college business law class. It shows how bar "skip the line" and cover-charge
pass apps work, and why their passes can't be faked. Every bar, address and event is fictional, set in the made-up
college town of **Larkspur Falls**. No real payments are taken.

**Tech:** Next.js 15 (App Router) · Tailwind CSS · API routes · Postgres via Prisma · `qrcode.react`

## Put it online (Vercel + GitHub)

The site runs on [Vercel](https://vercel.com) with a free Postgres database (Prisma Postgres or Neon). The code
lives on GitHub, and every push to `main` redeploys the site automatically.

1. **Import the repo:** in Vercel, click **Add New → Project** and import this GitHub repository. Don't deploy yet.
2. **Add a database:** in the project, open **Storage → Create Database**, pick **Prisma Postgres** or **Neon**,
   and connect it to the project. This adds `DATABASE_URL` for you.
3. **Add the signing secret:** in **Settings → Environment Variables**, add `PASS_SIGNING_SECRET` with a long random
   value. You can generate one with:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
4. **Deploy.** The build creates the tables and seeds the 8 bars. After that, the site keeps the next 7 nights
   stocked on its own.

Changing the secret makes all existing passes fail with "Invalid signature". That's expected, since they were
signed with the old key.

## Making changes

Edit the code, commit, and push to GitHub. Vercel rebuilds and redeploys in about a minute. Pushes to other branches
get their own preview URL, so you can check a change before it goes live.

Common edits:

| To change… | Edit |
| --- | --- |
| Bars, addresses, prices, featured events | `lib/seed.ts` (redeploy; existing nights keep their old prices) |
| Service fee | `lib/money.ts` |
| Pass card colors | `lib/passStyle.ts` |
| Background, cards, buttons | `app/globals.css`, `tailwind.config.ts` |
| How It Works text | `app/how-it-works/page.tsx` |
| Time zone for "tonight" | `NEXT_PUBLIC_APP_TIME_ZONE` env var (default `America/Chicago`) |

## Run it on your computer

You need Node.js 20+.

1. `npm install`
2. Create the `.env` file from `.env.example`. The easiest way is to install the Vercel CLI (`npm i -g vercel`)
   and run `vercel link` and then `vercel env pull .env`. That gives you the same database as the live site.
   You can also point `DATABASE_URL` at a local Postgres instead.
3. `npm run dev`, then open http://localhost:3000.

To wipe the database and reseed, run `npm run db:reset`. This also deletes every pass, including on the live
site if you're using its database.

## Demo script (for a presentation)

1. **Venues** → pick a bar → pick "Skip the Line" → **Place Demo Order**.
2. **My Passes** shows the pass card, its QR code, and two buttons: **I am venue staff** and **How to redeem this pass**.
3. Tap **I am venue staff**. The server checks the signature and the
   pass flips to "Redeemed". Tapping it again does nothing: a pass works once.
4. Open **How It Works** → "Make a fake pass" → "Check it with the server": **REJECTED: Invalid signature**.

## How the security works

| Piece | Where |
| --- | --- |
| Token signing / verification (HMAC-SHA256) | `lib/token.ts` |
| Redemption checks (signature → exists → venue → expiry → single use) | `app/api/redeem/route.ts` |
| Atomic inventory reservation (sold-out handling) | `app/api/orders/route.ts` |
| Pass screen (card, QR, staff redeem) | `app/passes/PassesClient.tsx` |
| Copycat token generator for the demo | `app/api/demo/forge/route.ts` |

A token looks like `SKL1.<base64 payload>.<signature>`. Only the server knows `PASS_SIGNING_SECRET`, so only the
server can make a valid signature. Redemption is a single conditional update ("set `redeemedAt` only if it's empty"),
so two attempts to use the same pass can't both succeed, even at the same moment.

Possible rejection reasons: **Unknown pass**, **Invalid signature**, **Already redeemed**, **Expired**, **Wrong venue**.

## Project layout

```
app/
  page.tsx                  Venues list (home)
  venues/[slug]/page.tsx    Venue page with passes grouped by date
  checkout/[optionId]/      Checkout + "Place Demo Order"
  passes/                   My Passes (card, QR, staff redeem)
  profile/page.tsx          Passholder name, links
  how-it-works/             Explainer + forge demo
  api/                      venues, orders, passes, redeem, demo/forge
components/                 Header, BottomNav, VenueArt (generated logos), icons
lib/                        prisma, token, dates, money, seed data, demo user
prisma/                     schema.prisma, seed.ts
```

## Notes

- There are no real accounts. Each browser gets a random demo user id in `localStorage`, and that id owns its passes.
- A pass for a given night expires at 4:00 AM the next morning, in the venue time zone.
- Service fee is 5.5% per pass (`lib/money.ts`).
