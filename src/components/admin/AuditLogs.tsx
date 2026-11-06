import React from 'react';
import { FileText, ShieldAlert, Clock, UserCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const AuditLogs: React.FC = () => {
  const { auditLogs } = useBanking();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-[#142B4A]">
          Security & Compliance Audit Trails
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable event ledger recording administrator actions, account provisions, and compliance events
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Principal</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-700 font-medium whitespace-nowrap">
                    @{log.adminUsername}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] text-slate-500 font-medium whitespace-nowrap">
                    {log.entityType} ({log.entityId})
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-sm">
                    {log.details}
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
