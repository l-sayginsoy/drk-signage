
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTime } from '../hooks/useTime';
import { useWeather } from '../hooks/useWeather';
import { AppData } from '../types';
import WeatherForecastWidget from './WeatherWidget';
import FocusView from './FocusView';
import ThemeOverlay from './ThemeOverlay';
import './Dashboard.css';

interface DashboardProps {
  appData: AppData;
}

const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const Dashboard: React.FC<DashboardProps> = ({ appData }) => {
  const navigate = useNavigate();
  const { hour, minute, timeString, dateString, calendarWeek, dayOfWeekIndex, now, getShortDate, greeting } = useTime();
  const weather = useWeather();

  // --- Logic for Escape Key ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // --- Date Parsing for Header ---
  const dateParts = dateString.split(',');
  const currentDayName = dateParts[0] || '';
  const currentDateFull = (dateParts[1] || '').trim();

  // --- Schedule Data ---
  const currentWeekSchedule = appData.weeklySchedule[calendarWeek] || [];
  
  const getDayDateShort = (dayIdx: number): string => {
     const diff = dayIdx - dayOfWeekIndex;
     const d = new Date(now);
     d.setDate(d.getDate() + diff);
     return getShortDate(d);
  };

  // LAYOUT TEST: Always show the longest quote (by word count) to check layout fit for long texts
  const quote = appData.quotes.reduce((a, b) => {
    const wordsA = a.split(' ').length;
    const wordsB = b.split(' ').length;
    return wordsA > wordsB ? a : b;
  }, "");

  return (
    <div className="dashboard-container" data-theme={appData.currentTheme || 'standard'}>
      <ThemeOverlay theme={appData.currentTheme || 'standard'} />
      <div className="screen">
        <div className="topbar">
          {/* LEFT: Clock | Date */}
          <div className="header-left">
            <div className="clock" id="clock">{timeString}</div>
            <div className="header-divider"></div>
            <div className="dayDate">
              <div className="day" id="dow">{currentDayName}</div>
              <div className="date" id="date">{currentDateFull}</div>
            </div>
          </div>
          
          {/* CENTER: Greeting */}
          <div className="greeting">{greeting}</div>

          {/* RIGHT: Weather */}
          <div className="header-right">
             <WeatherForecastWidget weather={weather} layout="horizontal" mode="light" />
          </div>
        </div>

        <div className="main">
          {/* LEFT PANEL: Focus View (Meals, Events, Slideshow, Birthdays) */}
          <section className="panel leftPanel p-0 border-0 bg-transparent shadow-none">
            <FocusView 
                urgentMessage={appData.urgentMessage}
                meals={appData.meals}
                lunchMenu={appData.lunchMenu}
                slideshow={appData.slideshow}
                weeklySchedule={appData.weeklySchedule}
                menuPlanUrl={appData.menuPlanUrl}
                residents={appData.residents}
            />
          </section>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            {/* TOP RIGHT PANEL: Weekly Schedule */}
            <section className="panel weekly-panel">
              <div className="rightHeader">
                <div className="title">Wochenplan</div>
              </div>

              <div className="weekList">
                {dayNames.map((dayName, index) => {
                  const dayData = currentWeekSchedule.find(d => d.day === dayName);
                  const events = dayData?.events || [];
                  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));
                  
                  const isToday = index === dayOfWeekIndex;
                  let eventToShow = sortedEvents[0];
                  
                  if (isToday && sortedEvents.length > 0) {
                     const currentTimeVal = hour * 60 + minute;
                     const upcoming = sortedEvents.find(e => {
                         const [h, m] = e.time.split(':').map(Number);
                         return (h * 60 + m) >= currentTimeVal;
                     });
                     eventToShow = upcoming || sortedEvents[sortedEvents.length - 1];
                  }

                  return (
                    <div className={`itemWrap ${isToday ? 'is-active-day' : ''}`} key={dayName}>
                      <div className={`item ${isToday ? 'today' : ''}`}>
                        <div className="date-col">
                          <div className="day">{dayName.substring(0, 2).toUpperCase()}</div>
                          <div className="dsmall">{getDayDateShort(index)}</div>
                        </div>
                        
                        <div className="info-col">
                          {sortedEvents.length > 0 ? (
                            sortedEvents.slice(0, 2).map((event, eIdx) => (
                              <div key={eIdx} className="event-row">
                                <div className="event-main">
                                  <div className="title">{event.title}</div>
                                  <div className="place">{event.location}</div>
                                </div>
                                <div className="time">{event.time}</div>
                              </div>
                            ))
                          ) : (
                            <div className="event-row">
                              <div className="event-main">
                                <div className="title">Keine Termine</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
