import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Modal from './Modal';
import FormInput from './FormInput';
import StyledDropdown from './StyledDropdown';
import Button from './Button';
import { FiCalendar, FiClock, FiMapPin, FiRepeat, FiSave, FiUsers } from 'react-icons/fi';
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

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  event?: Event | null;
  defaultDate?: Date | null;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [color, setColor] = useState('#0ea5e9');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartDate(format(new Date(event.startDate), 'yyyy-MM-dd'));
      setStartTime(format(new Date(event.startDate), 'HH:mm'));
      if (event.endDate) {
        setEndDate(format(new Date(event.endDate), 'yyyy-MM-dd'));
        setEndTime(format(new Date(event.endDate), 'HH:mm'));
      }
      setLocation(event.location || '');
      setIsAllDay(event.isAllDay);
      setColor(event.color || '#0ea5e9');
    } else {
      const date = defaultDate || new Date();
      setTitle('');
      setDescription('');
      setStartDate(format(date, 'yyyy-MM-dd'));
      setStartTime('09:00');
      setEndDate(format(date, 'yyyy-MM-dd'));
      setEndTime('10:00');
      setLocation('');
      setIsAllDay(false);
      setColor('#0ea5e9');
    }
  }, [event, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        title,
        description: description || undefined,
        startDate: new Date(`${startDate}T${startTime}`).toISOString(),
        endDate: new Date(`${endDate}T${endTime}`).toISOString(),
        location: location || undefined,
        isAllDay,
        color,
      };

      if (event) {
        await api.put(`/events/${event.id}`, eventData);
      } else {
        await api.post('/events', eventData);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    { value: '#0ea5e9', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create Event'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title..."
          icon={<FiCalendar size={18} />}
          required
        />

        <FormInput
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add event description..."
          multiline
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormInput
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <FormInput
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              disabled={isAllDay}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormInput
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <FormInput
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              disabled={isAllDay}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] text-[var(--oceanic-blue)] focus:ring-[var(--oceanic-blue)]/30"
            />
            <span className="text-sm font-medium text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60">
              All Day
            </span>
          </label>
        </div>

        <FormInput
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Add location..."
          icon={<FiMapPin size={18} />}
        />

        <div>
          <label className="block text-sm font-medium text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60 mb-1">
            Color
          </label>
          <div className="flex gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                className={`w-8 h-8 rounded-full transition-transform duration-200 ${
                  color === option.value ? 'scale-110 ring-2 ring-[var(--oceanic-blue)]' : ''
                }`}
                style={{ backgroundColor: option.value }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            icon={<FiSave size={18} />}
            loading={loading}
          >
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal; 