import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Blackcoffer Data Visualization Dashboard',
  description: 'Interactive data visualization dashboard for Blackcoffer Consulting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

