import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/Input';

const transactions = [
  { id: 1, date: '2023-10-25', description: 'Software License - Acme Corp', amount: '+$5,000.00', type: 'Income', status: 'Completed' },
  { id: 2, date: '2023-10-24', description: 'AWS Hosting', amount: '-$1,200.00', type: 'Expense', status: 'Completed' },
  { id: 3, date: '2023-10-22', description: 'Consulting - Globex Inc', amount: '+$12,000.00', type: 'Income', status: 'Pending' },
];

export default function Finance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-900/30 text-emerald-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">$124,500</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-900/30 text-red-600 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-slate-900">$32,100</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-900/30 text-blue-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Net Profit</p>
              <h3 className="text-2xl font-bold text-slate-900">$92,400</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search transactions..." className="pl-9" />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date}</TableCell>
                  <TableCell className="font-medium text-slate-800">{t.description}</TableCell>
                  <TableCell className={t.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}>
                    {t.amount}
                  </TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
