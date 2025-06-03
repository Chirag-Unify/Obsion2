import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { FiUser, FiFileText, FiCheckCircle, FiCalendar, FiPlus, FiBookOpen, FiList, FiSun, FiCircle } from 'react-icons/fi';

interface Note {
  id: string;
  title: string;
  updatedAt: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
}

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
}

export default function Dashboard() {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [upcomingTodos, setUpcomingTodos] = useState<Todo[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [notesRes, todosRes, eventsRes] = await Promise.all([
          api.get('/notes?limit=5'),
          api.get('/todos?completed=false&limit=5'),
          api.get('/events'),
        ]);

        setRecentNotes(notesRes.data);
        setUpcomingTodos(todosRes.data);
        setUpcomingEvents(eventsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Quick stats
  const stats = [
    {
      label: 'Notes',
      value: recentNotes.length,
      icon: <FiFileText size={22} />,
      color: 'from-[var(--oceanic-blue)] to-[var(--oceanic-green)]',
      link: '/notes',
    },
    {
      label: 'Todos',
      value: upcomingTodos.length,
      icon: <FiCheckCircle size={22} />,
      color: 'from-[var(--oceanic-green)] to-[var(--oceanic-blue)]',
      link: '/todos',
    },
    {
      label: 'Events',
      value: upcomingEvents.length,
      icon: <FiCalendar size={22} />,
      color: 'from-[var(--oceanic-blue)] to-[var(--oceanic-green)]',
      link: '/calendar',
    },
  ];

  return (
    <DashboardLayout>
      <div className="notion-page min-h-screen p-0 relative bg-gradient-to-br from-ocean-100 via-blue-100 to-lime-100 dark:from-[#1a2634] dark:via-[#0ea5e9]/20 dark:to-[#10b981]/10">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%230ea5e910\'/%3E%3C/svg%3E") repeat' }} />
        <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-8">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div>
              <h1 className="notion-title mb-2 flex items-center gap-3 drop-shadow-md">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--oceanic-blue)]/10 text-[var(--oceanic-blue)] shadow-md">
                  <FiUser size={28} />
                </span>
                Welcome back!
              </h1>
              <p className="text-lg text-[var(--oceanic-text)]/80 dark:text-[var(--oceanic-text-dark)]/80 font-medium mb-2">
                "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
              </p>
              <div className="flex gap-4 mt-4">
                {stats.map((stat) => (
                  <Link
                    key={stat.label}
                    to={stat.link}
                    className={`rounded-xl px-5 py-3 bg-gradient-to-br ${stat.color} text-white font-semibold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-200`}
                  >
                    {stat.icon} {stat.label}: {stat.value}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[var(--oceanic-blue)] to-[var(--oceanic-green)] shadow-2xl">
                <span className="text-white"><FiSun size={48} /></span>
              </span>
              <span className="text-lg font-bold text-[var(--oceanic-blue)] dark:text-[var(--oceanic-green)]">Shine today!</span>
            </div>
          </div>

          {/* Glassy Cards Section */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--oceanic-blue)]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Recent Notes */}
              <div className="backdrop-blur-xl bg-white/70 dark:bg-[#1a2634]/80 rounded-3xl shadow-2xl p-6 border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="notion-h2 flex items-center gap-2 text-[var(--oceanic-blue)]"><FiBookOpen /> Recent Notes</h2>
                  <Link
                    to="/notes"
                    className="text-sm text-[var(--oceanic-blue)] hover:underline font-semibold"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <Link
                      key={note.id}
                      to={`/notes/${note.id}`}
                      className="block p-3 hover:bg-[var(--oceanic-blue)]/10 rounded-xl transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)] truncate flex items-center gap-2"><FiFileText size={16} /> {note.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Upcoming Todos */}
              <div className="backdrop-blur-xl bg-white/70 dark:bg-[#1a2634]/80 rounded-3xl shadow-2xl p-6 border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="notion-h2 flex items-center gap-2 text-[var(--oceanic-green)]"><FiList /> Upcoming Todos</h2>
                  <Link
                    to="/todos"
                    className="text-sm text-[var(--oceanic-green)] hover:underline font-semibold"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-3 hover:bg-[var(--oceanic-green)]/10 rounded-xl transition-colors duration-150"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--oceanic-green)]/20">
                          {todo.completed ? <span className="text-[var(--oceanic-green)]"><FiCheckCircle size={18} /></span> : <span className="text-[var(--oceanic-blue)]"><FiCircle size={18} /></span>}
                        </span>
                        <span className="text-sm text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]">{todo.title}</span>
                      </div>
                      {todo.dueDate && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(todo.dueDate)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="backdrop-blur-xl bg-white/70 dark:bg-[#1a2634]/80 rounded-3xl shadow-2xl p-6 border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="notion-h2 flex items-center gap-2 text-[var(--oceanic-blue)]"><FiCalendar /> Upcoming Events</h2>
                  <Link
                    to="/calendar"
                    className="text-sm text-[var(--oceanic-blue)] hover:underline font-semibold"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 hover:bg-[var(--oceanic-blue)]/10 rounded-xl transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)] truncate flex items-center gap-2"><FiCalendar size={16} /> {event.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(event.startDate)}
                        {event.endDate && ` - ${formatDate(event.endDate)}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Quick Add Floating Button */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
          <Link
            to="/notes"
            className="bg-gradient-to-br from-[var(--oceanic-blue)] to-[var(--oceanic-green)] text-white shadow-2xl rounded-full p-5 hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--oceanic-blue)]/30 flex items-center gap-2"
            aria-label="Quick Add Note"
          >
            <FiPlus size={22} /> Note
          </Link>
          <Link
            to="/todos"
            className="bg-gradient-to-br from-[var(--oceanic-green)] to-[var(--oceanic-blue)] text-white shadow-2xl rounded-full p-5 hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--oceanic-green)]/30 flex items-center gap-2"
            aria-label="Quick Add Todo"
          >
            <FiPlus size={22} /> Todo
          </Link>
          <Link
            to="/calendar"
            className="bg-gradient-to-br from-[var(--oceanic-blue)] to-[var(--oceanic-green)] text-white shadow-2xl rounded-full p-5 hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--oceanic-blue)]/30 flex items-center gap-2"
            aria-label="Quick Add Event"
          >
            <FiPlus size={22} /> Event
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
} 