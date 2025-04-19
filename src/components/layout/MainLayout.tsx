
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <SideNav />
        <div className="flex flex-col flex-1 overflow-auto">
          <TopNav />
          <main className="flex-1 p-4 md:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
