import { useEffect, useRef } from "react";

export default function HeroOrbital() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // --- CONFIGURATION ---
    const particleCount = 1200; // High density for "concrete" feel
    const baseRadius = Math.min(width, height) * 0.25; // Size of the core
    const rangeRadius = 100; // Thickness of the ring
    const tilt = 0.4; // 3D Tilt perspective (0 = flat circle, 1 = side view)

    // Colors matching Flux Theme
    const colors = [
      "rgba(99, 102, 241, 0.8)",  // Indigo
      "rgba(168, 85, 247, 0.8)",  // Purple
      "rgba(59, 130, 246, 0.8)",  // Blue
      "rgba(255, 255, 255, 0.6)", // White sparks
    ];

    // --- PARTICLE SYSTEM ---
    const particles = Array.from({ length: particleCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: baseRadius + (Math.random() - 0.5) * rangeRadius,
      speed: (Math.random() * 0.005) + 0.002,
      size: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      offsetY: (Math.random() - 0.5) * 40, // Vertical spread for volume
    }));

    let animationFrame: number;

    const render = () => {
      // 1. Clear with Trail Effect (Makes it look fluid)
      ctx.fillStyle = "rgba(2, 0, 13, 0.2)"; // Low opacity wipe
      ctx.fillRect(0, 0, width, height);

      // 2. Set Additive Blending (Crucial for the "Neon" look)
      ctx.globalCompositeOperation = "lighter";

      const centerX = width / 2;
      const centerY = height / 2 + 50; // Push down slightly

      particles.forEach((p) => {
        // Update position
        p.angle += p.speed;

        // 3D Projection Math (Iso/Tilt)
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius * tilt + p.offsetY;
        
        // Scale size based on "depth" (closer particles are bigger)
        // Sine of angle gives us -1 (back) to 1 (front)
        const depth = Math.sin(p.angle); 
        const scale = 1 + depth * 0.3; // 0.7x to 1.3x scale
        const alpha = 0.3 + (depth + 1) * 0.35; // Fade out back particles

        // Draw Particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset blending for next frame's clear
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      animationFrame = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      
      {/* 1. The Canvas (The Orb) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-100"
      />

      {/* 2. Central Glow (The Core) */}
      {/* Adds a solid anchor in the middle so it looks like a black hole/star */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-indigo-600/30 blur-[80px] rounded-full mix-blend-screen" />

      {/* 3. Vignette (Focus attention) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02000d_80%)]" />
      
    </div>
  );
}