import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UniLibrary | University Library Management",
  description:
    "Explore books, request borrowing, and manage library resources at your university library.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
  <body>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Navbar></Navbar>
      {children}

    </ThemeProvider>
    <Footer></Footer>
  </body>
</html>
  );
}
