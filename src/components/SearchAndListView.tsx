import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  FileText, 
  ExternalLink, 
  Download, 
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Tag,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  CorrespondenceRecord, 
  CorrespondenceDirection, 
  CorrespondenceCategory, 
  CorrespondencePriority,
  CorrespondenceStatus 
} from '../types/correspondence';

interface SearchAndListViewProps {
  records: CorrespondenceRecord[];
  onSelectRecord: (record: CorrespondenceRecord) => void;
  onExportCsv: () => void;
}

export const SearchAndListView: React.FC<SearchAndListViewProps> = ({
  records,
  onSelectRecord,
  onExportCsv,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'ref' | 'deadline'>('date-desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const categories: CorrespondenceCategory[] = [
    'Flight Operations',
    'Airworthiness & Engineering',
    'Aerodrome & Ramp Safety',
    'Cabin Safety & Crew',
    'Tariffs, Routes & Licensing',
    'Aviation Security & Facilitation',
    'Legal & Regulatory Compliance',
  ];

  const statuses: CorrespondenceStatus[] = [
    'Draft',
    'Processing',
    'Awaiting Verification',
    'Received',
    'Under Review',
    'Reply Required',
    'Replied',
    'Dispatched',
    'Closed',
  ];

  // Filter and full-text search logic
  const filteredRecords = useMemo(() => {
    let result = [...records];
    const q = searchTerm.toLowerCase().trim();

    if (q) {
      result = result.filter(r => {
        const matchesRef = r.internalRef.toLowerCase().includes(q) ||
                           r.pcaaRefNumber.toLowerCase().includes(q) ||
                           (r.airblueRefNumber && r.airblueRefNumber.toLowerCase().includes(q));
        const matchesSubject = r.subject.toLowerCase().includes(q);
        const matchesPeople = r.sender.toLowerCase().includes(q) || 
                              r.recipient.toLowerCase().includes(q) ||
                              r.responsibleOfficer.toLowerCase().includes(q) ||
                              (r.mentionedOfficers && r.mentionedOfficers.some(o => o.toLowerCase().includes(q)));
        const matchesOcr = r.extractedText.toLowerCase().includes(q);
        const matchesSummary = r.aiSummary.toLowerCase().includes(q);
        const matchesKeywords = r.keywords.some(k => k.toLowerCase().includes(q));
        const matchesFilename = r.attachment?.fileName.toLowerCase().includes(q);
        const matchesDept = r.departmentConcerned.toLowerCase().includes(q);

        return matchesRef || matchesSubject || matchesPeople || matchesOcr || matchesSummary || matchesKeywords || matchesFilename || matchesDept;
      });
    }

    if (directionFilter !== 'all') {
      result = result.filter(r => r.direction === directionFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter(r => r.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(r => r.priority === priorityFilter);
    }

    if (dateFrom) {
      result = result.filter(r => r.letterDate >= dateFrom);
    }

    if (dateTo) {
      result = result.filter(r => r.letterDate <= dateTo);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.letterDate).getTime() - new Date(a.letterDate).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.letterDate).getTime() - new Date(b.letterDate).getTime();
      }
      if (sortBy === 'ref') {
        return a.internalRef.localeCompare(b.internalRef);
      }
      if (sortBy === 'deadline') {
        const da = a.replyDeadline ? new Date(a.replyDeadline).getTime() : Infinity;
        const db = b.replyDeadline ? new Date(b.replyDeadline).getTime() : Infinity;
        return da - db;
      }
      return 0;
    });

    return result;
  }, [records, searchTerm, directionFilter, categoryFilter, statusFilter, priorityFilter, dateFrom, dateTo, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDirectionFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-4">
      {/* Top Search Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Correspondence Registry &amp; Full-Text Retrieval
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant search across reference numbers, subjects, full OCR letter text, and regulatory keywords.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Search Input Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Airblue Ref, PCAA Ref, subject, officer name, or phrase inside OCR text (e.g., 'CFM56', 'AD-2026', 'Jeddah slots', 'FDR readout')..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Direction Filter */}
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Directions</option>
              <option value="incoming">Incoming (From PCAA)</option>
              <option value="outgoing">Outgoing (To PCAA)</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Toggle Advanced */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md bg-slate-50 flex items-center gap-1 font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvancedFilters ? 'Hide Date Filter' : 'Date Range'}</span>
            </button>

            {(searchTerm || directionFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || dateFrom || dateTo) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-700 underline font-medium ml-1"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="deadline">Reply Deadline</option>
              <option value="ref">Reference Number</option>
            </select>
          </div>
        </div>

        {/* Date Range Collapsible */}
        {showAdvancedFilters && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">From Date:</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">To Date:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Count & Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
          <span>Found <strong>{filteredRecords.length}</strong> matching correspondence records</span>
          <span className="font-mono text-[11px] text-slate-500">Live Database Index</span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">No correspondence records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search keywords, clearing filters, or check if the letter was registered under a different reference number.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md"
            >
              Clear All Search Criteria
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Internal Ref</th>
                  <th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Letter Date</th>
                  <th className="py-3 px-4">PCAA Reference</th>
                  <th className="py-3 px-4">Airblue Ref</th>
                  <th className="py-3 px-4">Subject &amp; Concerned Dept</th>
                  <th className="py-3 px-4">Priority / Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => onSelectRecord(record)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    {/* Internal Ref */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {record.internalRef}
                    </td>

                    {/* Direction */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        record.direction === 'incoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {record.direction.toUpperCase()}
                      </span>
                    </td>

                    {/* Letter Date */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                      {record.letterDate}
                    </td>

                    {/* PCAA Ref */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-800 whitespace-nowrap">
                      {record.pcaaRefNumber}
                    </td>

                    {/* Airblue Ref */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {record.airblueRefNumber || '—'}
                    </td>

                    {/* Subject & Dept */}
                    <td className="py-3 px-4 max-w-md">
                      <p className="font-semibold text-slate-900 truncate" title={record.subject}>
                        {record.subject}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{record.category}</span>
                        <span>·</span>
                        <span className="truncate">{record.departmentConcerned}</span>
                      </div>
                    </td>

                    {/* Priority & Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold w-max ${
                          record.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          record.priority === 'Urgent' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {record.priority}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {record.status}
                        </span>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                      {record.replyRequired && record.replyDeadline ? (
                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{record.replyDeadline}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Not Req.</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectRecord(record)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        Open Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
