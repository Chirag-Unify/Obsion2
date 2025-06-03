import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DayDetailModal from '../components/DayDetailModal';
import EventModal from '../components/EventModal';
import StyledDropdown from '../components/StyledDropdown';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiFilter } from 'react-icons/fi';
import api from '../utils/api';

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  isAllDay: boolean;
  color?: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const start = startOfMonth(currentDate).toISOString();
      const end = endOfMonth(currentDate).toISOString();
      const response = await api.get('/events', { params: { start, end } });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayDetailOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
    setIsDayDetailOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
    setIsDayDetailOpen(false);
  };

  const handleEventSaved = () => {
    fetchEvents();
    setIsEventModalOpen(false);
    setIsDayDetailOpen(true);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getEventsForDay = (date: Date) => {
    return events.filter((event) =>
      isSameDay(parseISO(event.startDate), date)
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-8 bg-gradient-to-br from-ocean-100 via-blue-100 to-lime-100 dark:from-[#1a2634] dark:via-[#0ea5e9]/20 dark:to-[#10b981]/10">
        {/* Calendar Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]">
                Calendar
              </h1>
              <StyledDropdown
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'month' | 'week' | 'day')}
                icon={<FiCalendar size={18} />}
                className="w-32"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </StyledDropdown>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                icon={<FiChevronLeft size={18} />}
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              />
              <h2 className="text-xl font-medium text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon={<FiChevronRight size={18} />}
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              />
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-[var(--oceanic-border)] dark:bg-[var(--oceanic-border-dark)] rounded-2xl overflow-hidden shadow-xl">
            {/* Week Days Header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-white/60 dark:bg-[#1a2634]/60 backdrop-blur-xl p-4 text-center font-medium text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <motion.button
                  key={day.toString()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDateClick(day)}
                  className={`
                    relative min-h-[120px] p-4 text-left transition-all duration-200
                    ${isCurrentMonth
                      ? 'bg-white/60 dark:bg-[#1a2634]/60'
                      : 'bg-white/30 dark:bg-[#1a2634]/30'
                    }
                    hover:bg-white/80 dark:hover:bg-[#1a2634]/80
                    backdrop-blur-xl
                  `}
                >
                  <span
                    className={`
                      text-sm font-medium
                      ${isCurrentMonth
                        ? 'text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]'
                        : 'text-[var(--oceanic-text)]/40 dark:text-[var(--oceanic-text-dark)]/40'
                      }
                    `}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Event Indicators */}
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs px-2 py-1 rounded-md truncate"
                        style={{
                          backgroundColor: event.color || 'var(--oceanic-blue)',
                          color: 'white',
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60 pl-2">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Day Detail Modal */}
        {selectedDate && (
          <DayDetailModal
            isOpen={isDayDetailOpen}
            onClose={() => setIsDayDetailOpen(false)}
            selectedDate={selectedDate}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
          />
        )}

        {/* Event Modal */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleEventSaved}
          event={selectedEvent}
          defaultDate={selectedDate}
        />
      </div>
    </DashboardLayout>
  );
} 