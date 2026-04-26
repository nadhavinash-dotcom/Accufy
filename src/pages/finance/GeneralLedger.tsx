import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, Sparkles, AlertTriangle, GitCommit, FileText, CheckCircle2, Landmark, ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const glTransactions = [
  { 
    id: 'GL-99201', 
    date: 'Nov 25, 2023 14:30', 
    account: '1010 - Cash Operating', 
    amount: '+$15,000.00', 
    currency: 'USD', 
    source: 'AR (Invoice INV-2023-001)', 
    status: 'Posted', 
    aiFlags: ['RevRec Applied'],
    auditThread: [
      { step: 'Invoice Created', user: 'System (Auto)', time: 'Oct 15, 2023 09:00', docId: 'INV-2023-001' },
      { step: 'Payment Received', user: 'Bank Sync', time: 'Nov 25, 2023 14:25', docId: 'PAY-8821' },
      { step: 'GL Post', user: 'System (Auto)', time: 'Nov 25, 2023 14:30', docId: 'GL-99201' },
      { step: 'Tax Impact', user: 'Tax Engine', time: 'Nov 25, 2023 14:31', docId: 'TAX-VAT-1500' }
    ]
  },
  { 
    id: 'GL-99202', 
    date: 'Nov 25, 2023 15:45', 
    account: '5020 - Travel Expenses', 
    amount: '-$3,450.00', 
    currency: 'USD', 
    source: 'AP (Expense EXP-102)', 
    status: 'Pending Review', 
    aiFlags: ['Anomaly Detected', 'Manual Override'],
    auditThread: [
      { step: 'Expense Submitted', user: 'Sarah Connor', time: 'Nov 18, 2023 11:20', docId: 'EXP-102' },
      { step: 'AI Flag: High Cost', user: 'AI Auditor', time: 'Nov 18, 2023 11:21', docId: 'FLAG-092' },
      { step: 'Manual Override', user: 'Avinash Nadh', time: 'Nov 25, 2023 15:40', docId: 'APPR-441' },
      { step: 'GL Post Pending', user: 'System', time: 'Nov 25, 2023 15:45', docId: 'GL-99202' }
    ]
  },
  { 
    id: 'GL-99203', 
    date: 'Nov 26, 2023 09:00', 
    account: '2010 - Accounts Payable', 
    amount: '-$1,200.00', 
    currency: 'EUR', 
    source: 'AP (Invoice SUP-INV-88)', 
    status: 'Posted', 
    aiFlags: ['Auto-Converted'],
    auditThread: [
      { step: 'Supplier Invoice', user: 'OCR Engine', time: 'Nov 24, 2023 10:00', docId: 'SUP-INV-88' },
      { step: 'PO Matched', user: 'AI Matcher', time: 'Nov 24, 2023 10:05', docId: 'PO-2023-45' },
      { step: 'Currency Conversion', user: 'Treasury Engine', time: 'Nov 26, 2023 08:59', docId: 'FX-EUR-USD' },
      { step: 'GL Post', user: 'System (Auto)', time: 'Nov 26, 2023 09:00', docId: 'GL-99203' }
    ]
  },
];

export default function GeneralLedger() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">General Ledger</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              All Entries
            </button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
              Flagged
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            AI Reconciliation
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Manual Journal
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
          <Landmark className="w-4 h-4" />
          Single Source of Truth
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Transaction ID</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Date</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Account</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Source</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Amount</TableHead>
              <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Flags
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {glTransactions.map((tx) => (
              <React.Fragment key={tx.id}>
                <TableRow 
                  className={cn(
                    "border-slate-200 cursor-pointer transition-colors",
                    expandedRow === tx.id ? "bg-slate-100" : "hover:bg-slate-100/30"
                  )}
                  onClick={() => toggleRow(tx.id)}
                >
                  <TableCell className="py-2">
                    {expandedRow === tx.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </TableCell>
                  <TableCell className="py-2 font-medium text-sm text-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      {tx.id}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-sm text-slate-500">{tx.date}</TableCell>
                  <TableCell className="py-2 text-sm text-slate-700">{tx.account}</TableCell>
                  <TableCell className="py-2 text-sm text-slate-500">{tx.source}</TableCell>
                  <TableCell className={cn("py-2 text-sm font-medium", tx.amount.startsWith('+') ? "text-emerald-600" : "text-slate-800")}>
                    {tx.amount} <span className="text-xs text-slate-400 font-normal">{tx.currency}</span>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-wrap gap-1">
                      {tx.aiFlags.map((flag, i) => (
                        <Badge key={i} variant="outline" className={cn(
                          "text-[10px] border-slate-300 bg-slate-100",
                          flag.includes('Anomaly') || flag.includes('Override') ? "text-amber-600 border-amber-200 bg-amber-50" : "text-blue-600 border-blue-200 bg-blue-50"
                        )}>
                          {flag.includes('Anomaly') && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Expandable Audit Thread */}
                {expandedRow === tx.id && (
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-4 border-l-2 border-blue-600 ml-4 my-2 bg-white rounded-r-md">
                        <div className="flex items-center gap-2 mb-4">
                          <GitCommit className="w-4 h-4 text-blue-600" />
                          <h4 className="text-sm font-medium text-slate-800">Immutable Audit Thread</h4>
                        </div>
                        
                        <div className="relative flex justify-between items-start before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                          <div className="flex flex-col sm:flex-row w-full gap-4 relative">
                            {tx.auditThread.map((step, idx) => (
                              <div key={idx} className="flex-1 relative">
                                <div className="flex items-center mb-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center z-10 relative text-[10px] text-slate-500">
                                    {idx + 1}
                                  </div>
                                  {idx < tx.auditThread.length - 1 && (
                                    <div className="h-px bg-slate-100 flex-1 hidden sm:block"></div>
                                  )}
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded p-2 text-xs">
                                  <div className="font-medium text-slate-700 mb-1">{step.step}</div>
                                  <div className="text-slate-400 mb-1">By: {step.user}</div>
                                  <div className="text-slate-400 mb-1">{step.time}</div>
                                  <div className="text-blue-600/80 font-mono text-[10px]">{step.docId}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
