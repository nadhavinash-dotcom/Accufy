import React, { useState, useEffect } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { Mail, Calendar, CheckCircle2, Loader2, ArrowRight, Sparkles, RefreshCw, Inbox, Send, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SuperAgentFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'connect' | 'configure' | 'processing' | 'complete';

export function SuperAgentFlow({ isOpen, onClose }: SuperAgentFlowProps) {
  const { addLead, addMeeting, addTask, addNote } = useCRMStore();
  const [step, setStep] = useState<Step>('connect');
  const [connected, setConnected] = useState({ gmail: false, outlook: false, calendar: false });
  const [dateRange, setDateRange] = useState('7');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('connect');
      setConnected({ gmail: false, outlook: false, calendar: false });
      setLogs([]);
    }
  }, [isOpen]);

  const handleConnect = (service: 'gmail' | 'outlook' | 'calendar') => {
    setConnected(prev => ({ ...prev, [service]: true }));
  };

  const startProcessing = () => {
    setStep('processing');
    setLogs(['Initializing Super Agent...', 'Connecting to mail servers...']);
    
    let currentLogIndex = 0;
    const processLogs = [
      { type: 'PARSE', msg: `Scanning emails from the last ${dateRange} days...` },
      { type: 'PARSE', msg: 'Found 142 emails. Analyzing content for potential leads...' },
      { type: 'PARSE', msg: 'Identified potential lead: Sarah Jenkins (TechNova)' },
      { type: 'ACTION', msg: 'Extracting contact information for Sarah Jenkins...' },
      { type: 'SCORE', msg: 'Sarah Jenkins scored 92 (Hot Lead)' },
      { type: 'ACTION', msg: 'Adding Sarah Jenkins to CRM Leads...' },
      { type: 'PARSE', msg: 'Identified potential lead: Marcus Chen (GlobalLogistics)' },
      { type: 'SCORE', msg: 'Marcus Chen scored 65 (Warm Lead)' },
      { type: 'ACTION', msg: 'Adding Marcus Chen to CRM Leads...' },
      { type: 'PARSE', msg: 'Analyzing calendar for scheduling conflicts...' },
      { type: 'ACTION', msg: 'Auto-scheduling introductory meeting with Sarah Jenkins for next Tuesday...' },
      { type: 'ACTION', msg: 'Drafting and sending automated follow-up email to Marcus Chen...' },
      { type: 'ACTION', msg: 'Creating task: "Review TechNova requirements"...' },
      { type: 'ACTION', msg: 'Adding notes from email thread with TechNova...' },
      { type: 'ACTION', msg: 'Super Agent processing complete. CRM updated.' }
    ];

    const generateTimestamp = () => {
      const now = new Date();
      return `[${now.toISOString().split('T')[1].split('.')[0]}]`;
    };

    const interval = setInterval(() => {
      if (currentLogIndex < processLogs.length) {
        const log = processLogs[currentLogIndex];
        const formattedLog = `${generateTimestamp()} [${log.type}] ${log.msg}`;
        setLogs(prev => [...prev, formattedLog]);
        
        // Simulate actual CRM updates at specific steps
        if (log.msg.includes('Adding Sarah Jenkins')) {
          addLead({ name: 'Sarah Jenkins', email: 'sarah@technova.io', company: 'TechNova', role: 'CTO', status: 'New', leadScore: 92 });
        }
        if (log.msg.includes('Adding Marcus Chen')) {
          addLead({ name: 'Marcus Chen', email: 'm.chen@globallogistics.com', company: 'GlobalLogistics', role: 'VP Operations', status: 'Contacted', leadScore: 65 });
        }
        if (log.msg.includes('Auto-scheduling')) {
          addMeeting({ title: 'Intro: TechNova', time: '10:00 - 10:30 AM', date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], account: 'TechNova', accountIcon: 'T' });
        }
        if (log.msg.includes('Creating task')) {
          addTask({ title: 'Review TechNova requirements', description: 'Review the requirements document sent by Sarah.', status: 'Todo', owner: 'Super Agent', account: 'TechNova', opportunity: '', dueDate: new Date(Date.now() + 86400000 * 2).toISOString() });
        }
        if (log.msg.includes('Adding notes')) {
          addNote({ content: 'Automated Note: Sarah mentioned they are looking to migrate from their legacy system within Q3.', account: 'TechNova', accountIcon: 'T' });
        }

        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep('complete'), 1000);
      }
    }, 800);

    return () => clearInterval(interval);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Super Agent</h2>
              <p className="text-sm text-slate-500">Automated Lead Capture & Routing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'connect' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center max-w-lg mx-auto mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Connect your data sources</h3>
                <p className="text-slate-500">The Super Agent needs access to your emails and calendar to automatically capture leads, schedule meetings, and route data.</p>
              </div>

              <div className="grid gap-4 max-w-xl mx-auto">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Gmail</h4>
                      <p className="text-sm text-slate-500">Read emails and send auto-replies</p>
                    </div>
                  </div>
                  <Button 
                    variant={connected.gmail ? "outline" : "default"}
                    className={connected.gmail ? "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" : ""}
                    onClick={() => handleConnect('gmail')}
                  >
                    {connected.gmail ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Connected</> : 'Connect'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <Inbox className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Outlook</h4>
                      <p className="text-sm text-slate-500">Read emails and send auto-replies</p>
                    </div>
                  </div>
                  <Button 
                    variant={connected.outlook ? "outline" : "default"}
                    className={connected.outlook ? "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" : ""}
                    onClick={() => handleConnect('outlook')}
                  >
                    {connected.outlook ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Connected</> : 'Connect'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Calendar</h4>
                      <p className="text-sm text-slate-500">Auto-schedule meetings</p>
                    </div>
                  </div>
                  <Button 
                    variant={connected.calendar ? "outline" : "default"}
                    className={connected.calendar ? "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" : ""}
                    onClick={() => handleConnect('calendar')}
                  >
                    {connected.calendar ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Connected</> : 'Connect'}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                  disabled={!connected.gmail && !connected.outlook}
                  onClick={() => setStep('configure')}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 'configure' && (
            <div className="space-y-6 max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Configure Agent Parameters</h3>
                <p className="text-slate-500">Set the rules for how the Super Agent should process your data.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block font-medium text-slate-700">Read emails from the last:</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['1', '7', '30'].map(days => (
                      <button
                        key={days}
                        onClick={() => setDateRange(days)}
                        className={`p-3 rounded-xl border text-center transition-all ${dateRange === days ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                      >
                        {days} {days === '1' ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block font-medium text-slate-700">Agent Actions:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                      <span className="text-sm text-slate-700">Extract and create Leads automatically</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                      <span className="text-sm text-slate-700">Auto-schedule introductory meetings</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                      <span className="text-sm text-slate-700">Send automated follow-up emails</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep('connect')}>Back</Button>
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                  onClick={startProcessing}
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Start Super Agent
                </Button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Agent is working...</h3>
                <p className="text-slate-500">Please do not close this window while the agent processes your data.</p>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-emerald-400 h-[300px] overflow-y-auto shadow-inner flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
                  <Terminal className="w-4 h-4" />
                  <span>Agent Terminal SSE Stream</span>
                </div>
                <div className="space-y-2 flex-1">
                  {logs.map((log, i) => {
                    const isAction = log.includes('[ACTION]');
                    const isScore = log.includes('[SCORE]');
                    const isError = log.includes('[ERROR]');
                    const isParse = log.includes('[PARSE]');
                    
                    let colorClass = 'text-emerald-400';
                    if (isAction) colorClass = 'text-blue-400 font-semibold';
                    if (isScore) colorClass = 'text-amber-400';
                    if (isError) colorClass = 'text-red-400';
                    if (isParse) colorClass = 'text-slate-300';
                    
                    return (
                      <div key={i} className={`flex gap-3 animate-in fade-in slide-in-from-left-2 ${colorClass}`}>
                        <span className="text-slate-600 shrink-0">{'>'}</span>
                        <span>{log}</span>
                      </div>
                    );
                  })}
                  <div className="flex gap-3 animate-pulse">
                    <span className="text-slate-600">{'>'}</span>
                    <span className="w-2 h-4 bg-emerald-400"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center max-w-md mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">CRM Updated Successfully!</h3>
              <p className="text-slate-500 mb-8">The Super Agent has finished processing your emails and calendar. Leads, meetings, tasks, and notes have been automatically routed and added to your CRM.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-bold text-slate-900">2</div>
                  <div className="text-sm text-slate-500">New Leads</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-bold text-slate-900">1</div>
                  <div className="text-sm text-slate-500">Meeting Scheduled</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-bold text-slate-900">1</div>
                  <div className="text-sm text-slate-500">Task Created</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-bold text-slate-900">1</div>
                  <div className="text-sm text-slate-500">Note Added</div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                onClick={onClose}
              >
                Return to CRM
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
