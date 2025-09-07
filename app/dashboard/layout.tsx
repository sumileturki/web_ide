import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/features/dashboard/actions";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { Footer } from "@/features/home/component/footer";
import { Header } from "@/features/home/component/header";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const playgroundData = await getAllPlaygroundForUser();

  const technologyIconMap: Record<string, string> = {
    REACTJS: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  };

  const formattedPlaygroundData =
    playgroundData?.map((item) => ({
      id: item.id,
      name: item.title,
      starred: item.Starmark?.[0]?.isMarked || false,
      icon: technologyIconMap[item.template] || "Code2",
    })) || [];

  return (
    <SidebarProvider>
      {/* Full-page Background */}
      <div
        className={cn(
          "fixed inset-0 -z-10",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      <div className="flex min-h-screen w-full overflow-x-hidden">
        {/* Sidebar */}
        <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 w-full pt-0 md:pt-0">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
