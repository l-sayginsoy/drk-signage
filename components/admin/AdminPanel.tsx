
import { useState, type FC, type Dispatch, type SetStateAction } from 'react';
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
  setAppData: Dispatch<SetStateAction<AppData>>;
}

type Tab = 'dashboard' | 'schedule' | 'meals' | 'slideshow' | 'urgent' | 'residents' | 'settings';

const AdminPanel: FC<AdminPanelProps> = ({ appData, setAppData }) => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    const SidebarItem = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
             {/* Header */}
             <div className="flex-shrink-0 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm h-16">
                <div className="max-w-[1920px] mx-auto px-6 h-full flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                         <img src="/assets/drk-logo.png" alt="DRK Logo" className="h-10 w-auto object-contain"/>
                         <h1 className="text-xl font-bold text-gray-800 border-l pl-4 border-gray-300">Admin-Bereich</h1>
                     </div>
                     <Link to="/display" className="px-5 py-2 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        Zur Anzeige
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 max-w-[1920px] w-full mx-auto p-6 gap-6">
                
                {/* Sidebar Navigation */}
                <aside className="w-64 flex-shrink-0 flex flex-col space-y-2 bg-white rounded-xl shadow-sm p-4 h-fit sticky top-24 border border-gray-100">
                    <div className="pb-2 pl-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Menü</div>
                    
                    <SidebarItem id="dashboard" label="Übersicht" icon={LayoutDashboard} />
                    <SidebarItem id="schedule" label="Wochenplan" icon={Calendar} />
                    <SidebarItem id="meals" label="Mahlzeiten" icon={Utensils} />
                    <SidebarItem id="residents" label="Bewohner" icon={Cake} />
                    <SidebarItem id="slideshow" label="Diashow" icon={ImageIcon} />
                    <SidebarItem id="urgent" label="Eilmeldung" icon={AlertCircle} />
                    
                    <div className="py-2 border-t border-gray-100 my-2"></div>
                    <SidebarItem id="settings" label="Daten & Backup" icon={Settings} />
                </aside>

                {/* Content Area - Added max-w-5xl to constrain width */}
                <main className="flex-1 min-w-0">
                    <div className="max-w-5xl w-full"> 
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-gray-500 text-sm font-semibold uppercase mb-1">Status</h3>
                                        <div className="text-2xl font-bold text-green-600">System bereit</div>
                                        <p className="text-sm text-gray-400 mt-2">Alle Dienste laufen normal.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-gray-500 text-sm font-semibold uppercase mb-1">Aktive Eilmeldung</h3>
                                        <div className={`text-2xl font-bold ${appData.urgentMessage.active ? 'text-red-600' : 'text-gray-400'}`}>
                                            {appData.urgentMessage.active ? 'JA' : 'NEIN'}
                                        </div>
                                        <p className="text-sm text-gray-400 mt-2">{appData.urgentMessage.active ? 'Wird aktuell angezeigt.' : 'Keine Meldung aktiv.'}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-gray-500 text-sm font-semibold uppercase mb-1">Diashow Bilder</h3>
                                        <div className="text-2xl font-bold text-blue-600">{appData.slideshow.images.length}</div>
                                        <p className="text-sm text-gray-400 mt-2">Bilder in der Rotation.</p>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-blue-800 mb-2">Willkommen im neuen Admin-Bereich!</h2>
                                    <p className="text-blue-700">Wählen Sie links im Menü den Bereich aus, den Sie bearbeiten möchten.</p>
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
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
