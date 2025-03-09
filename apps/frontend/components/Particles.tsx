"use client"
import React, { useRef, useState, useEffect } from 'react';

interface ParticleType {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  // Additional properties for more engaging animations
  targetRadius: number;
  originalRadius: number;
  pulseSpeed: number;
  pulseDirection: number;
}

interface ParticlesProps {
  quantityDesktop?: number;
  quantityMobile?: number;
  ease?: number;
  color?: string;
  refresh?: boolean;
  interactive?: boolean; // New prop to control interactivity level
}

const Particles: React.FC<ParticlesProps> = ({
  quantityDesktop = 90,
  quantityMobile = 60,
  ease = 50,
  color = "#6366f1",
  refresh = false,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<ParticleType[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouseTimerRef = useRef<number | null>(null);

  // Check if system is in dark mode
  useEffect(() => {
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

  const hexToHSL = (hex: string) => {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt("0x" + hex[1] + hex[1], 16);
      g = parseInt("0x" + hex[2] + hex[2], 16);
      b = parseInt("0x" + hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt("0x" + hex[1] + hex[2], 16);
      g = parseInt("0x" + hex[3] + hex[4], 16);
      b = parseInt("0x" + hex[5] + hex[6], 16);
    }
    
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    if (delta === 0) {
      h = 0;
    } else if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const toHex = (x: number) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const initParticles = (width: number, height: number, particleCount: number): ParticleType[] => {
    let particles: ParticleType[] = [];
    const colorHsl = hexToHSL(color);
    
    for (let i = 0; i < particleCount; i++) {
      // Create varied colors based on the main color with enhanced variations
      const hueVariation = (Math.random() * 40) - 20; // +/- 20 degrees for more color variation
      const satVariation = isDarkMode ? 
        Math.random() * 30 + 70 :  // Higher saturation in dark mode
        Math.random() * 25 + 65;   // Higher saturation in light mode too
      const lightVariation = isDarkMode ? 
        Math.random() * 25 + 50 :  // Brighter in dark mode
        Math.random() * 25 + 65;   // Brighter in light mode too
      
      const particleColor = hslToHex(
        (colorHsl.h + hueVariation) % 360,
        satVariation,
        lightVariation
      );
      
      const baseRadius = Math.random() * 2.5 + 1.2; // Larger base radius
      const maxLife = Math.random() * 3000 + 6000; // 6-9 seconds lifetime
      
      // Add pulse animation properties
      const pulseSpeed = Math.random() * 0.03 + 0.01;
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: baseRadius,
        originalRadius: baseRadius,
        targetRadius: baseRadius,
        color: particleColor,
        alpha: Math.random() * 0.5 + 0.3, // Higher base opacity for more visible effect
        life: 0,
        maxLife: maxLife,
        pulseSpeed: pulseSpeed,
        pulseDirection: Math.random() > 0.5 ? 1 : -1
      });
    }
    
    return particles;
  };

  const checkIfMobile = () => {
    return window.innerWidth <= 768;
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      if (!container) return;

      const { width, height } = container.getBoundingClientRect();
      
      // Setting the actual device pixel size for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Set display size (css pixels)
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      setDimensions({ width: canvas.width, height: canvas.height });
      
      // Initialize particles based on screen size
      const isMobile = checkIfMobile();
      const count = isMobile ? quantityMobile : quantityDesktop;
      particlesRef.current = initParticles(canvas.width, canvas.height, count);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      setMousePosition({ x, y });
      setIsMouseMoving(true);
      
      // Clear previous timer and set a new one
      if (mouseTimerRef.current) {
        window.clearTimeout(mouseTimerRef.current);
      }
      
      // Set mouse to not moving after 100ms of inactivity
      mouseTimerRef.current = window.setTimeout(() => {
        setIsMouseMoving(false);
      }, 100);
    };
    
    const handleMouseEnter = () => {
      setIsMouseInCanvas(true);
    };
    
    const handleMouseLeave = () => {
      setIsMouseInCanvas(false);
      setIsMouseMoving(false);
    };
    
    // Add mouse event listeners
    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
      canvasRef.current.addEventListener('mouseenter', handleMouseEnter);
      canvasRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    const animate = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Adjust global composite operation for glow effect
      ctx.globalCompositeOperation = 'lighter';
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Increment life
        particle.life += 1;
        
        // Calculate fade based on life
        const fadeInDuration = particle.maxLife * 0.1;
        const fadeOutStart = particle.maxLife * 0.8;
        
        if (particle.life < fadeInDuration) {
          // Fade in
          particle.alpha = (particle.life / fadeInDuration) * 0.6;
        } else if (particle.life > fadeOutStart) {
          // Fade out
          particle.alpha = 0.6 * (1 - ((particle.life - fadeOutStart) / (particle.maxLife - fadeOutStart)));
        }
        
        // Pulse animation - makes particles "breathe"
        particle.pulseDirection = 
          particle.radius >= particle.originalRadius * 1.5 ? -1 :
          particle.radius <= particle.originalRadius * 0.8 ? 1 :
          particle.pulseDirection;
        
        particle.radius += particle.pulseDirection * particle.pulseSpeed;
        
        // Mouse interaction - more pronounced effect
        if (interactive && isMouseInCanvas) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 180 * (window.devicePixelRatio || 1);
          
          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            const repelForce = isMouseMoving ? 2.2 : 1.2;
            
            // Repel particles away from mouse with enhanced movement
            particle.vx -= Math.cos(angle) * force * 0.015 * repelForce;
            particle.vy -= Math.sin(angle) * force * 0.015 * repelForce;
            
            // Make particles glow brighter when mouse is near
            particle.alpha = Math.min(0.9, particle.alpha + force * 0.3);
            
            // Make particles larger when mouse is near
            particle.targetRadius = particle.originalRadius * (1 + force * 1.5);
          } else {
            // Return to original size gradually
            particle.targetRadius = particle.originalRadius;
          }
          
          // Smoothly animate towards target radius
          particle.radius += (particle.targetRadius - particle.radius) * 0.1;
        }
        
        // Boundary check with bounce and wrap around
        if (particle.x < 0) {
          particle.vx = Math.abs(particle.vx) * 0.5;
          particle.x = 0;
        } else if (particle.x > canvas.width) {
          particle.vx = -Math.abs(particle.vx) * 0.5;
          particle.x = canvas.width;
        }
        
        if (particle.y < 0) {
          particle.vy = Math.abs(particle.vy) * 0.5;
          particle.y = 0;
        } else if (particle.y > canvas.height) {
          particle.vy = -Math.abs(particle.vy) * 0.5;
          particle.y = canvas.height;
        }
        
        // Apply some random movement for more natural flow
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;
        
        // Limit velocity
        const maxVel = 0.6;
        const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (vel > maxVel) {
          particle.vx = (particle.vx / vel) * maxVel;
          particle.vy = (particle.vy / vel) * maxVel;
        }
        
        // Apply a very subtle drift towards the center for particles that drift too far
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const distanceFromCenter = Math.sqrt(
          Math.pow(particle.x - centerX, 2) + 
          Math.pow(particle.y - centerY, 2)
        );
        
        if (distanceFromCenter > canvas.width * 0.45) {
          const centerAngle = Math.atan2(centerY - particle.y, centerX - particle.x);
          particle.vx += Math.cos(centerAngle) * 0.01;
          particle.vy += Math.sin(centerAngle) * 0.01;
        }
        
        // Draw particle with enhanced glow
        ctx.beginPath();
        
        // Create gradient for more pronounced glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 4
        );
        gradient.addColorStop(0, `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.6, `${particle.color}${Math.floor(particle.alpha * 0.4 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${particle.color}00`);
        
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset if lifetime exceeded
        if (particle.life >= particle.maxLife) {
          // Create a new particle
          particlesRef.current[index] = {
            ...initParticles(canvas.width, canvas.height, 1)[0],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
          };
        }
      });
      
      // Draw connections between nearby particles with enhanced visuals
      drawConnections(ctx, particlesRef.current, 120 * (window.devicePixelRatio || 1));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
        canvasRef.current.removeEventListener('mouseenter', handleMouseEnter);
        canvasRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mouseTimerRef.current) {
        window.clearTimeout(mouseTimerRef.current);
      }
    };
  }, [quantityDesktop, quantityMobile, color, refresh, isDarkMode, interactive]);
  
  const drawConnections = (
    ctx: CanvasRenderingContext2D, 
    particles: ParticleType[], 
    threshold: number
  ) => {
    ctx.globalCompositeOperation = 'lighter';
    
    // Process particles in waves for a fluid, dynamic connection effect
    const now = Date.now() / 1000;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < threshold) {
          // Calculate opacity based on distance with a wave effect
          const baseOpacity = 1 - (distance / threshold);
          // Add subtle wave motion to connections
          const waveEffect = 0.2 * Math.sin(now * 3 + i * 0.1) + 0.8;
          const strength = Math.min(baseOpacity * 0.25 * waveEffect, 0.2);
          
          // Create a gradient between the two particle colors
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          
          // Use particle colors with calculated opacity
          const color1 = particles[i].color;
          const color2 = particles[j].color;
          
          gradient.addColorStop(0, `${color1}${Math.floor(strength * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${color2}${Math.floor(strength * 255).toString(16).padStart(2, '0')}`);
          
          // Draw line with varying thickness based on distance
          const thickness = 0.5 * (1 - distance / threshold) * (window.devicePixelRatio || 1);
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = thickness;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    />
  );
};

export default Particles;
