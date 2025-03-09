import { SidebarTrigger } from './ui/sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { itemVariants } from '@/lib/animation-variants'
import { useEffect, useState } from 'react'

export const Header = ({ children, className, onClick }: {
	children?: React.ReactNode,
	className?: string,
	onClick?: () => void
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [rotation, setRotation] = useState(0);

	// Subtle continuous rotation animation for the logo
	useEffect(() => {
		const interval = setInterval(() => {
			setRotation(prev => (prev + 1) % 360);
		}, 50);
		
		return () => clearInterval(interval);
	}, []);

	return (
		<motion.header 
			variants={itemVariants} 
			className="flex items-center gap-2 bg-zinc-100 border dark:border-zinc-800 dark:hover:bg-zinc-600/10 dark:bg-zinc-900 px-4 py-2 rounded-3xl"
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			whileHover={{
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
				transition: { duration: 0.3 }
			}}
			animate={{
				y: [0, 2, 0],
				transition: {
					y: {
						repeat: Infinity,
						repeatType: 'reverse',
						duration: 1.5,
						ease: 'easeInOut'
					}
				}
			}}
		>
			<motion.div
				initial={{ scale: 1 }}
				whileHover={{ 
					scale: 1.1,
					transition: { duration: 0.2 }
				}}
				whileTap={{ scale: 0.95 }}
			>
				<SidebarTrigger
					variant="link"
					className="[&_svg:not([class*='size-'])]:size-5 cursor-pointer"
				/>
			</motion.div>
			
			<Link href="/">
				<motion.div
					animate={{ rotate: isHovered ? rotation : 0 }}
					whileHover={{ 
						scale: 1.15,
						filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))',
						transition: { duration: 0.3 }
					}}
					whileTap={{ scale: 0.9 }}
					style={{ 
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center' 
					}}
				>
					<Image src="/logo.svg" alt="logo" width={25} height={25} />
				</motion.div>
			</Link>
			
			{children && 
				<motion.div
					initial={{ scale: 1 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<Button
						variant="link"
						data-sidebar="trigger"
						data-slot="sidebar-trigger"
						size="icon"
						className={cn("h-7 w-7 [&_svg:not([class*='size-'])]:size-5 cursor-pointer", className)}
						onClick={onClick}
					>
						{children}
					</Button>
				</motion.div>
			}
		</motion.header>
	)
}
