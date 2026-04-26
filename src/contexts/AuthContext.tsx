import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'Super Admin' | 'HR Manager' | 'Finance Controller' | 'Inventory Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
}

export const USERS: User[] = [
  { id: '1', name: 'Avinash Nadh', email: 'avinash@example.com', role: 'Super Admin', initials: 'AN' },
  { id: '2', name: 'Emily Chen', email: 'emily@example.com', role: 'HR Manager', initials: 'EC' },
  { id: '3', name: 'Michael Chang', email: 'michael@example.com', role: 'Finance Controller', initials: 'MC' },
  { id: '4', name: 'Sarah Connor', email: 'sarah@example.com', role: 'Inventory Manager', initials: 'SC' },
  { id: '5', name: 'John Smith', email: 'john@example.com', role: 'Employee', initials: 'JS' },
];

export const DEFAULT_PERMISSIONS: Record<Role, string[]> = {
  'Super Admin': ['*'],
  'HR Manager': ['view:dashboard', 'view:hrm', 'view:resources', 'view:ai'],
  'Finance Controller': ['view:dashboard', 'view:finance', 'view:inventory', 'view:resources', 'view:ai'],
  'Inventory Manager': ['view:dashboard', 'view:inventory', 'view:resources', 'view:ai'],
  'Employee': ['view:dashboard', 'view:self_service', 'view:resources', 'view:ai'],
};

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  hasPermission: (permission: string) => boolean;
  rolePermissions: Record<Role, string[]>;
  updateRolePermission: (role: Role, permission: string, hasAccess: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [rolePermissions, setRolePermissions] = useState<Record<Role, string[]>>(DEFAULT_PERMISSIONS);

  const hasPermission = (permission: string) => {
    const userPerms = rolePermissions[currentUser.role];
    if (userPerms.includes('*')) return true;
    return userPerms.includes(permission);
  };

  const updateRolePermission = (role: Role, permission: string, hasAccess: boolean) => {
    setRolePermissions(prev => {
      const perms = prev[role];
      if (hasAccess && !perms.includes(permission)) {
        return { ...prev, [role]: [...perms, permission] };
      } else if (!hasAccess && perms.includes(permission)) {
        return { ...prev, [role]: perms.filter(p => p !== permission) };
      }
      return prev;
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, hasPermission, rolePermissions, updateRolePermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
