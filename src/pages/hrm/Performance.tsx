import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, Sparkles, Target, TrendingUp, Award, AlertTriangle, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const performanceRecords = [
  { id: 'PERF-01', employee: 'John Smith', role: 'Senior Developer', lastReview: 'Oct 2023', score: '4.8/5.0', aiPerfScore: 92, aiFlightRisk: 15, goals: '3/4 Completed', status: 'Exceeds Expectations', aiInsight: 'Ready for promotion to Lead role' },
  { id: 'PERF-02', employee: 'Sarah Connor', role: 'Marketing Manager', lastReview: 'Sep 2023', score: '3.5/5.0', aiPerfScore: 78, aiFlightRisk: 82, goals: '2/5 Completed', status: 'Meets Expectations', aiInsight: 'Flight risk: High burnout probability detected' },
  { id: 'PERF-03', employee: 'Emily Chen', role: 'Sales Executive', lastReview: 'Nov 2023', score: '4.2/5.0', aiPerfScore: 88, aiFlightRisk: 22, goals: '5/5 Completed', status: 'Exceeds Expectations', aiInsight: 'Top performer in Q3, suggest bonus' },
  { id: 'PERF-04', employee: 'Michael Chang', role: 'Support Specialist', lastReview: 'Aug 2023', score: '2.8/5.0', aiPerfScore: 65, aiFlightRisk: 45, goals: '1/3 Completed', status: 'Needs Improvement', aiInsight: 'Recommend communication skills training' },
];

const okrRecords = [
  { id: 'OKR-01', employee: 'John Smith', objective: 'Launch new ERP module', progress: 85, dueDate: 'Dec 31, 2023', status: 'On Track', parentOkr: 'Modernize Core Tech Stack (Acme Corp Global)', aiInsight: 'High probability of completion based on current velocity.' },
  { id: 'OKR-02', employee: 'Sarah Connor', objective: 'Increase inbound leads by 20%', progress: 40, dueDate: 'Dec 31, 2023', status: 'At Risk', parentOkr: 'Grow NA Revenue by 15% (Sales, Acme Corp NA)', aiInsight: 'Falling behind. Suggest re-allocating ad spend.' },
  { id: 'OKR-03', employee: 'Emily Chen', objective: 'Close $500k in Q4', progress: 100, dueDate: 'Dec 31, 2023', status: 'Completed', parentOkr: 'Grow EMEA Revenue by 10% (Acme Corp EMEA)', aiInsight: 'Goal achieved 3 weeks early.' },
];

const trainingRecords = [
  { id: 'TRN-01', employee: 'Michael Chang', course: 'Advanced Customer Communication', progress: 20, deadline: 'Dec 15, 2023', status: 'In Progress', aiInsight: 'Assigned based on Q3 performance review.' },
  { id: 'TRN-02', employee: 'John Smith', course: 'Leadership Fundamentals', progress: 0, deadline: 'Jan 31, 2024', status: 'Not Started', aiInsight: 'Preparation for upcoming promotion.' },
  { id: 'TRN-03', employee: 'Sarah Connor', course: 'Data-Driven Marketing', progress: 100, deadline: 'Nov 01, 2023', status: 'Completed', aiInsight: 'Skills successfully applied in recent campaign.' },
];

