import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, Settings2, CircleDashed, Circle, CheckCircle2, XCircle, Sparkles, LayoutGrid, List } from 'lucide-react';
import { useCRMStore } from '@/store/crmStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

const stages = [
  { name: 'Lead', icon: <CircleDashed className="w-4 h-4 text-slate-400" /> },
  { name: 'Qualification', icon: <Circle className="w-4 h-4 text-slate-400" /> },
  { name: 'Demo', icon: <div className="w-4 h-4 rounded-full border-2 border-slate-400 relative overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-1/4 bg-slate-400"></div></div> },
  { name: 'Trial', icon: <div className="w-4 h-4 rounded-full border-2 border-slate-400 relative overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-400"></div></div> },
  { name: 'Proposal', icon: <div className="w-4 h-4 rounded-full border-2 border-slate-400 relative overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-3/4 bg-slate-400"></div></div> },
  { name: 'Won', icon: <CheckCircle2 className="w-4 h-4 text-blue-600" /> },
  { name: 'Lost', icon: <XCircle className="w-4 h-4 text-red-600" /> },
];

export default function Opportunities() {
  const { opportunities, updateOpportunityStage, addOpportunity, setSuperAgentOpen } = useCRMStore();
  const [isNewOppModalOpen, setIsNewOppModalOpen] = useState(false);
  const [lossReasonModalOpen, setLossReasonModalOpen] = useState(false);
  const [pendingLossOppId, setPendingLossOppId] = useState<number | null>(null);
  const [lossReason, setLossReason] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const [newOpp, setNewOpp] = useState({
    title: '',
    amount: '',
    account: '',
    stage: 'Lead'
  });

  const handleDragStart = (e: React.DragEvent, oppId: number) => {
    e.dataTransfer.setData('oppId', oppId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageName: string) => {
    e.preventDefault();
    const oppId = parseInt(e.dataTransfer.getData('oppId'), 10);
    if (!isNaN(oppId)) {
      if (stageName === 'Lost') {
        setPendingLossOppId(oppId);
        setLossReason('');
        setLossReasonModalOpen(true);
      } else {
        updateOpportunityStage(oppId, stageName);
      }
    }
  };

  const handleConfirmLoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingLossOppId !== null) {
      updateOpportunityStage(pendingLossOppId, 'Lost', lossReason);
    }
    setLossReasonModalOpen(false);
    setPendingLossOppId(null);
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    addOpportunity({
      title: newOpp.title,
      amount: newOpp.amount,
      stage: newOpp.stage,
      account: newOpp.account,
      accountIcon: newOpp.account.charAt(0).toUpperCase() || 'N',
      owner: 'AN',
      lastInteraction: 'Just now',
      leadScore: 50,
      status: 'Warm',
      aiNextAction: 'Review new opportunity details'
    });
    setIsNewOppModalOpen(false);
    setNewOpp({ title: '', amount: '', account: '', stage: 'Lead' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Opportunities</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              All
            </button>
            <button className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-8 text-xs border-slate-200 bg-transparent hover:bg-slate-100" onClick={() => setSuperAgentOpen(true)}>
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Super Agent
          </Button>
          <Button variant="outline" className="gap-2 h-8 text-xs border-slate-200 bg-transparent hover:bg-slate-100">
            Import / Export
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1" onClick={() => setIsNewOppModalOpen(true)}>
            <Plus className="w-3 h-3" />
            Create opportunity
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
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-1 rounded ${viewMode === 'kanban' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
              title="Kanban View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
            <Settings2 className="w-3 h-3" />
            Display
          </Button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full min-w-max pb-4">
            {stages.map((stage) => {
              const stageOpps = opportunities.filter((o) => o.stage === stage.name);
              const totalAmount = stageOpps.reduce((sum, opp) => sum + parseInt(opp.amount.replace(/[^0-9]/g, '')), 0);
              
              return (
                <div 
                  key={stage.name} 
                  className="w-[280px] flex flex-col h-full bg-white rounded-lg border border-slate-200"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.name)}
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      {stage.icon}
                      <h3 className="text-sm font-medium text-slate-700">{stage.name}</h3>
                      <span className="text-xs text-slate-400">{stageOpps.length}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Column Content */}
                  <div className="p-2 flex-1 overflow-y-auto space-y-2">
                    <button 
                      onClick={() => {
                        setNewOpp(prev => ({ ...prev, stage: stage.name }));
                        setIsNewOppModalOpen(true);
                      }}
                      className="w-full py-1.5 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create opportunity
                    </button>
                    
                    {stageOpps.map((opp) => (
                      <div 
                        key={opp.id} 
                        className="bg-white border border-slate-200 rounded-md p-3 cursor-grab active:cursor-grabbing hover:border-slate-300 transition-colors shadow-sm"
                        draggable
                        onDragStart={(e) => handleDragStart(e, opp.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm text-slate-800">{opp.title}</h4>
                          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${opp.leadScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : opp.leadScore >= 60 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                            Score: {opp.leadScore}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[9px] font-medium text-slate-700 border border-slate-300">
                            {opp.accountIcon}
                          </div>
                          <span className="text-xs text-slate-500">{opp.account}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 ml-auto">{opp.status}</span>
                        </div>
                        
                        {/* AI Next Action / Loss Reason */}
                        {opp.stage === 'Lost' && opp.lossReason ? (
                          <div className="mb-3 p-2 rounded bg-red-50 border border-red-200 text-xs">
                            <span className="font-semibold text-red-700">Reason Lost:</span>
                            <p className="text-red-600 mt-0.5">{opp.lossReason}</p>
                          </div>
                        ) : (
                          <div className="mb-3 p-2 rounded bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              <span className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">AI Next Action</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-tight">{opp.aiNextAction}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-200">
                          <span className="text-xs font-medium text-slate-700">{opp.amount}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{opp.lastInteraction}</span>
                            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[8px]">
                              {opp.owner}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto border border-slate-200 rounded-md bg-white">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="font-medium text-slate-600 h-10">Opportunity</TableHead>
                <TableHead className="font-medium text-slate-600 h-10">Account</TableHead>
                <TableHead className="font-medium text-slate-600 h-10">Amount</TableHead>
                <TableHead className="font-medium text-slate-600 h-10">Stage</TableHead>
                <TableHead className="font-medium text-slate-600 h-10">Score</TableHead>
                <TableHead className="font-medium text-slate-600 h-10">AI Insights / Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opp) => (
                <TableRow key={opp.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <TableCell className="font-medium text-slate-900">{opp.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-700 border border-slate-300">
                        {opp.accountIcon}
                      </div>
                      <span className="text-slate-600">{opp.account}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{opp.amount}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {opp.stage}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${opp.leadScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : opp.leadScore >= 60 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {opp.leadScore}
                    </div>
                  </TableCell>
                  <TableCell>
                    {opp.stage === 'Lost' && opp.lossReason ? (
                      <span className="text-xs text-red-600 font-medium">Lost: {opp.lossReason}</span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-indigo-600 max-w-[200px] truncate" title={opp.aiNextAction}>
                        <Sparkles className="w-3 h-3 flex-shrink-0" />
                        {opp.aiNextAction}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal isOpen={isNewOppModalOpen} onClose={() => setIsNewOppModalOpen(false)} title="Create Opportunity">
        <form onSubmit={handleCreateOpportunity} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Opportunity Title</label>
            <Input 
              required
              value={newOpp.title}
              onChange={(e) => setNewOpp({...newOpp, title: e.target.value})}
              placeholder="e.g. Acme Corp - New Business"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account</label>
            <Input 
              required
              value={newOpp.account}
              onChange={(e) => setNewOpp({...newOpp, account: e.target.value})}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <Input 
              required
              value={newOpp.amount}
              onChange={(e) => setNewOpp({...newOpp, amount: e.target.value})}
              placeholder="e.g. $10,000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
            <select 
              className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm"
              value={newOpp.stage}
              onChange={(e) => setNewOpp({...newOpp, stage: e.target.value})}
            >
              {stages.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsNewOppModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={lossReasonModalOpen} onClose={() => setLossReasonModalOpen(false)} title="Mark as Lost">
        <form onSubmit={handleConfirmLoss} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Loss Reason</label>
            <textarea 
              required
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={lossReason}
              onChange={(e) => setLossReason(e.target.value)}
              placeholder="e.g. Went with competitor, budget constraints..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setLossReasonModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">Confirm Loss</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
