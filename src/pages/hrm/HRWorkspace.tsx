import React, { useState } from 'react';
import Employees from './Employees';
import Recruitment from './Recruitment';
import TimeAttendance from './TimeAttendance';
import Performance from './Performance';
import Payroll from './Payroll';
import { Users, Target, Timer, TrendingUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function HRWorkspace() {
  const [activeRootTab, setActiveRootTab] = useState('directory');
  const { hasPermission } = useAuth();
  
  const isSelfServiceOnly = !hasPermission('view:hrm') && hasPermission('view:self_service');

  if (isSelfServiceOnly) {
     return <Employees />;
  }

  return (
    <div className="flex h-full bg-slate-50/20 -m-6">
      {/* Side Navigation */}
      <div className="w-64 bg-white border-r border-slate-200 p-4 space-y-1 z-10 hidden md:block">
        <h2 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">HR Workspace</h2>
        <button onClick={() => setActiveRootTab('directory')} className={cn("w-full px-3 py-2 rounded-md font-medium text-sm flex items-center gap-3 transition-colors", activeRootTab === 'directory' ? "bg-slate-100 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>
          <Users className={cn("w-4 h-4", activeRootTab === 'directory' ? "text-blue-600" : "text-slate-400")}/> 
          Directory
        </button>
        <button onClick={() => setActiveRootTab('recruitment')} className={cn("w-full px-3 py-2 rounded-md font-medium text-sm flex items-center gap-3 transition-colors", activeRootTab === 'recruitment' ? "bg-slate-100 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>
          <Target className={cn("w-4 h-4", activeRootTab === 'recruitment' ? "text-blue-600" : "text-slate-400")}/> 
          Recruitment
        </button>
        <button onClick={() => setActiveRootTab('time')} className={cn("w-full px-3 py-2 rounded-md font-medium text-sm flex items-center gap-3 transition-colors", activeRootTab === 'time' ? "bg-slate-100 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>
          <Timer className={cn("w-4 h-4", activeRootTab === 'time' ? "text-blue-600" : "text-slate-400")}/> 
          Time & Attendance
        </button>
        <button onClick={() => setActiveRootTab('performance')} className={cn("w-full px-3 py-2 rounded-md font-medium text-sm flex items-center gap-3 transition-colors", activeRootTab === 'performance' ? "bg-slate-100 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>
          <TrendingUp className={cn("w-4 h-4", activeRootTab === 'performance' ? "text-blue-600" : "text-slate-400")}/> 
          Performance
        </button>
        <button onClick={() => setActiveRootTab('payroll')} className={cn("w-full px-3 py-2 rounded-md font-medium text-sm flex items-center gap-3 transition-colors", activeRootTab === 'payroll' ? "bg-slate-100 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>
          <FileText className={cn("w-4 h-4", activeRootTab === 'payroll' ? "text-blue-600" : "text-slate-400")}/> 
          Payroll
        </button>
      </div>
      
      {/* Mobile Top Navigation (Fallback) */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-slate-200 flex gap-2 overflow-x-auto shadow-sm z-10 w-full mb-4">
        <button onClick={() => setActiveRootTab('directory')} className={cn("px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors", activeRootTab === 'directory' ? "bg-slate-100 text-blue-700 border border-slate-200" : "text-slate-600 hover:bg-slate-50 border border-transparent")}>
          <Users className={cn("w-4 h-4", activeRootTab === 'directory' ? "text-blue-600" : "text-slate-400")}/> 
          Directory
        </button>
        <button onClick={() => setActiveRootTab('recruitment')} className={cn("px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors", activeRootTab === 'recruitment' ? "bg-slate-100 text-blue-700 border border-slate-200" : "text-slate-600 hover:bg-slate-50 border border-transparent")}>
          <Target className={cn("w-4 h-4", activeRootTab === 'recruitment' ? "text-blue-600" : "text-slate-400")}/> 
          Recruitment
        </button>
        <button onClick={() => setActiveRootTab('time')} className={cn("px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors", activeRootTab === 'time' ? "bg-slate-100 text-blue-700 border border-slate-200" : "text-slate-600 hover:bg-slate-50 border border-transparent")}>
          <Timer className={cn("w-4 h-4", activeRootTab === 'time' ? "text-blue-600" : "text-slate-400")}/> 
          Time
        </button>
        <button onClick={() => setActiveRootTab('performance')} className={cn("px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors", activeRootTab === 'performance' ? "bg-slate-100 text-blue-700 border border-slate-200" : "text-slate-600 hover:bg-slate-50 border border-transparent")}>
          <TrendingUp className={cn("w-4 h-4", activeRootTab === 'performance' ? "text-blue-600" : "text-slate-400")}/> 
          Performance
        </button>
        <button onClick={() => setActiveRootTab('payroll')} className={cn("px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors", activeRootTab === 'payroll' ? "bg-slate-100 text-blue-700 border border-slate-200" : "text-slate-600 hover:bg-slate-50 border border-transparent")}>
          <FileText className={cn("w-4 h-4", activeRootTab === 'payroll' ? "text-blue-600" : "text-slate-400")}/> 
          Payroll
        </button>
      </div>

      <div className="flex-1 overflow-hidden p-6 relative">
         <div className="absolute inset-0 p-6 overflow-hidden flex flex-col">
           {activeRootTab === 'directory' && <Employees hideHeader />}
           {activeRootTab === 'recruitment' && <Recruitment hideHeader />}
           {activeRootTab === 'time' && <TimeAttendance hideHeader />}
           {activeRootTab === 'performance' && <Performance hideHeader />}
           {activeRootTab === 'payroll' && <Payroll hideHeader />}
         </div>
      </div>
    </div>
  );
}
