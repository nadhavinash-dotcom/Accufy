import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, Sparkles, UserPlus, FileText, CheckCircle2, CircleDashed, Circle, XCircle, TrendingUp, Briefcase, Users, LayoutGrid, ClipboardCheck, AlertTriangle, Clock, ArrowRight, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

const stages = [
  { name: 'Applied', icon: <CircleDashed className="w-4 h-4 text-slate-400" /> },
  { name: 'Screening', icon: <Circle className="w-4 h-4 text-slate-400" /> },
  { name: 'Phone Screen', icon: <Phone className="w-4 h-4 text-slate-400" /> },
  { name: 'Interview', icon: <div className="w-4 h-4 rounded-full border-2 border-slate-400 relative overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-400"></div></div> },
  { name: 'Assessment', icon: <FileText className="w-4 h-4 text-slate-400" /> },
  { name: 'Offer', icon: <div className="w-4 h-4 rounded-full border-2 border-slate-400 relative overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-3/4 bg-slate-400"></div></div> },
  { name: 'Hired', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  { name: 'Rejected', icon: <XCircle className="w-4 h-4 text-red-600" /> },
];

const initialCandidates = [
  { id: 1, name: 'Alice Johnson', role: 'Senior Frontend Engineer', stage: 'Interview', source: 'LinkedIn', aiScore: 92, aiInsight: 'Strong React skills, good cultural fit' },
  { id: 2, name: 'Bob Williams', role: 'Product Manager', stage: 'Screening', source: 'Referral', aiScore: 78, aiInsight: 'Needs more technical depth' },
  { id: 3, name: 'Charlie Brown', role: 'UX Designer', stage: 'Offer', source: 'Website', aiScore: 88, aiInsight: 'Excellent portfolio, ready to close' },
  { id: 4, name: 'Diana Prince', role: 'Data Scientist', stage: 'Applied', source: 'Agency', aiScore: 95, aiInsight: 'Perfect match for requirements' },
  { id: 5, name: 'Evan Wright', role: 'DevOps Engineer', stage: 'Hired', source: 'Direct', aiScore: 96, aiInsight: 'Background check cleared, IT provisioning pending' },
];

const capacityPlans = [
  { dept: 'Engineering', node: 'Acme Corp Global', current: 45, required: 52, gap: 7, priority: 'High', aiInsight: 'Need 3 React devs by Q3 to meet roadmap velocity.' },
  { dept: 'Sales', node: 'Sales, Acme Corp NA', current: 20, required: 25, gap: 5, priority: 'Medium', aiInsight: 'Expand EMEA team based on recent pipeline growth.' },
  { dept: 'Marketing', node: 'Marketing, Acme Corp EMEA', current: 12, required: 12, gap: 0, priority: 'Low', aiInsight: 'Headcount optimal for current campaign load.' },
];

const jobPostings = [
  { id: 'REQ-001', title: 'Senior Frontend Engineer', dept: 'Engineering', hiringNode: 'Frontend Team, Acme Corp NA', budgetApprover: 'David Kim (BU Head)', status: 'Published', applicants: 45, aiMatch: '3 strong candidates found in ATS database', type: 'Full-time', location: 'Remote' },
  { id: 'REQ-002', title: 'Enterprise Account Executive', dept: 'Sales', hiringNode: 'Sales, Acme Corp NA', budgetApprover: 'Emily Chen (BU Head)', status: 'Draft', applicants: 0, aiMatch: 'AI generated description ready for review', type: 'Full-time', location: 'New York, NY' },
  { id: 'REQ-003', title: 'Product Marketing Manager', dept: 'Marketing', hiringNode: 'Marketing, Acme Corp EMEA', budgetApprover: 'John Smith (BU Head)', status: 'Closed', applicants: 120, aiMatch: 'Position filled', type: 'Full-time', location: 'San Francisco, CA' },
];

const onboardingTasks = [
  { id: 'ONB-001', newHire: 'Evan Wright', role: 'DevOps Engineer', startDate: 'Dec 01, 2023', itSetup: 'Pending', documents: 'Completed', orientation: 'Scheduled', status: 'In Progress', aiInsight: 'IT provisioning delayed. Follow up with IT support to ensure laptop delivery.' },
  { id: 'ONB-002', newHire: 'Charlie Brown', role: 'UX Designer', startDate: 'Dec 15, 2023', itSetup: 'Not Started', documents: 'Pending', orientation: 'Not Started', status: 'Pre-boarding', aiInsight: 'Send welcome package and background check link. Offer accepted yesterday.' },
  { id: 'ONB-003', newHire: 'Sarah Connor', role: 'Marketing Manager', startDate: 'Nov 01, 2023', itSetup: 'Completed', documents: 'Completed', orientation: 'Completed', status: 'Completed', aiInsight: '30-day check-in survey sent. Sentiment is highly positive.' },
];

export default function Recruitment({ hideHeader = false }: { hideHeader?: boolean }) {
  const [activeTab, setActiveTab] = useState('ats');
  const [candidates, setCandidates] = useState(initialCandidates);
  const { hasPermission } = useAuth();
  
  // Modal states
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showNewReqModal, setShowNewReqModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

  // New Req State
  const [newReq, setNewReq] = useState({ title: '', dept: 'Engineering', node: 'Acme Corp Global', type: 'Full-time', location: 'Remote', budget: '', jd: '' });
  const [isDraftingJD, setIsDraftingJD] = useState(false);

  const isSelfServiceOnly = !hasPermission('view:hrm') && hasPermission('view:self_service');

  const handleDragStart = (e: React.DragEvent, candidateId: number) => {
    e.dataTransfer.setData('candidateId', candidateId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageName: string) => {
    e.preventDefault();
    const candidateId = parseInt(e.dataTransfer.getData('candidateId'), 10);
    if (!isNaN(candidateId)) {
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? { ...c, stage: stageName } : c
      ));
    }
  };

  if (isSelfServiceOnly) {
    const publishedJobs = jobPostings.filter(j => j.status === 'Published');

    return (
      <div className="flex flex-col h-full max-w-5xl mx-auto w-full gap-6">
        {!hideHeader && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h1 className="text-xl font-semibold text-slate-900">Internal Job Board</h1>
            <Button variant="outline" className="h-8 text-xs gap-2">
              <UserPlus className="w-3 h-3" />
              Refer a Candidate
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publishedJobs.map(job => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal text-[10px]">
                  {job.dept}
                </Badge>
                <span className="text-xs text-slate-400">{job.id}</span>
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">{job.title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.type}</span>
                <span className="flex items-center gap-1"><LayoutGrid className="w-3 h-3" /> {job.location}</span>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> High match potential
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1 px-2">
                  View Details <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          {publishedJobs.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
              No internal job postings available at the moment.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {!hideHeader && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-900">Recruitment & Onboarding</h1>
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
              <button 
                onClick={() => setActiveTab('capacity')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'capacity' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Capacity Planning
              </button>
              <button 
                onClick={() => setActiveTab('postings')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'postings' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Reqs & Postings
              </button>
              <button 
                onClick={() => setActiveTab('ats')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'ats' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                ATS Pipeline
              </button>
              <button 
                onClick={() => setActiveTab('onboarding')}
                className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'onboarding' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
              >
                Onboarding
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
              <Sparkles className="w-3 h-3" />
              {activeTab === 'capacity' ? 'AI Headcount Forecast' : activeTab === 'postings' ? 'AI Market Insights' : activeTab === 'onboarding' ? 'AI Onboarding Plan' : 'AI Sourcing'}
            </Button>
            <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1" onClick={() => {
              if (activeTab === 'postings') setShowNewReqModal(true);
            }}>
              <Plus className="w-3 h-3" />
              {activeTab === 'postings' ? 'New Requisition' : activeTab === 'onboarding' ? 'New Hire Checklist' : 'Add Candidate'}
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
        <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
          <Settings2 className="w-3 h-3" />
          Display
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'capacity' && (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {capacityPlans.map((plan, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">{plan.dept}</h3>
                      <div className="text-xs text-slate-500">{plan.node}</div>
                    </div>
                    <Badge variant={plan.gap > 0 ? 'destructive' : 'secondary'} className="bg-slate-100 text-slate-700 border-slate-300 font-normal">
                      Gap: {plan.gap}
                    </Badge>
                  </div>
                  <div className="flex items-end gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{plan.current}</div>
                      <div className="text-xs text-slate-500">Current</div>
                    </div>
                    <div className="text-slate-300 text-2xl font-light">/</div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{plan.required}</div>
                      <div className="text-xs text-slate-500">Required</div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-medium text-blue-800">AI Forecast</span>
                    </div>
                    <p className="text-xs text-blue-700/80">{plan.aiInsight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'postings' && (
          <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Requisition</th>
                  <th className="px-4 py-3 font-medium">Hiring Node</th>
                  <th className="px-4 py-3 font-medium">Integrated Boards</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Applicants</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {jobPostings.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{job.title}</div>
                      <div className="text-xs text-slate-400">{job.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-700">{job.hiringNode}</div>
                      <div className="text-xs text-slate-400">{job.dept}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">LinkedIn</Badge>
                        <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 text-[10px]">Naukri</Badge>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[10px]">Internal</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn(
                        "font-normal text-xs",
                        job.status === 'Published' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        job.status === 'Draft' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{job.applicants}</td>
                    <td className="px-4 py-3 text-right">
                       <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700" onClick={() => setShowPublishModal(true)}>
                         Publish To...
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ats' && (
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-3 h-full min-w-max pb-4">
              {stages.map((stage) => {
                const stageCandidates = candidates.filter((c) => c.stage === stage.name);
                
                return (
                  <div 
                    key={stage.name} 
                    className="w-[280px] flex flex-col h-full bg-slate-50/50 rounded-lg border border-slate-200"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.name)}
                  >
                    {/* Column Header */}
                    <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-lg">
                      <div className="flex items-center gap-2">
                        {stage.icon}
                        <h3 className="text-sm font-medium text-slate-700">{stage.name}</h3>
                        <span className="text-xs text-slate-400">{stageCandidates.length}</span>
                      </div>
                    </div>
                    
                    {/* Column Content */}
                    <div className="p-2 flex-1 overflow-y-auto space-y-2">
                      {stageCandidates.map((candidate) => (
                        <div 
                          key={candidate.id} 
                          className="bg-white border border-slate-200 rounded-md p-3 cursor-grab active:cursor-grabbing hover:border-slate-300 transition-colors shadow-sm"
                          draggable
                          onDragStart={(e) => handleDragStart(e, candidate.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm text-slate-800">{candidate.name}</h4>
                            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-medium border border-blue-100">
                              <Sparkles className="w-2.5 h-2.5" />
                              {candidate.aiScore}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 mb-2">{candidate.role}</div>
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400">{candidate.source}</span>
                          </div>
                          <div className="mt-2 p-2 bg-slate-50 rounded text-[10px] text-slate-600 leading-tight border border-slate-100">
                            <span className="font-medium text-blue-600 mr-1">AI Note:</span>
                            {candidate.aiInsight}
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 gap-y-2">
                             {(stage.name === 'Screening' || stage.name === 'Phone Screen' || stage.name === 'Interview') && (
                               <Button variant="outline" size="sm" className="h-6 text-[10px] col-span-2 text-slate-600 flex justify-center hover:text-blue-600 text-center gap-1" onClick={() => { setSelectedCandidateId(candidate.id); setShowScheduleModal(true); }}>
                                 <Phone className="w-3 h-3" /> Zoom/Teams
                               </Button>
                             )}
                             {(stage.name === 'Assessment') && (
                               <Button variant="outline" size="sm" className="h-6 text-[10px] col-span-2 text-slate-600 flex justify-center hover:text-blue-600 text-center gap-1" onClick={() => toast.success('Results updated successfully')}>
                                 <FileText className="w-3 h-3" /> Update Results
                               </Button>
                             )}
                             {(stage.name === 'Offer') && (
                               <Button variant="outline" size="sm" className="h-6 text-[10px] col-span-2 text-slate-600 flex justify-center hover:text-emerald-600 text-center gap-1 bg-emerald-50 border-emerald-200" onClick={() => toast.success('Offer released tracking link generated')}>
                                 <FileText className="w-3 h-3" /> Release Offer
                               </Button>
                             )}
                             {(stage.name === 'Hired') && (
                               <Button variant="outline" size="sm" className="h-6 text-[10px] col-span-2 text-white flex justify-center bg-blue-600 hover:bg-blue-700 text-center gap-1" onClick={() => { setSelectedCandidateId(candidate.id); setShowConvertModal(true); }}>
                                 <UserPlus className="w-3 h-3" /> Convert to Employee
                               </Button>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'onboarding' && (
          <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">New Hire</th>
                  <th className="px-4 py-3 font-medium">Start Date</th>
                  <th className="px-4 py-3 font-medium">IT Setup</th>
                  <th className="px-4 py-3 font-medium">Documents</th>
                  <th className="px-4 py-3 font-medium">Orientation</th>
                  <th className="px-4 py-3 font-medium">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {onboardingTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{task.newHire}</div>
                      <div className="text-xs text-slate-400">{task.role}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {task.startDate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn(
                        "font-normal text-[10px]",
                        task.itSetup === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        task.itSetup === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {task.itSetup}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn(
                        "font-normal text-[10px]",
                        task.documents === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        task.documents === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {task.documents}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn(
                        "font-normal text-[10px]",
                        task.orientation === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        task.orientation === 'Scheduled' ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {task.orientation}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center flex-wrap">
                        <Badge variant="outline" className={cn(
                          "font-normal text-xs",
                          task.status === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          task.status === 'In Progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                          {task.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="h-6 text-[10px] bg-slate-50 border-slate-200 hover:text-slate-900 gap-1 font-medium" onClick={() => toast.success('Synchronized with Payroll successfully')}>
                           Sync to Payroll
                        </Button>
                        <Button variant="outline" size="sm" className="h-6 text-[10px] bg-slate-50 border-slate-200 hover:text-slate-900 gap-1 font-medium" onClick={() => toast.success('Synchronized with Leave Mgmt successfully')}>
                           Sync to Leave Mgmt
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      <Modal isOpen={showPublishModal} onClose={() => setShowPublishModal(false)} title="Publish Job Requisition">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Select the integrations to syndicate this job posting to:</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="rounded border-slate-300" defaultChecked /> 
              Internal Job Board (My Portal)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="rounded border-slate-300" defaultChecked /> 
              LinkedIn Premium Integration
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="rounded border-slate-300" /> 
              Naukri Corporate Integration
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="rounded border-slate-300" /> 
              Indeed Easy Apply
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowPublishModal(false)}>Cancel</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
              toast.success('Job requisition published to selected boards');
              setShowPublishModal(false);
            }}>Publish Now</Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Modal */}
      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Interview">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
            <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm">
              <option>Zoom Video</option>
              <option>Microsoft Teams</option>
              <option>Google Meet</option>
              <option>Phone Call</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <Input type="date" />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <Input type="time" />
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Interviewer(s) Emails</label>
            <Input placeholder="tech-lead@company.com" />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 gap-1" onClick={() => {
              toast.success('Interview scheduled. Invites dispatched via integrated calendar.');
              setShowScheduleModal(false);
            }}>
              <Sparkles className="w-3 h-3" />
              Auto Schedule
            </Button>
          </div>
        </div>
      </Modal>

      {/* Convert to Employee Modal */}
      <Modal isOpen={showConvertModal} onClose={() => setShowConvertModal(false)} title="Convert to Employee">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-md mb-4">
             <div className="flex items-center gap-1.5 text-blue-700 font-medium text-sm mb-1">
               <UserPlus className="w-4 h-4"/> 
               Initialize Onboarding
             </div>
             <p className="text-xs text-blue-600">This action will migrate the candidate from the ATS into the Employee Directory and generate a new onboarding task list.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Starting Salary / Compensation</label>
            <Input placeholder="$120,000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department Node</label>
              <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm">
                <option>Engineering, NA</option>
                <option>Sales, EMEA</option>
                <option>Marketing, Global</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <Input type="date" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowConvertModal(false)}>Cancel</Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => {
              if (selectedCandidateId !== null) {
                 setCandidates(prev => prev.filter(c => c.id !== selectedCandidateId));
              }
              toast.success('Candidate successfully converted to Employee.');
              setShowConvertModal(false);
            }}>Confirm Conversion</Button>
          </div>
        </div>
      </Modal>

      {/* New Job Requisition Modal */}
      <Modal isOpen={showNewReqModal} onClose={() => setShowNewReqModal(false)} title="Create Job Requisition">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
              <Input placeholder="e.g. Senior Backend Engineer" value={newReq.title} onChange={e => setNewReq({...newReq, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm" value={newReq.dept} onChange={e => setNewReq({...newReq, dept: e.target.value})}>
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Product</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hiring Node / Entity</label>
              <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm" value={newReq.node} onChange={e => setNewReq({...newReq, node: e.target.value})}>
                <option>Acme Corp Global</option>
                <option>Acme Corp NA</option>
                <option>Acme Corp EMEA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
              <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm" value={newReq.type} onChange={e => setNewReq({...newReq, type: e.target.value})}>
                <option>Full-time</option>
                <option>Contract</option>
                <option>Part-time</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <Input placeholder="e.g. Remote, New York, etc." value={newReq.location} onChange={e => setNewReq({...newReq, location: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Budget Range</label>
                <Input placeholder="e.g. $120k - $140k" value={newReq.budget} onChange={e => setNewReq({...newReq, budget: e.target.value})} />
             </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
               <label className="block text-sm font-medium text-slate-700">Job Description</label>
               <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-[10px] gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200 px-2"
                onClick={() => {
                  if (!newReq.title) {
                    toast.error('Please enter a job title first to generate JD');
                    return;
                  }
                  setIsDraftingJD(true);
                  setTimeout(() => {
                    setNewReq(prev => ({
                      ...prev,
                      jd: `We are looking for an experienced ${prev.title} to join our ${prev.dept} team at ${prev.node}.\n\nRequirements:\n- 5+ years of relevant experience\n- Strong communication skills\n- Ability to work independently in a fast-paced environment.\n\nResponsibilities:\n- Lead the development and execution of domain-specific strategies.\n- Collaborate cross-functionally with internal teams.\n- Mentor and guide junior team members.`
                    }));
                    setIsDraftingJD(false);
                    toast.success('AI successfully drafted a Job Description. You can edit it manually now.');
                  }, 1200);
                }}
                disabled={isDraftingJD}
               >
                 <Sparkles className="w-3 h-3"/> {isDraftingJD ? 'Drafting...' : 'Auto-Draft JD'}
               </Button>
            </div>
            <textarea 
              className="w-full flex min-h-[140px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 resize-none" 
              placeholder="Paste or write the job description here..."
              value={newReq.jd}
              onChange={e => setNewReq({...newReq, jd: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowNewReqModal(false)}>Cancel</Button>
            <Button className="bg-slate-800 text-white hover:bg-slate-900" onClick={() => {
               toast.success('Requisition saved as Draft and sent for Budget Approval.');
               setShowNewReqModal(false);
            }}>Save as Draft</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
              if(!newReq.title || !newReq.jd) {
                toast.error('Title and Job Description are required to publish');
                return;
              }
              toast.success('Job requisition successfully created and published.');
              setShowNewReqModal(false);
              setNewReq({ title: '', dept: 'Engineering', node: 'Acme Corp Global', type: 'Full-time', location: 'Remote', budget: '', jd: '' });
            }}>Publish Requisition</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
