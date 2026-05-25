import './globals.css';
import { AuthProvider } from '../lib/auth-context';

export const metadata = {
  title: 'Tulis Noon - Belajar Bahasa Arab',
  description: 'Bahasa Arab dengan cara memahami, bukan menghafal. Untuk jamaah umrah, profesional, dan pelajar.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
