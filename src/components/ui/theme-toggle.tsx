"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"
import { useAppSelector } from "@/app/hooks"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { language } = useAppSelector((state)=>state?.config);

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9">
        <Sun className="h-[1.2rem] w-[1.2rem] " />
      </Button>
    )
  }

  const themes = [
    {
      label: language == "my" ? "အမှောင် အပြင်အဆင်" : "Dark Theme",
      value: "light",
    },
    {
      label: language == "my" ? "အလင်းအပြင်အဆင်" : "Light Theme",
      value: "dark",
    },
  ]
  
  return (
    <Select value={theme} onValueChange={(e)=>setTheme(e)}>
      <SelectGroup>
        <SelectLabel className="ps-4">{language == "my"?"ဒီဇိုင်း":"Theme"}</SelectLabel>
      </SelectGroup>
      <SelectTrigger className="w-full glass rounded-lg h-14 p-4 border border-border/50 font-bold glass-card hover:glass-card-light transition-colors dark:text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {themes.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            <div>
              {s.label} 
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}