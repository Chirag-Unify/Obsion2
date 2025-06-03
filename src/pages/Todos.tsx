import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TodoModal from '../components/TodoModal';
import api from '../utils/api';
import '../styles/notion.css';
import { FiPlus, FiEdit2, FiCheckCircle, FiCircle, FiFlag, FiCalendar } from 'react-icons/fi';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  checklist: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await api.put(`/todos/${id}/toggle`);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleCreateTodo = () => {
    setSelectedTodo(undefined);
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="notion-page min-h-screen p-0 relative bg-gradient-to-br from-ocean-100 via-blue-100 to-lime-100 dark:from-[#1a2634] dark:via-[#0ea5e9]/20 dark:to-[#10b981]/10">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%230ea5e910\'/%3E%3C/svg%3E") repeat' }} />
        <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--oceanic-green)]/10 text-[var(--oceanic-green)] shadow-md">
                <FiCheckCircle size={28} />
              </span>
              <h1 className="notion-title drop-shadow-md">Todos</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="notion-dropdown">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="notion-dropdown-button shadow"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--oceanic-blue)]">Progress</span>
              <span className="text-xs text-[var(--oceanic-text)]/60">{completedCount} / {todos.length} completed</span>
            </div>
            <div className="w-full h-3 bg-[var(--oceanic-surface)] dark:bg-[#1a2634]/40 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[var(--oceanic-blue)] to-[var(--oceanic-green)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--oceanic-green)]"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="notion-card group flex items-center gap-4 p-5 rounded-2xl shadow-xl bg-white/70 dark:bg-[#1a2634]/80 border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] hover:scale-[1.01] transition-transform duration-200 relative backdrop-blur-xl hover:shadow-2xl"
                  onClick={() => handleEditTodo(todo)}
                >
                  <div
                    className="flex-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTodo(todo.id, todo.completed);
                    }}
                  >
                    <button
                      className={`transition-all duration-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--oceanic-blue)]/40 ${todo.completed ? 'bg-[var(--oceanic-green)]/20' : 'bg-[var(--oceanic-blue)]/10'}`}
                      aria-label="Toggle Todo"
                    >
                      {todo.completed ? (
                        <FiCheckCircle className="text-[var(--oceanic-green)] animate-bounceIn" size={24} />
                      ) : (
                        <FiCircle className="text-[var(--oceanic-blue)]" size={24} />
                      )}
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg font-semibold truncate transition-colors duration-200 ${
                        todo.completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className={`notion-tag ${getPriorityColor(todo.priority)} flex items-center gap-1 animate-fade-in`}>
                        <FiFlag size={14} />
                        {todo.priority}
                      </span>
                      {todo.dueDate && (
                        <span className="notion-tag flex items-center gap-1 animate-fade-in">
                          <FiCalendar size={14} />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="notion-icon-button notion-hover-trigger absolute top-4 right-4 bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow"
                    aria-label="Edit Todo"
                  >
                    <FiEdit2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Floating Action Button */}
        <button
          onClick={handleCreateTodo}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-[var(--oceanic-green)] to-[var(--oceanic-blue)] text-white shadow-2xl rounded-full p-5 hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--oceanic-green)]/30"
          aria-label="Add Todo"
        >
          <FiPlus size={28} />
        </button>
        <TodoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchTodos}
          todo={selectedTodo}
        />
      </div>
    </DashboardLayout>
  );
} 