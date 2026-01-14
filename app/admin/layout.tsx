import { SiteShell } from "@/components/site-shell";
import { AdminShell } from "@/components/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <div className="py-8">
        <AdminShell>{children}</AdminShell>
      </div>
    </SiteShell>
  );
}
