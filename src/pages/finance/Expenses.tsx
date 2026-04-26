import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, Settings2, Sparkles, Building2, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const expenses = [
  { id: 'EXP-101', category: 'Software Subscriptions', amount: '$1,200', date: 'Nov 15, 2023', vendor: 'Adobe Systems', status: 'Approved', aiInsight: 'OCR Matched with PO-2023-12', ocrStatus: 'Matched' },
  { id: 'EXP-102', category: 'Travel', amount: '$3,450', date: 'Nov 18, 2023', vendor: 'Delta Airlines', status: 'Pending', aiInsight: 'Unusually high flight cost detected', ocrStatus: 'Flagged' },
  { id: 'EXP-103', category: 'Office Supplies', amount: '$450', date: 'Nov 20, 2023', vendor: 'Staples', status: 'Approved', aiInsight: 'Within budget limits', ocrStatus: 'Matched' },
  { id: 'EXP-104', category: 'Client Entertainment', amount: '$850', date: 'Nov 22, 2023', vendor: 'Steakhouse', status: 'Rejected', aiInsight: 'Missing receipt documentation', ocrStatus: 'Missing' },
];

export default function Expenses() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Accounts Payable</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              All Bills
            </button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
              Pending Approval
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            AI OCR & Match
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Upload Bill
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
              <TableHead className="text-xs font-medium text-slate-400 h-9">Bill ID</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Category</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Amount</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Date</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Vendor</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
              <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI AP Insight
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((exp) => (
              <TableRow key={exp.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                <TableCell className="py-2 font-medium text-sm text-slate-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {exp.id}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm text-slate-700">{exp.category}</TableCell>
                <TableCell className="py-2 text-sm font-medium text-slate-800">{exp.amount}</TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{exp.date}</TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{exp.vendor}</TableCell>
                <TableCell className="py-2">
                  <Badge variant={
                    exp.status === 'Approved' ? 'success' : 
                    exp.status === 'Rejected' ? 'destructive' : 'warning'
                  } className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                    {exp.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 text-xs">
                  <div className={`flex items-center gap-1 ${exp.ocrStatus === 'Flagged' || exp.ocrStatus === 'Missing' ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                    {(exp.ocrStatus === 'Flagged' || exp.ocrStatus === 'Missing') && <AlertTriangle className="w-3 h-3" />}
                    {exp.ocrStatus === 'Matched' && <CheckCircle2 className="w-3 h-3" />}
                    {exp.aiInsight}
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
    </div>
  );
}
