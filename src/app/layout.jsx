 import './globals.css';

export const metadata = {
  title: 'Admin Panel',
  description: 'GKCC Admin Panel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
