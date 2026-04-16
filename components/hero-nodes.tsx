'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  radius: number
}

export function HeroNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const nodesRef = useRef<Node[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      initNodes()
    }

    const initNodes = () => {
      const nodeCount = 60
      nodesRef.current = []
      
      const centerX = width / 2
      const centerY = height / 2
      
      // Create nodes in orbital patterns around center
      for (let i = 0; i < nodeCount; i++) {
        const ring = Math.floor(i / 15) // 4 rings
        const angleOffset = (i % 15) / 15 * Math.PI * 2
        const baseRadius = 120 + ring * 100
        const wobble = Math.random() * 60 - 30
        
        const angle = angleOffset + Math.random() * 0.3
        const x = centerX + Math.cos(angle) * (baseRadius + wobble)
        const y = centerY + Math.sin(angle) * (baseRadius + wobble) * 0.6 // Elliptical
        
        nodesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          radius: 2 + Math.random() * 4
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, width, height)

      const mouse = mouseRef.current
      const nodes = nodesRef.current
      const time = Date.now() * 0.001

      // Update nodes
      nodes.forEach((node, i) => {
        // Mouse repulsion/attraction
        const dx = mouse.x - node.x
        const dy = mouse.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 200 && dist > 0) {
          // Attract towards mouse
          const force = (200 - dist) / 200 * 2
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }

        // Return to base position
        const homeX = node.baseX + Math.sin(time + i * 0.5) * 15
        const homeY = node.baseY + Math.cos(time + i * 0.3) * 10
        node.vx += (homeX - node.x) * 0.02
        node.vy += (homeY - node.y) * 0.02

        // Apply velocity with damping
        node.x += node.vx
        node.y += node.vy
        node.vx *= 0.92
        node.vy *= 0.92
      })

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (j > i) {
            const dx = other.x - node.x
            const dy = other.y - node.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 120) {
              const alpha = (1 - dist / 120) * 0.4
              ctx.strokeStyle = `rgba(152, 202, 63, ${alpha})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          }
        })
      })

      // Draw nodes with neon glow
      nodes.forEach((node) => {
        // Multiple glow layers
        for (let layer = 3; layer >= 0; layer--) {
          const glowRadius = node.radius * (1 + layer * 2)
          const alpha = 0.15 / (layer + 1)
          
          ctx.beginPath()
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(152, 202, 63, ${alpha})`
          ctx.fill()
        }

        // Core with bright center
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius
        )
        gradient.addColorStop(0, '#c8f05a')
        gradient.addColorStop(0.5, '#98CA3F')
        gradient.addColorStop(1, '#7ab030')
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.shadowColor = '#98CA3F'
        ctx.shadowBlur = 15
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
    />
  )
}
