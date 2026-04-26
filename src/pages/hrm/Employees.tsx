import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, Settings2, Sparkles, UserPlus, FileText, Shield, AlertTriangle, UserCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

const employees = [
  { id: 1, name: 'Avinash Nadh', role: 'CEO', department: 'Executive', orgNode: 'Acme Corp Global', status: 'Active', lifecycle: 'Tenured', joined: 'Jan 2020', salary: '$150,000', aiInsight: 'High performer, due for review' },
  { id: 2, name: 'Sarah Connor', role: 'VP Sales', department: 'Sales', orgNode: 'Sales, Acme Corp NA', status: 'Active', lifecycle: 'Tenured', joined: 'Mar 2021', salary: '$120,000', aiInsight: 'Exceeded Q3 targets' },
  { id: 3, name: 'John Smith', role: 'Lead Developer', department: 'Engineering', orgNode: 'Frontend Team', status: 'On Leave', lifecycle: 'Tenured', joined: 'Jun 2022', salary: '$110,000', aiInsight: 'Returning next week' },
  { id: 4, name: 'Emily Chen', role: 'HR Manager', department: 'HR', orgNode: 'Acme Corp EMEA', status: 'Active', lifecycle: 'Probation', joined: 'Sep 2023', salary: '$90,000', aiInsight: 'Managing 3 open requisitions' },
  { id: 5, name: 'David Kim', role: 'Backend Engineer', department: 'Engineering', orgNode: 'Backend Team', status: 'Offboarding', lifecycle: 'Exiting', joined: 'Feb 2022', salary: '$105,000', aiInsight: 'Exit interview scheduled for Friday' },
];

const transfers = [
  { id: 'TRF-001', employee: 'Alice Johnson', sourceNode: 'Frontend Team, NA', destNode: 'Frontend Team, EMEA', status: 'Pending Approval', approvers: 'David Kim (Source), Michael Chang (Dest)', aiInsight: 'Cross-border tax implications detected. Auto-generating compliance checklist.' },
  { id: 'TRF-002', employee: 'Bob Williams', sourceNode: 'Backend Team, NA', destNode: 'Engineering, NA', status: 'Approved', approvers: 'David Kim (Source/Dest)', aiInsight: 'Internal promotion. Salary band adjustment recommended.' },
];

const exitInterviews = [
  { id: 'EXIT-001', employee: 'David Kim', role: 'Backend Engineer', date: 'Nov 30, 2023', reason: 'Career Growth', aiSentiment: 'Neutral', aiInsight: 'Primary driver was lack of senior mentorship opportunities. Suggest implementing a formal mentorship program.' },
  { id: 'EXIT-002', employee: 'Lisa Wang', role: 'Marketing Specialist', date: 'Oct 15, 2023', reason: 'Compensation', aiSentiment: 'Negative', aiInsight: 'Salary was 15% below market average for this role. Review compensation bands.' },
];

