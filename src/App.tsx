import React, { useEffect, useState, Suspense } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ThemeProvider } from "@/components/ThemeProvider";

import ScrollToTop from "./components/ScrollToTop";

import { routes } from "./routes/routes";

import {
  useAppDispatch,
  useAppSelector,
} from "./app/hooks";

import { fetchHomeData } from "./features/home/homeSlice";

import { fetchJazzHomeDataThunk } from "./features/jazzHome/jazzHomeSlice";

import Home from "./pages/home/index";

import PopupBannerUpdated from "./components/PopupBannerUpdated";


import AuctionLoader from "./components/Loader";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { status, data } = useAppSelector(
    (state) => state.home
  );

  const jazzHome = useAppSelector(
    (state) => state.jazzHome
  );

  const [authToken, setAuthToken] =
    useState<string | null>(null);

  // ✅ Capture testId once
  const [initialTestId] = useState(() => {
    const url = new URL(window.location.href);

    const urlTestId = url.searchParams.get("testId");

    if (urlTestId) {
      sessionStorage.setItem("testId", urlTestId);

      return urlTestId;
    }

    return sessionStorage.getItem("testId");
  });

  // ✅ Initial APIs
  useEffect(() => {
    let id = 1;

    if (initialTestId) {
      try {
        const decoded = atob(initialTestId);

        const parsed = parseInt(decoded, 10);

        if (!isNaN(parsed)) {
          id = parsed;
          localStorage.setItem("userId", String(id));
        }
      } catch {
        id = 1;
      }
    }

    // dispatch(fetchHomeData(id));

    // ✅ JAZZ API
    dispatch(fetchJazzHomeDataThunk(id));
  }, [dispatch, initialTestId]);

  // ✅ Clean URL
  useEffect(() => {
    if (status === "success" && initialTestId) {
      window.history.replaceState({}, "", "/");
    }
  }, [status, initialTestId]);

  // ✅ BidBlast auth
  useEffect(() => {
    const token = sessionStorage.getItem("auth");

    if (status === "success" && data?.data?.authToken) {
      setAuthToken(token);

      const popupShown =
        sessionStorage.getItem("popupShown");

      if (!popupShown) {
        sessionStorage.setItem(
          "popupShown",
          "true"
        );
      }
    }
  }, [status, data]);

  // ✅ JAZZ localStorage setup
  useEffect(() => {
    const jazzData = jazzHome?.data;

    if (
      jazzHome.status === "success" &&
      jazzData
    ) {
      localStorage.setItem(
        "authToken",
        jazzData?.authToken || ""
      );

      localStorage.setItem(
        "playCoins",
        jazzData?.userInfo?.user_play_coins || ""
      );

      localStorage.setItem(
        "username",
        jazzData?.userInfo?.user_name || ""
      );

      localStorage.setItem(
        "tournamentID",
        jazzData?.heroTournaments?.[0]
          ?.tournament_id || ""
      );

      // ✅ Update token in state to allow routing access for Jazz
      setAuthToken(jazzData?.authToken || "");
    }
  }, [jazzHome]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        <TooltipProvider>
          <Toaster />

          <Sonner />

          <div className="mobile-container overflow-hidden">
            <BrowserRouter>
              <ScrollToTop />

              {/* {authToken && (
                <PopupBannerUpdated />
              )} */}

              <Suspense
                fallback={<AuctionLoader />}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      authToken ? (
                        jazzHome?.data ? (
                          <Home />
                        ) : (
                          <Navigate
                            to="/dashboard"
                            replace
                          />
                        )
                      ) : (
                        <AuctionLoader />
                      )
                    }
                  />

                  {authToken &&
                    routes.map(
                      (item, index) => (
                        <Route
                          key={index}
                          path={item.path}
                          element={item.element}
                        />
                      )
                    )}

                  <Route
                    path="*"
                    element={<AuctionLoader />}
                  />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;