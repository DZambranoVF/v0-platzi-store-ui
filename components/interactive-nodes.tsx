'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  connections: number[]
}

export function InteractiveNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const nodesRef = useRef<Node[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const initNodes = () => {
      const nodeCount = 12
      nodesRef.current = []
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2
        const radius = 30 + Math.random() * 20
        nodesRef.current.push({
          x: 60 + Math.cos(angle) * radius,
          y: 30 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 2 + Math.random() * 2,
          connections: []
        })
      }

      // Pre-compute connections
      nodesRef.current.forEach((node, i) => {
        nodesRef.current.forEach((other, j) => {
          if (i !== j) {
            const dx = other.x - node.x
            const dy = other.y - node.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 50) {
              node.connections.push(j)
            }
          }
        })
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return

      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const mouse = mouseRef.current
      const nodes = nodesRef.current

      // Update nodes
      nodes.forEach((node) => {
        // Mouse influence
        const dx = mouse.x - node.x
        const dy = mouse.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 80 && dist > 0) {
          const force = (80 - dist) / 80 * 0.15
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }

        // Apply velocity with damping
        node.x += node.vx
        node.y += node.vy
        node.vx *= 0.95
        node.vy *= 0.95

        // Keep in bounds with soft bounce
        const padding = 10
        if (node.x < padding) { node.x = padding; node.vx *= -0.5 }
        if (node.x > rect.width - padding) { node.x = rect.width - padding; node.vx *= -0.5 }
        if (node.y < padding) { node.y = padding; node.vy *= -0.5 }
        if (node.y > rect.height - padding) { node.y = rect.height - padding; node.vy *= -0.5 }
      })

      // Draw connections
      ctx.strokeStyle = 'rgba(152, 202, 63, 0.15)'
      ctx.lineWidth = 1
      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (j > i) {
            const dx = other.x - node.x
            const dy = other.y - node.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 45) {
              const alpha = (1 - dist / 45) * 0.3
              ctx.strokeStyle = `rgba(152, 202, 63, ${alpha})`
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          }
        })
      })

      // Draw nodes with glow
      nodes.forEach((node) => {
        // Outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4)
        gradient.addColorStop(0, 'rgba(152, 202, 63, 0.4)')
        gradient.addColorStop(0.5, 'rgba(152, 202, 63, 0.1)')
        gradient.addColorStop(1, 'rgba(152, 202, 63, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = '#98CA3F'
        ctx.shadowColor = '#98CA3F'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    initNodes()
    window.addEventListener('resize', () => { resize(); initNodes() })
    canvas.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
