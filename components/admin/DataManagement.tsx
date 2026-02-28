
import React, { useState, useRef, type FC, type Dispatch, type SetStateAction, type FormEvent, type ChangeEvent } from 'react';
import { AppData, AppTheme } from '../../types';
import { Download, Upload, AlertTriangle, CheckCircle2, Settings, Palette, HardDriveDownload, Database, Trash2, Plus } from 'lucide-react';

interface DataManagementProps {
  appData: AppData;
  setAppData: Dispatch<SetStateAction<AppData>>;
}

const ListManager = ({ 
    title, 
    items, 
    onAdd, 
    onRemove,
    placeholder 
}: { 
    title: string, 
    items: string[], 
    onAdd: (val: string) => void, 
    onRemove: (idx: number) => void,
    placeholder: string
}) => {
    const [newValue, setNewValue] = useState('');

    const handleAdd = (e: FormEvent) => {
        e.preventDefault();
        if (newValue.trim()) {
            onAdd(newValue.trim());
            setNewValue('');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                {title} <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-normal">{items.length}</span>
            </h4>
            
            {/* List */}
            <div className="flex-1 overflow-y-auto max-h-[250px] mb-4 space-y-2 pr-1 custom-scrollbar">
                {items.length === 0 && <p className="text-gray-400 text-sm italic">Liste ist leer.</p>}
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg group hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">
                        <span className="text-gray-700 text-sm font-medium pl-1">{item}</span>
                        <button 
                            onClick={() => onRemove(index)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100"
                            title="Löschen"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Input */}
            <form onSubmit={handleAdd} className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                <input 
                    type="text" 
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
                />
                <button 
                    type="submit"
                    disabled={!newValue.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                </button>
            </form>
        </div>
    );
};

const DataManagement: FC<DataManagementProps> = ({ appData, setAppData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleExport = () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `drk-melm-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsedData = JSON.parse(result);
        if (!parsedData.meals || !parsedData.weeklySchedule) throw new Error("Ungültiges Format.");
        setAppData(parsedData);
        setImportStatus('success');
        setStatusMessage('Daten erfolgreich importiert!');
        setTimeout(() => { setImportStatus('idle'); setStatusMessage(''); }, 3000);
      } catch (error) {
        setImportStatus('error');
        setStatusMessage('Fehler: Ungültige Datei.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setAppData(prev => ({ ...prev, currentTheme: e.target.value as AppTheme }));
  };

  // Master Data Handlers
  const addLocation = (val: string) => setAppData(prev => ({ ...prev, locations: [...prev.locations, val].sort() }));
  const removeLocation = (idx: number) => setAppData(prev => ({ ...prev, locations: prev.locations.filter((_, i) => i !== idx) }));

  const addEventTitle = (val: string) => setAppData(prev => ({ ...prev, eventTitles: [...(prev.eventTitles || []), val].sort() }));
  const removeEventTitle = (idx: number) => setAppData(prev => ({ ...prev, eventTitles: (prev.eventTitles || []).filter((_, i) => i !== idx) }));

  const selectClasses = "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-800 shadow-sm cursor-pointer font-medium";

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[80vh] animate-fade-in">
        <div className="flex items-center mb-8">
            <div className="bg-gray-100 p-3 rounded-xl mr-4 text-gray-600">
                <Settings size={28}/>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Einstellungen & Daten</h2>
                <p className="text-sm text-gray-500">Design anpassen, Stammdaten und Datensicherung</p>
            </div>
        </div>

        {/* --- Master Data (Listen) --- */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <Database size={22} className="text-slate-600"/>
                <h3 className="font-bold text-gray-800 text-lg">Stammdaten verwalten</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">
                Diese Listen werden im Wochenplan als Vorschläge angezeigt. Sie können dort trotzdem auch manuell Texte eingeben.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ListManager 
                    title="Veranstaltungsorte" 
                    items={appData.locations} 
                    onAdd={addLocation} 
                    onRemove={removeLocation}
                    placeholder="Neuer Ort (z.B. Garten)..."
                />
                <ListManager 
                    title="Veranstaltungen (Vorlagen)" 
                    items={appData.eventTitles || []} 
                    onAdd={addEventTitle} 
                    onRemove={removeEventTitle}
                    placeholder="Neuer Titel (z.B. Singkreis)..."
                />
            </div>
        </div>

        {/* --- Theme Settings --- */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <Palette size={22} className="text-purple-600"/>
                <h3 className="font-bold text-gray-800 text-lg">Saisonales Design</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <p className="text-gray-500 text-sm leading-relaxed flex-1 max-w-lg">
                    Das gewählte Thema verändert das Farbschema und fügt dezente Dekorationen in den Ecken des Displays hinzu (z.B. Tannenzweige zu Weihnachten).
                    <br/><br/>
                    <span className="text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">Aktuell aktiv: {appData.currentTheme || 'Standard'}</span>
                </p>
                <div className="w-full md:w-80">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Thema auswählen</label>
                    <select 
                        value={appData.currentTheme || 'standard'} 
                        onChange={handleThemeChange}
                        className={selectClasses}
                    >
                        <option value="standard">Standard (Neutral)</option>
                        
                        <optgroup label="Jahreszeiten">
                            <option value="spring">Frühling</option>
                            <option value="summer">Sommer</option>
                            <option value="autumn">Herbst</option>
                            <option value="winter">Winter</option>
                        </optgroup>
                        
                        <optgroup label="Feiertage & Events">
                            <option value="new_year">Neujahr</option>
                            <option value="three_kings">Heilige Drei Könige</option>
                            <option value="carnival">Karneval / Fasching</option>
                            <option value="valentines">Valentinstag</option>
                            <option value="womens_day">Internationaler Frauentag</option>
                            <option value="easter">Ostern</option>
                            <option value="mothers_day">Muttertag</option>
                            <option value="fathers_day">Vatertag / Himmelfahrt</option>
                            <option value="pentecost">Pfingsten</option>
                            <option value="soccer">EM / WM / Fußball</option>
                            <option value="oktoberfest">Oktoberfest</option>
                            <option value="german_unity">Tag der Deutschen Einheit</option>
                            <option value="thanksgiving">Erntedank</option>
                            <option value="halloween">Halloween</option>
                            <option value="st_martin">St. Martin / Laternenfest</option>
                            <option value="mourning_day">Volkstrauertag (Stille)</option>
                            <option value="advent">Advent</option>
                            <option value="nikolaus">Nikolaus</option>
                            <option value="christmas">Weihnachten</option>
                            <option value="silvester">Silvester</option>
                        </optgroup>
                    </select>
                </div>
            </div>
        </div>
        
        {/* --- Backup --- */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <HardDriveDownload size={22} className="text-slate-600"/>
                <h3 className="font-bold text-gray-800 text-lg">Datenverwaltung</h3>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="max-w-md">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Exportieren Sie Ihre aktuelle Konfiguration als Sicherungsdatei oder laden Sie eine bestehende Sicherung hoch.
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <button onClick={handleExport} className="flex items-center px-5 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm active:scale-95">
                        <Download size={18} className="mr-2" /> Exportieren
                    </button>
                    <div className="relative">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                        <button onClick={handleImportClick} className="flex items-center px-5 py-2.5 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition-all active:scale-95">
                            <Upload size={18} className="mr-2" /> Importieren
                        </button>
                    </div>
                </div>
            </div>

            {importStatus !== 'idle' && (
                <div className={`mt-6 p-4 rounded-xl flex items-center border animate-fade-in ${importStatus === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                    {importStatus === 'success' ? <CheckCircle2 size={24} className="mr-3"/> : <AlertTriangle size={24} className="mr-3"/>}
                    <span className="font-medium text-base">{statusMessage}</span>
                </div>
            )}
        </div>
    </section>
  );
};

export default DataManagement;
