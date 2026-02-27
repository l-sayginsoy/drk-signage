
import { useState, useEffect, useRef, type FC, type Dispatch, type SetStateAction } from 'react';
import { AppData, Event, DaySchedule } from '../../types';
import { getCalendarWeek } from '../../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, ChevronLeft, ChevronRight, Clock, CalendarDays, Plus } from 'lucide-react';

interface WeeklyScheduleEditorProps {
  appData: AppData;
  setAppData: Dispatch<SetStateAction<AppData>>;
}

// Custom Combobox Component (Hybrid Select/Input)
interface ComboboxProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder?: string;
}

const Combobox: FC<ComboboxProps> = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter options based on input
    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes((value || '').toLowerCase())
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const inputClasses = "w-full h-[46px] px-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm";

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={inputClasses}
                />
            </div>

            {/* Dropdown List */}
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredOptions.map((opt) => (
                        <div
                            key={opt}
                            className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-gray-700 text-sm transition-colors border-b border-gray-50 last:border-0"
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const emptyWeek: DaySchedule[] = dayNames.map(day => ({ day, events: [] }));

const WeeklyScheduleEditor: FC<WeeklyScheduleEditorProps> = ({ appData, setAppData }) => {
    const [currentWeek, setCurrentWeek] = useState(getCalendarWeek(new Date()));
    
    const handleWeekChange = (direction: 'prev' | 'next') => {
        setCurrentWeek(prev => direction === 'next' ? prev + 1 : prev - 1);
    };

    const getDateForDay = (dayIndex: number): string => {
        const today = new Date();
        const currentDayOfWeek = (today.getDay() + 6) % 7; // 0=Mon, 6=Sun
        const currentKW = getCalendarWeek(today);
        
        const dayDifference = dayIndex - currentDayOfWeek;
        const weekDifference = (currentWeek - currentKW) * 7;
        
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + dayDifference + weekDifference);
        
        return targetDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    };

    const handleDayChange = (day: string, field: 'title' | 'location' | 'time', value: string, eventIndex: number) => {
        setAppData(prev => {
            const newSchedule = { ...prev.weeklySchedule };
            const weekData = newSchedule[currentWeek] 
                ? newSchedule[currentWeek].map(d => ({ ...d, events: [...d.events] })) 
                : JSON.parse(JSON.stringify(emptyWeek));
            
            let dayIndex = weekData.findIndex(d => d.day === day);
            if (dayIndex === -1) {
                weekData.push({ day, events: [] });
                dayIndex = weekData.length - 1;
            }

            const dayEvents = [...weekData[dayIndex].events];
            
            if (dayEvents[eventIndex]) {
                dayEvents[eventIndex] = { ...dayEvents[eventIndex], [field]: value };
            }

            weekData[dayIndex].events = dayEvents;
            newSchedule[currentWeek] = weekData;
            return { ...prev, weeklySchedule: newSchedule };
        });
    };

    const handleAddEvent = (day: string) => {
        setAppData(prev => {
            const newSchedule = { ...prev.weeklySchedule };
            const weekData = newSchedule[currentWeek] 
                ? newSchedule[currentWeek].map(d => ({ ...d, events: [...d.events] })) 
                : JSON.parse(JSON.stringify(emptyWeek));
            
            let dayIndex = weekData.findIndex(d => d.day === day);
            if (dayIndex === -1) {
                weekData.push({ day, events: [] });
                dayIndex = weekData.length - 1;
            }

            const newEvent: Event = {
                id: uuidv4(),
                title: '',
                location: appData.locations[0] || '',
                time: '10:00'
            };
            
            weekData[dayIndex].events.push(newEvent);
            newSchedule[currentWeek] = weekData;
            return { ...prev, weeklySchedule: newSchedule };
        });
    };

    const handleDeleteEvent = (day: string, eventId: string) => {
        setAppData(prev => {
            const newSchedule = { ...prev.weeklySchedule };
            if (!newSchedule[currentWeek]) return prev;

            const weekData = newSchedule[currentWeek].map(d => {
                if (d.day === day) {
                    return { ...d, events: d.events.filter(e => e.id !== eventId) };
                }
                return d;
            });
            
            newSchedule[currentWeek] = weekData;
            return { ...prev, weeklySchedule: newSchedule };
        });
    };

    const weekData = appData.weeklySchedule[currentWeek] || emptyWeek;
    const inputClasses = "w-full h-[46px] px-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm";

    return (
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[80vh] animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 backdrop-blur-sm z-20 py-4 border-b border-gray-100">
                <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4 text-blue-600">
                        <CalendarDays size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Wochenprogramm</h2>
                        <p className="text-sm text-gray-500">Planen Sie die Aktivitäten für die Woche</p>
                    </div>
                </div>
                
                <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-200 shadow-sm">
                    <button onClick={() => handleWeekChange('prev')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all active:scale-95"><ChevronLeft size={20}/></button>
                    <div className="text-center font-bold text-gray-800 w-32 select-none flex flex-col items-center leading-none justify-center">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Kalenderwoche</span>
                        <span className="text-xl">{currentWeek}</span>
                    </div>
                    <button onClick={() => handleWeekChange('next')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all active:scale-95"><ChevronRight size={20}/></button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Rows */}
                <div className="divide-y divide-gray-100">
                    {dayNames.map((day, index) => {
                        const dayData = weekData.find(d => d.day === day);
                        const events = dayData?.events || [];
                        const dateLabel = getDateForDay(index);

                        return (
                            <div key={day} className="transition-colors hover:bg-gray-50/30">
                                <div className="grid grid-cols-[180px_1fr] gap-8 px-8 py-6">
                                    {/* Day Column */}
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-gray-800 text-xl">{day}</span>
                                            <span className="text-sm text-blue-600 font-bold">{dateLabel}</span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleAddEvent(day)}
                                            className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 px-3 py-2 rounded-lg transition-all w-fit border border-blue-100"
                                        >
                                            <Plus size={14} />
                                            Termin hinzufügen
                                        </button>
                                    </div>

                                    {/* Events Column */}
                                    <div className="space-y-4">
                                        {events.length === 0 ? (
                                            <div className="flex items-center justify-center h-[46px] border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm italic">
                                                Keine Termine geplant
                                            </div>
                                        ) : (
                                            events.map((event, eIdx) => (
                                                <div key={event.id} className="grid grid-cols-[1fr_1fr_120px_50px] gap-4 items-center animate-slide-in">
                                                    {/* Title Combobox */}
                                                    <Combobox 
                                                        value={event.title}
                                                        onChange={(val) => handleDayChange(day, 'title', val, eIdx)}
                                                        options={appData.eventTitles || []}
                                                        placeholder="Veranstaltung..."
                                                    />

                                                    {/* Location Combobox */}
                                                    <Combobox 
                                                        value={event.location}
                                                        onChange={(val) => handleDayChange(day, 'location', val, eIdx)}
                                                        options={appData.locations}
                                                        placeholder="Ort..."
                                                    />

                                                    {/* Time Input */}
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                                        <input 
                                                            type="time" 
                                                            value={event.time} 
                                                            onChange={(e) => handleDayChange(day, 'time', e.target.value, eIdx)}
                                                            className={`${inputClasses} pl-9 text-center`}
                                                        />
                                                    </div>

                                                    {/* Delete Button */}
                                                    <div className="flex justify-center">
                                                        <button 
                                                            onClick={() => handleDeleteEvent(day, event.id)}
                                                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                            title="Termin entfernen"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WeeklyScheduleEditor;
