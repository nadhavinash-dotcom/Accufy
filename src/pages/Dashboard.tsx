import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown, ListFilter, MessageSquare, Settings, Paperclip, ArrowUp, Clock, VideoOff } from 'lucide-react';
import { useCRMStore } from '@/store/crmStore';
import { format, isToday } from 'date-fns';

export default function Dashboard() {
  const { tasks, meetings } = useCRMStore();

  const todayMeetings = meetings.filter(m => isToday(new Date(m.date)));
  const todayTasks = tasks.filter(t => isToday(new Date(t.dueDate)));

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Up next</h1>
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded shadow-sm">
              Just me
            </button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
              My team
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Create
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pt-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-lg font-medium text-slate-800">{format(new Date(), 'EEE, MMM d')}</h2>
          
          {/* Meetings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-slate-700">Meetings</h3>
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors">
                Today
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            {todayMeetings.length === 0 ? (
              <div className="text-sm text-slate-400 italic pl-2">
                No meetings
              </div>
            ) : (
              <div className="space-y-2">
                {todayMeetings.map((meeting) => (
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-slate-700">Tasks</h3>
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors">
                Today
                <ChevronDown className="w-3 h-3" />
              </button>
              <button className="text-slate-400 hover:text-slate-700 transition-colors ml-1">
                <ListFilter className="w-3.5 h-3.5" />
              </button>
            </div>
            {todayTasks.length === 0 ? (
              <div className="text-sm text-slate-400 italic pl-2">
                No tasks
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors group">
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <h4 className="text-sm font-medium text-slate-800 truncate">
                        {task.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-500">{task.account}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ask Lightfield Input Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl">
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg flex items-center p-2 gap-2">
          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            <Clock className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            placeholder="Ask Lightfield..." 
            className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 outline-none text-sm"
          />
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-2 bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors ml-1">
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
