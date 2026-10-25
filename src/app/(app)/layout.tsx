import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const alertasCount = await prisma.alerta.count({
    where: { resuelta: false },
  });

  return (
    <AppShell
      user={{
        name: session.user.name,
        username: session.user.username,
        role: session.user.role,
      }}
      alertasCount={alertasCount}
    >
      {children}
    </AppShell>
  );
}
