
import React from 'react';
import { useTime } from '../hooks/useTime';
import { WeeklyScheduleData, Event } from '../types';
import { Clock } from 'lucide-react';

interface UpcomingEventsProps {
  weeklySchedule: WeeklyScheduleData;
}

const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ weeklySchedule }) => {
    const { calendarWeek, dayOfWeekIndex, now, getShortDate } = useTime();

    const getEventForDay = (dayIndex: number): Event | null => {
        const weekData = weeklySchedule[calendarWeek] || [];
        const dayName = dayNames[dayIndex];
        const dayData = weekData.find(d => d.day === dayName);
        if (!dayData || dayData.events.length === 0) return null;

        const sortedEvents = [...dayData.events].sort((a, b) => a.time.localeCompare(b.time));
        
        if (dayIndex === dayOfWeekIndex) {
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const upcomingEvent = sortedEvents.find(event => {
                const [eventHour, eventMinute] = event.time.split(':').map(Number);
                return eventHour * 60 + eventMinute >= currentTime;
            });
            return upcomingEvent || sortedEvents[sortedEvents.length - 1] || null;
        }

        return sortedEvents[0];
    };

    const todayEvent = getEventForDay(dayOfWeekIndex);
    const tomorrowEvent = getEventForDay((dayOfWeekIndex + 1) % 7);

    const todayDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(todayDate.getDate() + 1);

    const todayDayName = todayDate.toLocaleDateString('de-DE', { weekday: 'long' });
    const tomorrowDayName = tomorrowDate.toLocaleDateString('de-DE', { weekday: 'long' });
    const tomorrowShortDate = getShortDate(tomorrowDate);

    const EventCard: React.FC<{title: string, dateString: string, shortDate: string, event: Event | null, isToday: boolean}> = ({ title, dateString, shortDate, event, isToday }) => {
        const cardClasses = isToday 
            ? "bg-slate-800 text-white" 
            : "bg-white text-slate-800";
        const dotClasses = isToday ? "bg-white" : "bg-gray-400";
        const timeIconClasses = isToday ? "text-white/90" : "text-gray-500";
        const locationTextClasses = isToday ? "text-white/90" : "text-gray-500";
        const dateTextClasses = isToday ? "text-white/90" : "text-gray-500";
        const titleFontSize = 'clamp(0.8rem, 1.8vmin, 1.3rem)';
        const contentFontSize = 'clamp(1rem, 2.2vmin, 1.6rem)';
        const locationFontSize = 'clamp(0.85rem, 1.9vmin, 1.4rem)';
        
        return (
            <div className={`${cardClasses} rounded-2xl p-[1.8vmin] shadow-lg flex flex-col`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <span className={`w-[1vmin] h-[1vmin] ${dotClasses} rounded-full`}></span>
                        <h3 className="font-bold tracking-wider" style={{fontSize: titleFontSize}}>{title}</h3>
                        <p className={`font-medium ${isToday ? 'text-white/90' : 'text-gray-700'}`} style={{fontSize: titleFontSize}}>{dateString}</p>
                    </div>
                    { !isToday && <p className={`font-medium text-gray-500`} style={{fontSize: titleFontSize}}>{shortDate}.</p> }
                </div>
                
                <div className={event ? "pt-[1vmin]" : ""}>
                    {event ? (
                        <div className="flex items-start justify-between">
                             <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center space-x-2">
                                    <Clock size="2.5vmin" className={timeIconClasses}/>
                                    <p className="font-bold" style={{fontSize: contentFontSize}}>{event.time}</p>
                                </div>
                                <p className={`font-medium truncate ${locationTextClasses} mt-1 ml-[calc(2.5vmin+0.5rem)]`} style={{fontSize: locationFontSize}}>{event.location}</p>
                            </div>
                            <p className="font-bold text-right" style={{fontSize: contentFontSize}}>{event.title}</p>
                        </div>
                    ) : (
                         <p className="text-center font-medium opacity-70 py-4" style={{fontSize: locationFontSize}}>{`Keine Termine`}</p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-[1.8vmin]">
            <EventCard 
                title="HEUTE" 
                dateString={todayDayName} 
                shortDate=""
                event={todayEvent} 
                isToday={true} />
            <EventCard 
                title="MORGEN" 
                dateString={tomorrowDayName} 
                shortDate={tomorrowShortDate}
                event={tomorrowEvent} 
                isToday={false} />
        </div>
    )
}

export default UpcomingEvents;
