
import React, { useState, useEffect, useRef } from 'react';
import { AppData, Event, DaySchedule } from '../../types';
import { getCalendarWeek } from '../../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, ChevronLeft, ChevronRight, Clock, CalendarDays, Plus } from 'lucide-react';

interface WeeklyScheduleEditorProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

// Custom Combobox Component (Hybrid Select/Input)
interface ComboboxProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder?: string;
}

const Combobox: React.FC<ComboboxProps> = ({ value, onChange, options, placeholder }) => {
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

const WeeklyScheduleEditor: React.FC<WeeklyScheduleEditorProps> = ({ appData, setAppData }) => {
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
        <section className="animate-fade-in">
            {/* Header - Simplified as main layout has title */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                    <div className="bg-blue-100 p-2.5 rounded-lg mr-3 text-blue-600">
                        <CalendarDays size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Wochenprogramm</h2>
                    </div>
                </div>
                
                <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <button onClick={() => handleWeekChange('prev')} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"><ChevronLeft size={18}/></button>
                    <div className="px-4 text-center">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">KW</span>
                        <span className="text-lg font-bold text-gray-800 leading-none">{currentWeek}</span>
                    </div>
                    <button onClick={() => handleWeekChange('next')} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"><ChevronRight size={18}/></button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                {dayNames.map((day, index) => {
                    const dayData = weekData.find(d => d.day === day);
                    const events = dayData?.events || [];
                    const dateLabel = getDateForDay(index);

                    return (
                        <div key={day} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-0 lg:gap-8">
                                {/* Day Column - Header */}
                                <div className="bg-gray-50 lg:bg-white p-6 lg:py-8 lg:pl-8 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start border-b lg:border-b-0 lg:border-r border-gray-100">
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-3">
                                            <span className="font-black text-gray-800 text-2xl tracking-tight">{day}</span>
                                        </div>
                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md w-fit mt-1.5">{dateLabel}</span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleAddEvent(day)}
                                        className="lg:mt-6 flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 active:scale-95"
                                    >
                                        <Plus size={18} />
                                        <span className="hidden lg:inline">Termin hinzufügen</span>
                                        <span className="lg:hidden">Neu</span>
                                    </button>
                                </div>

                                {/* Events Column - Content */}
                                <div className="p-6 lg:py-8 lg:pr-8 space-y-3">
                                    {events.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full py-8 border-2 border-dashed border-gray-100 rounded-xl text-gray-400">
                                            <CalendarDays size={32} className="mb-2 opacity-20"/>
                                            <span className="text-sm font-medium">Keine Termine geplant</span>
                                        </div>
                                    ) : (
                                        events.map((event, eIdx) => (
                                            <div key={event.id} className="group grid grid-cols-1 xl:grid-cols-[1.5fr_1.5fr_140px_auto] gap-4 items-center animate-slide-in p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:ring-1 hover:ring-blue-100 transition-all">
                                                {/* Title Combobox */}
                                                <div className="w-full">
                                                    <label className="block xl:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Veranstaltung</label>
                                                    <Combobox 
                                                        value={event.title}
                                                        onChange={(val) => handleDayChange(day, 'title', val, eIdx)}
                                                        options={appData.eventTitles || []}
                                                        placeholder="Titel eingeben..."
                                                    />
                                                </div>

                                                {/* Location Combobox */}
                                                <div className="w-full">
                                                    <label className="block xl:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ort</label>
                                                    <Combobox 
                                                        value={event.location}
                                                        onChange={(val) => handleDayChange(day, 'location', val, eIdx)}
                                                        options={appData.locations}
                                                        placeholder="Ort wählen..."
                                                    />
                                                </div>

                                                {/* Time Input */}
                                                <div className="relative w-full">
                                                    <label className="block xl:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Uhrzeit</label>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                                        <input 
                                                            type="time" 
                                                            value={event.time} 
                                                            onChange={(e) => handleDayChange(day, 'time', e.target.value, eIdx)}
                                                            className={`${inputClasses} pl-9 text-center font-mono font-medium`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Delete Button */}
                                                <div className="flex justify-end xl:justify-center mt-2 xl:mt-0">
                                                    <button 
                                                        onClick={() => handleDeleteEvent(day, event.id)}
                                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-lg transition-all opacity-100 xl:opacity-0 group-hover:opacity-100"
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
        </section>
    );
};

export default WeeklyScheduleEditor;
