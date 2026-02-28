
import React, { useRef, type FC, type Dispatch, type SetStateAction, type ChangeEvent } from 'react';
import { AppData } from '../../types';
import { Upload, Clock, AlertCircle, X, Megaphone } from 'lucide-react';
import { processImageFile } from '../../utils/fileUtils';

interface UrgentEditorProps {
  appData: AppData;
  setAppData: Dispatch<SetStateAction<AppData>>;
}

const UrgentEditor: FC<UrgentEditorProps> = ({ appData, setAppData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUrgentMessageChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const updatedValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

        setAppData(prev => {
            const newUrgentMessage = { ...prev.urgentMessage, [name]: updatedValue };
            return { ...prev, urgentMessage: newUrgentMessage };
        });
    };

    const handleUrgentImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const base64 = await processImageFile(e.target.files[0]);
                setAppData(prev => ({ 
                    ...prev, 
                    urgentMessage: { ...prev.urgentMessage, imageUrl: base64 } 
                }));
            } catch (error) {
                alert("Fehler beim Verarbeiten des Bildes.");
            }
            e.target.value = '';
        }
    };

    const handleRemoveImage = () => {
        setAppData(prev => ({ 
            ...prev, 
            urgentMessage: { ...prev.urgentMessage, imageUrl: '' } 
        }));
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    // Soft UI Input Class
    const inputClasses = "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-800 shadow-sm placeholder-gray-400";

    const isActive = appData.urgentMessage.active;

    return (
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[80vh] animate-fade-in">
            <div className="flex items-center mb-8">
                <div className={`p-3 rounded-xl mr-4 transition-colors ${isActive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Megaphone size={28}/>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Eilmeldung</h2>
                    <p className="text-sm text-gray-500">Wichtige Hinweise für Bewohner (z.B. Ausfälle, Hitze)</p>
                </div>
            </div>

            {/* Status Toggle Bar */}
            <div className={`border rounded-xl p-6 mb-8 flex items-center justify-between transition-all duration-300 ${isActive ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    {isActive ? <AlertCircle className="text-red-600" size={24}/> : <div className="w-6 h-6 rounded-full bg-gray-300"/>}
                    <div>
                        <h3 className={`font-bold text-lg ${isActive ? 'text-red-800' : 'text-gray-600'}`}>{isActive ? 'Eilmeldung ist AKTIV' : 'Eilmeldung ist inaktiv'}</h3>
                        <p className={`text-sm ${isActive ? 'text-red-600' : 'text-gray-500'}`}>{isActive ? 'Wird aktuell auf dem Display angezeigt.' : 'Schalten Sie den Regler an, um die Meldung zu senden.'}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="active" 
                        checked={isActive} 
                        onChange={handleUrgentMessageChange} 
                        className="sr-only peer" 
                    />
                    <div className="w-16 h-9 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-red-600 shadow-inner"></div>
                </label>
            </div>

            {/* Edit Form */}
            <div className={`space-y-8 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-60 grayscale-[0.5]'}`}>
                
                {/* Title & Text */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Titel der Meldung</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={appData.urgentMessage.title} 
                            onChange={handleUrgentMessageChange} 
                            className={inputClasses}
                            placeholder="z.B. Wichtiger Hinweis"
                            disabled={!isActive}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nachrichtentext</label>
                        <textarea 
                            name="text" 
                            value={appData.urgentMessage.text} 
                            onChange={handleUrgentMessageChange} 
                            className={`${inputClasses} h-32 resize-none`}
                            placeholder="Ihre Nachricht hier..."
                            disabled={!isActive}
                        ></textarea>
                    </div>
                </div>

                {/* Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Startzeit (Optional)</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <input 
                                type="time" 
                                name="activeFrom" 
                                value={appData.urgentMessage.activeFrom || ''} 
                                onChange={handleUrgentMessageChange} 
                                className={`${inputClasses} pl-10`}
                                disabled={!isActive}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Endzeit (Optional)</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <input 
                                type="time" 
                                name="activeUntil" 
                                value={appData.urgentMessage.activeUntil || ''} 
                                onChange={handleUrgentMessageChange} 
                                className={`${inputClasses} pl-10`}
                                disabled={!isActive}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2 ml-1">Leer lassen für dauerhafte Anzeige.</p>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="pt-4 border-t border-gray-100">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Hintergrundbild</label>
                     
                     <div className="flex flex-col md:flex-row items-start gap-6">
                        {appData.urgentMessage.imageUrl ? (
                            <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-md group">
                                <img src={appData.urgentMessage.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    onClick={handleRemoveImage}
                                    disabled={!isActive}
                                    className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                                    title="Bild entfernen"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full md:w-64 aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                <AlertCircle size={32} className="mb-2 opacity-50"/>
                                <span className="text-xs font-medium">Kein Bild gewählt</span>
                            </div>
                        )}

                        <div className="flex-1">
                             <input 
                                type="file" 
                                ref={fileInputRef}
                                accept="image/*" 
                                onChange={handleUrgentImageUpload} 
                                className="hidden" 
                                id="urgent-upload"
                                disabled={!isActive}
                            />
                            <label 
                                htmlFor="urgent-upload"
                                className={`inline-flex items-center px-5 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-sm transition-all ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Upload size={18} className="mr-2"/>
                                Bild auswählen
                            </label>
                            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                                Ein Bild verstärkt die Aufmerksamkeit. Nutzen Sie ein Querformat-Bild (1920x1080).
                                <br/>Ohne Bild wird ein roter Warnhintergrund angezeigt.
                            </p>
                        </div>
                     </div>
                </div>
            </div>
        </section>
    );
};

export default UrgentEditor;
