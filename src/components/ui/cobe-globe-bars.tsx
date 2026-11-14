"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

export interface BarMarker {
  id: string
  location: [number, number]
  value?: number
  label: string
  review?: string
  city?: string
  author?: string
  company?: string
  rating?: number
}

export interface GlobeBarsProps {
  markers?: BarMarker[]
  className?: string
  speed?: number
  baseColor?: [number, number, number]
  markerColor?: [number, number, number]
  glowColor?: [number, number, number]
  arcColor?: [number, number, number]
  dark?: number
  activeMarkerId?: string
  onSelectMarker?: (marker: BarMarker) => void
  targetLocation?: [number, number] | null
}

const defaultMarkers: BarMarker[] = [
  { id: "bar-1", location: [37.77, -122.42], value: 99, label: "SF", review: "Exceptional speed and craft", city: "San Francisco" },
  { id: "bar-2", location: [40.71, -74.01], value: 96, label: "NYC", review: "Sub-5ms ultra-low latency", city: "New York" },
  { id: "bar-3", location: [51.51, -0.13], value: 94, label: "LDN", review: "Zero dropped frames in production", city: "London" },
  { id: "bar-4", location: [52.52, 13.40], value: 100, label: "BER", review: "Pixel-perfect modular design systems", city: "Berlin" },
  { id: "bar-5", location: [35.68, 139.65], value: 98, label: "TKY", review: "Flawless distributed architecture", city: "Tokyo" },
]

export function GlobeBars({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
  baseColor = [0.96, 0.94, 0.91],
  markerColor = [1, 0.82, 0],
  glowColor = [0.98, 0.96, 0.92],
  arcColor = [1, 0.82, 0],
  dark = 0,
  activeMarkerId,
  onSelectMarker,
  targetLocation = null,
}: GlobeBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [supportsAnchor, setSupportsAnchor] = useState(true)

  // Detect CSS Anchor Positioning support on mount
  useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports) {
      setSupportsAnchor(CSS.supports("position-anchor: --foo"))
    }
  }, [])

  // Smoothly rotate towards targetLocation when selected
  useEffect(() => {
    if (!targetLocation) return
    const [lat, lng] = targetLocation
    const targetPhi = -(lng * Math.PI) / 180 - Math.PI / 2
    const targetTheta = (lat * Math.PI) / 180
    phiOffsetRef.current = targetPhi
    thetaOffsetRef.current = targetTheta - 0.2
  }, [targetLocation])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    const canvas = canvasRef.current
    const container = containerRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let io: IntersectionObserver | null = null
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      // Create arcs connecting prominent hubs
      const arcs = [
        { from: markers[0]?.location || [37.77, -122.42], to: markers[1]?.location || [40.71, -74.01] },
        { from: markers[1]?.location || [40.71, -74.01], to: markers[2]?.location || [51.51, -0.13] },
        { from: markers[2]?.location || [51.51, -0.13], to: markers[3]?.location || [52.52, 13.40] },
        { from: markers[3]?.location || [52.52, 13.40], to: markers[4]?.location || [35.68, 139.65] },
      ]

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: dark ? 3.5 : 8.5,
        baseColor,
        markerColor,
        glowColor,
        markerElevation: 0,
        markers: markers.map((m) => ({ location: m.location, size: 0.03, id: m.id })),
        arcs,
        arcColor,
        arcWidth: 0.6,
        arcHeight: 0.3,
        opacity: 0.85,
      })

      let isVisible = false

      const markerElements = !supportsAnchor
        ? markers.map((m) => ({
            id: m.id,
            anchorEl: container.querySelector(`[style*="--cobe-${m.id}"]`) as HTMLElement | null,
            markerCard: container.querySelector(`[data-marker-id="${m.id}"]`) as HTMLElement | null,
          }))
        : []

      function animate() {
        if (!isVisible) {
          animationId = 0
          return
        }

        if (!isPausedRef.current) phi += speed
        globe?.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        })

        // Fallback for browsers lacking native CSS Anchor Positioning
        if (!supportsAnchor) {
          for (const { id, anchorEl, markerCard } of markerElements) {
            if (anchorEl && markerCard) {
              markerCard.style.left = anchorEl.style.left
              markerCard.style.top = anchorEl.style.top
              const isVis = canvas?.style.getPropertyValue(`--cobe-visible-${id}`)
              markerCard.style.opacity = isVis ? "1" : "0"
            }
          }
        }

        animationId = requestAnimationFrame(animate)
      }

      io = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting
          if (isVisible && !animationId) {
            animationId = requestAnimationFrame(animate)
          }
        },
        { rootMargin: "150px 0px" }
      )
      io.observe(container)

      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (io) io.disconnect()
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed, baseColor, markerColor, glowColor, arcColor, dark, supportsAnchor])

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square select-none ${className}`}
    >
      <style>{`
        @keyframes bar-fill { from { width: 0; } to { width: var(--value, 0%); } }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m) => {
        const isActive = activeMarkerId === m.id
        const displayText = m.review || m.label
        const rating = m.rating ?? 5

        return (
          <div
            key={m.id}
            data-marker-id={m.id}
            onClick={() => onSelectMarker?.(m)}
            role="button"
            tabIndex={0}
            className={`group cursor-pointer transition-all duration-300 ${
              isActive ? "z-30 scale-105" : "z-20 hover:scale-105"
            }`}
            style={{
              position: "absolute",
              positionAnchor: `--cobe-${m.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              translate: "-50% 0",
              marginBottom: 6,
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: "0.15rem",
              padding: "0.22rem 0.38rem",
              background: "#370232",
              border: isActive ? "1.5px solid #FFD000" : "1px solid rgba(255, 208, 0, 0.85)",
              borderRadius: 6,
              minWidth: 70,
              maxWidth: 105,
              boxShadow: isActive
                ? "0 0 16px rgba(255, 208, 0, 0.5), 0 6px 16px rgba(55, 2, 50, 0.5)"
                : "0 4px 14px rgba(55, 2, 50, 0.35)",
              opacity: `var(--cobe-visible-${m.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 6px))`,
              transition: "opacity 0.4s, filter 0.4s, transform 0.25s, border-color 0.2s, box-shadow 0.25s",
            }}
          >
            {/* Review Title (3-5 Words) */}
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.42rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                color: "#FFD000",
                textAlign: "center",
                lineHeight: 1.18,
              }}
            >
              {displayText}
            </span>

            {/* Stars Ranking */}
            <div
              style={{
                display: "flex",
                gap: "1.5px",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1px",
              }}
              aria-label={`${rating} star rating`}
            >
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <svg
                  key={starIndex}
                  viewBox="0 0 24 24"
                  fill={starIndex <= rating ? "#FFD000" : "rgba(255, 208, 0, 0.2)"}
                  stroke="none"
                  style={{
                    width: "7px",
                    height: "7px",
                    filter: "drop-shadow(0 0 1.5px rgba(255, 208, 0, 0.6))",
                  }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
