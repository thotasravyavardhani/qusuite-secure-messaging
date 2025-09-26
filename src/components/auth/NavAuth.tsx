"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const NavAuth = () => {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : "";
    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    }
  };

  if (isPending) {
    return <div className="text-xs text-muted-foreground">Checking session…</div>;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/sign-in" className="text-muted-foreground hover:text-foreground text-sm">Sign in</Link>
        <Link href="/register">
          <Button size="sm">Register</Button>
        </Link>
      </div>
    );
  }

  const email = session.user.email || session.user.name || "User";
  // Plan badge placeholder (integrate with payments later)
  const planName = "Free Plan";

  return (
    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="hidden sm:inline-flex">{planName}</Badge>
      <span className="text-sm text-muted-foreground">{email}</span>
      <Button size="sm" variant="outline" onClick={handleSignOut}>Sign out</Button>
    </div>
  );
};

export default NavAuth;