/**
 * Calendar Utilities for Calendario Deportivo.
 * Pure functions for date adjustment, calendar grid generation, and geolocation.
 */

// ─── Types ────────────────────────────────────────────

export interface CalendarEvent {
    event_id: string;
    name: string;
    sport_id: string;
    city_id: string;
    color: string;
    reference_start: string; // ISO date string
    reference_end: string;
    start_day_of_week: number; // 0=Sun..6=Sat
    end_day_of_week: number;
    is_recurring: boolean;
    sport?: { name: string }[] | { name: string } | null;
    city?: { name: string; country_id: number }[] | { name: string; country_id: number } | null;
}

export interface AdjustedEvent extends CalendarEvent {
    adjustedStart: Date;
    adjustedEnd: Date;
}

export interface DayCell {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    events: AdjustedEvent[];
}

// ─── Day-of-Week Auto-Adjustment ──────────────────────

/**
 * Adjusts a recurring event's dates to a target year,
 * preserving the same day-of-week for start and end.
 *
 * Algorithm:
 * 1. Take the reference start date (e.g., Thu Jan 12, 2025)
 * 2. In the target year, find the same month/day
 * 3. Find the closest date that matches the same day-of-week
 * 4. Shift end date by the same duration offset
 */
export function adjustEventToYear(event: CalendarEvent, targetYear: number): AdjustedEvent {
    const refStart = new Date(event.reference_start + 'T00:00:00');
    const refEnd = new Date(event.reference_end + 'T00:00:00');
    const refYear = refStart.getFullYear();

    if (!event.is_recurring || targetYear === refYear) {
        return {
            ...event,
            adjustedStart: refStart,
            adjustedEnd: refEnd
        };
    }

    // Duration in days
    const durationMs = refEnd.getTime() - refStart.getTime();
    const durationDays = Math.round(durationMs / (86400000));

    // Candidate date in target year (same month/day)
    const candidateStart = new Date(targetYear, refStart.getMonth(), refStart.getDate());

    // Find closest date matching the desired day-of-week
    const adjustedStart = findClosestDayOfWeek(candidateStart, event.start_day_of_week);

    // End date = start + same duration
    const adjustedEnd = new Date(adjustedStart.getTime());
    adjustedEnd.setDate(adjustedEnd.getDate() + durationDays);

    return {
        ...event,
        adjustedStart,
        adjustedEnd
    };
}

/**
 * Find the closest date to `base` that falls on `targetDow` (0=Sun..6=Sat).
 * Searches at most ±3 days from the base date.
 */
function findClosestDayOfWeek(base: Date, targetDow: number): Date {
    const baseDow = base.getDay();
    let diff = targetDow - baseDow;

    // Normalize to range [-3, +3]
    if (diff > 3) diff -= 7;
    if (diff < -3) diff += 7;

    const result = new Date(base.getTime());
    result.setDate(result.getDate() + diff);
    return result;
}

// ─── Calendar Grid ────────────────────────────────────

/**
 * Generates a calendar grid for a given year/month.
 * Returns an array of weeks, each containing 7 DayCell objects.
 * Weeks start on Monday (ISO standard).
 */
export function getCalendarGrid(
    year: number,
    month: number, // 0-indexed (0=Jan..11=Dec)
    events: AdjustedEvent[] = []
): DayCell[][] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Adjust to start on Monday (ISO week)
    let startDow = firstDay.getDay();
    if (startDow === 0) startDow = 7; // Sunday = 7 in ISO
    const gridStart = new Date(firstDay.getTime());
    gridStart.setDate(gridStart.getDate() - (startDow - 1));

    const weeks: DayCell[][] = [];
    const current = new Date(gridStart.getTime());

    // Generate 6 weeks max
    for (let w = 0; w < 6; w++) {
        const week: DayCell[] = [];
        for (let d = 0; d < 7; d++) {
            const cellDate = new Date(current.getTime());
            const dayEvents = events.filter((ev) => {
                const evStart = normalizeDate(ev.adjustedStart);
                const evEnd = normalizeDate(ev.adjustedEnd);
                const cell = normalizeDate(cellDate);
                return cell >= evStart && cell <= evEnd;
            });

            week.push({
                date: cellDate,
                day: cellDate.getDate(),
                isCurrentMonth: cellDate.getMonth() === month,
                events: dayEvents
            });
            current.setDate(current.getDate() + 1);
        }
        weeks.push(week);

        // Stop if we've passed the last day and completed the week
        if (current > lastDay && current.getDay() === 1) break;
    }

    return weeks;
}

/** Normalize a date to midnight for comparison */
function normalizeDate(d: Date): number {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// ─── Geolocation ──────────────────────────────────────

/**
 * Detects the user's country ISO code using browser geolocation
 * + a free reverse-geocoding API. Falls back to 'CO' (Colombia).
 */
export async function detectCountryFromGeolocation(): Promise<string> {
    try {
        // Try IP-based geolocation first (faster, no permission needed)
        const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        if (response.ok) {
            const data = await response.json();
            if (data.country_code) {
                return data.country_code;
            }
        }
    } catch {
        // Fallback silently
    }

    return 'CO'; // Default: Colombia
}

// ─── Month/Weekday Names ──────────────────────────────

export const MONTH_NAMES_ES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
];

export const MONTH_NAMES_PT = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];

export const WEEKDAY_SHORT_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const WEEKDAY_SHORT_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
