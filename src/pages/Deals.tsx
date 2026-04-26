import React, { useState } from 'react';
import { useCRMStore, DealStage } from '@/store/crmStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Sparkles, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

const stages: DealStage[] = ['Lead', 'Meeting', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function Deals() {
  const { deals, updateDealStage, addDeal, setSuperAgentOpen } = useCRMStore();
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'Lead' as DealStage,
    expectedCloseDate: new Date().toISOString().split('T')[0]
  });

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      updateDealStage(dealId, stage);
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    addDeal({
      title: newDeal.title,
      company: newDeal.company,
      value: Number(newDeal.value) || 0,
      stage: newDeal.stage,
      expectedCloseDate: new Date(newDeal.expectedCloseDate).toISOString()
    });
    setIsNewDealModalOpen(false);
    setNewDeal({
      title: '',
      company: '',
      value: '',
      stage: 'Lead',
      expectedCloseDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Deals Pipeline</h1>
          <p className="text-sm text-slate-500">Track and manage your sales opportunities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setSuperAgentOpen(true)}>
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Insights
          </Button>
          <Button className="gap-2" onClick={() => setIsNewDealModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Deal
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {stages.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div 
                key={stage} 
                className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 p-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-700">{stage}</h3>
                    <Badge variant="secondary" className="text-xs bg-slate-200">{stageDeals.length}</Badge>
                  </div>
                  <span className="text-sm font-medium text-slate-500">${stageValue.toLocaleString()}</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageDeals.map((deal) => (
                    <Card 
                      key={deal.id} 
                      className="cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors shadow-sm"
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-900 leading-tight">{deal.title}</h4>
                          <button className="text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">{deal.company}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-semibold text-indigo-600">${deal.value.toLocaleString()}</span>
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                            {format(new Date(deal.expectedCloseDate), 'MMM d')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                      Drop deals here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isNewDealModalOpen} onClose={() => setIsNewDealModalOpen(false)} title="Add New Deal">
        <form onSubmit={handleCreateDeal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deal Title</label>
            <Input 
              required
              value={newDeal.title}
              onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
              placeholder="e.g. Enterprise License"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <Input 
              required
              value={newDeal.company}
              onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Value ($)</label>
            <Input 
              required
              type="number"
              value={newDeal.value}
              onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expected Close Date</label>
            <Input 
              required
              type="date"
              value={newDeal.expectedCloseDate}
              onChange={(e) => setNewDeal({...newDeal, expectedCloseDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
            <select 
              className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm"
              value={newDeal.stage}
              onChange={(e) => setNewDeal({...newDeal, stage: e.target.value as DealStage})}
            >
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsNewDealModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
