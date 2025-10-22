
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sign In to Arcadia News
          </h2>
          <p className="text-gray-600">
            Access your account and start engaging with global news
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