export default function Performance({ hideHeader = false }: { hideHeader?: boolean }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const { currentUser, hasPermission } = useAuth();
  
  const isSelfServiceOnly = !hasPermission('view:hrm') && hasPermission('view:self_service');

  if (isSelfServiceOnly) {
    const myOkrs = okrRecords.filter(r => r.employee === currentUser.name) || [];
    const myTraining = trainingRecords.filter(r => r.employee === currentUser.name) || [];

    return (
      <div className="flex flex-col h-full max-w-5xl mx-auto w-full gap-6">
        {!hideHeader && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h1 className="text-xl font-semibold text-slate-900">My Performance & Goals</h1>
            <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
              <Plus className="w-3 h-3" />
              New Goal
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <Award className="w-4 h-4 text-slate-400" />
              Last Review Score
            </div>
            <div className="text-2xl font-bold text-slate-900">4.8 <span className="text-sm font-normal text-slate-500">/ 5.0</span></div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Exceeds Expectations</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <Target className="w-4 h-4 text-slate-400" />
              Active Goals
            </div>
            <div className="text-2xl font-bold text-slate-900">{myOkrs.length}</div>
            <div className="text-xs text-slate-500 mt-1">For Q4 2023</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              Training Progress
            </div>
            <div className="text-2xl font-bold text-slate-900">{myTraining.filter(t => t.status === 'Completed').length} <span className="text-sm font-normal text-slate-500">/ {myTraining.length}</span></div>
            <div className="text-xs text-slate-500 mt-1">Courses completed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 font-medium text-sm text-slate-800">
              My OKRs
            </div>
            <div className="flex-1 overflow-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Objective</TableHead>
                    <TableHead className="text-xs">Progress</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myOkrs.length > 0 ? myOkrs.map(okr => (
                    <TableRow key={okr.id}>
                      <TableCell className="text-xs font-medium">{okr.objective}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[60px]">
                            <div className={`h-1.5 rounded-full ${okr.progress === 100 ? 'bg-emerald-500' : okr.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${okr.progress}%` }}></div>
                          </div>
                          <span className="text-[10px] text-slate-500">{okr.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={cn(
                          "font-normal text-[10px] px-1.5 py-0",
                          okr.status === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          okr.status === 'At Risk' ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                          {okr.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-slate-500 py-8">
                        No active OKRs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 font-medium text-sm text-slate-800">
              My Training
            </div>
            <div className="flex-1 overflow-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Course</TableHead>
                    <TableHead className="text-xs">Deadline</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTraining.length > 0 ? myTraining.map(train => (
                    <TableRow key={train.id}>
                      <TableCell className="text-xs font-medium">{train.course}</TableCell>
                      <TableCell className="text-xs text-slate-500">{train.deadline}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={cn(
                          "font-normal text-[10px] px-1.5 py-0",
                          train.status === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          train.status === 'In Progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                          {train.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-slate-500 py-8">
                        No training assigned.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
            <h1 className="text-xl font-semibold text-slate-900">Performance & L&D</h1>
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
              <button 
                onClick={() => setActiveTab('reviews')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'reviews' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Reviews
              </button>
              <button 
                onClick={() => setActiveTab('okrs')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'okrs' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Goals (OKRs)
              </button>
              <button 
                onClick={() => setActiveTab('training')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'training' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Training
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
              <Sparkles className="w-3 h-3" />
              {activeTab === 'reviews' ? 'AI Talent Predictor' : activeTab === 'okrs' ? 'AI Goal Alignment' : 'AI Skill Gap Analysis'}
            </Button>
            <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
              <Plus className="w-3 h-3" />
              {activeTab === 'reviews' ? 'Start Review' : activeTab === 'okrs' ? 'New Goal' : 'Assign Training'}
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
          <TrendingUp className="w-4 h-4" />
          Continuous Feedback
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'reviews' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Employee</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Role</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Last Review</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Manager Score</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9">AI Score</TableHead>
                  <TableHead className="text-xs font-medium text-amber-600 h-9">Flight Risk</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Career Insight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceRecords.map((record) => (
                  <TableRow key={record.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {record.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        {record.employee}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{record.role}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{record.lastReview}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1 text-sm font-medium text-slate-800">
                        <Award className={`w-3.5 h-3.5 ${parseFloat(record.score) >= 4.0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                        {record.score}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded w-fit text-xs font-medium border border-blue-100">
                        <Sparkles className="w-3 h-3" />
                        {record.aiPerfScore}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded w-fit text-xs font-medium border ${record.aiFlightRisk > 75 ? 'bg-red-50 text-red-700 border-red-200' : record.aiFlightRisk > 40 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {record.aiFlightRisk > 75 && <AlertTriangle className="w-3 h-3" />}
                        {record.aiFlightRisk}%
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant={
                        record.status === 'Exceeds Expectations' ? 'success' : 
                        record.status === 'Needs Improvement' ? 'destructive' : 'secondary'
                      } className="bg-slate-100 text-slate-700 border-slate-300 font-normal text-xs">
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className={`flex items-center gap-1 ${record.aiInsight.includes('Flight risk') || record.aiInsight.includes('Needs') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                        {(record.aiInsight.includes('Flight risk') || record.aiInsight.includes('Needs')) && <AlertTriangle className="w-3 h-3" />}
                        {record.aiInsight}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'okrs' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Employee</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Objective</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Parent OKR (Node)</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Progress</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Due Date</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Progress Insight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {okrRecords.map((record) => (
                  <TableRow key={record.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {record.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        {record.employee}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-700">{record.objective}</TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{record.parentOkr}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                          <div className={`h-2 rounded-full ${record.progress === 100 ? 'bg-emerald-500' : record.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${record.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500">{record.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {record.dueDate}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className={cn(
                        "font-normal text-xs",
                        record.status === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        record.status === 'At Risk' ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className={`flex items-center gap-1 ${record.aiInsight.includes('Falling') ? 'text-amber-600' : 'text-blue-600/80 italic'}`}>
                        {record.aiInsight.includes('Falling') && <AlertTriangle className="w-3 h-3" />}
                        {record.aiInsight.includes('achieved') && <CheckCircle2 className="w-3 h-3" />}
                        {record.aiInsight}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Employee</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Course</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Progress</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Deadline</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Skill Insight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingRecords.map((record) => (
                  <TableRow key={record.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <TableCell className="py-2 font-medium text-sm text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {record.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        {record.employee}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        {record.course}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                          <div className={`h-2 rounded-full ${record.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${record.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500">{record.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-slate-500">{record.deadline}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className={cn(
                        "font-normal text-xs",
                        record.status === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        record.status === 'In Progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="text-blue-700/80 leading-tight">
                        {record.aiInsight}
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
