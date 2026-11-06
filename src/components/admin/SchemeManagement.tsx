import React, { useState } from 'react';
import { 
  Landmark, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { GovernmentScheme } from '../../types';

export const SchemeManagement: React.FC = () => {
  const { schemes, addOrUpdateScheme, deleteScheme } = useBanking();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'agriculture' | 'education' | 'business' | 'women' | 'karnataka'>('agriculture');
  const [description, setDescription] = useState('');
  const [targetBeneficiaries, setTargetBeneficiaries] = useState('');
  const [financialBenefits, setFinancialBenefits] = useState('');
  const [department, setDepartment] = useState('');
  const [officialPortalUrl, setOfficialPortalUrl] = useState('');
  const [eligibilityRaw, setEligibilityRaw] = useState('');
  const [documentsRaw, setDocumentsRaw] = useState('');
  const [isStateScheme, setIsStateScheme] = useState(false);
  const [stateName, setStateName] = useState('Karnataka');

  const startAdd = () => {
    setEditingId(null);
    setTitle('');
    setCategory('agriculture');
    setDescription('');
    setTargetBeneficiaries('');
    setFinancialBenefits('');
    setDepartment('Ministry of Agriculture & Farmers Welfare');
    setOfficialPortalUrl('https://');
    setEligibilityRaw('Indian Citizen, Aadhaar linked bank account');
    setDocumentsRaw('Aadhaar Card, Land Record, Bank Passbook');
    setIsStateScheme(false);
    setStateName('Karnataka');
    setIsEditing(true);
  };

  const startEdit = (s: GovernmentScheme) => {
    setEditingId(s.id);
    setTitle(s.title);
    setCategory(s.category);
    setDescription(s.description);
    setTargetBeneficiaries(s.targetBeneficiaries);
    setFinancialBenefits(s.financialBenefits);
    setDepartment(s.department);
    setOfficialPortalUrl(s.officialPortalUrl);
    setEligibilityRaw(s.eligibility.join('\n'));
    setDocumentsRaw(s.requiredDocuments.join(', '));
    setIsStateScheme(s.isStateScheme);
    setStateName(s.state || 'Karnataka');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || `SCH-${Date.now().toString().slice(-6)}`;
    
    const categoryLabels: Record<string, string> = {
      agriculture: 'Agriculture & Farmer Welfare',
      education: 'Education & Higher Studies',
      business: 'Business & Micro-Enterprise',
      women: 'Women Empowerment',
      karnataka: 'Karnataka State Scheme',
    };

    const schemeObj: GovernmentScheme = {
      id,
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category] || 'Government Scheme',
      description: description.trim(),
      targetBeneficiaries: targetBeneficiaries.trim(),
      eligibility: eligibilityRaw.split('\n').map(s => s.trim()).filter(Boolean),
      financialBenefits: financialBenefits.trim(),
      requiredDocuments: documentsRaw.split(',').map(s => s.trim()).filter(Boolean),
      officialPortalUrl: officialPortalUrl.trim(),
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
      isVerified: true,
      department: department.trim(),
      isStateScheme: category === 'karnataka' || isStateScheme,
      state: category === 'karnataka' || isStateScheme ? stateName : undefined,
    };

    addOrUpdateScheme(schemeObj);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            Government Financial Assistance Schemes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain verified public directory of central and state subsidies, scholarships, and grants
          </p>
        </div>

        <button
          type="button"
          onClick={startAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add New Scheme</span>
        </button>
      </div>

      {isEditing && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md max-w-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-[#142B4A]">
              {editingId ? 'Edit Government Scheme' : 'Register New Government Scheme'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Scheme Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="agriculture">Agriculture & Farmer</option>
                  <option value="education">Education & Scholarships</option>
                  <option value="business">Business & Enterprise</option>
                  <option value="women">Women Empowerment</option>
                  <option value="karnataka">Karnataka State Scheme</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Administering Department / Ministry *</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description *</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Beneficiaries *</label>
                <input
                  type="text"
                  value={targetBeneficiaries}
                  onChange={(e) => setTargetBeneficiaries(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Financial Benefits & Support *</label>
                <input
                  type="text"
                  value={financialBenefits}
                  onChange={(e) => setFinancialBenefits(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Eligibility Criteria (one per line)</label>
              <textarea
                rows={3}
                value={eligibilityRaw}
                onChange={(e) => setEligibilityRaw(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Required Documents (comma separated)</label>
              <input
                type="text"
                value={documentsRaw}
                onChange={(e) => setDocumentsRaw(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Portal URL *</label>
              <input
                type="url"
                value={officialPortalUrl}
                onChange={(e) => setOfficialPortalUrl(e.target.value)}
                required
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#142B4A] hover:bg-[#1f3f6b] rounded-lg shadow-xs"
              >
                Save Scheme
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Scheme Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Benefits</th>
                <th className="py-3 px-4">Portal Link</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schemes.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 max-w-[240px]">
                    <div className="font-bold text-[#142B4A] truncate">{s.title}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{s.department}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm">
                      {s.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate">
                    {s.financialBenefits}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <a 
                      href={s.officialPortalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {s.lastVerifiedDate}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(s)}
                        className="p-1 text-slate-500 hover:text-[#2563EB] rounded-sm transition-colors"
                        title="Edit Scheme"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove scheme "${s.title}" from directory?`)) {
                            deleteScheme(s.id);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-red-600 rounded-sm transition-colors"
                        title="Remove Scheme"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
