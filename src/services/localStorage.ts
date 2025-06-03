import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  settings: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isArchived: boolean;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isAllDay: boolean;
  location?: string;
  color?: string;
  userId: string;
  reminders: EventReminder[];
  recurrence?: EventRecurrence;
  attendees: EventAttendee[];
}

export interface EventReminder {
  id: string;
  time: string;
  type: string;
}

export interface EventRecurrence {
  id: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
}

export interface EventAttendee {
  id: string;
  email: string;
  name?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

// Storage Keys
const STORAGE_KEYS = {
  USER: 'obsion_user',
  NOTES: 'obsion_notes',
  TODOS: 'obsion_todos',
  EVENTS: 'obsion_events',
  AUTH_TOKEN: 'obsion_token',
} as const;

// Initial data
const INITIAL_DATA = {
  [STORAGE_KEYS.NOTES]: [] as const,
  [STORAGE_KEYS.TODOS]: [] as const,
  [STORAGE_KEYS.EVENTS]: [] as const,
} as const;

// Initialize local storage with default data if empty
export const initializeStorage = (): void => {
  Object.entries(INITIAL_DATA).forEach(([key, defaultValue]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
  });
};

// Helper functions
const getItem = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    const defaultValue = [] as T[];
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const setItem = <T>(key: string, value: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    // Handle quota exceeded or other storage errors
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Local storage is full. Please delete some items to continue.');
    }
  }
};

// User Management
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const login = (email: string, password: string): User => {
  // In a real app, we would validate the password
  const user = {
    id: uuidv4(),
    email,
    name: email.split('@')[0],
    settings: {
      theme: 'light' as const,
      language: 'en',
      notifications: true,
    },
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
};

export const register = (email: string, password: string, name: string): User => {
  const user = {
    id: uuidv4(),
    email,
    name,
    settings: {
      theme: 'light' as const,
      language: 'en',
      notifications: true,
    },
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Notes Management
export const getNotes = (): Note[] => {
  return getItem<Note>(STORAGE_KEYS.NOTES);
};

export const createNote = (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
  const notes = getNotes();
  const newNote = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  setItem(STORAGE_KEYS.NOTES, notes);
  return newNote;
};

export const updateNote = (id: string, data: Partial<Note>): Note => {
  const notes = getNotes();
  const index = notes.findIndex(note => note.id === id);
  if (index === -1) throw new Error('Note not found');
  
  notes[index] = {
    ...notes[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.NOTES, notes);
  return notes[index];
};

export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  setItem(STORAGE_KEYS.NOTES, filteredNotes);
};

// Todos Management
export const getTodos = (): Todo[] => {
  return getItem<Todo>(STORAGE_KEYS.TODOS);
};

export const createTodo = (data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo => {
  const todos = getTodos();
  const newTodo = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  todos.push(newTodo);
  setItem(STORAGE_KEYS.TODOS, todos);
  return newTodo;
};

export const updateTodo = (id: string, data: Partial<Todo>): Todo => {
  const todos = getTodos();
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) throw new Error('Todo not found');
  
  todos[index] = {
    ...todos[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.TODOS, todos);
  return todos[index];
};

export const deleteTodo = (id: string): void => {
  const todos = getTodos();
  const filteredTodos = todos.filter(todo => todo.id !== id);
  setItem(STORAGE_KEYS.TODOS, filteredTodos);
};

// Events Management
export const getEvents = (): Event[] => {
  return getItem<Event>(STORAGE_KEYS.EVENTS);
};

export const createEvent = (data: Omit<Event, 'id'>): Event => {
  const events = getEvents();
  const newEvent = {
    ...data,
    id: uuidv4(),
    reminders: data.reminders?.map(r => ({ ...r, id: uuidv4() })) || [],
    recurrence: data.recurrence ? { ...data.recurrence, id: uuidv4() } : undefined,
    attendees: data.attendees?.map(a => ({ ...a, id: uuidv4() })) || [],
  };
  events.push(newEvent);
  setItem(STORAGE_KEYS.EVENTS, events);
  return newEvent;
};

export const updateEvent = (id: string, data: Partial<Event>): Event => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === id);
  if (index === -1) throw new Error('Event not found');
  
  events[index] = {
    ...events[index],
    ...data,
    reminders: data.reminders?.map(r => ({ ...r, id: r.id || uuidv4() })) || events[index].reminders,
    recurrence: data.recurrence ? { ...data.recurrence, id: data.recurrence.id || uuidv4() } : undefined,
    attendees: data.attendees?.map(a => ({ ...a, id: a.id || uuidv4() })) || events[index].attendees,
  };
  setItem(STORAGE_KEYS.EVENTS, events);
  return events[index];
};

export const deleteEvent = (id: string): void => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  setItem(STORAGE_KEYS.EVENTS, filteredEvents);
};

export const updateEventAttendeeStatus = (
  eventId: string,
  attendeeEmail: string,
  status: EventAttendee['status']
): Event => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === eventId);
  if (index === -1) throw new Error('Event not found');
  
  const attendeeIndex = events[index].attendees.findIndex(a => a.email === attendeeEmail);
  if (attendeeIndex === -1) throw new Error('Attendee not found');
  
  events[index].attendees[attendeeIndex].status = status;
  setItem(STORAGE_KEYS.EVENTS, events);
  return events[index];
}; 