import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Habitly - Daily Habit Tracker",
  description: "Track your daily habits, watch your streaks grow, and see your progress at a glance, all in one simple dashboard.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isApp = window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/habits') || window.location.pathname.startsWith('/settings');
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' && isApp) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full font-sans bg-[#FEFEFE] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
