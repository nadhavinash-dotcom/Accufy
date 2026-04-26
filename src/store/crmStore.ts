import { create } from 'zustand';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type DealStage = 'Lead' | 'Meeting' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type OpportunityStage = 'Lead' | 'Qualification' | 'Demo' | 'Trial' | 'Proposal' | 'Won' | 'Lost';

export interface Opportunity {
  id: number;
  title: string;
  amount: string;
  stage: string;
  account: string;
  accountIcon: string;
  owner: string;
  lastInteraction: string;
  leadScore: number;
  status: string;
  aiNextAction: string;
  lossReason?: string;
}

export interface Contact {
  id: number;
  name: string;
  account: string;
  accountIcon: string;
  lastInteraction: string;
  jobTitle: string;
  email: string;
  linkedin: string;
  leadScore: number;
  status: string;
  aiNextAction: string;
}

export interface Account {
  id: number;
  name: string;
  icon: string;
  industry: string;
  lastInteraction: string;
  revenue: string;
  headcount: string;
  lastFunding: string;
  linkedin: string;
  website: string;
  owner: string;
}

export interface Meeting {
  id: number;
  time: string;
  title: string;
  account: string;
  accountIcon: string;
  date: string;
}

export interface Note {
  id: number;
  title?: string;
  content: string;
  account: string;
  accountIcon: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done';
  owner: string;
  account: string;
  opportunity: string;
  dueDate: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: LeadStatus;
  createdAt: string;
  leadScore: number;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  expectedCloseDate: string;
  leadId?: string;
}

export interface Activity {
  id: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Note';
  description: string;
  date: string;
  relatedTo: string; // Lead or Deal name
}

interface CRMState {
  leads: Lead[];
  deals: Deal[];
  opportunities: Opportunity[];
  activities: Activity[];
  contacts: Contact[];
  accounts: Account[];
  tasks: Task[];
  notes: Note[];
  meetings: Meeting[];
  isSuperAgentOpen: boolean;
  setSuperAgentOpen: (isOpen: boolean) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'leadScore'> & { leadScore?: number }) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  updateDealStage: (id: string, stage: DealStage) => void;
  addOpportunity: (opportunity: Omit<Opportunity, 'id'>) => void;
  updateOpportunityStage: (id: number, stage: string, lossReason?: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: number, status: Task['status']) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
}

// Initial mock data
const initialLeads: Lead[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@techcorp.com', company: 'TechCorp', role: 'CTO', status: 'Qualified', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), leadScore: 92 },
  { id: '2', name: 'Bob Smith', email: 'bob@innovate.io', company: 'Innovate.io', role: 'CEO', status: 'Contacted', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), leadScore: 65 },
  { id: '3', name: 'Charlie Davis', email: 'charlie@designco.net', company: 'DesignCo', role: 'Design Lead', status: 'New', createdAt: new Date().toISOString(), leadScore: 42 },
];

const initialDeals: Deal[] = [
  { id: '1', title: 'TechCorp Enterprise License', company: 'TechCorp', value: 50000, stage: 'Proposal', expectedCloseDate: new Date(Date.now() + 86400000 * 15).toISOString(), leadId: '1' },
  { id: '2', title: 'Innovate.io Team Plan', company: 'Innovate.io', value: 12000, stage: 'Meeting', expectedCloseDate: new Date(Date.now() + 86400000 * 30).toISOString(), leadId: '2' },
  { id: '3', title: 'DesignCo Custom Integration', company: 'DesignCo', value: 25000, stage: 'Lead', expectedCloseDate: new Date(Date.now() + 86400000 * 45).toISOString(), leadId: '3' },
];

const initialOpportunities: Opportunity[] = [
  { id: 1, title: 'Phenom - New Business', amount: '$10,000', stage: 'Lead', account: 'Phenom', accountIcon: 'P', owner: 'AN', lastInteraction: '11d ago', leadScore: 65, status: 'Warm', aiNextAction: 'Send follow-up email regarding pricing' },
  { id: 2, title: 'HCA Healthcare - Expansion', amount: '$25,000', stage: 'Qualification', account: 'HCA Healthcare', accountIcon: 'H', owner: 'AN', lastInteraction: '6d ago', leadScore: 92, status: 'Hot', aiNextAction: 'Schedule technical deep-dive call' },
  { id: 3, title: 'Kollx - Renewal', amount: '$5,000', stage: 'Demo', account: 'Kollx', accountIcon: 'K', owner: 'AN', lastInteraction: '2d ago', leadScore: 88, status: 'Hot', aiNextAction: 'Prepare custom demo environment' },
];

