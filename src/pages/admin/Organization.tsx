import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Upload, Lock, Network, ChevronRight, ChevronDown, Building2, Users, Briefcase, UserCircle, Sparkles, AlertTriangle, Edit2, Trash2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

// Mock Data for Adjacency List Model
const initialOrgUnits = [
  { id: '1', parentId: null, name: 'Acme Corp Global', type: 'Org', head: 'Avinash Nadh', children: ['2', '3'] },
  { id: '2', parentId: '1', name: 'Acme Corp NA', type: 'Company', head: 'Sarah Connor', children: ['4', '5'] },
  { id: '3', parentId: '1', name: 'Acme Corp EMEA', type: 'Company', head: 'Michael Chang', children: ['6'] },
  { id: '4', parentId: '2', name: 'Engineering', type: 'BU', head: 'David Kim', children: ['7', '8'] },
  { id: '5', parentId: '2', name: 'Sales', type: 'BU', head: 'Emily Chen', children: [] },
  { id: '6', parentId: '3', name: 'Marketing', type: 'BU', head: 'John Smith', children: [] },
  { id: '7', parentId: '4', name: 'Frontend Team', type: 'Team', head: 'Alice Johnson', children: [] },
  { id: '8', parentId: '4', name: 'Backend Team', type: 'Team', head: 'Bob Williams', children: [] },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Org': return <Network className="w-4 h-4 text-indigo-500" />;
    case 'Company': return <Building2 className="w-4 h-4 text-blue-500" />;
    case 'BU': return <Briefcase className="w-4 h-4 text-emerald-500" />;
    case 'Dept': return <Users className="w-4 h-4 text-amber-500" />;
    case 'Team': return <UserCircle className="w-4 h-4 text-rose-500" />;
    default: return <Building2 className="w-4 h-4 text-slate-500" />;
  }
};

