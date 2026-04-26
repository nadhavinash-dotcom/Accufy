import React from 'react';

export default function GenericPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      <div className="p-8 border border-slate-200 rounded-xl bg-white text-center text-slate-500">
        {title} content goes here.
      </div>
    </div>
  );
}
