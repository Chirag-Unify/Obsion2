import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center page-container">
      <div className="max-w-md w-full px-6 py-12 text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-light-fg-secondary dark:text-dark-fg-secondary">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center btn-primary"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Go back home
        </Link>
      </div>
    </div>
  );
} 