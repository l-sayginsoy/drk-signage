
export interface UrgentMessage {
  active: boolean;
  title: string;
  text: string;
  imageUrl: string;
  activeFrom: string; // Format "HH:mm"
  activeUntil: string; // Format "HH:mm"
}

export interface Meal {
  name: string;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  imageUrl: string;
}

export interface LunchMenu {
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  // Array of 7 image URLs (Index 0 = Monday, Index 6 = Sunday)
  images: string[]; 
}

export interface SlideshowImage {
  id: string;
  url: string;
  caption: string;
}

export interface SlideshowData {
  active: boolean;
  activeFrom: string; // Format "HH:mm"
  activeUntil: string; // Format "HH:mm"
  durationPerSlide: number; // Duration in seconds
  images: SlideshowImage[];
}

export interface Event {
  id: string;
  time: string;
  title: string;
  location: string;
}

export interface DaySchedule {
  day: string;
  events: Event[];
}

export interface WeeklyScheduleData {
  [kw: string]: DaySchedule[];
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO Format YYYY-MM-DD
  hideAge: boolean; // Privacy setting
  active: boolean; // If false, will not show up
}

export type AppTheme = 
  | 'standard' 
  // Jahreszeiten
  | 'spring' | 'summer' | 'autumn' | 'winter'
  // Feiertage & Events
  | 'new_year' | 'three_kings' | 'carnival' | 'valentines' | 'womens_day'
  | 'easter' | 'mothers_day' | 'fathers_day' | 'pentecost'
  | 'thanksgiving' | 'oktoberfest' | 'german_unity' | 'halloween' | 'st_martin'
  | 'mourning_day' | 'advent' | 'nikolaus' | 'christmas' | 'silvester'
  | 'soccer';

export interface AppData {
  currentTheme: AppTheme;
  urgentMessage: UrgentMessage;
  meals: Meal[]; // Breakfast, Dinner, Coffee
  lunchMenu: LunchMenu; // Special logic for daily changing lunch
  slideshow: SlideshowData;
  weeklySchedule: WeeklyScheduleData;
  quotes: string[];
  locations: string[];
  eventTitles: string[]; // List of common event titles for autocomplete
  menuPlanUrl: string; // Generic fallback
  residents: Resident[];
}

export type WeatherType = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'snow';

export interface ForecastDay {
  day: string;
  type: WeatherType;
  maxTemp: number;
}

export interface WeatherData {
  type: WeatherType;
  temperature: number;
  forecast: ForecastDay[];
}
