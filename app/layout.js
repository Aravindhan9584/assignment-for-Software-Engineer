import "./globals.css";

export const metadata = {
  title: "Shortlist — find the right car, not just a list of cars",
  description:
    "Describe what you need in plain words and get a ranked, explained car shortlist for the Indian market.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='11' fill='%230B0D10'/%3E%3Ccircle cx='12' cy='12' r='7' fill='none' stroke='%23E8A33D' stroke-width='2'/%3E%3C/svg%3E",
  },
};

export const viewport = {
  themeColor: "#0B0D10",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
