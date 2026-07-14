"use client";

import { TopBar } from "@/components/TopBar";
import { BottomNavBar } from "@/components/BottomNavBar";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

export default function TermsOfUsePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <>
      <TopBar />

      <div className="mobile-container py-4  pt-3 px-3">
        {/* Header */}
        <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#0a0f7ac4] to-pink-700 text-white rounded-xl px-3 pb-12 pt-3 shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 top-3 p-1 bg-white/95 hover:bg-white rounded-xl backdrop-blur-md transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-indigo-600" />
          </button>

          <h1 className="text-xl font-bold leading-relaxed">
            {t.termsHeader || "Terms of Use"}
          </h1>
        </div>

        {/* Content Card */}
        <div className="min-h-screen relative z-10 bg-white rounded-2xl shadow-xl py-6 pb-0 px-4 text-[14px] text-gray-900 -mt-10 mx-3 border border-gray-100">

          <p>
            {t.termsIntroPart1}{t.termsIntroBold && <b>{t.termsIntroBold}</b>}{t.termsIntroPart2}
          </p>

          <p>
            {t.termsAcceptance}
          </p>

          <p className="font-bold">
            {t.termsWarning}
          </p>

          <br />

          <ol className="list-decimal ml-4 space-y-2">
            <li>
              {t.termsPoint1}
            </li>

            <li>
              {t.termsPoint2Title}
              <ul className="list-[lower-alpha] ml-4">
                <li>
                  {t.termsPoint2A}
                </li>
                <li>
                  {t.termsPoint2B}
                </li>
              </ul>
              {t.termsPoint2Footer}
            </li>

            <li>
              {t.termsPoint3}
            </li>

            <li>
              {t.termsPoint4}
            </li>

            <li>
              {t.termsPoint5}
            </li>

            <li>
              {t.termsPoint6}
            </li>

            <li>
              {t.termsPoint7}
            </li>
          </ol>

          <br />
          <br />
        </div>
      </div>

      <BottomNavBar />
    </>
  );
}
