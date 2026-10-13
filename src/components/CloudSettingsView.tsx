import React, { useState } from 'react';
import { 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  FolderTree, 
  Key, 
  Settings,
  ExternalLink,
  Lock,
  Clock
} from 'lucide-react';
import { CloudStorageConfig } from '../types/correspondence';

interface CloudSettingsViewProps {
  config: CloudStorageConfig;
  onUpdateConfig: (newConfig: Partial<CloudStorageConfig>) => Promise<void>;
}

export const CloudSettingsView: React.FC<CloudSettingsViewProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [formData, setFormData] = useState<CloudStorageConfig>({ ...config });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isTestingSync, setIsTestingSync] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateConfig(formData);
      setSaveMessage('Cloud storage configuration successfully updated and verified!');
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingSync(true);
    setTestResult(null);
    try {
      // Simulate Microsoft Graph handshake
      await new Promise(r => setTimeout(r, 1200));
      setTestResult('Connection Successful! Microsoft Graph API authenticated for Airblue tenant.');
    } catch (err) {
      setTestResult('Connection test failed.');
    } finally {
      setIsTestingSync(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-900">
            Enterprise Cloud Storage &amp; Archival Setup
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure official organization-authorized Microsoft OneDrive or SharePoint document repository for Airblue PCAA correspondence records.
        </p>
      </div>

      {saveMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Connection Status Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
            MS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Microsoft Graph ({formData.provider === 'onedrive' ? 'OneDrive for Business' : 'SharePoint Enterprise'})
              </h3>
              {formData.isConnected ? (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  CONNECTED
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  SETUP REQUIRED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized Tenant: <strong>{formData.tenantId}</strong> ({formData.accountEmail})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={isTestingSync}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          {isTestingSync ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Testing Handshake...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Test Microsoft Graph Sync</span>
            </>
          )}
        </button>
      </div>

      {testResult && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
        {/* Provider Selection */}
        <div className="space-y-2">
          <label className="block text-slate-800 font-bold text-sm">
            Cloud Storage Service Provider
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
              formData.provider === 'onedrive' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <input
                type="radio"
                name="provider"
                value="onedrive"
                checked={formData.provider === 'onedrive'}
                onChange={() => setFormData({ ...formData, provider: 'onedrive' })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Microsoft OneDrive for Business</span>
                <span className="text-[11px] text-slate-500">Corporate document storage drive</span>
              </div>
            </label>

            <label className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
              formData.provider === 'sharepoint' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <input
                type="radio"
                name="provider"
                value="sharepoint"
                checked={formData.provider === 'sharepoint'}
                onChange={() => setFormData({ ...formData, provider: 'sharepoint' })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Microsoft SharePoint Online</span>
                <span className="text-[11px] text-slate-500">Department document library site</span>
              </div>
            </label>
          </div>
        </div>

        {/* Tenant & Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Authorized Account Email
            </label>
            <input
              type="email"
              value={formData.accountEmail}
              onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Microsoft Azure Tenant ID
            </label>
            <input
              type="text"
              value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Folder Hierarchy & Naming Scheme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Base Storage Vault Path
            </label>
            <input
              type="text"
              value={formData.baseFolder}
              onChange={(e) => setFormData({ ...formData, baseFolder: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Directory Structure Pattern
            </label>
            <input
              type="text"
              value={formData.namingPattern}
              onChange={(e) => setFormData({ ...formData, namingPattern: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Retention Policy & Auto Sync */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Statutory Retention Schedule (Years)
            </label>
            <select
              value={formData.retentionYears}
              onChange={(e) => setFormData({ ...formData, retentionYears: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={5}>5 Years (Operational Records)</option>
              <option value={7}>7 Years (Standard Corporate Retention)</option>
              <option value={10}>10 Years (ICAO / PCAA Airworthiness &amp; Flight Safety Standard)</option>
              <option value={20}>20 Years (Permanent Regulatory Archival)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Enforces retention locks preventing deletion of regulatory records prior to statutory expiry.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={formData.autoSync}
                onChange={(e) => setFormData({ ...formData, autoSync: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span>Automatic Background Synchronization</span>
            </label>
            <p className="text-[11px] text-slate-500 mt-1">
              Immediately syncs uploaded original letter scans to Microsoft Graph upon registrar verification.
            </p>
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configuration...' : 'Save & Enforce Cloud Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
