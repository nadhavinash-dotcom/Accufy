import React, { useState, useRef } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, ChevronDown, ListFilter, Settings2, Sparkles, UploadCloud, Globe, Edit3, Loader2 } from 'lucide-react';
import { enrichCompanyData, parseBusinessCard } from '@/lib/gemini';
import { toast } from 'sonner';

export default function Contacts() {
  const { contacts, addContact, addAccount, addOpportunity } = useCRMStore();
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'manual' | 'scan' | 'web'>('manual');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    account: '',
    accountIcon: '',
    lastInteraction: 'Just now',
    jobTitle: '',
    email: '',
    linkedin: '',
    leadScore: 0,
    status: 'New',
    aiNextAction: 'Send welcome email'
  });

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingAI(true);
    
    toast.info(`Retrieving AI details for ${newContact.account}...`);
    
    try {
      const enriched = await enrichCompanyData(newContact.account);
      
      const accountIcon = newContact.account.charAt(0).toUpperCase() || 'C';
      
      addContact({
        ...newContact,
        accountIcon,
        leadScore: enriched.leadScore,
        aiNextAction: enriched.aiNextAction
      });

      addAccount({
        name: newContact.account,
        industry: enriched.industry,
        website: `www.${newContact.account.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        owner: 'Avinash Nadh',
        icon: accountIcon,
        lastInteraction: 'Just now',
        revenue: 'Unknown',
        headcount: 'Unknown',
        lastFunding: 'Unknown',
        linkedin: `linkedin.com/company/${newContact.account.toLowerCase().replace(/[^a-z0-9]/g, '')}`
      });

      addOpportunity({
        title: `${newContact.account} - New Lead`,
        amount: '$' + (enriched.leadScore * 100).toString(),
        stage: 'Lead',
        account: newContact.account,
        accountIcon,
        owner: 'Avinash Nadh',
        lastInteraction: 'Just now',
        leadScore: enriched.leadScore,
        status: enriched.leadScore > 75 ? 'Hot' : 'Warm',
        aiNextAction: enriched.aiNextAction
      });

      toast.success(`${newContact.name} created and enriched with AI details!`);
      
      setIsNewContactModalOpen(false);
      setNewContact({
        name: '',
        account: '',
        accountIcon: '',
        lastInteraction: 'Just now',
        jobTitle: '',
        email: '',
        linkedin: '',
        leadScore: 0,
        status: 'New',
        aiNextAction: 'Send welcome email'
      });
    } catch (error) {
      toast.error('Failed to create contact');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAI(true);
    toast.info("Scanning business card via AI...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = (event.target?.result as string).split(',')[1];
      try {
        const parsed = await parseBusinessCard(base64Data, file.type);
        setNewContact(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          account: parsed.account || prev.account,
          jobTitle: parsed.jobTitle || prev.jobTitle,
          email: parsed.email || prev.email
        }));
        setCreationMode('manual');
        toast.success("Details extracted successfully! Please review.");
      } catch (err) {
        toast.error("Failed to parse the card. Please enter manually.");
      } finally {
        setIsProcessingAI(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Contacts</h1>
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
          <Button variant="outline" className="gap-2 h-8 text-xs border-slate-200 bg-transparent hover:bg-slate-100">
            Import / Export
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1" onClick={() => setIsNewContactModalOpen(true)}>
            <Plus className="w-3 h-3" />
            Create contact
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
              <TableHead className="text-xs font-medium text-slate-400 h-9">Name</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Account</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Score</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Status</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Job title</TableHead>
              <TableHead className="text-xs font-medium text-slate-400 h-9">Email addresses</TableHead>
              <TableHead className="text-xs font-medium text-blue-600 h-9 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Next Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className="border-slate-200 hover:bg-slate-100 cursor-pointer">
                <TableCell className="py-2 font-medium text-sm text-slate-800">{contact.name}</TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-700 border border-slate-300">
                      {contact.accountIcon}
                    </div>
                    <span className="text-sm text-slate-700">{contact.account}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${contact.leadScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : contact.leadScore >= 60 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {contact.leadScore}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{contact.status}</TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{contact.jobTitle}</TableCell>
                <TableCell className="py-2 text-sm text-slate-500">{contact.email}</TableCell>
                <TableCell className="py-2 text-xs text-blue-600/80 italic">{contact.aiNextAction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Footer */}
      <div className="py-3 text-xs text-slate-400">
        {contacts.length} contacts
      </div>

      <Modal isOpen={isNewContactModalOpen} onClose={() => setIsNewContactModalOpen(false)} title="Add New Contact">
        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button 
            type="button"
            onClick={() => setCreationMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${creationMode === 'manual' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Edit3 className="w-4 h-4" />
            Manual
          </button>
          <button 
            type="button"
            onClick={() => setCreationMode('scan')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${creationMode === 'scan' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Scan
          </button>
          <button 
            type="button"
            onClick={() => setCreationMode('web')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${creationMode === 'web' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            Web Form
          </button>
        </div>

        {creationMode === 'manual' && (
          <form onSubmit={handleCreateContact} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <Input 
                required
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account (Company)</label>
              <Input 
                required
                value={newContact.account}
                onChange={(e) => setNewContact({...newContact, account: e.target.value})}
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
              <Input 
                required
                value={newContact.jobTitle}
                onChange={(e) => setNewContact({...newContact, jobTitle: e.target.value})}
                placeholder="e.g. CEO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input 
                required
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                placeholder="e.g. john@example.com"
              />
            </div>
            <div className="flex justify-between items-center gap-2 pt-4">
              <span className="text-xs text-indigo-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-creates Account & Opportunity
              </span>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsNewContactModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2" disabled={isProcessingAI}>
                  {isProcessingAI ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Enrich & Save'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {creationMode === 'scan' && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">Upload a Business Card</h3>
            <p className="text-xs text-slate-500 mb-4 text-center">Take a photo or upload an image of a business card. AI will extract the details automatically.</p>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <Button type="button" onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 flex items-center" disabled={isProcessingAI}>
              {isProcessingAI ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : <><Sparkles className="w-4 h-4" /> Select Image</>}
            </Button>
          </div>
        )}

        {creationMode === 'web' && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-slate-200 rounded-xl bg-emerald-50 border-dashed">
            <Globe className="w-10 h-10 text-emerald-500 mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">Web Form Integration Active</h3>
            <p className="text-xs text-slate-500 mb-4 text-center">Contacts submitted via your website's `/contact-us` form are automatically mapped here.</p>
            <Button type="button" variant="outline" className="text-emerald-700 border-emerald-200 hover:bg-emerald-100">
              View API Keys & Documentation
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
