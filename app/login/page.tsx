import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Smart EMI Application System",
  description: "Login to your Smart EMI account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">Smart EMI Application System</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Streamline your EMI application process with our comprehensive management system.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full" />
                <span className="text-blue-100">Fast application processing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full" />
                <span className="text-blue-100">Real-time status tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full" />
                <span className="text-blue-100">Comprehensive reporting</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">Smart EMI</span>
            </div>

            {/* Mobile branding - shown only on small screens */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Smart EMI Application System</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Streamline your EMI application process with our comprehensive management system.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Need help?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Contact your administrator for account access or technical support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
