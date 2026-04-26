import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, Settings2, Sparkles, ShoppingCart, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const orders = [
  { id: 'ORD-5001', customer: 'Acme Corp', items: 12, total: '$4,500', date: 'Nov 25, 2023', status: 'Processing', aiInsight: 'Expected fulfillment in 2 days' },
  { id: 'ORD-5002', customer: 'Globex Inc', items: 3, total: '$1,200', date: 'Nov 24, 2023', status: 'Shipped', aiInsight: 'On track for early delivery' },
  { id: 'ORD-5003', customer: 'Soylent Corp', items: 45, total: '$12,000', date: 'Nov 22, 2023', status: 'Delivered', aiInsight: 'Customer satisfaction likely high' },
  { id: 'ORD-5004', customer: 'Initech', items: 1, total: '$299', date: 'Nov 26, 2023', status: 'Pending', aiInsight: 'Awaiting stock confirmation' },
];

export default function Orders() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Sales Orders</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              All Orders
            </button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
              Processing
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            AI Fulfillment Optimizer
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Create Order
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
              <TableHead className="text-xs font-medium text-slate-400 h-9">Order ID</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Customer</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Items</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Total</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Date</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
              <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Logistics Insight
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                <TableCell className="py-2 font-medium text-sm text-slate-800">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-slate-400" />
                    {order.id}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm text-slate-700">{order.customer}</TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{order.items}</TableCell>
                <TableCell className="py-2 text-sm font-medium text-slate-800">{order.total}</TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{order.date}</TableCell>
                <TableCell className="py-2">
                  <Badge variant={
                    order.status === 'Delivered' ? 'success' : 
                    order.status === 'Shipped' ? 'default' : 
                    order.status === 'Processing' ? 'warning' : 'secondary'
                  } className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                    {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />}
                    {order.status === 'Shipped' && <Truck className="w-3 h-3 mr-1 text-blue-600" />}
                    {order.status === 'Processing' && <Clock className="w-3 h-3 mr-1 text-amber-500" />}
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 text-xs text-blue-600/80 italic">{order.aiInsight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
