import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm h-64 bg-white rounded-lg shadow animate-pulse" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
