
import * as React from 'react';
import { AppTheme } from '../types';

interface ThemeOverlayProps {
    theme: AppTheme;
}

// Map themes to emoji/visual configurations
// corner: TL (TopLeft), TR (TopRight), BL (BottomLeft), BR (BottomRight)
const getDecorations = (theme: AppTheme) => {
    switch (theme) {
        // --- JAHRESZEITEN ---
        case 'spring':
            return { tl: '🌸', tr: '🦋', bl: '🌱', br: '🌸', opacity: 0.6 };
        case 'summer':
            return { tl: '☀️', tr: '🌻', bl: '🍦', br: '🌊', opacity: 0.6 };
        case 'autumn':
            return { tl: '🍂', tr: '🍁', bl: '🍄', br: '🎃', opacity: 0.7 };
        case 'winter':
            return { tl: '❄️', tr: '⛄', bl: '❄️', br: '🌨️', opacity: 0.7 };
        
        // --- FEIERTAGE ---
        case 'christmas':
        case 'advent':
        case 'nikolaus':
            return { tl: '🎄', tr: '⭐', bl: '🎁', br: '🦌', opacity: 0.8 };
        case 'easter':
            return { tl: '🐰', tr: '🥚', bl: '🐣', br: '🌷', opacity: 0.8 };
        case 'carnival':
            return { tl: '🎭', tr: '🎈', bl: '🎉', br: '🤡', opacity: 0.8 };
        case 'new_year':
        case 'silvester':
            return { tl: '🎆', tr: '🥂', bl: '🍀', br: '🎇', opacity: 0.7 };
        case 'halloween':
            return { tl: '👻', tr: '🕷️', bl: '🎃', br: '🕸️', opacity: 0.7 };
        case 'valentines':
        case 'mothers_day':
            return { tl: '❤️', tr: '🌹', bl: '💖', br: '💝', opacity: 0.6 };
        case 'st_martin':
            return { tl: '🏮', tr: '✨', bl: '🔥', br: '🌙', opacity: 0.7 };
        case 'oktoberfest':
            return { tl: '🥨', tr: '🍺', bl: '🎡', br: '💙', opacity: 0.7 };
        case 'soccer':
            return { tl: '⚽', tr: '🇩🇪', bl: '🏆', br: '⚽', opacity: 0.8 };
        
        default:
            return null;
    }
};

const ThemeOverlay: React.FC<ThemeOverlayProps> = ({ theme }) => {
    const decor = getDecorations(theme);
    
    if (!decor) return null;

    // Common style for all corners
    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        // Reduced size slightly to be less obtrusive
        fontSize: 'clamp(2.5rem, 5vmin, 4rem)', 
        lineHeight: 1,
        pointerEvents: 'none', // Allow clicking through
        zIndex: 50, // High enough to be over content panels
        opacity: decor.opacity,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
    };

    // Adjusted positions:
    // Top: 13vh ensures it sits BELOW the Topbar (which is ~10-12vh tall)
    // Bottom: 13vh ensures it sits ABOVE the Footer
    // Left/Right: 1.5vw keeps it close to the edge but with a little breathing room

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            {/* Top Left */}
            <div style={{ ...baseStyle, top: '13vh', left: '1.5vw', transform: 'rotate(-15deg)' }}>
                {decor.tl}
            </div>
            
            {/* Top Right */}
            <div style={{ ...baseStyle, top: '13vh', right: '1.5vw', transform: 'rotate(15deg)' }}>
                {decor.tr}
            </div>

            {/* Bottom Left */}
            <div style={{ ...baseStyle, bottom: '13vh', left: '1.5vw', transform: 'rotate(10deg)' }}>
                {decor.bl}
            </div>

            {/* Bottom Right */}
            <div style={{ ...baseStyle, bottom: '13vh', right: '1.5vw', transform: 'rotate(-10deg)' }}>
                {decor.br}
            </div>
        </div>
    );
};

export default ThemeOverlay;
