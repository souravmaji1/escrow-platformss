'use client'
import { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { 
  Shield,
  Layout,
  House,
  Users,
  Plus,
  Crown,
  Settings,
  HelpCircle,
  Book
} from "lucide-react";

const SidebarNav = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: House, label: "Home" },
    { href: "/dashboard", icon: Layout, label: "Dashboard" },
    { href: "/projects", icon: Users, label: "Projects" },
    { href: "/createproject", icon: Plus, label: "Create" },
    { href: "/admin", icon: Crown, label: "Admin" }
  ];

  const bottomNavItems = [
    { href: "/docs", icon: Book, label: "Documentation" },
    { href: "/help", icon: HelpCircle, label: "Help Center" }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col fixed h-full`}>
      <div className="p-4 border-b border-gray-800">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="w-8 h-8 text-green-500" />
          {!isSidebarCollapsed && (
            <span className="ml-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
              ForeChain
            </span>
          )}
        </Link>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-500/10 text-green-400'
                    : 'text-gray-300 hover:bg-green-500/10 hover:text-green-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="space-y-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-green-500/10 text-green-400'
                      : 'text-gray-300 hover:bg-green-500/10 hover:text-green-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-green-500/10 hover:text-green-400"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <Layout className="w-5 h-5" />
          {!isSidebarCollapsed && <span className="ml-3">Collapse</span>}
        </Button>
      </div>
    </aside>
  );
};

export default SidebarNav;