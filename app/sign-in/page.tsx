import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-2 text-ink/65">Access your Rongai Wholesalers account.</p>
      <AuthForm mode="sign-in" />
      <p className="mt-5 text-sm text-ink/65">
        New here? <Link className="font-semibold text-leaf" href="/sign-up">Create an account</Link>
      </p>
    </section>
  );
}
