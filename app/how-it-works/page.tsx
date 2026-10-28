import Header from "@/components/Header";
import ForgeDemo from "./ForgeDemo";

const SECTIONS = [
  {
    n: "1",
    title: "Signed tokens",
    body: (
      <>
        <p>
          The QR code on a pass isn&apos;t a picture of a ticket. It holds a short piece of text called a{" "}
          <b>token</b>: the pass ID, the bar, and the expiry time, followed by a <b>signature</b>.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-[11px] leading-relaxed text-[#7cc0ff]">
{`SKL1 . {"pid":"…","vid":"…","exp":…} . 8fK2…Qx
 ^          ^ payload (base64)          ^ HMAC-SHA256 signature`}
        </pre>
        <p className="mt-3">
          The server makes the signature with <b>HMAC-SHA256</b> and a secret key that lives only in the
          server&apos;s <code>.env</code> file. Without the key, nobody can produce a matching signature. If you
          change a single character of the payload (another bar, a later expiry), the signature no longer matches.
        </p>
      </>
    ),
  },
  {
    n: "2",
    title: "Server-side validation",
    body: (
      <>
        <p>The app on the phone doesn&apos;t make the decision. When venue staff redeem a pass, the token goes to the server, which checks it in order:</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Does the signature match? If not: <b>Invalid signature</b>.</li>
          <li>Does that pass ID exist in the database? If not: <b>Unknown pass</b>.</li>
          <li>Is it for this bar? If not: <b>Wrong venue</b>.</li>
          <li>Is it before the 4:00 AM expiry? If not: <b>Expired</b>.</li>
          <li>Has it been used? If so: <b>Already redeemed</b>.</li>
        </ol>
        <p className="mt-3">
          The rules live on the server, so editing the app on your phone can&apos;t change the outcome.
        </p>
      </>
    ),
  },
  {
    n: "3",
    title: "Single-use redemption",
    body: (
      <p>
        When a pass is accepted, the server records the time it was redeemed in one atomic database step:
        &ldquo;set <code>redeemedAt</code> only if it is still empty.&rdquo; If someone tries to use the same pass
        again, from a screenshot or a second phone, even a second later, that step changes nothing and the server
        answers <b>Already redeemed</b>. Sharing one pass with a group gets one person in.
      </p>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <main className="pb-32">
      <Header title="How It Works" back />
      <div className="px-4 pt-6">
        <p className="text-sm font-bold uppercase tracking-widest text-[#7cc0ff]">Business law class project</p>
        <h1 className="mt-1 text-3xl font-black leading-tight">Why a line-skip pass can&apos;t be faked</h1>
        <p className="mt-3 text-white/70">
          Pass apps sell something you can&apos;t hold: a promise that the bar will let you skip the line or skip
          the cover. Here is how the app makes sure each promise is honored once, for the person who paid.
        </p>
      </div>

      <div className="space-y-4 px-4 pt-6">
        {SECTIONS.map((s) => (
          <section key={s.n} className="glass p-5 text-[15px] leading-relaxed text-white/80">
            <div className="mb-2 flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm font-black text-white">{s.n}</span>
              <h2 className="text-xl font-bold text-white">{s.title}</h2>
            </div>
            {s.body}
          </section>
        ))}

        <section className="rounded-xl border border-red-400/50 bg-red-500/10 p-5 text-[15px] leading-relaxed text-white/80">
          <div className="mb-2 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-red-500 text-sm font-black text-white">4</span>
            <h2 className="text-xl font-bold text-white">Why a copied front end fails</h2>
          </div>
          <p>
            Anyone can copy how an app <i>looks</i>: the colors, the card layout, even a moving gradient. That
            copy is only a front end. It has no access to the real server, its database, or its secret key.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>
              <b>A made-up QR code</b> has no valid signature, because the copy doesn&apos;t know the key. The server
              returns <b>Invalid signature</b>.
            </li>
            <li>
              <b>A copied token from a real pass</b> has already been used by the person who bought it, or soon
              will be. The second try returns <b>Already redeemed</b>.
            </li>
            <li>
              <b>Changing the bar or date</b> in a real token breaks the signature.
            </li>
            <li>
              <b>Its own &ldquo;backend&rdquo;</b> can sign tokens, but with a different key. To the real server,
              those are still <b>Invalid signature</b>.
            </li>
          </ul>
          <p className="mt-3">
            Because the check happens against the real server, a pass that looks perfect still gets rejected. Try it below.
          </p>
        </section>

        <ForgeDemo />
      </div>
    </main>
  );
}
