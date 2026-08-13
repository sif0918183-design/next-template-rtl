import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['300', '400', '500', '700', '900']
});

export const metadata: Metadata = {
  title: "المنصة الرقمية الرسمية للسادة الركابية في السودان",
  description: "المنصة الرسمية للسادة الركابية في السودان - النسب، التاريخ، التكافل، وقاعدة البيانات الموحدة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className={`${notoSansArabic.variable} antialiased`} suppressHydrationWarning dir="rtl">
      <body className="font-sans">
        <DirectionProvider direction="rtl">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