const initialActivities: Activity[] = [
  { id: '1', type: 'Call', description: 'Initial discovery call with Alice. Very interested in enterprise features.', date: new Date(Date.now() - 86400000 * 1).toISOString(), relatedTo: 'Alice Johnson' },
  { id: '2', type: 'Email', description: 'Sent proposal to TechCorp.', date: new Date(Date.now() - 86400000 * 0.5).toISOString(), relatedTo: 'TechCorp Enterprise License' },
];

const initialContacts: Contact[] = [
  { id: 1, name: 'Pavani Kallakuri', account: 'Phenom', accountIcon: 'P', lastInteraction: '4d ago', jobTitle: 'Senior Talent Acquisition Exec', email: 'pavani.kallakuri@phenom.com', linkedin: 'pavani-kallakuri-1234', leadScore: 75, status: 'Warm', aiNextAction: 'Follow up on recent email' },
  { id: 2, name: 'Deekshitha S', account: 'Phenom', accountIcon: 'P', lastInteraction: '4d ago', jobTitle: 'Talent Acquisition Executive', email: 'deekshitha.s@phenom.com', linkedin: 'deekshitha-s-ba7a3b236', leadScore: 45, status: 'Cold', aiNextAction: 'Nurture with marketing content' },
  { id: 3, name: 'Sravani G', account: 'Phenom', accountIcon: 'P', lastInteraction: '4d ago', jobTitle: 'Talent Acquisition Executive', email: 'sravani.g@phenom.com', linkedin: 'sravani-g-1234', leadScore: 60, status: 'Warm', aiNextAction: 'Invite to upcoming webinar' },
  { id: 4, name: 'John Doe', account: 'HCA Healthcare', accountIcon: 'H', lastInteraction: '6d ago', jobTitle: 'VP of HR', email: 'john.doe@hca.com', linkedin: 'johndoe', leadScore: 95, status: 'Hot', aiNextAction: 'Schedule executive briefing' },
  { id: 5, name: 'Jane Smith', account: 'Kollx', accountIcon: 'K', lastInteraction: '6d ago', jobTitle: 'CEO', email: 'jane@kollx.com', linkedin: 'janesmith', leadScore: 88, status: 'Hot', aiNextAction: 'Send ROI case study' },
];

const initialAccounts: Account[] = [
  { id: 1, name: 'Phenom', icon: 'P', industry: 'Human Resources', lastInteraction: '4d ago', revenue: '$100M to $500M', headcount: '1001-5000', lastFunding: 'Undisclosed', linkedin: 'phenom', website: 'phenom.com', owner: 'Avinash Nadh' },
  { id: 2, name: 'HCA Healthcare', icon: 'H', industry: 'Hospitals and Health Care', lastInteraction: '6d ago', revenue: '$10B+', headcount: '10001+', lastFunding: 'Undisclosed', linkedin: 'hca', website: 'hcahealthcare.com', owner: 'Avinash Nadh' },
  { id: 3, name: 'Kollx', icon: 'K', industry: 'Technology, Information and Internet', lastInteraction: '6d ago', revenue: 'Unknown', headcount: '11-50', lastFunding: 'Undisclosed', linkedin: 'kollx', website: 'kollx.com', owner: 'Avinash Nadh' },
  { id: 4, name: 'Freshteam', icon: 'F', industry: 'Software Development', lastInteraction: '10d ago', revenue: '$100M to $500M', headcount: '1001-5000', lastFunding: 'Series B', linkedin: 'freshteam', website: 'freshteam.com', owner: 'Avinash Nadh' },
  { id: 5, name: 'Recruit CRM', icon: 'R', industry: 'Software Development', lastInteraction: '10d ago', revenue: '$10M to $50M', headcount: '51-200', lastFunding: 'Undisclosed', linkedin: 'recruit-crm', website: 'recruitcrm.io', owner: 'Avinash Nadh' },
  { id: 6, name: 'Ceipal', icon: 'C', industry: 'Software Development', lastInteraction: '10d ago', revenue: '$10M to $50M', headcount: '201-500', lastFunding: 'Series B', linkedin: 'ceipal', website: 'ceipal.com', owner: 'Avinash Nadh' },
  { id: 7, name: 'Sense', icon: 'S', industry: 'Software Development', lastInteraction: '10d ago', revenue: '$10M to $50M', headcount: '201-500', lastFunding: 'Series D', linkedin: 'sense', website: 'sensehq.com', owner: 'Avinash Nadh' },
];