export default function Employees({ hideHeader = false }: { hideHeader?: boolean }) {
  const [activeTab, setActiveTab] = useState('directory');
  const { currentUser, hasPermission } = useAuth();
  
  // Modal states
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  
  const isSelfServiceOnly = !hasPermission('view:hrm') && hasPermission('view:self_service');

  if (isSelfServiceOnly) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
        {!hideHeader && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
            <Button variant="outline" className="h-8 text-xs">Edit Profile</Button>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-6 pb-6 relative">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-blue-600 -mt-12 mb-4">
              {currentUser.initials}
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                <p className="text-slate-500 font-medium">{currentUser.role}</p>
              </div>
              <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active Employee</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {currentUser.name.toLowerCase().replace(' ', '.')}@company.com
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    +1 (555) 123-4567
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    San Francisco, CA
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Employment Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Employee ID</span>
                    <span className="font-medium text-slate-900">EMP-{currentUser.id.padStart(4, '0')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Department</span>
                    <span className="font-medium text-slate-900">General</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Manager</span>
                    <span className="font-medium text-slate-900">Jane Doe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {!hideHeader && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-900">Employee Directory</h1>
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
              <button 
                onClick={() => setActiveTab('directory')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'directory' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Directory
              </button>
              <button 
                onClick={() => setActiveTab('transfers')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'transfers' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Transfer Hub
              </button>
              <button 
                onClick={() => setActiveTab('exit')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'exit' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Exit Management
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
              <Sparkles className="w-3 h-3" />
              {activeTab === 'directory' ? 'AI Retention Insights' : activeTab === 'transfers' ? 'AI Transfer Impact' : 'AI Exit Analysis'}
            </Button>
            <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1" onClick={() => {
              if (activeTab === 'directory') setShowAddEmpModal(true);
              else if (activeTab === 'transfers') setShowTransferModal(true);
            }}>
              <UserPlus className="w-3 h-3" />
              {activeTab === 'directory' ? 'Add Employee' : activeTab === 'transfers' ? 'Initiate Transfer' : 'Log Exit Interview'}
            </Button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
            <ListFilter className="w-3 h-3" />
            Filter
          </Button>
        </div>
        <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
          <Settings2 className="w-3 h-3" />
          Display
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'directory' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Name</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Role</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Org Node</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Lifecycle</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Joined</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Insight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-700 border border-slate-300">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm text-slate-800">{emp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{emp.role}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">
                      <div className="text-slate-700">{emp.orgNode}</div>
                      <div className="text-xs text-slate-400">{emp.department}</div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'Offboarding' ? 'destructive' : 'secondary'} className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">
                      <span className={`text-xs ${emp.lifecycle === 'Probation' ? 'text-amber-600' : emp.lifecycle === 'Exiting' ? 'text-red-600' : 'text-slate-500'}`}>
                        {emp.lifecycle}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{emp.joined}</TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className={`flex items-center gap-1 ${emp.aiInsight.includes('Exit') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                        {emp.aiInsight.includes('Exit') && <AlertTriangle className="w-3 h-3" />}
                        {emp.aiInsight}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'transfers' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Employee</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Source Node</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Destination Node</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Approvers</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Insight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">{transfer.employee}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{transfer.sourceNode}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{transfer.destNode}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className={cn(
                        "font-normal text-xs",
                        transfer.status === 'Approved' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        transfer.status === 'Pending Approval' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{transfer.approvers}</TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className={`flex items-center gap-1 ${transfer.aiInsight.includes('tax') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                        {transfer.aiInsight.includes('tax') && <AlertTriangle className="w-3 h-3" />}
                        {transfer.aiInsight}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'exit' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Employee</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Role</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Exit Date</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Primary Reason</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Sentiment</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Exit Analysis
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exitInterviews.map((interview) => (
                  <TableRow key={interview.id} className="border-slate-200 hover:bg-slate-100">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">{interview.employee}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{interview.role}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{interview.date}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-700">{interview.reason}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className={cn(
                        "font-normal text-xs",
                        interview.aiSentiment === 'Positive' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        interview.aiSentiment === 'Negative' ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {interview.aiSentiment}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="text-blue-700/80 leading-tight">
                        {interview.aiInsight}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-xs text-right">
                       <div className="flex justify-end gap-1 flex-col sm:flex-row">
                          <Button variant="outline" size="sm" className="h-6 text-[10px] bg-red-50 text-red-700 hover:bg-red-100 border-red-200 gap-1 font-medium" onClick={() => setShowRevokeModal(true)}>
                            <Shield className="w-3 h-3"/> Revoke Access
                          </Button>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] bg-slate-50 border-slate-200 hover:text-slate-900 gap-1 font-medium" onClick={() => toast.success('FnF (Full and Final) payroll data compiled and sent to Finance.')}>
                            <FileText className="w-3 h-3"/> Generate FnF Payroll
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={showAddEmpModal} onClose={() => setShowAddEmpModal(false)} title="Add New Employee">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <Input placeholder="e.g. John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <Input placeholder="e.g. Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <Input placeholder="john.doe@acmecorp.com" type="email" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <Input placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Org Node</label>
              <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm">
                <option>Acme Corp Global</option>
                <option>Acme Corp EMEA</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowAddEmpModal(false)}>Cancel</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
              toast.success('Successfully added new employee to the Directory');
              setShowAddEmpModal(false);
            }}>Add Employee</Button>
          </div>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} title="Initiate Internal Transfer">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
            <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm">
               {employees.map(e => <option key={e.id}>{e.name} ({e.role})</option>)}
            </select>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-3">
             <h4 className="text-sm font-medium text-slate-800">Transfer Destination</h4>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">New Node</label>
                 <select className="w-full h-8 px-2 py-1 rounded border border-slate-200 bg-white text-xs">
                   <option>Backend Team, NA</option>
                   <option>Frontend Team, EMEA</option>
                 </select>
               </div>
               <div>
                 <label className="block text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">New Manager</label>
                 <Input className="h-8 text-xs px-2" placeholder="Manager Name" />
               </div>
             </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowTransferModal(false)}>Cancel</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 text-xs" onClick={() => {
              toast.success('Transfer request initiated and routed to Approvers.');
              setShowTransferModal(false);
            }}>Initiate Request</Button>
          </div>
        </div>
      </Modal>

      {/* Revoke Access Modal */}
      <Modal isOpen={showRevokeModal} onClose={() => setShowRevokeModal(false)} title="Revoke IT Access">
         <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-3 rounded flex gap-2 items-start">
               <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
               <p className="text-sm text-red-800">You are about to issue a command to instantly revoke all IT systems and building access for this user. This action cannot be undone automatically.</p>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <input type="checkbox" className="rounded border-slate-300" defaultChecked /> 
                Revoke Google Workspace / Email Sign-in
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <input type="checkbox" className="rounded border-slate-300" defaultChecked /> 
                Revoke VPN & Internal Network
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <input type="checkbox" className="rounded border-slate-300" defaultChecked /> 
                Deactivate Keycard / Building Access
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowRevokeModal(false)}>Cancel</Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => {
                 toast.error('All access tokens and sessions forcefully revoked.');
                 setShowRevokeModal(false);
              }}>Confirm Revocation</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
