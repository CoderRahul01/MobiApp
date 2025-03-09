
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { cn } from '@/lib/utils'
import { meta } from '@/lib/constants'
import Particles from "@/components/Particles"
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from "@/components/app-sidebar"
import { useEffect, useState } from 'react'

import "./globals.css"

import { ClerkProvider } from "@clerk/nextjs"

const figtree = Figtree({
	variable: "--font-figtree",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: meta.title,
	description: meta.description
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(
				"min-h-screen bg-background font-sans antialiased",
				figtree.variable
			)}>
				<ClerkProvider
					appearance={{
						elements: {
							formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
							card: 'bg-background/95 backdrop-blur-md border border-primary/20 shadow-xl',
							headerTitle: 'text-foreground',
							headerSubtitle: 'text-muted-foreground',
							socialButtonsBlockButton: 'bg-background/50 border border-primary/20 text-foreground hover:bg-primary/10',
							formField: 'border-input',
							formFieldInput: 'bg-background/50 border-primary/20 focus:border-primary/40',
							footerActionText: 'text-muted-foreground',
							footerActionLink: 'text-primary hover:text-primary/90',
						}
					}}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<ClientParticlesWrapper />
						<div className="relative flex min-h-screen flex-col">
							<SidebarProvider>
								<div className="flex flex-1">
									<AppSidebar />
									<main className="flex-1">{children}</main>
								</div>
							</SidebarProvider>
						</div>
					</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}

// Client component wrapper for theme-dependent particles
function ClientParticlesWrapper() {
	'use client'
	const [isDarkMode, setIsDarkMode] = useState(false);
	
	useEffect(() => {
		// Check initial theme
		setIsDarkMode(document.documentElement.classList.contains('dark'));
		
		// Listen for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'class') {
					setIsDarkMode(document.documentElement.classList.contains('dark'));
				}
			});
		});
		
		observer.observe(document.documentElement, { attributes: true });
		return () => observer.disconnect();
	}, []);
	
	return (
		<Particles
			quantityDesktop={isDarkMode ? 90 : 75}
			quantityMobile={isDarkMode ? 60 : 45}
			color={isDarkMode ? "#6366f1" : "#7c3aed"} // Stronger purple for light mode
			interactive={true}
		/>
	);
}

// grid px-4 grid-cols-[1fr_min(640px,100%)_1fr] xl:grid-cols-[1fr_minmax(auto,10rem)_min(640px,100%)_minmax(auto,10rem)_1fr] xl:gap-x-9 xl:px-0 [&>*]:col-start-2 xl:[&>*]:col-start-3

