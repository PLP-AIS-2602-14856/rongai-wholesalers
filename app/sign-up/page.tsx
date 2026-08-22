import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold">Create account</h1>
      <p className="mt-2 text-ink/65">Supabase Auth handles account security.</p>
      <AuthForm mode="sign-up" />
      <p className="mt-5 text-sm text-ink/65">
        Already registered? <Link className="font-semibold text-leaf" href="/sign-in">Sign in</Link>
      </p>
    </section>
  );
}
