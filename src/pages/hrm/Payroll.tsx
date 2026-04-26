import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, Settings2, Sparkles, FileText, Download, CheckCircle2, HeartPulse, ShieldAlert, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const payrollData = [
  { id: 1, period: 'Nov 2023', totalEmployees: 45, totalAmount: '$450,000', benefits: '$45,000', status: 'Processed', date: 'Nov 30, 2023', budgetNode: 'Acme Corp Global', aiInsight: 'No anomalies detected' },
  { id: 2, period: 'Oct 2023', totalEmployees: 44, totalAmount: '$440,000', benefits: '$44,000', status: 'Processed', date: 'Oct 31, 2023', budgetNode: 'Acme Corp Global', aiInsight: 'Overtime costs up 5%' },
  { id: 3, period: 'Sep 2023', totalEmployees: 42, totalAmount: '$420,000', benefits: '$42,000', status: 'Processed', date: 'Sep 30, 2023', budgetNode: 'Acme Corp Global', aiInsight: 'New hires added successfully' },
  { id: 4, period: 'Dec 2023', totalEmployees: 45, totalAmount: '$455,000', benefits: '$45,500', status: 'Draft', date: 'Dec 31, 2023', budgetNode: 'Acme Corp Global', aiInsight: 'Review pending bonuses' },
];

const myPayslips = [
  { id: 'PS-11', period: 'Nov 2023', date: 'Nov 30, 2023', netPay: '$4,250.00', status: 'Paid' },
  { id: 'PS-10', period: 'Oct 2023', date: 'Oct 31, 2023', netPay: '$4,250.00', status: 'Paid' },
  { id: 'PS-09', period: 'Sep 2023', date: 'Sep 30, 2023', netPay: '$4,250.00', status: 'Paid' },
  { id: 'PS-08', period: 'Aug 2023', date: 'Aug 31, 2023', netPay: '$4,250.00', status: 'Paid' },
];

const benefitsData = [
  { id: 'BEN-01', plan: 'Premium Health', provider: 'BlueCross', enrolled: 32, costPerEmployee: '$850/mo', status: 'Active', aiInsight: 'High utilization. Negotiate rates next cycle.' },
  { id: 'BEN-02', plan: 'Standard Dental', provider: 'Delta Dental', enrolled: 40, costPerEmployee: '$45/mo', status: 'Active', aiInsight: 'Cost effective. 90% enrollment rate.' },
  { id: 'BEN-03', plan: '401k Match 4%', provider: 'Fidelity', enrolled: 38, costPerEmployee: 'Variable', status: 'Active', aiInsight: 'Participation up 12% since last quarter.' },
];

const complianceData = [
  { id: 'TAX-01', form: 'Form 941 (Q3)', type: 'Federal Tax', dueDate: 'Oct 31, 2023', status: 'Filed', aiInsight: 'Filed on time. No discrepancies found.' },
  { id: 'TAX-02', form: 'W-2 Generation', type: 'Year-End', dueDate: 'Jan 31, 2024', status: 'Pending', aiInsight: 'Data collection at 95%. 2 employees missing updated addresses.' },
  { id: 'TAX-03', form: 'State Unemployment', type: 'State Tax', dueDate: 'Jan 15, 2024', status: 'Draft', aiInsight: 'Rate changed from 1.2% to 1.5% for 2024.' },
];

