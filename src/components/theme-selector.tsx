"use client"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type ThemeColor = "purple" | "blue" | "green" | "red" | "yellow" | "pink"

interface ThemeSelectorProps {
  className?: string
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { themeColor, setThemeColor } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const colors: { name: ThemeColor; class: string; label: string }[] = [
    { name: "purple", class: "bg-purple-500", label: "Purple" },
    { name: "blue", class: "bg-blue-500", label: "Blue" },
    { name: "green", class: "bg-green-500", label: "Green" },
    { name: "red", class: "bg-red-500", label: "Red" },
    { name: "yellow", class: "bg-yellow-500", label: "Yellow" },
    { name: "pink", class: "bg-pink-500", label: "Pink" },
  ]

  const handleColorChange = (color: ThemeColor) => {
    console.log("Setting theme color to:", color)
    setThemeColor(color)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {colors.map((color) => (
        <button
          key={color.name}
          className={cn(
            "h-8 w-8 rounded-full cursor-pointer transition-all",
            color.class,
            themeColor === color.name && "ring-2 ring-offset-2 dark:ring-offset-gray-900",
          )}
          onClick={() => handleColorChange(color.name)}
          aria-label={`Set theme color to ${color.label}`}
        />
      ))}
    </div>
  )
}

