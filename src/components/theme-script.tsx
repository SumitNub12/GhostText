"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect } from "react"

// This component applies the theme class to the body element
export function ThemeScript() {
  const { themeColor } = useTheme()

  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove(
      "theme-purple",
      "theme-blue",
      "theme-green",
      "theme-red",
      "theme-yellow",
      "theme-pink",
    )

    // Add the current theme class
    document.body.classList.add(`theme-${themeColor}`)

    console.log("Applied theme class:", `theme-${themeColor}`)
  }, [themeColor])

  return null
}