export default function Payroll({ hideHeader = false }: { hideHeader?: boolean }) {
  const [activeTab, setActiveTab] = useState('payroll');
  const { hasPermission } = useAuth();
  
  const isSelfServiceOnly = !hasPermission('view:hrm') && hasPermission('view:self_service');

  if (isSelfServiceOnly) {
    return (
      <div className="flex flex-col h-full max-w-5xl mx-auto w-full gap-6">
        {!hideHeader && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h1 className="text-xl font-semibold text-slate-900">My Payslips & Benefits</h1>
            <Button variant="outline" className="h-8 text-xs gap-2">
              <Download className="w-3 h-3" />
              Download Year-to-Date
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <DollarSign className="w-4 h-4 text-slate-400" />
              Latest Net Pay
            </div>
            <div className="text-2xl font-bold text-slate-900">$4,250.00</div>
            <div className="text-xs text-slate-500 mt-1">For period ending Nov 30, 2023</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <HeartPulse className="w-4 h-4 text-slate-400" />
              Active Benefits
            </div>
            <div className="text-2xl font-bold text-slate-900">3 <span className="text-sm font-normal text-slate-500">plans</span></div>
            <div className="text-xs text-slate-500 mt-1">Health, Dental, 401k</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              Next Pay Date
            </div>
            <div className="text-2xl font-bold text-slate-900">Dec 31</div>
            <div className="text-xs text-slate-500 mt-1">15 days remaining</div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="font-medium text-sm text-slate-800">Payslip History</div>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              View Tax Documents
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Period</TableHead>
                  <TableHead className="text-xs">Pay Date</TableHead>
                  <TableHead className="text-xs">Net Pay</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPayslips.map(slip => (
                  <TableRow key={slip.id}>
                    <TableCell className="text-sm font-medium text-slate-800">{slip.period}</TableCell>
                    <TableCell className="text-sm text-slate-500">{slip.date}</TableCell>
                    <TableCell className="text-sm font-medium text-slate-700">{slip.netPay}</TableCell>
                    <TableCell>
                      <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-normal text-xs">
                        {slip.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            <h1 className="text-xl font-semibold text-slate-900">Payroll & Benefits</h1>
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
              <button 
                onClick={() => setActiveTab('payroll')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'payroll' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Payroll Runs
              </button>
              <button 
                onClick={() => setActiveTab('benefits')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'benefits' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Benefits Enrollment
              </button>
              <button 
                onClick={() => setActiveTab('compliance')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'compliance' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Taxes & Compliance
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
              <Sparkles className="w-3 h-3" />
              {activeTab === 'payroll' ? 'AI Audit' : activeTab === 'benefits' ? 'AI Plan Optimizer' : 'AI Compliance Check'}
            </Button>
            <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
              <Plus className="w-3 h-3" />
              {activeTab === 'payroll' ? 'New Run' : activeTab === 'benefits' ? 'Add Plan' : 'File Form'}
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
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {activeTab === 'benefits' ? (
            <>
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span className="text-rose-600 font-medium">Open Enrollment: Active</span>
            </>
          ) : activeTab === 'compliance' ? (
            <>
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 font-medium">All systems compliant</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'payroll' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Period</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Budget Node</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Employees</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Total Payroll</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Benefits Cost</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Date</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Audit Note
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((run) => (
                  <TableRow key={run.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {run.period}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{run.budgetNode}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{run.totalEmployees}</TableCell>
                    <TableCell className="py-2 text-sm font-medium text-slate-700">{run.totalAmount}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{run.benefits}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant={run.status === 'Processed' ? 'success' : 'secondary'} className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                        {run.status === 'Processed' && <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />}
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{run.date}</TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className={`flex items-center gap-1 ${run.aiInsight.includes('Review') || run.aiInsight.includes('up') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                        {(run.aiInsight.includes('Review') || run.aiInsight.includes('up')) && <AlertTriangle className="w-3 h-3" />}
                        {run.aiInsight}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Plan Name</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Provider</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Enrolled</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Cost/Employee</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Optimization Insight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benefitsData.map((plan) => (
                  <TableRow key={plan.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="w-4 h-4 text-slate-400" />
                        {plan.plan}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{plan.provider}</TableCell>
                    <TableCell className="py-2 text-sm font-medium text-slate-700">{plan.enrolled}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{plan.costPerEmployee}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-normal text-xs">
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="text-blue-700/80 leading-tight">
                        {plan.aiInsight}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Form/Requirement</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Type</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Due Date</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Compliance Check
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceData.map((item) => (
                  <TableRow key={item.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-slate-400" />
                        {item.form}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{item.type}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{item.dueDate}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className={cn(
                        "font-normal text-xs",
                        item.status === 'Filed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        item.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className={`flex items-center gap-1 ${item.aiInsight.includes('missing') || item.aiInsight.includes('changed') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                        {(item.aiInsight.includes('missing') || item.aiInsight.includes('changed')) && <AlertTriangle className="w-3 h-3" />}
                        {item.aiInsight}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
