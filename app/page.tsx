import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="text-center text-gray-700">
        <Image src='/two-factor-authentication.png' alt='' width={100} height={100}/>
        <h1 className="text-6xl font-bold mb-4">Welcome</h1>
        <p className="text-xl mb-8">Secure Authentication App</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-blue-800 px-4 py-2 rounded-md font-semibold hover:text-blue-400 transition inline-block"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-blue-800 px-4 py-2 rounded-md font-semibold hover:text-blue-400 transition inline-block"          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}