const initialTasks: Task[] = [
  { id: 1, title: 'Follow up with Phenom', description: 'Check in on the proposal sent last week.', status: 'Todo', owner: 'Avinash Nadh', account: 'Phenom', opportunity: 'Phenom - New Business', dueDate: new Date(Date.now() + 86400000).toISOString() },
  { id: 2, title: 'Prepare Demo for HCA', description: 'Customize the demo environment for HCA Healthcare.', status: 'In Progress', owner: 'Avinash Nadh', account: 'HCA Healthcare', opportunity: 'HCA Healthcare - Expansion', dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
];

const initialNotes: Note[] = [
  { id: 1, content: 'Had a great initial meeting with the Phenom team. They are looking for a comprehensive CRM solution.', account: 'Phenom', accountIcon: 'P', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 2, title: 'HCA Healthcare Requirements', content: 'Key requirements include HIPAA compliance and integration with existing EHR systems.', account: 'HCA Healthcare', accountIcon: 'H', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

const initialMeetings: Meeting[] = [
  { id: 1, time: '11:00 - 11:15 AM', title: 'Avinash Nadh Basuvu - Interview with Product Owner - 15mins', account: 'Kollx', accountIcon: 'K', date: new Date().toISOString().split('T')[0] },
  { id: 2, time: '2:00 - 3:00 PM', title: 'Product Manager (Remote) Interview - Web conference', account: 'Freshteam', accountIcon: 'F', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] }
];

export const useCRMStore = create<CRMState>((set) => ({
  leads: initialLeads,
  deals: initialDeals,
  opportunities: initialOpportunities,
  activities: initialActivities,
  contacts: initialContacts,
  accounts: initialAccounts,
  tasks: initialTasks,
  notes: initialNotes,
  meetings: initialMeetings,
  isSuperAgentOpen: false,
  setSuperAgentOpen: (isOpen) => set({ isSuperAgentOpen: isOpen }),
  
  addLead: (lead) => set((state) => ({
    leads: [{ ...lead, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), leadScore: lead.leadScore || Math.floor(Math.random() * 100) }, ...state.leads]
  })),
  
  updateLeadStatus: (id, status) => set((state) => ({
    leads: state.leads.map(l => l.id === id ? { ...l, status } : l)
  })),
  
  addDeal: (deal) => set((state) => ({
    deals: [{ ...deal, id: Math.random().toString(36).substr(2, 9) }, ...state.deals]
  })),
  
  updateDealStage: (id, stage) => set((state) => ({
    deals: state.deals.map(d => d.id === id ? { ...d, stage } : d)
  })),

  addOpportunity: (opportunity) => set((state) => ({
    opportunities: [{ ...opportunity, id: Math.max(...state.opportunities.map(o => o.id), 0) + 1 }, ...state.opportunities]
  })),

  updateOpportunityStage: (id, stage, lossReason) => set((state) => ({
    opportunities: state.opportunities.map(o => o.id === id ? { ...o, stage, lossReason: lossReason || o.lossReason } : o)
  })),
  
  addActivity: (activity) => set((state) => ({
    activities: [{ ...activity, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString() }, ...state.activities]
  })),

  addContact: (contact) => set((state) => ({
    contacts: [{ ...contact, id: Math.max(...state.contacts.map(c => c.id), 0) + 1 }, ...state.contacts]
  })),

  addAccount: (account) => set((state) => ({
    accounts: [{ ...account, id: Math.max(...state.accounts.map(a => a.id), 0) + 1 }, ...state.accounts]
  })),

  addTask: (task) => set((state) => ({
    tasks: [{ ...task, id: Math.max(...state.tasks.map(t => t.id), 0) + 1 }, ...state.tasks]
  })),

  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t)
  })),

  addNote: (note) => set((state) => ({
    notes: [{ ...note, id: Math.max(...state.notes.map(n => n.id), 0) + 1, createdAt: new Date().toISOString() }, ...state.notes]
  })),

  addMeeting: (meeting) => set((state) => ({
    meetings: [{ ...meeting, id: Math.max(...state.meetings.map(m => m.id), 0) + 1 }, ...state.meetings]
  }))
}));
