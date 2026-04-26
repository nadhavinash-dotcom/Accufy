import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, Sparkles, Clock, Calendar, AlertTriangle, CheckCircle2, ShieldCheck, FileText, Play, Square } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

const attendanceRecords = [
  { id: 'ATT-001', employee: 'John Smith', date: 'Nov 25, 2023', clockIn: '08:55 AM', clockOut: '05:05 PM', totalHours: '8h 10m', status: 'Present', aiInsight: 'Consistent schedule' },
  { id: 'ATT-002', employee: 'Sarah Connor', date: 'Nov 25, 2023', clockIn: '09:30 AM', clockOut: '06:45 PM', totalHours: '9h 15m', status: 'Late', aiInsight: 'High burnout risk: 3rd late shift this week' },
  { id: 'ATT-003', employee: 'Emily Chen', date: 'Nov 25, 2023', clockIn: '-', clockOut: '-', totalHours: '0h', status: 'On Leave', aiInsight: 'Approved PTO (Vacation)' },
  { id: 'ATT-004', employee: 'Michael Chang', date: 'Nov 25, 2023', clockIn: '09:00 AM', clockOut: '05:00 PM', totalHours: '8h 00m', status: 'Present', aiInsight: 'Potential buddy punching detected' },
];

const leaveRequests = [
  { id: 'LR-101', employee: 'David Kim', type: 'Sick Leave', dates: 'Dec 01 - Dec 02', days: 2, status: 'Pending', approver: 'Michael Chang (Backend Team Lead)', aiInsight: 'High probability of approval based on balance and team capacity.' },
  { id: 'LR-102', employee: 'Sarah Connor', type: 'Vacation', dates: 'Dec 15 - Dec 29', days: 10, status: 'Approved', approver: 'Avinash Nadh (CEO)', aiInsight: 'Coverage plan verified. No critical project overlap.' },
  { id: 'LR-103', employee: 'John Smith', type: 'Personal', dates: 'Dec 05', days: 1, status: 'Pending', approver: 'Sarah Connor (VP Sales)', aiInsight: 'Warning: 3 other team members off on this date.' },
];

const leavePolicies = [
  { id: 'POL-01', name: 'Standard PTO', allowance: '20 Days', accrual: 'Monthly', enrolled: 145, utilization: '78%', status: 'Active', scope: 'Global', aiInsight: 'Utilization is healthy. 15% of employees have >10 days rolling over.' },
  { id: 'POL-02', name: 'Sick Leave', allowance: '10 Days', accrual: 'Annual', enrolled: 150, utilization: '42%', status: 'Active', scope: 'Global', aiInsight: 'Below industry average utilization. Monitor for presenteeism.' },
  { id: 'POL-03', name: 'Parental Leave', allowance: '16 Weeks', accrual: 'Per Event', enrolled: 150, utilization: 'N/A', status: 'Active', scope: 'Global', aiInsight: 'Highly competitive policy. Strong retention driver.' },
  { id: 'POL-04', name: 'Sabbatical', allowance: '4 Weeks', accrual: 'After 5 Years', enrolled: 32, utilization: '12%', status: 'Active', scope: 'Acme Corp EMEA', aiInsight: 'Consider expanding eligibility to improve long-term retention.' },
];

