
import React, { useState } from 'react';
import { AppData, SlideshowImage } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, ImageIcon, Loader2, Plus, Clock, PlayCircle, CheckSquare, Square, X } from 'lucide-react';
import { processImageFile } from '../../utils/fileUtils';

interface SlideshowEditorProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

const SlideshowEditor: React.FC<SlideshowEditorProps> = ({ appData, setAppData }) => {
    const [newSlideCaption, setNewSlideCaption] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        let updatedValue: any = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        if (name === 'durationPerSlide') updatedValue = parseInt(value, 10) || 10;
        
        setAppData(prev => ({
            ...prev,
            slideshow: { ...prev.slideshow, [name]: updatedValue }
        }));
    };

    const handleAddSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsProcessing(true);
        try {
            const newSlides: SlideshowImage[] = [];
            for (let i = 0; i < files.length; i++) {
                const url = await processImageFile(files[i]);
                newSlides.push({ id: uuidv4(), url, caption: newSlideCaption });
            }
            setAppData(prev => ({ 
                ...prev, 
                slideshow: { ...prev.slideshow, images: [...prev.slideshow.images, ...newSlides] } 
            }));
            setNewSlideCaption('');
        } catch (error) {
            alert("Fehler beim Verarbeiten der Bilder.");
        } finally {
            setIsProcessing(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = (id: string) => {
        setAppData(prev => ({
            ...prev,
            slideshow: { ...prev.slideshow, images: prev.slideshow.images.filter(s => s.id !== id) }
        }));
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    };

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === appData.slideshow.images.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(appData.slideshow.images.map(img => img.id));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`${selectedIds.length} Bilder wirklich löschen?`)) {
            setAppData(prev => ({
                ...prev,
                slideshow: { 
                    ...prev.slideshow, 
                    images: prev.slideshow.images.filter(img => !selectedIds.includes(img.id)) 
                }
            }));
            setSelectedIds([]);
        }
    };

    const handleDeleteAll = () => {
        if (appData.slideshow.images.length === 0) return;
        if (confirm("Wirklich ALLE Bilder löschen?")) {
            setAppData(prev => ({
                ...prev,
                slideshow: { ...prev.slideshow, images: [] }
            }));
            setSelectedIds([]);
        }
    };

    // Soft UI Input Class
    const inputClasses = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-800 shadow-sm";

    return (
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[80vh] animate-fade-in">
            <div className="flex items-center mb-8">
                <div className="bg-purple-100 p-3 rounded-xl mr-4 text-purple-600">
                    <ImageIcon size={28}/>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Biografie & Diashow</h2>
                    <p className="text-sm text-gray-500">Bilder aus der Region oder von Veranstaltungen</p>
                </div>
            </div>
            
            {/* Status & Config */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <PlayCircle className="text-blue-500" size={24}/>
                        <div>
                            <h3 className="font-bold text-gray-800">Aktivierung</h3>
                            <p className="text-sm text-gray-500">Diashow läuft automatisch im Leerlauf</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="active" checked={appData.slideshow.active} onChange={handleConfigChange} className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Anzeigedauer (Sek)</label>
                        <input type="number" name="durationPerSlide" value={appData.slideshow.durationPerSlide || 10} onChange={handleConfigChange} className={inputClasses} />
                    </div>
                    {appData.slideshow.active && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Startzeit</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input type="time" name="activeFrom" value={appData.slideshow.activeFrom || ''} onChange={handleConfigChange} className={`${inputClasses} pl-9`} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Endzeit</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input type="time" name="activeUntil" value={appData.slideshow.activeUntil} onChange={handleConfigChange} className={`${inputClasses} pl-9`} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 mb-8 text-center hover:bg-gray-50 transition-colors cursor-default">
                <div className="max-w-md mx-auto">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Neue Bilder hinzufügen</h3>
                    <p className="text-gray-500 text-sm mb-6">Laden Sie Bilder vom PC hoch. Sie können optional direkt eine Beschriftung für alle ausgewählten Bilder festlegen.</p>
                    
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 text-left">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bildunterschrift (Optional)</label>
                            <input 
                                type="text" 
                                value={newSlideCaption} 
                                onChange={e => setNewSlideCaption(e.target.value)} 
                                placeholder="z.B. Sommerfest 2023" 
                                className={inputClasses} 
                            />
                        </div>
                        <label className={`flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isProcessing ? <Loader2 className="animate-spin mr-2" size={18}/> : <ImageIcon size={18} className="mr-2"/>}
                            {isProcessing ? 'Verarbeite...' : 'Bilder wählen'}
                            <input 
                                type="file" 
                                accept="image/*" 
                                multiple 
                                disabled={isProcessing}
                                onChange={handleAddSlide} 
                                className="hidden" 
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-800 text-lg">Galerie</h3>
                    <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">{appData.slideshow.images.length} Bilder</span>
                </div>

                <div className="flex items-center gap-2">
                    {appData.slideshow.images.length > 0 && (
                        <>
                            <button 
                                onClick={handleSelectAll}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                            >
                                {selectedIds.length === appData.slideshow.images.length ? <CheckSquare size={16}/> : <Square size={16}/>}
                                {selectedIds.length === appData.slideshow.images.length ? 'Auswahl aufheben' : 'Alle auswählen'}
                            </button>

                            {selectedIds.length > 0 && (
                                <button 
                                    onClick={handleDeleteSelected}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-md shadow-red-100"
                                >
                                    <Trash2 size={16}/>
                                    {selectedIds.length} löschen
                                </button>
                            )}

                            <button 
                                onClick={handleDeleteAll}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <X size={16}/>
                                Alle löschen
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {appData.slideshow.images.map(slide => {
                    const isSelected = selectedIds.includes(slide.id);
                    return (
                        <div 
                            key={slide.id} 
                            onClick={() => handleToggleSelect(slide.id)}
                            className={`group relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 cursor-pointer overflow-hidden ${isSelected ? 'border-blue-500 ring-4 ring-blue-50 shadow-md' : 'border-gray-100 hover:border-blue-200'}`}
                        >
                            {/* Selection Checkbox */}
                            <div className={`absolute top-2 left-2 z-20 w-6 h-6 rounded-md flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 border border-gray-200'}`}>
                                {isSelected ? <CheckSquare size={16}/> : <Square size={16}/>}
                            </div>

                            {/* Image Aspect Ratio Container */}
                            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                <img src={slide.url} alt="slide" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                            </div>
                            
                            {/* Quick Delete Action */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(slide.id);
                                    }} 
                                    className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700 shadow-lg transform hover:scale-110 transition-all"
                                    title="Sofort löschen"
                                >
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                            
                            {/* Caption */}
                            <div className={`p-3 border-t transition-colors ${isSelected ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-50'}`}>
                                <p className={`text-xs font-bold truncate text-center ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                    {slide.caption ? slide.caption : <span className="text-gray-300 italic font-normal">Kein Titel</span>}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default SlideshowEditor;
