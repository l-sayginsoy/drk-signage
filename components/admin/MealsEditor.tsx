
import { useEffect, useState, type FC, type Dispatch, type SetStateAction, type ChangeEvent } from 'react';
import { AppData } from '../../types';
import { Upload, Utensils, Image as ImageIcon, Trash2, Clock, Calendar } from 'lucide-react';
import { processImageFile } from '../../utils/fileUtils';

interface MealsEditorProps {
  appData: AppData;
  setAppData: Dispatch<SetStateAction<AppData>>;
}

const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

// Extracted Component for Image Upload with Error Handling
const ImageUploader = ({ 
    imageUrl, 
    onUpload, 
    onDelete,
    inputId,
    label = "Upload"
}: { 
    imageUrl: string, 
    onUpload: (e: ChangeEvent<HTMLInputElement>) => void, 
    onDelete: () => void,
    inputId: string,
    label?: string
}) => {
    const [hasError, setHasError] = useState(false);

    // Reset error if URL changes
    useEffect(() => {
        setHasError(false);
    }, [imageUrl]);

    const showImage = !!imageUrl && !hasError;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square md:aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group cursor-pointer hover:border-blue-400 hover:ring-2 hover:ring-blue-100 transition-all mb-2">
                <label htmlFor={inputId} className="cursor-pointer block w-full h-full">
                    {showImage ? (
                        <img 
                            src={imageUrl} 
                            alt="Vorschau" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                            onError={() => setHasError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 p-2 text-center">
                            <Upload size={24} className="mb-1"/>
                            <span className="text-[10px] font-bold uppercase">{label}</span>
                        </div>
                    )}
                    <input 
                        id={inputId}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={onUpload} 
                    />
                </label>
                {showImage && (
                    <button 
                        onClick={(e) => { 
                            e.preventDefault(); 
                            onDelete(); 
                        }} 
                        className="absolute top-1 right-1 p-1.5 bg-white/80 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        title="Bild löschen"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

const MealsEditor: FC<MealsEditorProps> = ({ appData, setAppData }) => {
    
    const formatTimeObj = (time: { hour: number; minute: number }) => {
        return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    };

    const handleMealTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
        if (!value) return;
        const [hour, minute] = value.split(':').map(Number);
        setAppData(prev => {
            const newMeals = [...prev.meals];
            newMeals[index] = { ...newMeals[index], [field]: { hour, minute } };
            return { ...prev, meals: newMeals };
        });
    };

    const handleLunchTimeChange = (field: 'startTime' | 'endTime', value: string) => {
        if (!value) return;
        const [hour, minute] = value.split(':').map(Number);
        setAppData(prev => ({
            ...prev,
            lunchMenu: { ...prev.lunchMenu, [field]: { hour, minute } }
        }));
    };

    const handleLunchImageUpload = async (dayIndex: number, file: File, inputElement: HTMLInputElement) => {
        try {
            const base64 = await processImageFile(file);
            setAppData(prev => {
                const newImages = [...prev.lunchMenu.images];
                newImages[dayIndex] = base64;
                return { ...prev, lunchMenu: { ...prev.lunchMenu, images: newImages } };
            });
        } catch (error) {
            alert("Fehler beim Bild.");
        }
        inputElement.value = '';
    };

    const handleRemoveLunchImage = (dayIndex: number) => {
        if(!confirm("Bild wirklich entfernen?")) return;
        setAppData(prev => {
            const newImages = [...prev.lunchMenu.images];
            newImages[dayIndex] = '';
            return { ...prev, lunchMenu: { ...prev.lunchMenu, images: newImages } };
        });
    };

    const handleImageUpload = async (index: number, file: File, inputElement: HTMLInputElement) => {
        try {
            const base64 = await processImageFile(file);
            setAppData(prev => {
                const newMeals = [...prev.meals];
                newMeals[index] = { ...newMeals[index], imageUrl: base64 };
                return { ...prev, meals: newMeals };
            });
        } catch (error) {
            alert("Fehler beim Bild.");
        }
        inputElement.value = '';
    };

    const handleRemoveImage = (index: number) => {
        if(!confirm("Bild wirklich entfernen?")) return;
        setAppData(prev => {
            const newMeals = [...prev.meals];
            newMeals[index] = { ...newMeals[index], imageUrl: '' };
            return { ...prev, meals: newMeals };
        });
    };

    // Soft Input Style
    const inputClasses = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-center bg-gray-50 text-gray-800 font-medium shadow-sm";

    return (
        <div className="space-y-8 animate-fade-in">
            {/* LUNCH MENU SECTION */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="bg-orange-100 p-3 rounded-xl mr-4 text-orange-600">
                            <Utensils size={28}/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Mittagessen (Wochenplan)</h2>
                            <p className="text-sm text-gray-500">Täglich wechselndes Bild für das Mittagessen</p>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-6 mb-8">
                     <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                <Clock size={18} className="text-orange-500"/> Anzeigezeitraum
                            </h4>
                            <p className="text-sm text-gray-500 mb-3">Wann soll das Mittagessen angezeigt werden?</p>
                            <div className="flex items-center gap-4">
                                <div className="w-32">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Start</label>
                                    <input 
                                        type="time" 
                                        value={formatTimeObj(appData.lunchMenu.startTime)} 
                                        onChange={(e) => handleLunchTimeChange('startTime', e.target.value)} 
                                        className={inputClasses} 
                                    />
                                </div>
                                <span className="text-gray-400 mt-4">-</span>
                                <div className="w-32">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Ende</label>
                                    <input 
                                        type="time" 
                                        value={formatTimeObj(appData.lunchMenu.endTime)} 
                                        onChange={(e) => handleLunchTimeChange('endTime', e.target.value)} 
                                        className={inputClasses} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 border-l border-orange-200 pl-8 hidden md:block">
                            <p className="text-sm text-gray-600 italic">
                                "Außerhalb dieser Zeit wird automatisch die Diashow angezeigt (sofern keine Veranstaltung ansteht)."
                            </p>
                        </div>
                     </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-gray-500"/> Mittagessen pro Wochentag
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {dayNames.map((day, index) => (
                        <div key={day} className="flex flex-col">
                            <span className="text-xs font-bold text-gray-500 uppercase text-center mb-2">{day}</span>
                            <ImageUploader 
                                imageUrl={appData.lunchMenu.images[index]}
                                inputId={`lunch-upload-${index}`}
                                onUpload={(e) => e.target.files && handleLunchImageUpload(index, e.target.files[0], e.target)}
                                onDelete={() => handleRemoveLunchImage(index)}
                                label={day.substring(0, 2)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* OTHER MEALS LIST */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4 text-blue-600">
                        <ImageIcon size={28}/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Sonstige Mahlzeiten</h2>
                        <p className="text-sm text-gray-500">Frühstück, Kaffee & Abendessen (Täglich gleich)</p>
                    </div>
                </div>
                
                {/* Table Header */}
                <div className="grid grid-cols-[100px_1fr_120px_120px] gap-6 bg-slate-50/80 border-b border-gray-200 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-t-xl">
                    <div className="text-center">Bild</div>
                    <div>Mahlzeit</div>
                    <div>Start</div>
                    <div>Ende</div>
                </div>

                <div className="divide-y divide-gray-100 border-x border-b border-gray-100 rounded-b-xl overflow-hidden">
                    {appData.meals.map((meal, index) => (
                        <div key={index} className="grid grid-cols-[100px_1fr_120px_120px] gap-6 items-center p-4 bg-white hover:bg-gray-50 transition-colors">
                            
                            <div className="w-20">
                                <ImageUploader 
                                    imageUrl={meal.imageUrl}
                                    inputId={`meal-upload-${index}`}
                                    onUpload={(e) => e.target.files && handleImageUpload(index, e.target.files[0], e.target)}
                                    onDelete={() => handleRemoveImage(index)}
                                />
                            </div>

                            {/* Name */}
                            <div className="font-bold text-gray-800 text-lg">{meal.name}</div>

                            {/* Start Time */}
                            <input 
                                type="time" 
                                value={formatTimeObj(meal.startTime)} 
                                onChange={(e) => handleMealTimeChange(index, 'startTime', e.target.value)} 
                                className={inputClasses} 
                            />

                            {/* End Time */}
                            <input 
                                type="time" 
                                value={formatTimeObj(meal.endTime)} 
                                onChange={(e) => handleMealTimeChange(index, 'endTime', e.target.value)} 
                                className={inputClasses} 
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MealsEditor;
