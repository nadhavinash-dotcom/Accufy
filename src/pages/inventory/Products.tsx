import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, Settings2, Sparkles, Package, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const products = [
  { id: 'PRD-001', name: 'Ergonomic Office Chair', sku: 'FUR-CH-01', category: 'Furniture', stock: 45, status: 'In Stock', price: '$299', aiInsight: 'Demand increasing, restock soon' },
  { id: 'PRD-002', name: 'Standing Desk Pro', sku: 'FUR-DK-02', category: 'Furniture', stock: 12, status: 'Low Stock', price: '$599', aiInsight: 'Stockout predicted in 5 days' },
  { id: 'PRD-003', name: 'Wireless Keyboard', sku: 'ELC-KB-01', category: 'Electronics', stock: 150, status: 'In Stock', price: '$89', aiInsight: 'Stable inventory levels' },
  { id: 'PRD-004', name: 'Noise Cancelling Headphones', sku: 'ELC-HP-03', category: 'Electronics', stock: 0, status: 'Out of Stock', price: '$249', aiInsight: 'Supplier delay detected' },
];

export default function Products() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Products Inventory</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              All Products
            </button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
              Low Stock
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            AI Demand Forecast
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Add Product
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
              <TableHead className="text-xs font-medium text-slate-400 h-9">Product Name</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">SKU</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Category</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Stock Level</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Price</TableHead>
              <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Inventory Insight
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((prod) => (
              <TableRow key={prod.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                <TableCell className="py-2 font-medium text-sm text-slate-800">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    {prod.name}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{prod.sku}</TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{prod.category}</TableCell>
                <TableCell className="py-2 text-sm font-medium text-slate-700">{prod.stock}</TableCell>
                <TableCell className="py-2">
                  <Badge variant={
                    prod.status === 'In Stock' ? 'success' : 
                    prod.status === 'Out of Stock' ? 'destructive' : 'warning'
                  } className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                    {prod.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 text-sm text-slate-700">{prod.price}</TableCell>
                <TableCell className="py-2 text-xs">
                  <div className={`flex items-center gap-1 ${prod.aiInsight.includes('Stockout') || prod.aiInsight.includes('delay') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                    {(prod.aiInsight.includes('Stockout') || prod.aiInsight.includes('delay')) && <AlertTriangle className="w-3 h-3" />}
                    {prod.aiInsight}
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
