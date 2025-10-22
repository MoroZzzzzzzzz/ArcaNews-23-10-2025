
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join Arcadia News
          </h2>
          <p className="text-gray-600">
            Create your account and get your free ACD wallet
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
