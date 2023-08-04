import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const font = Poppins({ subsets: ["latin"], weight: "400" });

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
            <body className={`${font.className} bg-zinc-950 text-zinc-200 h-screen`}>
                {children}

                <Analytics></Analytics>
            </body>
        </html>
    );
}
