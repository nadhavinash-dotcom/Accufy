import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, CheckSquare, Calendar, Building2, Briefcase } from 'lucide-react';
import { useCRMStore, Task } from '@/store/crmStore';
import { format } from 'date-fns';

export default function Tasks() {
  const { tasks, addTask, updateTaskStatus } = useCRMStore();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Todo' as Task['status'],
    owner: 'Avinash Nadh',
    account: '',
    opportunity: '',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask({
      ...newTask,
      dueDate: new Date(newTask.dueDate).toISOString()
    });
    setNewTask({
      title: '',
      description: '',
      status: 'Todo',
      owner: 'Avinash Nadh',
      account: '',
      opportunity: '',
      dueDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Tasks</h1>
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
          <Button onClick={() => titleInputRef.current?.focus()} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Create task
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
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-700 border border-slate-200">
            <span className="text-slate-400">Status</span>
            <span>is any of</span>
            <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">2 values</span>
          </div>
        </div>
        <Button variant="outline" className="gap-2 h-7 text-xs border-slate-200 bg-transparent hover:bg-slate-100 text-slate-500">
          <Settings2 className="w-3 h-3" />
          Display
        </Button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
        <div className="divide-y divide-slate-200">
          {tasks.map(task => (
            <div key={task.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <button 
                onClick={() => updateTaskStatus(task.id, task.status === 'Done' ? 'Todo' : 'Done')}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.status === 'Done' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-transparent hover:border-blue-600'}`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h3 className={`text-sm font-medium ${task.status === 'Done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className={`px-2 py-0.5 rounded-full ${task.status === 'Done' ? 'bg-slate-100 text-slate-600' : task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {task.status}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-slate-500 mb-2 line-clamp-2">{task.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {task.account && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {task.account}
                    </span>
                  )}
                  {task.opportunity && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {task.opportunity}
                    </span>
                  )}
                  <span className="flex items-center gap-1 ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[8px]">
                      {task.owner.split(' ').map(n => n[0]).join('')}
                    </div>
                    {task.owner}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No tasks found.
            </div>
          )}
        </div>
      </div>

      {/* Create Task Form */}
      <div className="flex-shrink-0">
        <form onSubmit={handleCreateTask} className="w-full bg-slate-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">
            <input 
              ref={titleInputRef}
              required
              type="text" 
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              placeholder="Add title" 
              className="w-full bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none"
            />
            <textarea 
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})}
              placeholder="Description..." 
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none h-16"
            />
            
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <select 
                value={newTask.status}
                onChange={e => setNewTask({...newTask, status: e.target.value as Task['status']})}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 outline-none"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <input 
                type="text"
                value={newTask.account}
                onChange={e => setNewTask({...newTask, account: e.target.value})}
                placeholder="Account"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 outline-none w-32"
              />
              <input 
                type="text"
                value={newTask.opportunity}
                onChange={e => setNewTask({...newTask, opportunity: e.target.value})}
                placeholder="Opportunity"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 outline-none w-32"
              />
              <input 
                type="date"
                value={newTask.dueDate}
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 outline-none"
              />
            </div>
          </div>
          <div className="p-3 border-t border-slate-200 bg-white flex justify-end">
            <Button type="submit" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              Create task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
