import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Navbar from '@/app/components/Navbar';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to Your Dashboard
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* User Info Card */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Name:</span>
                  <p className="text-gray-900">{session.user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Email:</span>
                  <p className="text-gray-900">{session.user?.email}</p>
                </div>
                
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Status:</span>
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Session Status:</span>
                  <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Logged In
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Protected Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold mb-2 text-red-200"> <Image src='/analysis.png' alt='' width={40} height={40} className='mb-2'/>Analytics</h3>
                <p className="text-gray-600 text-sm">
                  View your personalized analytics and insights
                </p>
              </div>

              <div className="border rounded-lg p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold mb-2 text-yellow-200"> <Image src='/gear.png' alt='' width={40} height={40} className='mb-2'/>Settings</h3>
                <p className="text-gray-600 text-sm">
                  Manage your account preferences
                </p>
              </div>

              <div className="border rounded-lg p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-blue-300 mb-2"> <Image src='/user.png' alt='' width={40} height={40} className='mb-2'/>Profile</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Update your profile information
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This is a protected page. Only authenticated users can access this content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}