"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { updateConfig } from "@/features/config/configSlice"

export function LanguageToggle() {

  const config = useAppSelector((state) => state?.config);
  const { language } = useAppSelector((state) => state?.config);
  const dispatch = useAppDispatch();

  const languages = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Burmese",
      value: "my",
    },
  ]

  return (
    <Select value={config?.language} onValueChange={(e) => {
      // console.log(e)
      dispatch(updateConfig({ language: e }));
    }}>
      <SelectGroup>
        <SelectLabel className="ps-4">{language == "my" ? "ဘာသာစကား" : "Language"}</SelectLabel>
      </SelectGroup>
      <SelectTrigger className="w-full glass rounded-lg h-14 p-4 border border-border/50 font-bold glass-card hover:glass-card-light transition-colors dark:text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((s) => (
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