import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, Sparkles, Shield, UserCheck, Key, Lock, AlertTriangle, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth, Role, DEFAULT_PERMISSIONS } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AVAILABLE_PERMISSIONS = [
  { id: 'view:dashboard', label: 'Dashboard' },
  { id: 'view:crm', label: 'CRM Module' },
  { id: 'view:hrm', label: 'HRM Module' },
  { id: 'view:finance', label: 'Finance Module' },
  { id: 'view:inventory', label: 'Inventory Module' },
  { id: 'view:resources', label: 'Resources' },
  { id: 'view:admin', label: 'Admin Settings' },
  { id: 'view:self_service', label: 'Employee Self-Service' },
  { id: 'view:ai', label: 'AI Copilot' },
];

export default function AccessControl() {
  const { rolePermissions, updateRolePermission } = useAuth();
  const [activeTab, setActiveTab] = useState('roles');
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const rolesList: { id: string; name: Role; users: number; status: string; aiInsight: string; scope: string }[] = [
    { id: 'ROLE-01', name: 'Super Admin', users: 1, status: 'Active', aiInsight: 'No anomalies detected', scope: 'Global' },
    { id: 'ROLE-02', name: 'HR Manager', users: 2, status: 'Active', aiInsight: 'Consider restricting payroll access for 1 user', scope: 'Company' },
    { id: 'ROLE-03', name: 'Finance Controller', users: 1, status: 'Active', aiInsight: 'Least privilege optimized', scope: 'BU' },
    { id: 'ROLE-04', name: 'Inventory Manager', users: 3, status: 'Active', aiInsight: 'Unusual after-hours access detected', scope: 'Dept' },
    { id: 'ROLE-05', name: 'Employee', users: 145, status: 'Active', aiInsight: 'Standard access pattern', scope: 'Self' },
  ];

  const handleTogglePermission = (role: Role, permission: string, currentAccess: boolean) => {
    if (role === 'Super Admin') {
      toast.error('Cannot modify Super Admin permissions');
      return;
    }
    updateRolePermission(role, permission, !currentAccess);
    toast.success(`Permission updated for ${role}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Access Control (RBAC)</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button 
              onClick={() => setActiveTab('roles')}
              className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'roles' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
            >
              Roles & Permissions
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'users' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'audit' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
            >
              Audit Logs
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            AI Security Audit
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
            <ListFilter className="w-3 h-3" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4" />
          Zero Trust Architecture
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col gap-4">
        {activeTab === 'roles' && (
          <>
            <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-slate-400 h-9">Role Name</TableHead>
                    <TableHead className="text-xs font-medium text-slate-400 h-9">Assigned Users</TableHead>
                    <TableHead className="text-xs font-medium text-slate-400 h-9">Access Level</TableHead>
                    <TableHead className="text-xs font-medium text-slate-400 h-9">Data Scope</TableHead>
                    <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                    <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Security Insight
                    </TableHead>
                    <TableHead className="text-xs font-medium text-slate-400 h-9 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesList.map((role) => {
                    const isEditing = editingRole === role.name;
                    const perms = rolePermissions[role.name] || [];
                    const isSuperAdmin = role.name === 'Super Admin';
                    const accessLevel = isSuperAdmin ? 'Full System' : `${perms.length} Modules`;

                    return (
                      <React.Fragment key={role.id}>
                        <TableRow className={cn("border-slate-200 hover:bg-slate-50 cursor-pointer", isEditing && "bg-slate-50")}>
                          <TableCell className="py-2 font-medium text-sm text-slate-800">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-slate-400" />
                              {role.name}
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-sm text-slate-700">
                            <div className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-slate-400" />
                              {role.users}
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-sm text-slate-500">{accessLevel}</TableCell>
                          <TableCell className="py-2 text-sm text-slate-500">
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 font-normal">
                              {role.scope}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2">
                            <Badge variant="success" className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                              {role.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-xs">
                            <div className={`flex items-center gap-1 ${role.aiInsight.includes('Unusual') || role.aiInsight.includes('restricting') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                              {(role.aiInsight.includes('Unusual') || role.aiInsight.includes('restricting')) && <AlertTriangle className="w-3 h-3" />}
                              {role.aiInsight}
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setEditingRole(isEditing ? null : role.name)}
                              className="h-8 px-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                            >
                              {isEditing ? 'Close' : 'Edit Permissions'}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {isEditing && (
                          <TableRow className="bg-slate-50/50 border-b border-slate-200">
                            <TableCell colSpan={6} className="p-4">
                              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-slate-800 mb-3">Module Permissions for {role.name}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {AVAILABLE_PERMISSIONS.map(perm => {
                                    const hasAccess = isSuperAdmin || perms.includes(perm.id);
                                    return (
                                      <button
                                        key={perm.id}
                                        disabled={isSuperAdmin}
                                        onClick={() => handleTogglePermission(role.name, perm.id, hasAccess)}
                                        className={cn(
                                          "flex items-center justify-between p-2 rounded border text-left transition-colors",
                                          hasAccess 
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300",
                                          isSuperAdmin && "opacity-70 cursor-not-allowed"
                                        )}
                                      >
                                        <span className="text-xs font-medium">{perm.label}</span>
                                        {hasAccess ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        ) : (
                                          <X className="w-3.5 h-3.5 text-slate-400" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
