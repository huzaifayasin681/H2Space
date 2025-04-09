import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <div className="text-5xl mb-4">🚫</div>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Go to Home
            </Link>
            <Link href="/login" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}