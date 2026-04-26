import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Settings as SettingsIcon, Mail, Bell, Users, Link2, Database, 
  CreditCard, Calculator, Package, Sparkles, Building2, Shield, 
  UserCircle, Target, Briefcase, Globe, Clock, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const settingsNav = [
  {
    title: 'Account',
    items: [
      { icon: UserCircle, label: 'Profile', id: 'profile' },
      { icon: Bell, label: 'Notifications', id: 'notifications' },
      { icon: Sparkles, label: 'AI Preferences', id: 'ai-preferences' },
    ]
  },
  {
    title: 'Workspace',
    items: [
      { icon: SettingsIcon, label: 'General', id: 'general' },
      { icon: Shield, label: 'Access Control (RBAC)', id: 'access-control', isLink: true, path: '/admin/access-control' },
      { icon: CreditCard, label: 'Billing', id: 'billing' },
      { icon: Link2, label: 'Integrations', id: 'integrations' },
    ]
  },
  {
    title: 'Modules',
    items: [
      { icon: Building2, label: 'CRM Settings', id: 'crm-settings' },
      { icon: Users, label: 'HRM Settings', id: 'hrm-settings' },
      { icon: Calculator, label: 'Finance Settings', id: 'finance-settings' },
      { icon: Package, label: 'Inventory Settings', id: 'inventory-settings' },
    ]
  }
];

