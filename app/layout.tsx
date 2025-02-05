import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { FC, ReactNode } from "react";

export const metadata: Metadata = {
    title: "Katsuyou",
    description: "Online, free, infinite practices for Japanese verbs and adjectives",
};

interface RootLayoutProps {
    children: ReactNode
}

const RootLayout: FC<RootLayoutProps> = async ({ children }) => {
    const locale = await getLocale()
    const messages = await getMessages()

    return (
        <html lang={locale}>
        <body className={`antialiased m-0 p-0`}>
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
        </body>
        </html>
    );
}

export default RootLayout