const OrgNode = ({ node, allNodes, level = 0, onAddChild, onEdit, onDelete, onDropNode }: { node: any, allNodes: any[], level?: number, onAddChild: (parentId: string) => void, onEdit: (node: any) => void, onDelete: (id: string) => void, onDropNode: (draggedId: string, targetId: string) => void }) => {
  const [expanded, setExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const children = allNodes.filter(n => n.parentId === node.id);
  const hasChildren = children.length > 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('nodeId', node.id);
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const draggedId = e.dataTransfer.getData('nodeId');
    if (draggedId && draggedId !== node.id) {
      onDropNode(draggedId, node.id);
    }
  };

  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "flex items-center gap-3 py-2 px-3 hover:bg-slate-50 rounded-md group transition-colors border cursor-grab active:cursor-grabbing",
          level === 0 ? "bg-slate-50 border-slate-200 mb-2" : "border-transparent hover:border-slate-200",
          isDragOver ? "bg-blue-50 border-blue-300 border-dashed" : ""
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button 
          onClick={() => setExpanded(!expanded)}
          className={cn("p-0.5 rounded-sm hover:bg-slate-200 text-slate-400 transition-colors", !hasChildren && "invisible")}
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        <div className="flex items-center gap-2 flex-1">
          {getTypeIcon(node.type)}
          <span className="font-medium text-sm text-slate-800">{node.name}</span>
          <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0 h-4 bg-slate-100 text-slate-500 border-slate-200">
            {node.type}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1"><UserCircle className="w-3 h-3" /> Head: {node.head}</span>
          <Button variant="ghost" size="sm" onClick={() => onEdit(node)} className="h-6 w-6 p-0 text-slate-400 hover:text-blue-600"><Edit2 className="w-3 h-3" /></Button>
          <Button variant="ghost" size="sm" onClick={() => onAddChild(node.id)} className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-600"><Plus className="w-3 h-3" /></Button>
          {level > 0 && <Button variant="ghost" size="sm" onClick={() => onDelete(node.id)} className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></Button>}
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="flex flex-col relative before:absolute before:left-[1.2rem] before:top-0 before:bottom-4 before:w-px before:bg-slate-200">
          {children.map(child => (
            <OrgNode key={child.id} node={child} allNodes={allNodes} level={level + 1} onAddChild={onAddChild} onEdit={onEdit} onDelete={onDelete} onDropNode={onDropNode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Organization() {
  const [orgUnits, setOrgUnits] = useState(initialOrgUnits);
  const [isLocked, setIsLocked] = useState(false);
  const [editingNode, setEditingNode] = useState<any | null>(null);
  const [isAddingNode, setIsAddingNode] = useState<{ parentId: string | null } | null>(null);
  const [newNodeData, setNewNodeData] = useState({ name: '', type: 'Team', head: '' });

  const rootNodes = orgUnits.filter(n => n.parentId === null);

  const handleAddChild = (parentId: string | null) => {
    if (isLocked) {
      toast.error("Hierarchy is locked. Unlock to make changes.");
      return;
    }
    setIsAddingNode({ parentId });
    setNewNodeData({ name: '', type: 'Team', head: '' });
  };

  const handleSaveNewNode = () => {
    if (!newNodeData.name || !newNodeData.head) {
      toast.error("Please fill in all fields.");
      return;
    }
    const newNode = {
      id: Math.random().toString(36).substr(2, 9),
      parentId: isAddingNode?.parentId || null,
      name: newNodeData.name,
      type: newNodeData.type,
      head: newNodeData.head,
      children: []
    };
    setOrgUnits([...orgUnits, newNode]);
    setIsAddingNode(null);
    toast.success(`Added ${newNode.name} to hierarchy.`);
  };

  const handleEditNode = (node: any) => {
    if (isLocked) {
      toast.error("Hierarchy is locked. Unlock to make changes.");
      return;
    }
    setEditingNode({ ...node });
  };

  const handleSaveEdit = () => {
    if (!editingNode.name || !editingNode.head) {
      toast.error("Please fill in all fields.");
      return;
    }
    setOrgUnits(orgUnits.map(n => n.id === editingNode.id ? editingNode : n));
    setEditingNode(null);
    toast.success(`Updated ${editingNode.name}.`);
  };

  const handleDeleteNode = (id: string) => {
    if (isLocked) {
      toast.error("Hierarchy is locked. Unlock to make changes.");
      return;
    }
    const nodeToDelete = orgUnits.find(n => n.id === id);
    if (!nodeToDelete) return;
    
    // Check if it has children
    const hasChildren = orgUnits.some(n => n.parentId === id);
    if (hasChildren) {
      toast.error(`Cannot delete ${nodeToDelete.name} because it has child units. Delete or move them first.`);
      return;
    }

    setOrgUnits(orgUnits.filter(n => n.id !== id));
    toast.success(`Deleted ${nodeToDelete.name}.`);
  };

  const handleAIGenerate = () => {
    if (isLocked) {
      toast.error("Hierarchy is locked. Unlock to make changes.");
      return;
    }
    toast.success("AI is analyzing uploaded documents to generate hierarchy...", {
      description: "This may take a moment."
    });
    // Simulate AI generation
    setTimeout(() => {
      toast.success("Hierarchy generated successfully from Acme_Corp_OrgChart_2023.pdf");
    }, 2000);
  };

  const handleDropNode = (draggedId: string, targetId: string) => {
    if (isLocked) {
      toast.error("Hierarchy is locked. Unlock to make changes.");
      return;
    }

    // Prevent dropping a node into itself or its descendants
    let currentTarget: any = orgUnits.find(n => n.id === targetId);
    while (currentTarget) {
      if (currentTarget.id === draggedId) {
        toast.error("Cannot move a node into its own descendant.");
        return;
      }
      currentTarget = orgUnits.find(n => n.id === currentTarget.parentId);
    }

    const draggedNode = orgUnits.find(n => n.id === draggedId);
    const targetNode = orgUnits.find(n => n.id === targetId);

    if (draggedNode && targetNode) {
      setOrgUnits(orgUnits.map(n => {
        if (n.id === draggedId) {
          return { ...n, parentId: targetId };
        }
        return n;
      }));
      toast.success(`Moved ${draggedNode.name} under ${targetNode.name}`);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Org Structure Builder</h1>
          <p className="text-sm text-slate-500 mt-1">Enterprise Tenant Onboarding & Hierarchy Management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-9 text-sm border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600" onClick={handleAIGenerate}>
            <Sparkles className="w-4 h-4" />
            AI Auto-Generate from CSV/PDF
          </Button>
          <Button 
            className={cn("h-9 text-sm gap-2 text-white", isLocked ? "bg-slate-800 hover:bg-slate-900" : "bg-blue-600 hover:bg-blue-700")}
            onClick={() => {
              setIsLocked(!isLocked);
              toast.success(isLocked ? "Hierarchy unlocked for editing" : "Hierarchy locked");
            }}
          >
            <Lock className="w-4 h-4" />
            {isLocked ? "Unlock Hierarchy" : "Lock Hierarchy"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Org Tree */}
        <div className="lg:col-span-2 flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="font-medium text-sm text-slate-800 flex items-center gap-2">
              <Network className="w-4 h-4 text-slate-500" />
              Hierarchy Tree (Drag-and-Drop)
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-normal text-[10px]">
                Drag nodes to reorder
              </Badge>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleAddChild(null)}>
                <Plus className="w-3 h-3" /> Add Root Node
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {rootNodes.map(node => (
              <OrgNode key={node.id} node={node} allNodes={orgUnits} onAddChild={handleAddChild} onEdit={handleEditNode} onDelete={handleDeleteNode} onDropNode={handleDropNode} />
            ))}
          </div>
        </div>

        {/* AI Insights & Integrations */}
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Node Editor / Adder */}
          {(editingNode || isAddingNode) && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-800 text-sm">
                  {editingNode ? 'Edit Node' : 'Add New Node'}
                </h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { setEditingNode(null); setIsAddingNode(null); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Node Name</label>
                  <Input 
                    value={editingNode ? editingNode.name : newNodeData.name} 
                    onChange={e => editingNode ? setEditingNode({...editingNode, name: e.target.value}) : setNewNodeData({...newNodeData, name: e.target.value})}
                    className="h-8 text-sm" 
                    placeholder="e.g. Frontend Team" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Node Type</label>
                  <select 
                    className="flex h-8 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950"
                    value={editingNode ? editingNode.type : newNodeData.type}
                    onChange={e => editingNode ? setEditingNode({...editingNode, type: e.target.value}) : setNewNodeData({...newNodeData, type: e.target.value})}
                  >
                    <option value="Org">Organization</option>
                    <option value="Company">Company</option>
                    <option value="BU">Business Unit</option>
                    <option value="Dept">Department</option>
                    <option value="Team">Team</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Head of Node</label>
                  <Input 
                    value={editingNode ? editingNode.head : newNodeData.head} 
                    onChange={e => editingNode ? setEditingNode({...editingNode, head: e.target.value}) : setNewNodeData({...newNodeData, head: e.target.value})}
                    className="h-8 text-sm" 
                    placeholder="e.g. Alice Johnson" 
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setEditingNode(null); setIsAddingNode(null); }}>Cancel</Button>
                  <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={editingNode ? handleSaveEdit : handleSaveNewNode}>
                    {editingNode ? 'Save Changes' : 'Add Node'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              AI Policy Inheritance
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
                <p className="text-blue-800 font-medium mb-1">Global Holidays Cascaded</p>
                <p className="text-blue-600/80 text-xs">12 global holidays automatically applied to all child nodes. Acme Corp EMEA has 2 local overrides.</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 font-medium mb-1">Misaligned Teams Detected</p>
                    <p className="text-amber-700/80 text-xs">"Frontend Team" is under "Engineering" but reports to a manager in "Marketing". Review recommended.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-sm text-slate-800 mb-3">Critical Integrations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xs">AD</div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Azure AD / Okta (SCIM)</p>
                    <p className="text-xs text-slate-500">Auto-mapping AD groups to Org_Units</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-normal text-[10px]">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center text-orange-600 font-bold text-xs">ERP</div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">SAP / NetSuite</p>
                    <p className="text-xs text-slate-500">Financial GL & Payroll Roll-ups</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-[10px]">Configure</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
