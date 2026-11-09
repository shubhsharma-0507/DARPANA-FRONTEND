export const metadata = { title: 'Contact' };
const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
export default function Contact() {
  return (
    <div className="container max-w-2xl space-y-6 py-14">
      <p className="font-script text-3xl text-coral">We’re here to help</p>
      <h1>Contact us</h1>
      {email || phone ? (
        <div className="card space-y-2 p-6">
          {email && <p>Email: <a className="text-coral underline" href={`mailto:${email}`}>{email}</a></p>}
          {phone && <p>Phone: <a className="text-coral underline" href={`tel:${phone}`}>{phone}</a></p>}
        </div>
      ) : (
        <div className="card p-6 text-muted">Our support details will appear here. The site owner can set <code>NEXT_PUBLIC_SUPPORT_EMAIL</code> and <code>NEXT_PUBLIC_SUPPORT_PHONE</code> in <code>apps/web/.env.local</code>.</div>
      )}
      <p className="text-sm text-muted">For order problems, include your order number. For returns, you can also start a request from your order page.</p>
    </div>
  );
}
