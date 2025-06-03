import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Notes from '../pages/Notes';
import Calendar from '../pages/Calendar';
import TodoList from '../pages/TodoList';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'notes',
        children: [
          {
            index: true,
            element: <Notes />,
          },
          {
            path: ':id',
            element: <Notes />,
          },
        ],
      },
      {
        path: 'calendar',
        children: [
          {
            index: true,
            element: <Calendar />,
          },
          {
            path: ':date',
            element: <Calendar />,
          },
        ],
      },
      {
        path: 'todos',
        children: [
          {
            index: true,
            element: <TodoList />,
          },
          {
            path: ':filter',
            element: <TodoList />,
          },
        ],
      },
    ],
  },
]); 