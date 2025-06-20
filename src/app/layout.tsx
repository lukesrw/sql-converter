import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SQL Converter",
    description: "Easily convert between SQL, JS, and PHP",
    icons: {
        icon: "/favicon.png"
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-zinc-950 text-zinc-200 h-screen font-mono" suppressHydrationWarning>
                {children}

                <Analytics></Analytics>
            </body>
        </html>
    );
}
