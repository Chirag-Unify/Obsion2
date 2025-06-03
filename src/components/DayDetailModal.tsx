import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import Modal from './Modal';
import Button from './Button';
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

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onAddEvent,
  onEditEvent,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen, selectedDate]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events', {
        params: {
          start: selectedDate.toISOString(),
          end: new Date(selectedDate.setHours(23, 59, 59, 999)).toISOString(),
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await api.delete(`/events/${eventId}`);
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={format(selectedDate, 'EEEE, MMMM d, yyyy')}
    >
      <div className="space-y-6">
        {/* Header with Add Event Button */}
        <div className="flex items-center justify-between">
          <p className="text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60">
            {events.length} events scheduled
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={<FiPlus size={16} />}
            onClick={onAddEvent}
          >
            Add Event
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[var(--oceanic-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60">
                No events scheduled for this day
              </p>
              <Button
                variant="secondary"
                size="sm"
                icon={<FiPlus size={16} />}
                onClick={onAddEvent}
                className="mt-4"
              >
                Schedule an Event
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group relative p-4 rounded-xl bg-white/40 dark:bg-[#1a2634]/40 border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] backdrop-blur-sm hover:shadow-lg transition-all duration-200"
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: event.color || 'var(--oceanic-blue)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60">
                        {!event.isAllDay && (
                          <div className="flex items-center gap-1">
                            <FiClock size={14} />
                            <span>
                              {formatTime(event.startDate)}
                              {event.endDate && ` - ${formatTime(event.endDate)}`}
                            </span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <FiMapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<FiEdit2 size={14} />}
                        onClick={() => onEditEvent(event)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<FiTrash2 size={14} />}
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-500 hover:text-red-600"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DayDetailModal; 