const Toggle = ({ label, description, defaultChecked = false, ai = false }: { label: string, description: string, defaultChecked?: boolean, ai?: boolean }) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
      <div>
        <h3 className="text-sm font-medium text-slate-800 flex items-center gap-2">
          {ai && <Sparkles className="w-3.5 h-3.5 text-blue-600" />}
          {label}
        </h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <div 
        onClick={() => setChecked(!checked)}
        className={cn(
          "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
          checked ? "bg-blue-600" : "bg-slate-300"
        )}
      >
        <div className={cn(
          "absolute top-1 w-3 h-3 bg-white rounded-full transition-transform",
          checked ? "right-1" : "left-1"
        )}></div>
      </div>
    </div>
  );
};

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState('profile');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleNavClick = (item: any) => {
    if (item.isLink) {
      navigate(item.path);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <div className="flex h-full -m-6">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col gap-6 overflow-y-auto hide-scrollbar">
        <h2 className="text-xl font-bold text-slate-900 px-2">Settings</h2>
        
        {settingsNav.map((section, idx) => (
          <div className="space-y-1" key={idx}>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              {section.title}
            </div>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
                  activeTab === item.id && !item.isLink
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                )}
              >
                <item.icon className={cn("w-4 h-4", item.id === 'ai-preferences' && "text-blue-600")} />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                      {currentUser.initials}
                    </div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Full Name</label>
                      <Input defaultValue={currentUser.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email Address</label>
                      <Input defaultValue={currentUser.email} type="email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Role</label>
                      <Input defaultValue={currentUser.role} disabled className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Timezone</label>
                      <Input defaultValue="America/Los_Angeles (PST)" />
                    </div>
                  </div>
                  <Button className="mt-4">Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what updates you want to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Toggle label="Email Notifications" description="Receive daily summaries and critical alerts via email." defaultChecked={true} />
                  <Toggle label="In-App Notifications" description="Show push notifications within the application." defaultChecked={true} />
                  <Toggle label="Marketing Updates" description="Receive news about product updates and features." defaultChecked={false} />
                  <Toggle label="AI Insights Alerts" description="Get notified when AI detects anomalies or opportunities." defaultChecked={true} ai={true} />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'ai-preferences' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Copilot Settings</CardTitle>
                  <CardDescription>Manage how AI assists you across the ERP modules.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Toggle label="Global AI Suggestions" description="Allow AI to suggest actions and optimizations across all modules." defaultChecked={true} ai={true} />
                  <Toggle label="Automated Financial Insights" description="Generate weekly AI reports on cash flow, expenses, and anomalies." defaultChecked={true} ai={true} />
                  <Toggle label="Smart Resume Screening" description="Automatically score and rank candidates in the ATS pipeline." defaultChecked={true} ai={true} />
                  <Toggle label="Predictive Inventory" description="Forecast demand and suggest reorder points for products." defaultChecked={true} ai={true} />
                  <Toggle label="AI Meeting Summaries" description="Automatically transcribe and summarize connected calendar meetings." defaultChecked={false} ai={true} />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workspace Settings</CardTitle>
                  <CardDescription>Manage your company's general information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Company Name</label>
                    <Input defaultValue="Acme Corp Global" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Base Currency</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input defaultValue="USD ($)" className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Primary Timezone</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input defaultValue="UTC-8 (Pacific Time)" className="pl-9" />
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4">Save Configuration</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription & Billing</CardTitle>
                  <CardDescription>Manage your plan and payment methods.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">Enterprise Plan</h3>
                      <p className="text-sm text-blue-700 mt-1">Unlimited users, all modules included.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-900">$2,499<span className="text-sm font-normal text-blue-700">/mo</span></div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Manage Payment Methods</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Apps</CardTitle>
                  <CardDescription>Manage third-party integrations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-700">G</div>
                      <div>
                        <h3 className="font-medium text-slate-900">Google Workspace</h3>
                        <p className="text-xs text-slate-500">Calendar, Email, Drive integration</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">Disconnect</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-700">S</div>
                      <div>
                        <h3 className="font-medium text-slate-900">Slack</h3>
                        <p className="text-xs text-slate-500">Notifications and channel alerts</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'crm-settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CRM Configuration</CardTitle>
                  <CardDescription>Customize your sales pipeline and customer management.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Default Pipeline Stages</label>
                    <Input defaultValue="Lead, Qualification, Proposal, Negotiation, Closed Won, Closed Lost" />
                  </div>
                  <Toggle label="AI Lead Scoring" description="Automatically assign scores to new leads based on historical conversion data." defaultChecked={true} ai={true} />
                  <Toggle label="Auto-assign Leads" description="Distribute incoming leads round-robin to active sales reps." defaultChecked={false} />
                  <Button className="mt-4">Save CRM Settings</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'hrm-settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>HRM Configuration</CardTitle>
                  <CardDescription>Manage HR policies, recruitment, and performance cycles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Performance Review Cycle</label>
                      <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent">
                        <option>Quarterly</option>
                        <option>Bi-Annually</option>
                        <option>Annually</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Default Leave Allowance</label>
                      <Input defaultValue="20 Days" />
                    </div>
                  </div>
                  <Toggle label="AI Job Description Generator" description="Enable AI assistance when creating new job requisitions." defaultChecked={true} ai={true} />
                  <Toggle label="Automated Onboarding Workflows" description="Trigger IT and HR tasks automatically when an offer is accepted." defaultChecked={true} />
                  <Button className="mt-4">Save HRM Settings</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'finance-settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Finance Configuration</CardTitle>
                  <CardDescription>Set up accounting rules, taxes, and fiscal periods.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Fiscal Year Start</label>
                      <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent">
                        <option>January 1</option>
                        <option>April 1</option>
                        <option>July 1</option>
                        <option>October 1</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Default Tax Rate (%)</label>
                      <Input defaultValue="8.5" type="number" />
                    </div>
                  </div>
                  <Toggle label="AI Expense Categorization" description="Automatically categorize incoming expenses and flag anomalies." defaultChecked={true} ai={true} />
                  <Toggle label="Auto-send Invoice Reminders" description="Send automated emails for overdue accounts receivable." defaultChecked={true} />
                  <Button className="mt-4">Save Finance Settings</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'inventory-settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Configuration</CardTitle>
                  <CardDescription>Manage warehouses, stock alerts, and supply chain rules.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Default Warehouse</label>
                    <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent">
                      <option>Main Distribution Center (NY)</option>
                      <option>West Coast Hub (CA)</option>
                      <option>European Hub (UK)</option>
                    </select>
                  </div>
                  <Toggle label="AI Demand Forecasting" description="Use historical data to predict stockouts and suggest reorder quantities." defaultChecked={true} ai={true} />
                  <Toggle label="Automated Purchase Orders" description="Automatically draft POs when stock falls below the minimum threshold." defaultChecked={false} />
                  <Button className="mt-4">Save Inventory Settings</Button>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
