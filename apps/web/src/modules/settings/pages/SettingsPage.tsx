import { useState } from 'react';
import { 
  Settings, Shield, Building2, Users, Plug, Sparkles, 
  CheckCircle2, Activity, HardDrive, ArrowRight, ChevronRight, Check
} from 'lucide-react';
import { PageContainer } from "@/components/layout";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // General Form State
  const [formData, setFormData] = useState({
    organizationName: 'TransitOps Logistics',
    currency: 'USD - US Dollar ($)',
    timezone: '(UTC+05:30) Asia/Kolkata',
    distanceUnit: 'km',
    language: 'English (United States)',
    numberFormat: '1,234.56',
    dateFormat: 'DD MMM YYYY (29 Jul 2026)',
    weekStartsOn: 'Monday'
  });

  // Security Toggles State
  const [securityData, setSecurityData] = useState({
    twoFactor: true,
    autoLogout: true
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API request
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleReset = () => {
    if (activeTab === 'General') {
      setFormData({
        organizationName: 'TransitOps Logistics',
        currency: 'USD - US Dollar ($)',
        timezone: '(UTC+05:30) Asia/Kolkata',
        distanceUnit: 'km',
        language: 'English (United States)',
        numberFormat: '1,234.56',
        dateFormat: 'DD MMM YYYY (29 Jul 2026)',
        weekStartsOn: 'Monday'
      });
    } else if (activeTab === 'Security') {
      setSecurityData({
        twoFactor: true,
        autoLogout: true
      });
    }
  };

  return (
    <PageContainer maxWidth="ultra" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Application Settings</h1>
          <p className="text-[13px] text-surface-400">
            Manage your organization, workspace, security, integrations and system preferences.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="px-5 py-2 rounded-lg border border-surface-700 bg-surface-900/50 hover:bg-surface-800 text-white text-[13px] font-semibold transition-all"
          >
            Reset
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2 rounded-lg text-white text-[13px] font-bold transition-all shadow-lg flex items-center gap-2 ${
              saveSuccess ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-primary-600 hover:bg-primary-500 shadow-primary-600/20'
            }`}
          >
            {isSaving ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
            ) : saveSuccess ? (
              <Check className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-3 rounded-[16px] bg-surface-900/40 border border-surface-700/50">
            <div className="space-y-1">
              {[
                { name: 'General', icon: Settings },
                { name: 'Security', icon: Shield },
              ].map((item, idx) => {
                const isActive = activeTab === item.name;
                return (
                  <button 
                    key={idx} 
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[13px] transition-all ${
                      isActive 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold' 
                        : 'text-surface-400 hover:text-white hover:bg-surface-800/50 border border-transparent'
                    }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" /> {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-[16px] bg-gradient-to-br from-primary-950/40 to-[#030712] border border-primary-800/30">
            <div className="flex items-center gap-2 text-primary-400 font-bold mb-3 text-[13px]">
              <Sparkles className="h-4 w-4" /> AI Fleet Copilot
            </div>
            <p className="text-[11px] text-surface-400 mb-5 leading-relaxed">
              Smart insights and recommendations to optimize your fleet operations.
            </p>
            <button className="w-full py-2.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 font-bold text-[12px] hover:bg-primary-500/20 transition-colors flex justify-center items-center gap-1.5">
              Try Copilot <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            
            {/* Card 1: Workspace */}
            <div className="p-4 rounded-[16px] bg-surface-900/40 border border-surface-700/50 flex items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] text-surface-400 font-semibold mb-0.5">Workspace</div>
                <div className="text-[13px] text-white font-medium truncate">Current Organization</div>
                <div className="text-[11px] text-surface-500 mt-1 truncate">{formData.organizationName || 'TransitOps Logistics'}</div>
              </div>
            </div>

            {/* Card 2: Members */}
            <div className="p-4 rounded-[16px] bg-surface-900/40 border border-surface-700/50 flex items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                <Users className="h-5 w-5" />
              </div>
              <div className="overflow-hidden w-full">
                <div className="text-[11px] text-surface-400 font-semibold mb-0.5">Members</div>
                <div className="text-[18px] text-white font-bold leading-none">1</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-surface-500">Active Member</span>
                  <span className="text-[10px] font-bold text-emerald-400">↑ 0%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Roles */}
            <div className="p-4 rounded-[16px] bg-surface-900/40 border border-surface-700/50 flex items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Shield className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] text-surface-400 font-semibold mb-0.5">Roles</div>
                <div className="text-[18px] text-white font-bold leading-none">6</div>
                <div className="text-[10px] text-surface-500 mt-1.5">Permission Roles</div>
              </div>
            </div>

            {/* Card 4: Integrations */}
            <div className="p-4 rounded-[16px] bg-surface-900/40 border border-surface-700/50 flex items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Plug className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] text-surface-400 font-semibold mb-0.5">Integrations</div>
                <div className="text-[18px] text-white font-bold leading-none">0</div>
                <div className="text-[10px] text-surface-500 mt-1.5">Connected</div>
              </div>
            </div>

            {/* Card 5: Security */}
            <div className="p-4 rounded-[16px] bg-surface-900/40 border border-surface-700/50 flex items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] text-surface-400 font-semibold mb-0.5">Security</div>
                <div className="text-[18px] text-emerald-400 font-bold leading-none">Healthy</div>
                <div className="text-[10px] text-surface-500 mt-1.5">All systems secure</div>
              </div>
            </div>

            {/* Card 6: Storage */}
            <div className="p-4 rounded-[16px] bg-surface-900/40 border border-surface-700/50 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                   <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                     <HardDrive className="h-3.5 w-3.5" />
                   </div>
                   <div>
                     <div className="text-[11px] text-surface-400 font-semibold">Storage</div>
                   </div>
                </div>
              </div>
              <div>
                <div className="text-[16px] text-white font-bold leading-none mb-1">2.4 GB</div>
                <div className="flex justify-between text-[10px] text-surface-500 mb-2">
                  <span>of 50 GB used</span>
                  <span>5%</span>
                </div>
                <div className="w-full bg-surface-800 rounded-full h-1">
                  <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Center Forms (8 cols) */}
            <div className="xl:col-span-8 space-y-6">
              
              {activeTab === 'General' && (
                <div className="p-6 rounded-[16px] bg-surface-900/40 border border-surface-700/50 transition-opacity animate-in fade-in">
                  <div className="mb-6">
                    <h2 className="text-[18px] font-bold text-white mb-1">General Settings</h2>
                    <p className="text-[13px] text-surface-400">Configure the basic settings for your organization.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-surface-300">Organization Name</label>
                      <input 
                        type="text" 
                        value={formData.organizationName}
                        onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                        className="w-full bg-[#030712] border border-surface-700 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-surface-300">Currency</label>
                      <select 
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="w-full bg-[#030712] border border-surface-700 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        <option>USD - US Dollar ($)</option>
                        <option>EUR - Euro (€)</option>
                        <option>GBP - British Pound (£)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-surface-300">Timezone</label>
                      <select 
                        value={formData.timezone}
                        onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                        className="w-full bg-[#030712] border border-surface-700 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        <option>(UTC+05:30) Asia/Kolkata</option>
                        <option>(UTC-05:00) Eastern Time</option>
                        <option>(UTC+00:00) GMT</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-surface-300">Distance Unit</label>
                      <div className="flex bg-[#030712] border border-surface-700 rounded-xl overflow-hidden p-1">
                        <button 
                          onClick={() => setFormData({...formData, distanceUnit: 'km'})}
                          className={`flex-1 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${
                            formData.distanceUnit === 'km' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'text-surface-400 hover:text-white font-medium border border-transparent'
                          }`}
                        >
                          km
                        </button>
                        <button 
                          onClick={() => setFormData({...formData, distanceUnit: 'miles'})}
                          className={`flex-1 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${
                            formData.distanceUnit === 'miles' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'text-surface-400 hover:text-white font-medium border border-transparent'
                          }`}
                        >
                          miles
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-surface-300">Language</label>
                      <select 
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        className="w-full bg-[#030712] border border-surface-700 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        <option>English (United States)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-surface-300">Number Format</label>
                      <select 
                        value={formData.numberFormat}
                        onChange={(e) => setFormData({...formData, numberFormat: e.target.value})}
                        className="w-full bg-[#030712] border border-surface-700 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        <option>1,234.56</option>
                        <option>1.234,56</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-surface-300">Date Format</label>
                      <select 
                        value={formData.dateFormat}
                        onChange={(e) => setFormData({...formData, dateFormat: e.target.value})}
                        className="w-full bg-[#030712] border border-surface-700 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        <option>DD MMM YYYY (29 Jul 2026)</option>
                        <option>MM/DD/YYYY (07/29/2026)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-surface-300">Week Starts On</label>
                      <select 
                        value={formData.weekStartsOn}
                        onChange={(e) => setFormData({...formData, weekStartsOn: e.target.value})}
                        className="w-full bg-[#030712] border border-surface-700 rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        <option>Monday</option>
                        <option>Sunday</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`px-6 py-2 rounded-lg text-[13px] font-bold transition-all shadow-lg flex items-center gap-2 ${
                        saveSuccess ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/20'
                      }`}
                    >
                      {isSaving ? (
                        <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                      ) : saveSuccess ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Security' && (
                <div className="p-6 rounded-[16px] bg-surface-900/40 border border-surface-700/50 transition-opacity animate-in fade-in">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-white mb-0.5">Security Settings</h2>
                      <p className="text-[12px] text-surface-400">Manage security preferences and authentication settings.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 divide-y divide-surface-800 md:divide-y-0">
                    
                    {/* Item */}
                    <div className="flex items-center justify-between py-4 md:border-b border-surface-800">
                      <div>
                        <div className="text-[13px] font-semibold text-white mb-0.5">Two-Factor Authentication</div>
                        <div className="text-[11px] text-surface-400">Add an extra layer of security</div>
                      </div>
                      {/* Toggle Switch */}
                      <div 
                        onClick={() => setSecurityData({...securityData, twoFactor: !securityData.twoFactor})}
                        className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
                          securityData.twoFactor ? 'bg-emerald-500 justify-end' : 'bg-surface-700 justify-start'
                        }`}
                      >
                        <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                    {/* Item */}
                    <div className="flex items-center justify-between py-4 md:border-b border-surface-800 cursor-pointer group">
                      <div>
                        <div className="text-[13px] font-semibold text-white mb-0.5">Password Policy</div>
                        <div className="text-[11px] text-surface-400">Strong password is required</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-surface-600 group-hover:text-surface-300 transition-colors" />
                    </div>

                    {/* Item */}
                    <div className="flex items-center justify-between py-4 md:border-b border-surface-800 cursor-pointer group">
                      <div>
                        <div className="text-[13px] font-semibold text-white mb-0.5">Session Timeout</div>
                        <div className="text-[11px] text-surface-400">30 minutes</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-surface-600 group-hover:text-surface-300 transition-colors" />
                    </div>

                    {/* Item */}
                    <div className="flex items-center justify-between py-4 md:border-b border-surface-800">
                      <div>
                        <div className="text-[13px] font-semibold text-white mb-0.5">Auto Logout</div>
                        <div className="text-[11px] text-surface-400">Logout inactive sessions automatically</div>
                      </div>
                      {/* Toggle Switch */}
                      <div 
                        onClick={() => setSecurityData({...securityData, autoLogout: !securityData.autoLogout})}
                        className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
                          securityData.autoLogout ? 'bg-emerald-500 justify-end' : 'bg-surface-700 justify-start'
                        }`}
                      >
                        <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                    {/* Item */}
                    <div className="flex items-center justify-between py-4 cursor-pointer group">
                      <div>
                        <div className="text-[13px] font-semibold text-white mb-0.5">Device Management</div>
                        <div className="text-[11px] text-surface-400">3 devices active</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-surface-600 group-hover:text-surface-300 transition-colors" />
                    </div>

                    {/* Item */}
                    <div className="flex items-center justify-between py-4 cursor-pointer group">
                      <div>
                        <div className="text-[13px] font-semibold text-white mb-0.5">Login History</div>
                        <div className="text-[11px] text-surface-400">View login activity</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-surface-600 group-hover:text-surface-300 transition-colors" />
                    </div>
                    
                  </div>
                </div>
              )}

            </div>

            {/* Right Side Widget (4 cols) */}
            <div className="xl:col-span-4 space-y-6">
              
              <div className="p-6 rounded-[16px] bg-surface-900/40 border border-surface-700/50">
                <div className="flex items-start gap-3 mb-8">
                  <Activity className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h2 className="text-[16px] font-bold text-white mb-0.5">System Status</h2>
                    <p className="text-[12px] text-surface-400">All systems operational</p>
                  </div>
                </div>

                <div className="space-y-6">
                  
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[13px] font-semibold text-white leading-none mb-1">System Health</div>
                      <div className="text-[11px] text-surface-400">Operational</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[13px] font-semibold text-white leading-none mb-1">API Status</div>
                      <div className="text-[11px] text-surface-400">All APIs responding</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[13px] font-semibold text-white leading-none mb-1">Database</div>
                      <div className="text-[11px] text-surface-400">Healthy</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[13px] font-semibold text-white leading-none mb-1">Storage</div>
                      <div className="text-[11px] text-surface-400">2.4 GB / 50 GB (5%)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[13px] font-semibold text-white leading-none mb-1">Background Jobs</div>
                      <div className="text-[11px] text-surface-400">Running smoothly</div>
                    </div>
                  </div>

                </div>

                <button className="w-full mt-8 py-2.5 rounded-xl border border-surface-700 bg-surface-900/50 hover:bg-surface-800 text-[12px] font-bold text-white transition-all flex justify-center items-center gap-2">
                  View System Logs <ArrowRight className="h-3.5 w-3.5 text-surface-400" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </PageContainer>
  );
}
