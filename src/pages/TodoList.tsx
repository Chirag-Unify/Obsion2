import { useState } from 'react';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const sampleTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write technical documentation for the new features',
    completed: false,
    dueDate: new Date('2024-03-15'),
    priority: 'high',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and merge pending pull requests',
    completed: true,
    priority: 'medium',
    createdAt: new Date(),
  },
];

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [showNewTodoForm, setShowNewTodoForm] = useState(false);
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    priority: 'medium',
    completed: false,
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleCreateTodo = () => {
    if (!newTodo.title) return;

    const todo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTodo.title,
      description: newTodo.description,
      completed: false,
      dueDate: newTodo.dueDate,
      priority: newTodo.priority || 'medium',
      createdAt: new Date(),
    };

    setTodos([...todos, todo]);
    setShowNewTodoForm(false);
    setNewTodo({
      priority: 'medium',
      completed: false,
    });
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Todo List</h2>
          <div className="mt-2">
            <nav className="flex space-x-4" aria-label="Tabs">
              {['all', 'active', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as typeof filter)}
                  className={`
                    px-3 py-2 font-medium text-sm rounded-md
                    ${
                      filter === tab
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowNewTodoForm(true)}
          className="btn-primary"
        >
          New Task
        </button>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`p-4 flex items-start justify-between ${
              todo.completed ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className={`
                    h-5 w-5 rounded border-2 flex items-center justify-center
                    ${
                      todo.completed
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-gray-300'
                    }
                  `}
                >
                  {todo.completed && (
                    <CheckIcon className="h-3 w-3 text-white" />
                  )}
                </button>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {todo.description}
                  </p>
                )}
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${priorityColors[todo.priority]}
                  `}>
                    {todo.priority}
                  </span>
                  {todo.dueDate && (
                    <span className="text-xs text-gray-500">
                      Due {todo.dueDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-gray-400 hover:text-gray-500"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
        {filteredTodos.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No tasks found
          </div>
        )}
      </div>

      {/* New todo modal */}
      {showNewTodoForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Task
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 input-primary"
                  value={newTodo.title || ''}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 input-primary"
                  value={newTodo.description || ''}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  className="mt-1 input-primary"
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as Todo['priority'] })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  className="mt-1 input-primary"
                  value={newTodo.dueDate ? new Date(newTodo.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewTodoForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTodo}
                className="btn-primary"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 