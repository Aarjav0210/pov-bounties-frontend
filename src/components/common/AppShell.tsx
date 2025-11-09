"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const userNavigation = [
  { name: "Marketplace", href: "/bounties" },
  { name: "Dashboard", href: "/dashboard" },
];

const enterpriseNavigation: { name: string; href: string }[] = [
  { name: "Dashboard", href: "/enterprise/dashboard" },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isEnterpriseView = pathname.startsWith("/enterprise");
  const navigation = isEnterpriseView ? enterpriseNavigation : userNavigation;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-background-light/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={isEnterpriseView ? "/enterprise" : "/"} className="flex items-center gap-4 text-gray-900">
            <svg className={cn("h-6 w-6", isEnterpriseView ? "text-green-500" : "text-red-500")} fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
            </svg>
            <h2 className="text-gray-900 text-lg font-bold">Pepper</h2>
          </Link>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <nav className="hidden items-center gap-6 md:flex">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive 
                        ? isEnterpriseView 
                          ? "text-green-600" 
                          : "text-red-600"
                        : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full",
                  isEnterpriseView ? "focus:ring-green-500" : "focus:ring-red-500"
                )}>
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold text-sm transition-colors",
                    isEnterpriseView 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-red-500 hover:bg-red-600"
                  )}>
                    {isEnterpriseView ? "EN" : "AJ"}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard")}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    !isEnterpriseView && "bg-gray-50"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span>User Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/enterprise")}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    isEnterpriseView && "bg-gray-50"
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Enterprise Account</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <nav className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? isEnterpriseView
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Switch Account
              </div>
              <Link
                href="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  !isEnterpriseView
                    ? "bg-red-50 text-red-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <User className="h-4 w-4" />
                <span>User Account</span>
              </Link>
              <Link
                href="/enterprise"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isEnterpriseView
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Building2 className="h-4 w-4" />
                <span>Enterprise Account</span>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

