"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
type ThemeColor = "purple" | "blue" | "green" | "red" | "yellow" | "pink"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColor?: ThemeColor
}

type ThemeProviderState = {
  theme: Theme
  themeColor: ThemeColor
  setTheme: (theme: Theme) => void
  setThemeColor: (color: ThemeColor) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  themeColor: "purple",
  setTheme: () => null,
  setThemeColor: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColor = "purple",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [themeColor, setThemeColor] = useState<ThemeColor>(defaultColor)
  const [mounted, setMounted] = useState(false)

  // Apply the theme color to CSS variables
  const applyThemeColor = (color: ThemeColor) => {
    const root = document.documentElement
    const colors = getThemeColorValues(color)

    root.style.setProperty("--primary-light", colors.light)
    root.style.setProperty("--primary-dark", colors.dark)
  }

  // Apply the theme mode (light/dark)
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

    root.classList.remove("light", "dark")
    root.classList.add(theme === "system" ? systemTheme : theme)
  }

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedColor = localStorage.getItem("themeColor") as ThemeColor

    if (savedTheme) {
      setTheme(savedTheme)
    }

    if (savedColor) {
      setThemeColor(savedColor)
    }

    setMounted(true)
  }, [])

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return

    applyTheme(theme)
    localStorage.setItem("theme", theme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted, applyTheme])

  // Apply theme color changes
  useEffect(() => {
    if (!mounted) return

    applyThemeColor(themeColor)
    localStorage.setItem("themeColor", themeColor)
  }, [themeColor, mounted, applyThemeColor])

  // Prevent flash of incorrect theme
  useEffect(() => {
    if (!mounted) return

    applyTheme(theme)
    applyThemeColor(themeColor)
  }, [mounted, theme, themeColor, applyTheme, applyThemeColor])

  const value = {
    theme,
    themeColor,
    setTheme: (newTheme: Theme) => setTheme(newTheme),
    setThemeColor: (newColor: ThemeColor) => setThemeColor(newColor),
  }

  // Prevent flash of incorrect theme
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

function getThemeColorValues(color: ThemeColor): { light: string; dark: string } {
  switch (color) {
    case "purple":
      return { light: "hsl(265, 89%, 78%)", dark: "hsl(265, 89%, 60%)" }
    case "blue":
      return { light: "hsl(217, 91%, 60%)", dark: "hsl(217, 91%, 45%)" }
    case "green":
      return { light: "hsl(142, 76%, 45%)", dark: "hsl(142, 76%, 36%)" }
    case "red":
      return { light: "hsl(0, 84%, 60%)", dark: "hsl(0, 84%, 50%)" }
    case "yellow":
      return { light: "hsl(48, 96%, 53%)", dark: "hsl(48, 96%, 40%)" }
    case "pink":
      return { light: "hsl(330, 81%, 60%)", dark: "hsl(330, 81%, 50%)" }
    default:
      return { light: "hsl(265, 89%, 78%)", dark: "hsl(265, 89%, 60%)" }
  }
}

