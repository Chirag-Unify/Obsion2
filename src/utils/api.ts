import * as storage from '../services/localStorage';

// Notes API
export const notesApi = {
  getAll: () => Promise.resolve({ data: storage.getNotes() }),
  create: (note: any) => Promise.resolve({ data: storage.createNote(note) }),
  update: (id: string, note: any) => Promise.resolve({ data: storage.updateNote(id, note) }),
  delete: (id: string) => Promise.resolve({ data: storage.deleteNote(id) }),
};

// Todos API
export const todosApi = {
  getAll: () => Promise.resolve({ data: storage.getTodos() }),
  create: (todo: any) => Promise.resolve({ data: storage.createTodo(todo) }),
  update: (id: string, todo: any) => Promise.resolve({ data: storage.updateTodo(id, todo) }),
  delete: (id: string) => Promise.resolve({ data: storage.deleteTodo(id) }),
};

// Events API
export const eventsApi = {
  getAll: () => Promise.resolve({ data: storage.getEvents() }),
  create: (event: any) => Promise.resolve({ data: storage.createEvent(event) }),
  update: (id: string, event: any) => Promise.resolve({ data: storage.updateEvent(id, event) }),
  delete: (id: string) => Promise.resolve({ data: storage.deleteEvent(id) }),
  updateAttendeeStatus: (eventId: string, email: string, status: 'PENDING' | 'ACCEPTED' | 'DECLINED') => 
    Promise.resolve({ data: storage.updateEventAttendeeStatus(eventId, email, status) }),
};

// Dashboard API
export const dashboardApi = {
  getData: () => Promise.resolve({
    data: {
      recentNotes: storage.getNotes().slice(0, 5),
      upcomingTodos: storage.getTodos()
        .filter(todo => !todo.completed && !todo.isArchived)
        .slice(0, 5),
      upcomingEvents: storage.getEvents()
        .filter(event => new Date(event.startDate) >= new Date())
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 5),
    },
  }),
};

export default {
  get: () => Promise.reject(new Error('Direct API calls are not supported in local storage mode')),
  post: () => Promise.reject(new Error('Direct API calls are not supported in local storage mode')),
  put: () => Promise.reject(new Error('Direct API calls are not supported in local storage mode')),
  delete: () => Promise.reject(new Error('Direct API calls are not supported in local storage mode')),
}; 