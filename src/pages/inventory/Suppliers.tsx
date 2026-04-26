import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, Settings2, Sparkles, Truck, Star, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const suppliers = [
  { id: 'SUP-001', name: 'Global Furniture Co.', category: 'Furniture', rating: 4.8, leadTime: '14 days', status: 'Active', aiInsight: 'Highly reliable, consider long-term contract' },
  { id: 'SUP-002', name: 'Techtronics Inc.', category: 'Electronics', rating: 3.5, leadTime: '30 days', status: 'Active', aiInsight: 'Recent delays detected, monitor closely' },
  { id: 'SUP-003', name: 'Office Essentials Ltd.', category: 'Supplies', rating: 4.2, leadTime: '5 days', status: 'Active', aiInsight: 'Consistent performance' },
  { id: 'SUP-004', name: 'FastShip Logistics', category: 'Shipping', rating: 2.9, leadTime: 'N/A', status: 'Under Review', aiInsight: 'High rate of damaged goods reported' },
];

export default function Suppliers() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Suppliers</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              All Suppliers
            </button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
              Under Review
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            AI Risk Assessment
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Add Supplier
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
              <TableHead className="text-xs font-medium text-slate-400 h-9">Supplier Name</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Category</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Rating</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Avg Lead Time</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
              <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Supplier Insight
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                <TableCell className="py-2 font-medium text-sm text-slate-800">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-slate-400" />
                    {supplier.name}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{supplier.category}</TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-1 text-sm text-slate-700">
                    <Star className={`w-3.5 h-3.5 ${supplier.rating >= 4 ? 'text-amber-600 fill-amber-400' : 'text-slate-400'}`} />
                    {supplier.rating}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{supplier.leadTime}</TableCell>
                <TableCell className="py-2">
                  <Badge variant={
                    supplier.status === 'Active' ? 'success' : 
                    supplier.status === 'Under Review' ? 'destructive' : 'secondary'
                  } className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                    {supplier.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 text-xs">
                  <div className={`flex items-center gap-1 ${supplier.aiInsight.includes('delays') || supplier.aiInsight.includes('damaged') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                    {(supplier.aiInsight.includes('delays') || supplier.aiInsight.includes('damaged')) && <AlertTriangle className="w-3 h-3" />}
                    {supplier.aiInsight}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