export default function TimeAttendance({ hideHeader = false }: { hideHeader?: boolean }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const { currentUser, hasPermission } = useAuth();
  
  // Modal states
  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  const isSelfServiceOnly = !hasPermission('view:hrm') && hasPermission('view:self_service');

  if (isSelfServiceOnly) {
    const myAttendance = attendanceRecords.filter(r => r.employee === currentUser.name) || [];
    const myLeaves = leaveRequests.filter(r => r.employee === currentUser.name) || [];

    return (
      <div className="flex flex-col h-full max-w-5xl mx-auto w-full gap-6">
        {!hideHeader && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h1 className="text-xl font-semibold text-slate-900">My Time & Leave</h1>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-500 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              <Button 
                onClick={() => setIsClockedIn(!isClockedIn)}
                className={cn(
                  "h-9 gap-2 transition-all",
                  isClockedIn ? "bg-red-600 hover:bg-red-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                {isClockedIn ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">Hours This Week</div>
            <div className="text-2xl font-bold text-slate-900">32.5 <span className="text-sm font-normal text-slate-500">/ 40h</span></div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">PTO Balance</div>
            <div className="text-2xl font-bold text-slate-900">12 <span className="text-sm font-normal text-slate-500">days</span></div>
            <Button variant="link" className="h-auto p-0 text-blue-600 text-xs mt-2" onClick={() => setShowLeaveModal(true)}>Request Time Off</Button>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">Sick Leave Balance</div>
            <div className="text-2xl font-bold text-slate-900">8 <span className="text-sm font-normal text-slate-500">days</span></div>
            <Button variant="link" className="h-auto p-0 text-blue-600 text-xs mt-2" onClick={() => setShowLeaveModal(true)}>Request Sick Leave</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 font-medium text-sm text-slate-800">
              Recent Timesheets
            </div>
            <div className="flex-1 overflow-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">In</TableHead>
                    <TableHead className="text-xs">Out</TableHead>
                    <TableHead className="text-xs">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myAttendance.length > 0 ? myAttendance.map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="text-xs">{record.date}</TableCell>
                      <TableCell className="text-xs">{record.clockIn}</TableCell>
                      <TableCell className="text-xs">{record.clockOut}</TableCell>
                      <TableCell className="text-xs font-medium">{record.totalHours}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-slate-500 py-8">
                        No recent timesheets found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 font-medium text-sm text-slate-800">
              My Leave Requests
            </div>
            <div className="flex-1 overflow-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Dates</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myLeaves.length > 0 ? myLeaves.map(req => (
                    <TableRow key={req.id}>
                      <TableCell className="text-xs">{req.type}</TableCell>
                      <TableCell className="text-xs">{req.dates}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={cn(
                          "font-normal text-[10px] px-1.5 py-0",
                          req.status === 'Approved' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          req.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                          {req.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-slate-500 py-8">
                        No leave requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
            <h1 className="text-xl font-semibold text-slate-900">Time & Attendance</h1>
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
              <button 
                onClick={() => setActiveTab('daily')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'daily' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Daily Log
              </button>
              <button 
                onClick={() => setActiveTab('leaves')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'leaves' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Leave Management
              </button>
              <button 
                onClick={() => setActiveTab('policies')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'policies' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Leave Policies
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
              <Sparkles className="w-3 h-3" />
              {activeTab === 'daily' ? 'AI Workforce Optimizer' : activeTab === 'leaves' ? 'AI Leave Approvals' : 'AI Policy Insights'}
            </Button>
            <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1" onClick={() => {
              if (activeTab === 'daily') setShowLogTimeModal(true);
              else if (activeTab === 'leaves') setShowLeaveModal(true);
            }}>
              <Plus className="w-3 h-3" />
              {activeTab === 'daily' ? 'Log Time' : activeTab === 'leaves' ? 'Request Leave' : 'Create Policy'}
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
          {activeTab === 'daily' && (
            <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
              <Calendar className="w-3 h-3" />
              Today: Nov 25, 2023
            </Button>
          )}
        </div>
        <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
          <Settings2 className="w-3 h-3" />
          Display
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'daily' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Employee</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Date</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Clock In</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Clock Out</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Total Hours</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Insight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {record.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        {record.employee}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{record.date}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-700">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {record.clockIn}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-700">{record.clockOut}</TableCell>
                    <TableCell className="py-2 text-sm font-medium text-slate-800">{record.totalHours}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant={
                        record.status === 'Present' ? 'success' : 
                        record.status === 'Late' ? 'destructive' : 'secondary'
                      } className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className={`flex items-center gap-1 ${record.aiInsight.includes('burnout') || record.aiInsight.includes('buddy') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                        {(record.aiInsight.includes('burnout') || record.aiInsight.includes('buddy')) && <AlertTriangle className="w-3 h-3" />}
                        {record.aiInsight.includes('Consistent') && <CheckCircle2 className="w-3 h-3" />}
                        {record.aiInsight}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Employee</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Leave Type</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Dates</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Days</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Approver</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Approval Insight
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((req) => (
                  <TableRow key={req.id} className="border-slate-200 hover:bg-slate-100">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {req.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        {req.employee}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{req.type}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-700">{req.dates}</TableCell>
                    <TableCell className="py-2 text-sm font-medium text-slate-800">{req.days}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className={cn(
                        "font-normal text-xs",
                        req.status === 'Approved' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        req.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{req.approver}</TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className={`flex items-center gap-1 ${req.aiInsight.includes('Warning') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                        {req.aiInsight.includes('Warning') && <AlertTriangle className="w-3 h-3" />}
                        {req.aiInsight}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-xs text-right">
                       <div className="flex justify-end gap-1 flex-col sm:flex-row">
                          {req.status === 'Pending' && (
                             <>
                              <Button variant="outline" size="sm" className="h-6 text-[10px] bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 gap-1 font-medium" onClick={() => toast.success('Leave Request Approved')}>
                                <CheckCircle2 className="w-3 h-3"/> Approve
                              </Button>
                              <Button variant="outline" size="sm" className="h-6 text-[10px] bg-red-50 border-red-200 text-red-700 hover:bg-red-100 gap-1 font-medium" onClick={() => toast.success('Leave Request Rejected')}>
                                <AlertTriangle className="w-3 h-3"/> Reject
                              </Button>
                             </>
                          )}
                          {req.status === 'Approved' && (
                            <Button variant="outline" size="sm" className="h-6 text-[10px] bg-slate-50 border-slate-200 hover:text-slate-900 gap-1 font-medium" onClick={() => toast.success('Synced to integrated calendars')}>
                              <Calendar className="w-3 h-3"/> View in Calendar
                            </Button>
                          )}
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Policy Name</th>
                  <th className="px-4 py-3 font-medium">Scope (Node)</th>
                  <th className="px-4 py-3 font-medium">Allowance</th>
                  <th className="px-4 py-3 font-medium">Accrual</th>
                  <th className="px-4 py-3 font-medium">Enrolled</th>
                  <th className="px-4 py-3 font-medium">Utilization</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">AI Policy Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {leavePolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{policy.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 font-normal">
                        {policy.scope}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{policy.allowance}</td>
                    <td className="px-4 py-3 text-slate-500">{policy.accrual}</td>
                    <td className="px-4 py-3 text-slate-500">{policy.enrolled}</td>
                    <td className="px-4 py-3 text-slate-500">{policy.utilization}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-normal text-xs">
                        {policy.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-start gap-1.5 text-xs ${policy.aiInsight.includes('Below') || policy.aiInsight.includes('Consider') ? 'text-amber-600' : 'text-blue-600'}`}>
                        {policy.aiInsight.includes('Below') || policy.aiInsight.includes('Consider') ? <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                        <span className="leading-tight">{policy.aiInsight}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Leave Modal */}
      <Modal isOpen={showLeaveModal} onClose={() => setShowLeaveModal(false)} title="Request Time Off">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
            <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm">
              <option>PTO / Vacation</option>
              <option>Sick Leave</option>
              <option>Parental Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
               <Input type="date" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
               <Input type="date" />
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
            <textarea className="w-full flex min-h-[80px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 resize-none" placeholder="Add a short note for your manager..."></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 text-xs" onClick={() => {
              toast.success('Leave request submitted to your manager for approval.');
              setShowLeaveModal(false);
            }}>Submit Request</Button>
          </div>
        </div>
      </Modal>

      {/* Log Time Modal */}
      <Modal isOpen={showLogTimeModal} onClose={() => setShowLogTimeModal(false)} title="Log Past Time / Timesheet">
         <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
               <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm">
                 <option>John Smith</option>
                 <option>Sarah Connor</option>
                 <option>David Kim</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
               <Input type="date" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Clock In Time</label>
                  <Input type="time" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Clock Out Time</label>
                  <Input type="time" />
               </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowLogTimeModal(false)}>Cancel</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
                 toast.success('Historical timesheet entry successfully added.');
                 setShowLogTimeModal(false);
              }}>Save Entry</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
