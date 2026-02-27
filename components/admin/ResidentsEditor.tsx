
import React, { useState, useRef } from 'react';
import { AppData, Resident } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, UserPlus, Cake, Calendar } from 'lucide-react';

interface ResidentsEditorProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

const ResidentsEditor: React.FC<ResidentsEditorProps> = ({ appData, setAppData }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [hideAge, setHideAge] = useState(false);
    
    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);

    const residents = appData.residents || [];

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!day || !month || !year) return;

        const d = day.padStart(2, '0');
        const m = month.padStart(2, '0');
        const y = year;
        const isoDate = `${y}-${m}-${d}`;
        const dateObj = new Date(isoDate);
        
        if (isNaN(dateObj.getTime()) || dateObj.toISOString().slice(0,10) !== isoDate) {
            alert("Ungültiges Datum.");
            return;
        }

        const newResident: Resident = {
            id: uuidv4(),
            firstName,
            lastName,
            birthDate: isoDate,
            hideAge,
            active: true
        };
        
        setAppData(prev => ({
            ...prev,
            residents: [...(prev.residents || []), newResident].sort((a,b) => a.lastName.localeCompare(b.lastName))
        }));

        setFirstName('');
        setLastName('');
        setDay('');
        setMonth('');
        setYear('');
        setHideAge(false);
        document.getElementById('firstNameInput')?.focus();
    };

    const handleDelete = (id: string) => {
        setAppData(prev => ({ ...prev, residents: prev.residents.filter(r => r.id !== id) }));
    };

    const toggleActive = (id: string) => {
        setAppData(prev => ({
            ...prev,
            residents: prev.residents.map(r => r.id === id ? { ...r, active: !r.active } : r)
        }));
    };

    // Soft UI Input Class
    const inputClasses = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none text-gray-800 shadow-sm placeholder-gray-400";

    return (
        <section className="bg-white p-8 rounded-2xl shadow-sm animate-fade-in border border-gray-100 flex flex-col min-h-[80vh]">
            <div className="flex items-center mb-8">
                <div className="bg-pink-100 p-3 rounded-xl mr-4 text-pink-600">
                    <Cake size={28}/>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Bewohner & Geburtstage</h2>
                    <p className="text-sm text-gray-500">Verwaltung der Gratulationen</p>
                </div>
            </div>

            {/* Input Form Card */}
            <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
                <h3 className="text-gray-700 font-bold mb-4 flex items-center text-sm uppercase tracking-wide">
                    <UserPlus size={16} className="mr-2"/> Neuen Bewohner anlegen
                </h3>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                    <div className="md:col-span-3">
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Vorname</label>
                         <input 
                            id="firstNameInput"
                            type="text" 
                            value={firstName} 
                            onChange={e => setFirstName(e.target.value)} 
                            className={inputClasses}
                            placeholder="Max"
                            required 
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Nachname</label>
                        <input 
                            type="text" 
                            value={lastName} 
                            onChange={e => setLastName(e.target.value)} 
                            className={inputClasses}
                            placeholder="Mustermann"
                            required 
                        />
                    </div>
                    
                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Geburtsdatum</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="text" inputMode="numeric" placeholder="TT" maxLength={2} value={day} ref={dayRef}
                                onChange={e => { setDay(e.target.value.replace(/\D/g, '')); if(e.target.value.length === 2) monthRef.current?.focus(); }}
                                className={`${inputClasses} text-center`} required />
                            <input type="text" inputMode="numeric" placeholder="MM" maxLength={2} value={month} ref={monthRef}
                                onChange={e => { setMonth(e.target.value.replace(/\D/g, '')); if(e.target.value.length === 2) yearRef.current?.focus(); }}
                                className={`${inputClasses} text-center`} required />
                            <input type="text" inputMode="numeric" placeholder="JJJJ" maxLength={4} value={year} ref={yearRef}
                                onChange={e => setYear(e.target.value.replace(/\D/g, ''))}
                                className={`${inputClasses} text-center`} required />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all active:scale-95 shadow-md shadow-pink-200 flex items-center justify-center h-[46px]">
                            <span className="mr-1">Hinzufügen</span>
                        </button>
                    </div>
                </form>
                <div className="mt-4 flex items-center ml-1">
                     <label className="inline-flex items-center cursor-pointer group">
                        <input type="checkbox" checked={hideAge} onChange={e => setHideAge(e.target.checked)} className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer" />
                        <span className="text-sm text-gray-600 ml-2 group-hover:text-gray-900 transition-colors select-none">Alter verbergen <span className="text-gray-400 text-xs">(nur "Herzlichen Glückwunsch" anzeigen)</span></span>
                     </label>
                </div>
            </div>

            {/* List Header */}
             <div className="grid grid-cols-[80px_1fr_1fr_1fr_80px] gap-6 bg-slate-50/80 border border-gray-200 border-b-0 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-t-xl">
                <div className="text-center">Status</div>
                <div>Name</div>
                <div>Geburtstag</div>
                <div>Alter</div>
                <div className="text-right">Aktion</div>
            </div>

            {/* List Items */}
            <div className="border border-gray-200 rounded-b-xl overflow-hidden divide-y divide-gray-100">
                {residents.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400 bg-white">
                        <UserPlus size={48} className="mb-4 opacity-20"/>
                        <p>Noch keine Bewohner eingetragen.</p>
                    </div>
                ) : (
                    residents.map(r => {
                        const bDate = new Date(r.birthDate);
                        const age = new Date().getFullYear() - bDate.getFullYear();
                        const formattedDate = bDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

                        return (
                            <div key={r.id} className={`grid grid-cols-[80px_1fr_1fr_1fr_80px] gap-6 items-center px-6 py-4 transition-colors ${r.active ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 opacity-70'}`}>
                                <div className="text-center flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer" title={r.active ? "Aktiv" : "Inaktiv"}>
                                        <input type="checkbox" checked={r.active} onChange={() => toggleActive(r.id)} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="font-bold text-gray-800 text-lg">{r.lastName}, {r.firstName}</div>
                                <div className="text-gray-600 flex items-center gap-2">
                                    <Calendar size={14} className="text-gray-400"/>
                                    {formattedDate}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {age} Jahre
                                    {r.hideAge && <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">versteckt</span>}
                                </div>
                                <div className="text-right">
                                    <button onClick={() => handleDelete(r.id)} className="text-gray-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all" title="Löschen">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default ResidentsEditor;
