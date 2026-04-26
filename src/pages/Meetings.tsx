import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, VideoOff, MoreHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import { useCRMStore } from '@/store/crmStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { format } from 'date-fns';

export default function Meetings() {
  const { meetings, addMeeting, accounts } = useCRMStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    account: ''
  });

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const accountObj = accounts.find(a => a.name === newMeeting.account);
    if (!accountObj) return;

    addMeeting({
      title: newMeeting.title,
      time: newMeeting.time,
      date: newMeeting.date,
      account: accountObj.name,
      accountIcon: accountObj.icon
    });
    setIsModalOpen(false);
    setNewMeeting({ title: '', time: '', date: format(new Date(), 'yyyy-MM-dd'), account: '' });
  };

  // Group meetings by date
  const groupedMeetings = meetings.reduce((acc, meeting) => {
    const dateStr = format(new Date(meeting.date), 'EEEE, MMMM d, yyyy');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(meeting);
    return acc;
  }, {} as Record<string, typeof meetings>);

  const sortedGroups = Object.entries(groupedMeetings).sort((a, b) => {
    return new Date(a[0]).getTime() - new Date(b[0]).getTime();
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Meetings</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              All
            </button>
            <button className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-3.5 h-3.5" />
            Create meeting
          </Button>
          <Button variant="outline" className="gap-2 h-8 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
            <ListFilter className="w-3.5 h-3.5" />
            Filter
          </Button>
        </div>
        <Button variant="outline" className="gap-2 h-8 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
          <Settings2 className="w-3.5 h-3.5" />
          Display
        </Button>
      </div>

      {/* Meetings List */}
      <div className="flex-1 overflow-auto space-y-6 pt-4">
        {sortedGroups.map(([dateStr, items]) => (
          <div key={dateStr} className="space-y-3">
            <h3 className="text-sm font-medium text-slate-500 sticky top-0 bg-slate-50 py-1 z-10">
              {dateStr}
            </h3>
            
            {items.length === 0 ? (
              <div className="text-sm text-slate-400 italic pl-4">No meetings</div>
            ) : (
              <div className="space-y-2">
                {items.map((meeting) => (
                  <div key={meeting.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors group">
                    <div className="w-32 text-xs font-medium text-slate-500 flex-shrink-0">
                      {meeting.time}
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <h4 className="text-sm font-medium text-slate-800 truncate">
                        {meeting.title}
                      </h4>
                      <VideoOff className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-700 border border-slate-300">
                        {meeting.accountIcon}
                      </div>
                      <span className="text-xs text-slate-500">{meeting.account}</span>
                    </div>
                    
                    <button className="p-1 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {sortedGroups.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No meetings scheduled.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Meeting"
      >
        <form onSubmit={handleCreateMeeting} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Meeting Title
            </label>
            <Input
              required
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              placeholder="e.g., Initial Consultation"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                required
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Time
              </label>
              <Input
                required
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                placeholder="e.g., 10:00 AM - 11:00 AM"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Account
            </label>
            <select
              required
              value={newMeeting.account}
              onChange={(e) => setNewMeeting({ ...newMeeting, account: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.name}>{account.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Meeting
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
