import { SidebarLayout } from "@/components/sidebar-layout";
import ProtectedLayout from "@/layout/protected-layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      <ProtectedLayout>{children}</ProtectedLayout>
    </SidebarLayout>
  );
}
