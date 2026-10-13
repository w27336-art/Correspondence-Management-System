import React, { useState } from 'react';
import { 
  History, 
  ShieldCheck, 
  Search, 
  Filter, 
  User, 
  Clock, 
  FileText, 
  Tag, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { AuditLogEntry } from '../types/correspondence';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q ||
      log.actorName.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      (log.internalRef && log.internalRef.toLowerCase().includes(q)) ||
      log.action.toLowerCase().includes(q);

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Immutable Regulatory Audit Trail
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Permanent, tamper-evident log capturing all correspondence creation events, AI OCR extractions, user verifications, metadata alterations, and cloud storage transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Chain of Custody Verified</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by actor name, reference, or action description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Audit Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="AI_EXTRACT">AI_EXTRACT</option>
            <option value="VERIFY">VERIFY</option>
            <option value="UPDATE">UPDATE</option>
            <option value="LINK_THREAD">LINK_THREAD</option>
            <option value="STATUS_CHANGE">STATUS_CHANGE</option>
            <option value="CLOUD_SYNC">CLOUD_SYNC</option>
            <option value="CONFIG_CHANGE">CONFIG_CHANGE</option>
            <option value="EXPORT">EXPORT</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor &amp; Role</th>
                <th className="py-3 px-4">Correspondence Ref</th>
                <th className="py-3 px-4">Audit Description &amp; State Delta</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  {/* Action Type */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      log.action === 'CREATE' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'VERIFY' ? 'bg-emerald-100 text-emerald-800' :
                      log.action === 'AI_EXTRACT' ? 'bg-purple-100 text-purple-800' :
                      log.action === 'CLOUD_SYNC' ? 'bg-indigo-100 text-indigo-800' :
                      log.action === 'LINK_THREAD' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  {/* Actor */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{log.actorName}</div>
                    <div className="text-[10px] text-slate-500">{log.actorRole}</div>
                  </td>

                  {/* Correspondence Ref */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-800 whitespace-nowrap">
                    {log.internalRef || '—'}
                  </td>

                  {/* Description & Details */}
                  <td className="py-3 px-4 max-w-md">
                    <p className="text-slate-800">{log.description}</p>
                    {log.details && (
                      <div className="mt-1 text-[11px] font-mono bg-slate-50 p-1.5 rounded border border-slate-200/60 text-slate-600">
                        {log.details.oldValue !== undefined && log.details.newValue !== undefined ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-red-500 line-through">
                              {JSON.stringify(log.details.oldValue) || 'null'}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="text-emerald-600 font-semibold">
                              {JSON.stringify(log.details.newValue)}
                            </span>
                          </div>
                        ) : (
                          <span>{JSON.stringify(log.details)}</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* IP Address */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 text-right whitespace-nowrap">
                    {log.ipAddress || '127.0.0.1'}
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
