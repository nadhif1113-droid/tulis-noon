import './globals.css';

export const metadata = {
  title: 'Tulis Noon — Belajar Bahasa Arab',
  description: 'Bahasa Arab dengan cara memahami, bukan menghafal. Untuk jamaah umrah, profesional, dan pelajar.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
