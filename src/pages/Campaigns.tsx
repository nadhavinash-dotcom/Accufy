import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, Sparkles, Mail, MessageSquare, Phone, Play, Pause, BarChart2, Users, ArrowRight, GitMerge, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { toast } from 'sonner';

const initialCampaigns = [
  { id: 'CMP-001', name: 'Q4 Enterprise Outreach', status: 'Active', type: 'Multi-Channel', audience: 450, sent: 450, opened: '42%', replied: '12%', booked: 15, aiInsight: 'Subject line A outperforming B by 24%' },
  { id: 'CMP-002', name: 'SaaS Churn Reactivation', status: 'Draft', type: 'Email Only', audience: 120, sent: 0, opened: '-', replied: '-', booked: 0, aiInsight: 'Draft ready. Recommend sending Tuesday 10AM.' },
  { id: 'CMP-003', name: 'Webinar Follow-up', status: 'Completed', type: 'Email + Call', audience: 890, sent: 890, opened: '65%', replied: '8%', booked: 42, aiInsight: 'Call connection rate was 18%.' },
];

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  
  // Modals
  const [showBuilder, setShowBuilder] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    audience: 'All Leads (Score > 70)',
    goal: 'Book Meeting'
  });

  const [sequence, setSequence] = useState([
    { id: 1, type: 'email', delay: 'Day 1', content: 'Intro & Value Prop' },
    { id: 2, type: 'call', delay: 'Day 3', content: 'Follow-up Call Task for Rep' },
    { id: 3, type: 'sms', delay: 'Day 5', content: 'Quick Text Check-in' }
  ]);

  const addSequenceStep = (type: string) => {
    setSequence([...sequence, { id: Date.now(), type, delay: `Day ${sequence.length * 2 + 1}`, content: 'New Step' }]);
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Campaigns & Outreach</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button 
              onClick={() => setActiveTab('campaigns')}
              className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'campaigns' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
            >
              All Campaigns
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'templates' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
            >
              Templates
            </button>
            <button 
              onClick={() => setActiveTab('audiences')}
              className={cn("px-3 py-1 text-sm font-medium rounded transition-colors", activeTab === 'audiences' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
            >
              Audiences
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600">
            <Sparkles className="w-3 h-3" />
            AI Sequence Generator
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1" onClick={() => setShowBuilder(true)}>
            <Plus className="w-3 h-3" />
            Create Campaign
          </Button>
        </div>
      </div>

      {activeTab === 'campaigns' && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-500 mb-1">Active Campaigns</div>
              <div className="text-2xl font-bold text-slate-900">12</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-500 mb-1">Total Audience</div>
              <div className="text-2xl font-bold text-slate-900">8,405</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-500 mb-1">Avg Open Rate</div>
              <div className="text-xl font-bold text-emerald-600">48.2% <span className="text-sm font-normal text-slate-500">+2.1%</span></div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-500 mb-1">Meetings Booked</div>
              <div className="text-2xl font-bold text-slate-900">142 <span className="text-sm font-normal text-slate-500">this month</span></div>
            </div>
          </div>

          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
                <ListFilter className="w-3 h-3" /> Filter
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-400 h-9 shrink-0 w-8"></TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Campaign Name</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Type</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Audience</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Opened</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Replied</TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 h-9">Booked</TableHead>
                  <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Optimization Insight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((camp) => (
                  <TableRow key={camp.id} className="border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <TableCell className="w-8">
                      {camp.status === 'Active' ? <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" /> : 
                       camp.status === 'Draft' ? <Pause className="w-4 h-4 text-slate-400" /> : 
                       <CheckCircle2 className="w-4 h-4 text-slate-400" />}
                    </TableCell>
                    <TableCell className="py-3 font-medium text-sm text-slate-800">{camp.name}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={cn(
                        "font-normal text-[10px]",
                        camp.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        camp.status === 'Draft' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {camp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-slate-500">{camp.type}</TableCell>
                    <TableCell className="py-3 text-sm font-medium text-slate-700">{camp.audience}</TableCell>
                    <TableCell className="py-3 text-sm text-slate-700">{camp.opened}</TableCell>
                    <TableCell className="py-3 text-sm text-slate-700">{camp.replied}</TableCell>
                    <TableCell className="py-3 text-sm font-medium text-emerald-600">{camp.booked}</TableCell>
                    <TableCell className="py-3 text-xs">
                      <div className="flex items-center gap-1 text-blue-600/80 italic leading-tight">
                        {camp.aiInsight}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Campaign Builder Modal */}
      <Modal isOpen={showBuilder} onClose={() => setShowBuilder(false)} title="Campaign Sequence Builder">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
              <Input 
                placeholder="e.g., Q1 Enterprise Outreach" 
                value={newCampaign.name}
                onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
              <select className="w-full h-9 px-3 py-1 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500">
                <option>All Leads (Score &gt; 70)</option>
                <option>Lost Opportunities - Reactivation</option>
                <option>Webinar Attendees</option>
              </select>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
               <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                 <GitMerge className="w-4 h-4 text-slate-500"/>
                 Outreach Sequence
               </h4>
               <Button 
                variant="outline" 
                className="gap-1 h-7 text-[10px] border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                   setIsDrafting(true);
                   setTimeout(() => {
                     setSequence([
                       { id: 10, type: 'email', delay: 'Day 1', content: 'Highly personalized AI intro based on company news' },
                       { id: 11, type: 'call', delay: 'Day 2', content: 'Call Task: Refer to the email sent yesterday' },
                       { id: 12, type: 'email', delay: 'Day 4', content: 'Value-add: Case study attachment' },
                       { id: 13, type: 'sms', delay: 'Day 7', content: 'Final text bump' },
                     ]);
                     setIsDrafting(false);
                     toast.success('AI successfully mapped an optimal conversion sequence.');
                   }, 1000);
                }}
               >
                 <Sparkles className="w-3 h-3"/> {isDrafting ? 'Generating...' : 'Auto-Generate Sequence'}
               </Button>
            </div>

            <div className="space-y-3 pl-2 border-l-2 border-slate-100 ml-2">
               {sequence.map((step, idx) => (
                  <div key={step.id} className="relative bg-white border border-slate-200 rounded p-3 shadow-sm flex items-start gap-3">
                     {/* Step dot */}
                     <div className="absolute -left-[22px] top-4 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm ring-1 ring-slate-200"></div>
                     
                     <div className="flex-shrink-0 mt-0.5">
                       {step.type === 'email' ? <Mail className="w-4 h-4 text-blue-500"/> :
                        step.type === 'call' ? <Phone className="w-4 h-4 text-emerald-500"/> :
                        <MessageSquare className="w-4 h-4 text-indigo-500"/>}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-700">{step.delay}</span>
                          <span className="uppercase text-[10px] tracking-wider text-slate-400 font-medium">
                            {step.type}
                          </span>
                        </div>
                        <Input 
                           value={step.content} 
                           className="h-7 text-xs bg-slate-50 border-slate-100" 
                           onChange={(e) => {
                             const newSeq = [...sequence];
                             newSeq[idx].content = e.target.value;
                             setSequence(newSeq);
                           }}
                        />
                     </div>
                  </div>
               ))}

               <div className="pt-3 flex items-center gap-2">
                 <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 bg-slate-50" onClick={() => addSequenceStep('email')}>
                   <Mail className="w-3 h-3 text-slate-500"/> Add Email
                 </Button>
                 <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 bg-slate-50" onClick={() => addSequenceStep('call')}>
                   <Phone className="w-3 h-3 text-slate-500"/> Add Call Task
                 </Button>
                 <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 bg-slate-50" onClick={() => addSequenceStep('sms')}>
                   <MessageSquare className="w-3 h-3 text-slate-500"/> Add SMS
                 </Button>
               </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={() => setShowBuilder(false)}>Cancel</Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => {
              toast.success('Campaign scheduled and routing tasks to the sales team.');
              setShowBuilder(false);
            }}>Launch Campaign</Button>
          </div>
        </div>
      </Modal>

      {/* Empty States for other tabs */}
      {activeTab === 'templates' && (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 mt-4">
          <Mail className="w-8 h-8 text-slate-400 mb-2" />
          <h3 className="font-semibold text-slate-800">Email & Message Templates</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm text-center">Manage your standardized outreach templates. AI can help optimize these based on recent winning replies.</p>
          <Button variant="outline" className="bg-white">Create Template</Button>
        </div>
      )}
      {activeTab === 'audiences' && (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 mt-4">
          <Users className="w-8 h-8 text-slate-400 mb-2" />
          <h3 className="font-semibold text-slate-800">Dynamic Audiences</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm text-center">Build specific lists based on Lead Scores, Account size, or behavioral data integration.</p>
          <Button variant="outline" className="bg-white">Build Audience List</Button>
        </div>
      )}
    </div>
  );
}
