'use client'

import { motion } from 'motion/react'
import { containerVariants, itemVariants } from '@/lib/animation-variants'
import { useEffect, useState } from 'react'

export const Hero = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	
	useEffect(() => {
		setIsDarkMode(document.documentElement.classList.contains('dark'));
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
	   <motion.div
	     variants={containerVariants}
	     initial="hidden"
	     animate="visible"
	     className="flex flex-col items-center justify-center space-y-6"
	   >
              <motion.div 
                variants={itemVariants} 
                className="relative"
              >
                <span className={`absolute -left-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-xl ${!isDarkMode && 'mix-blend-multiply'}`} />
                <span className={`absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-accent/10 blur-xl ${!isDarkMode && 'mix-blend-multiply'}`} />
                
                {!isDarkMode && (
                  <motion.div 
                    className="absolute inset-0 -z-10"
                    animate={{
                      background: [
                        'radial-gradient(circle at 30% 50%, rgba(124, 58, 237, 0.06) 0%, transparent 70%)',
                        'radial-gradient(circle at 70% 50%, rgba(124, 58, 237, 0.06) 0%, transparent 70%)',
                        'radial-gradient(circle at 30% 50%, rgba(124, 58, 237, 0.06) 0%, transparent 70%)'
                      ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                
                <h1 className={`text-center text-4xl font-semibold tracking-tight sm:text-6xl drop-shadow-sm 
                  ${isDarkMode 
                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-accent' 
                    : 'bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent/90'}`}
                >
                  Bring your imagination to life
                </h1>
              </motion.div>

              <motion.div 
                variants={itemVariants} 
                className="group flex items-center justify-center"
              >
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-md 
                    ${isDarkMode 
                      ? 'bg-primary/10 dark:bg-primary/5' 
                      : 'bg-primary/15'} 
                    transform group-hover:scale-110 transition-all duration-300`}>
                  </div>
                  <p
                    className={`relative mt-4 px-6 py-2 rounded-full text-center border 
                      ${isDarkMode
                        ? 'border-primary/20 dark:border-primary/10 font-medium bg-primary/5 dark:bg-primary/5 tracking-wide text-primary-foreground/80 dark:text-primary/90'
                        : 'border-primary/20 font-medium bg-white/50 tracking-wide text-primary/90'}`
                    }
                  >
                    Prompt, click generate and watch your app come to life
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="pt-8 flex flex-col items-center"
              >
                <div className={`h-16 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent ${!isDarkMode && 'via-primary/40'}`}></div>
                <div className="mt-4 text-muted-foreground text-center max-w-md">
                  <p className={!isDarkMode ? 'text-gray-600' : ''}>Our AI-powered platform transforms your ideas into beautiful, functional applications with just a few clicks.</p>
                </div>
              </motion.div>
	   </motion.div>
	)	
}
