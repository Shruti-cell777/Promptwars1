import './globals.css';
import { SimulationProvider } from '@/context/SimulationContext';

export const metadata = {
  title: 'Smart Event Management',
  description: 'Enterprise-grade event experience management system.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SimulationProvider>
          {children}
        </SimulationProvider>
      </body>
    </html>
  );
}
