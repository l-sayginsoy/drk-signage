
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppData } from '../../types';
import WeeklyScheduleEditor from './WeeklyScheduleEditor';
import MealsEditor from './MealsEditor';
import SlideshowEditor from './SlideshowEditor';
import UrgentEditor from './UrgentEditor';
import ResidentsEditor from './ResidentsEditor';
import DataManagement from './DataManagement';
import { LayoutDashboard, Calendar, Utensils, Image as ImageIcon, AlertCircle, Cake, Settings } from 'lucide-react';

interface AdminPanelProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

type Tab = 'dashboard' | 'schedule' | 'meals' | 'slideshow' | 'urgent' | 'residents' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = ({ appData, setAppData }) => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    const SidebarItem = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <Icon size={20} className={activeTab === id ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar Navigation - Full Height */}
            <aside className="w-72 bg-slate-900 text-white flex flex-col flex-shrink-0 shadow-xl z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-1.5 rounded-lg">
                            <img src="/assets/drk-logo.png" alt="DRK" className="h-6 w-auto object-contain"/>
                        </div>
                        <span className="font-bold text-lg tracking-tight">Admin-Bereich</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <div className="px-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Hauptmenü</div>
                    
                    <SidebarItem id="dashboard" label="Übersicht" icon={LayoutDashboard} />
                    <SidebarItem id="schedule" label="Wochenplan" icon={Calendar} />
                    <SidebarItem id="meals" label="Mahlzeiten" icon={Utensils} />
                    <SidebarItem id="residents" label="Bewohner" icon={Cake} />
                    <SidebarItem id="slideshow" label="Diashow" icon={ImageIcon} />
                    <SidebarItem id="urgent" label="Eilmeldung" icon={AlertCircle} />
                    
                    <div className="my-4 border-t border-slate-800"></div>
                    <div className="px-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">System</div>
                    <SidebarItem id="settings" label="Daten & Backup" icon={Settings} />
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    <Link to="/display" className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20">
                        Zur Anzeige öffnen
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        {activeTab === 'dashboard' && 'Dashboard Übersicht'}
                        {activeTab === 'schedule' && 'Wochenplan verwalten'}
                        {activeTab === 'meals' && 'Speiseplan & Mahlzeiten'}
                        {activeTab === 'residents' && 'Bewohnerliste'}
                        {activeTab === 'slideshow' && 'Medien & Diashow'}
                        {activeTab === 'urgent' && 'Eilmeldung konfigurieren'}
                        {activeTab === 'settings' && 'Einstellungen'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">Angemeldet als Administrator</div>
                        <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-200">A</div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto pb-10"> 
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-gray-500 text-sm font-bold uppercase">System Status</h3>
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-800">Online</div>
                                        <p className="text-sm text-gray-400 mt-2">Alle Dienste arbeiten normal.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-gray-500 text-sm font-bold uppercase">Eilmeldung</h3>
                                            <div className={`h-2 w-2 rounded-full ${appData.urgentMessage.active ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                        </div>
                                        <div className={`text-3xl font-bold ${appData.urgentMessage.active ? 'text-red-600' : 'text-gray-400'}`}>
                                            {appData.urgentMessage.active ? 'Aktiv' : 'Inaktiv'}
                                        </div>
                                        <p className="text-sm text-gray-400 mt-2">{appData.urgentMessage.active ? 'Wird auf dem Display angezeigt.' : 'Keine Warnung aktiv.'}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-gray-500 text-sm font-bold uppercase">Diashow</h3>
                                            <ImageIcon size={16} className="text-blue-500"/>
                                        </div>
                                        <div className="text-3xl font-bold text-blue-600">{appData.slideshow.images.length}</div>
                                        <p className="text-sm text-gray-400 mt-2">Bilder in der Rotation.</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                                    <h2 className="text-2xl font-bold mb-2">Willkommen im Admin-Bereich</h2>
                                    <p className="text-blue-100 max-w-2xl">Hier können Sie alle Inhalte des Dashboards steuern. Wählen Sie links im Menü den gewünschten Bereich aus. Änderungen werden sofort auf dem Display wirksam.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'schedule' && <WeeklyScheduleEditor appData={appData} setAppData={setAppData} />}
                        {activeTab === 'meals' && <MealsEditor appData={appData} setAppData={setAppData} />}
                        {activeTab === 'slideshow' && <SlideshowEditor appData={appData} setAppData={setAppData} />}
                        {activeTab === 'urgent' && <UrgentEditor appData={appData} setAppData={setAppData} />}
                        {activeTab === 'residents' && <ResidentsEditor appData={appData} setAppData={setAppData} />}
                        {activeTab === 'settings' && <DataManagement appData={appData} setAppData={setAppData} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
