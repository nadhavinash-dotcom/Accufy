import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, Settings2, Sparkles, Receipt, Download, FileText, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const invoices = [
  { id: 'INV-2023-001', client: 'Acme Corp', amount: '$15,000', date: 'Oct 15, 2023', dueDate: 'Nov 15, 2023', status: 'Paid', aiInsight: 'Paid 3 days early', creditStatus: 'Good' },
  { id: 'INV-2023-002', client: 'Globex Inc', amount: '$45,000', date: 'Nov 01, 2023', dueDate: 'Dec 01, 2023', status: 'Pending', aiInsight: 'High probability of late payment', creditStatus: 'Warning' },
  { id: 'INV-2023-003', client: 'Soylent Corp', amount: '$8,500', date: 'Nov 10, 2023', dueDate: 'Dec 10, 2023', status: 'Overdue', aiInsight: 'Automated dunning sent (Level 2)', creditStatus: 'Critical' },
  { id: 'INV-2023-004', client: 'Initech', amount: '$22,000', date: 'Nov 20, 2023', dueDate: 'Dec 20, 2023', status: 'Draft', aiInsight: 'Ready for review', creditStatus: 'Good' },
];

export default function Invoices() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Accounts Receivable</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              All Invoices
            </button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
              Overdue
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            AI Dunning & Credit
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Create Invoice
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
        <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
          <Settings2 className="w-3 h-3" />
          Display
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-slate-400 h-9">Invoice ID</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Client</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Amount</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Due Date</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Credit Limit</TableHead>
              <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI AR Insight
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                <TableCell className="py-2 font-medium text-sm text-slate-800">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-slate-400" />
                    {inv.id}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm text-slate-700">{inv.client}</TableCell>
                <TableCell className="py-2 text-sm font-medium text-slate-800">{inv.amount}</TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{inv.dueDate}</TableCell>
                <TableCell className="py-2">
                  <Badge variant={
                    inv.status === 'Paid' ? 'success' : 
                    inv.status === 'Overdue' ? 'destructive' : 
                    inv.status === 'Pending' ? 'warning' : 'secondary'
                  } className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  <div className={`text-xs flex items-center gap-1 ${inv.creditStatus === 'Critical' ? 'text-red-600' : inv.creditStatus === 'Warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {inv.creditStatus === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                    {inv.creditStatus}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-xs text-blue-600/80 italic">{inv.aiInsight}</TableCell>
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
    </div>
  );
}
