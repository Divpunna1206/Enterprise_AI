import { AuthProvider } from './auth/AuthContext';
import { LmsApp } from './lms/LmsApp';

export default function App() {
  return (
    <AuthProvider>
      <LmsApp />
    </AuthProvider>
  );
}
