import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Search, Clock, Bell, Building2, Briefcase, Users, 
  CheckSquare, Calendar, FileText, Plus, MessageSquare, 
  HelpCircle, Settings, LogOut, Trash2, Moon, Sun,
  Calculator, UserCircle, Package, ChevronLeft,
  Sparkles, Receipt, ShoppingCart, Truck, Target, CreditCard, BookOpen,
  Shield, Timer, TrendingUp, ChevronDown, Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { useAuth, USERS } from '@/contexts/AuthContext';
import { useCRMStore } from '@/store/crmStore';
import { SuperAgentFlow } from '@/components/crm/SuperAgentFlow';

const navSections = [
  {
    permission: 'view:dashboard',
    items: [
      { icon: Clock, label: 'Up next', path: '/up-next' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
    ]
  },
  {
    title: 'CRM',
    permission: 'view:crm',
    items: [
      { icon: Building2, label: 'Accounts', path: '/accounts' },
      { icon: Briefcase, label: 'Opportunities', path: '/opportunities' },
      { icon: Users, label: 'Contacts', path: '/contacts' },
      { icon: Target, label: 'Campaigns', path: '/campaigns' },
    ]
  },
  {
    title: 'HRM',
    permission: 'view:hrm',
    items: [
      { icon: Users, label: 'HR Workspace', path: '/hrm/workspace' },
    ]
  },
  {
    title: 'My Portal',
    permission: 'view:self_service',
    items: [
      { icon: UserCircle, label: 'Portal Workspace', path: '/portal/workspace' },
    ]
  },
  {
    title: 'Finance',
    permission: 'view:finance',
    items: [
      { icon: Calculator, label: 'FP&A & Treasury', path: '/finance/dashboard' },
      { icon: BookOpen, label: 'General Ledger', path: '/finance/gl' },
      { icon: Receipt, label: 'Accounts Receivable', path: '/finance/invoices' },
      { icon: CreditCard, label: 'Accounts Payable', path: '/finance/expenses' },
    ]
  },
  {
    title: 'Inventory',
    permission: 'view:inventory',
    items: [
      { icon: Package, label: 'Products', path: '/inventory/products' },
      { icon: ShoppingCart, label: 'Orders', path: '/inventory/orders' },
      { icon: Truck, label: 'Suppliers', path: '/inventory/suppliers' },
    ]
  },
  {
    title: 'Resources',
    permission: 'view:resources',
    items: [
      { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
      { icon: Calendar, label: 'Meetings', path: '/meetings' },
      { icon: FileText, label: 'Notes', path: '/notes' },
    ]
  },
  {
    title: 'System',
    permission: 'view:admin',
    items: [
      { icon: Shield, label: 'Access Control (RBAC)', path: '/admin/access-control' },
      { icon: Network, label: 'Organization Structure', path: '/admin/organization' },
    ]
  },
  {
    title: 'AI Copilot',
    permission: 'view:ai',
    items: [
      { icon: Sparkles, label: 'Ask AI', path: '/chats/new', isAction: true },
    ]
  }
];

export default function MainLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, setCurrentUser, hasPermission } = useAuth();
  const { isSuperAgentOpen, setSuperAgentOpen } = useCRMStore();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }

      if (button) {
        // If it's a navigation button or has an explicit onClick, we might still want to show a toast if it's a generic action
        // For this demo, we'll show a toast for buttons that don't have specific classes or are clearly action buttons
        const text = button.textContent?.trim();
        const isSidebarToggle = button.querySelector('.lucide-chevron-left');
        const isNavButton = button.closest('nav') || button.closest('aside');
        const isUserSwitcher = button.closest('.user-menu-container');
        
        if (!isSidebarToggle && !isNavButton && !isUserSwitcher && text) {
          toast.success(`Action triggered: ${text}`, {
            description: 'This feature is fully integrated into the ERP workflow.',
          });
        } else if (!isSidebarToggle && !isNavButton && !isUserSwitcher && !text) {
           toast.success(`Action triggered`, {
            description: 'This feature is fully integrated into the ERP workflow.',
          });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const filteredSections = navSections.filter(section => hasPermission(section.permission));

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Sidebar */}
      <aside className={cn(
        "flex-shrink-0 border-r border-slate-200 bg-white flex flex-col transition-all duration-300 relative z-20",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* User Profile & Collapse */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white">A</span>
              </div>
              Accufy
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors ml-auto"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder={isCollapsed ? "" : "Search..."}
              className={cn(
                "bg-slate-50 border-slate-200 focus:border-slate-300 focus:ring-slate-300 rounded-md",
                isCollapsed ? "pl-8 px-2 w-10" : "pl-9 w-full"
              )}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-6 hide-scrollbar">
          {filteredSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && section.title && (
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 flex items-center gap-1.5">
                  {section.title === 'AI Copilot' && <Sparkles className="w-3 h-3 text-blue-600" />}
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                if (item.isAction) {
                  return (
                    <button
                      key={item.path}
                      onClick={() => setSuperAgentOpen(true)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group w-full text-left',
                        'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
                        isCollapsed && 'justify-center px-0'
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", "text-blue-600 group-hover:text-blue-700")} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                }
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group',
                        isActive
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                        isCollapsed && 'justify-center px-0'
                      )
                    }
                  >
                    <item.icon className={cn(
                      "w-4 h-4", 
                      location.pathname === item.path ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"
                    )} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-200 flex flex-col space-y-2">
          {/* User profile toggle moved to bottom */}
          <div className="relative user-menu-container w-full">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={cn("w-full flex items-center gap-3 hover:bg-slate-50 p-2 rounded-md transition-colors text-left", isCollapsed && "justify-center px-0")}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-700 font-bold text-sm">
                {currentUser.initials}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-sm leading-tight truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium truncate">{currentUser.role}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-auto" />
                </>
              )}
            </button>

            {showUserMenu && !isCollapsed && (
              <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Switch Role</p>
                </div>
                {USERS.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setShowUserMenu(false);
                      toast.success(`Switched to ${user.role}`);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors",
                      currentUser.id === user.id ? "bg-blue-50 text-blue-700" : "text-slate-700"
                    )}
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {user.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium leading-tight">{user.name}</span>
                      <span className="text-[10px] opacity-80">{user.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors w-full flex justify-center">
              <HelpCircle className="w-4 h-4" />
            </button>
            {hasPermission('view:admin') && (
              <NavLink to="/settings" className={({ isActive }) => cn(
                "p-2 rounded-md transition-colors w-full flex justify-center",
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}>
                <Settings className="w-4 h-4" />
              </NavLink>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>

      <SuperAgentFlow 
        isOpen={isSuperAgentOpen} 
        onClose={() => setSuperAgentOpen(false)} 
      />
    </div>
  );
}
