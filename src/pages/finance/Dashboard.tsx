import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DollarSign, TrendingUp, TrendingDown, Activity, Sparkles, ArrowUpRight, ArrowDownRight, Landmark, FileText, ShieldCheck, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FinanceDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">FP&A & Treasury</h1>
          <p className="text-sm text-slate-500">Predictive insights and real-time cash flow monitoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            ML Forecast
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-900">$1,245,000</h3>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Expenses</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-900">$450,000</h3>
              </div>
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>4.2% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Net Profit</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-900">$795,000</h3>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>18.1% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 border-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <Sparkles className="w-4 h-4 text-blue-600/50" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">ML Forecast (Q4)</p>
                <h3 className="text-xl font-bold mt-1 text-slate-900">+8.5% Growth</h3>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              Based on historical GL data and market trends.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Finance Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treasury & Risk */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-800 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-slate-400" />
              Treasury & Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                <div>
                  <p className="text-xs text-slate-400">Liquidity Status</p>
                  <p className="text-sm font-medium text-emerald-600">Healthy (2.4x Ratio)</p>
                </div>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                <div>
                  <p className="text-xs text-slate-400">AI Fraud Detection</p>
                  <p className="text-sm font-medium text-amber-600">2 Anomalies Flagged</p>
                </div>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Compliance */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Tax Compliance Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                <div>
                  <p className="text-xs text-slate-400">Global Tax Rules</p>
                  <p className="text-sm font-medium text-slate-800">Updated (Real-time)</p>
                </div>
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                <div>
                  <p className="text-xs text-slate-400">Q3 VAT Filing</p>
                  <p className="text-sm font-medium text-emerald-600">Ready to File</p>
                </div>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RevRec */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-800 flex items-center gap-2">
              <LineChart className="w-4 h-4 text-slate-400" />
              Revenue Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                <div>
                  <p className="text-xs text-slate-400">ASC 606 / IFRS 15</p>
                  <p className="text-sm font-medium text-slate-800">Compliant</p>
                </div>
                <ShieldCheck className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                <div>
                  <p className="text-xs text-slate-400">Deferred Revenue</p>
                  <p className="text-sm font-medium text-slate-800">$125,000</p>
                </div>
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
