'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 32

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return
    const particleCanvas = canvas
    const particleContext = context

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.4 + 0.4,
      speed: Math.random() * 0.00018 + 0.00008,
      opacity: Math.random() * 0.35 + 0.08,
    }))
    let animationFrame = 0

    function resizeCanvas() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      particleCanvas.width = window.innerWidth * pixelRatio
      particleCanvas.height = window.innerHeight * pixelRatio
      particleCanvas.style.width = `${window.innerWidth}px`
      particleCanvas.style.height = `${window.innerHeight}px`
      particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    function animate() {
      particleContext.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const particle of particles) {
        particle.y -= particle.speed
        if (particle.y < -0.02) particle.y = 1.02

        particleContext.beginPath()
        particleContext.arc(particle.x * window.innerWidth, particle.y * window.innerHeight, particle.radius, 0, Math.PI * 2)
        particleContext.fillStyle = `rgba(251, 191, 36, ${particle.opacity})`
        particleContext.fill()
      }
      animationFrame = window.requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1] h-full w-full opacity-70" aria-hidden="true" />
}
