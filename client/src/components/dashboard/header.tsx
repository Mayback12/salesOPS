import { cn } from "@/lib/utils";
import type { Section } from "@/App";
import { useAuthStore } from "@/stores/auth-store";
import { Bell, Search, Calendar, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar";

interface HeaderProps {
  activeSection: Section;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onSectionChange: (section: Section) => void;
}

const sectionTitles: Record<Section, string> = {
  overview: "Overview",
  inventory: "Inventory",
  sales: "Sales",
  customers: "Customers",
  debts: "Customer Balances",
  expenses: "Expenses",
  reports: "Reports",
  settings: "Settings",
};

export function Header({ 
  activeSection, 
  onOpenMobileMenu, 
  isMobileMenuOpen, 
  onCloseMobileMenu,
  onSectionChange 
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="h-16 border-b border-border bg-background sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-6">
        <Sheet open={isMobileMenuOpen} onOpenChange={(open) => !open && onCloseMobileMenu()}>
          <SheetTrigger asChild>
            <button 
              onClick={onOpenMobileMenu}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px] bg-sidebar border-r-sidebar-border">
            <div className="flex flex-col h-full">
              <SidebarContent 
                activeSection={activeSection} 
                onSectionChange={onSectionChange}
                collapsed={false}
              />
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg md:text-xl font-semibold text-foreground truncate max-w-[150px] md:max-w-none">
          {sectionTitles[activeSection]}
        </h1>
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search */}
        <div
          className={cn(
            "relative hidden sm:flex items-center transition-all duration-300",
            searchFocused ? "w-48 md:w-64" : "w-32 md:w-48"
          )}
        >
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
          />
        </div>

        {/* Mobile Search Button */}
        <button className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="hidden xs:flex w-9 h-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User avatar */}
        <button className="w-9 h-9 rounded-lg overflow-hidden bg-secondary ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200">
          <div className="w-full h-full bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-xs font-semibold text-accent-foreground">
            {user?.name?.substring(0, 2).toUpperCase() || "JD"}
          </div>
        </button>
      </div>
    </header>
  );
}
