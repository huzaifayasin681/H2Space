import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">H2Space</h1>
          <p className="mt-3 text-lg text-gray-500">
            Advanced content creation and publishing platform
          </p>
          <p className="mt-2 text-md text-gray-600">
            A robust, feature-rich digital ecosystem for content management, 
            monetization, and audience engagement.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4 mt-8">
          <Link href="/login" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none text-center">
            Sign In
          </Link>
          <Link href="/register" className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none text-center">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}