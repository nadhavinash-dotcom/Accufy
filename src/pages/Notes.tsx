import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ListFilter, Settings2, Search } from 'lucide-react';
import { useCRMStore } from '@/store/crmStore';
import { format } from 'date-fns';

export default function Notes() {
  const { notes, addNote, accounts } = useCRMStore();
  const [newNote, setNewNote] = useState({
    content: '',
    account: '',
    accountIcon: ''
  });
  const [searchAccount, setSearchAccount] = useState('');

  const filteredAccounts = accounts.filter(a => a.name.toLowerCase().includes(searchAccount.toLowerCase()));

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.content || !newNote.account) return;
    addNote(newNote);
    setNewNote({ content: '', account: '', accountIcon: '' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Notes</h1>
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
          <Button className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1">
            <Plus className="w-3 h-3" />
            Create note
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

      {/* Notes List */}
      <div className="flex-1 overflow-auto mb-6 space-y-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-700 border border-slate-300">
                {note.accountIcon}
              </div>
              <span className="text-sm font-medium text-slate-900">{note.account}</span>
              <span className="text-xs text-slate-400 ml-auto">{format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}</span>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm">
            No notes found.
          </div>
        )}
      </div>

      {/* Create Note Form */}
      <div className="flex-shrink-0">
        <form onSubmit={handleCreateNote} className="w-full bg-slate-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {!newNote.account ? (
            <>
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-sm font-medium text-slate-800">Select an account for this note</h2>
              </div>
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchAccount}
                    onChange={e => setSearchAccount(e.target.value)}
                    placeholder="Account name" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-slate-300"
                  />
                </div>
                
                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                  {filteredAccounts.map((account) => (
                    <button 
                      key={account.id} 
                      type="button"
                      onClick={() => setNewNote({...newNote, account: account.name, accountIcon: account.icon})}
                      className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-700 border border-slate-300">
                        {account.icon}
                      </div>
                      <span className="text-sm text-slate-700">{account.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-700 border border-slate-300">
                    {newNote.accountIcon}
                  </div>
                  <span className="text-sm font-medium text-slate-900">{newNote.account}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setNewNote({...newNote, account: '', accountIcon: ''})}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Change
                </button>
              </div>
              <div className="p-4 bg-white">
                <textarea 
                  required
                  value={newNote.content}
                  onChange={e => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Start typing your note..." 
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none h-24"
                />
              </div>
              <div className="p-3 border-t border-slate-200 bg-white flex justify-end">
                <Button type="submit" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  Save note
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
