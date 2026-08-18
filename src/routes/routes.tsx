import BiddingPageLatest from "@/components/BiddingPageLatest";
import { lazy } from "react";
import { useAppSelector } from "@/app/hooks";
// import Home from "@/pages/home/index";
import Home from "@/pages/home/index";



const GamesPage = lazy(() => import("@/components/GamesPageNew"));
const GamesPageNewTesting = lazy(() => import("@/components/GamesPageNewTesting"));
const NotificationPage = lazy(() => import("@/components/NotificationJazz"));
const PlayGamesUpdatedNew = lazy(() => import("@/components/PlayGamesUpdatedNew"));
const TermsOfUsePage = lazy(() => import("@/components/TermsPageNew"));
const SettingsPageNewStatic = lazy(() => import("@/components/SettingsPageNewStatic"));
const PrivacyPolicyPageNew = lazy(() => import("@/components/PrivacyPolicyPageNew"));
const TournamentHistory = lazy(() => import("@/components/TournamentHistory"));
const ViewAllGames = lazy(() => import("@/components/ViewAllGamesNew"));
const LeaderboardJazzStatic = lazy(() => import("@/components/LeaderboardJazzStatic"));


const SPECIFIC_USER_PHONE = "959729081679";

const UserSpecificRoute = ({
  latest: LatestComponent,
  original: OriginalComponent,
}: {
  latest: React.ComponentType;
  original: React.ComponentType;
}) => {
  const { data: homeData } = useAppSelector((state) => state.home);
  const userPhone = homeData?.data?.userInfo?.user_phone;

  if (userPhone === SPECIFIC_USER_PHONE) {
    return <LatestComponent />;
  }
  return <OriginalComponent />;
};


import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LeaderboardJazzStatic2 from "@/components/LeaderboardJazzStatic2";
import LeaderboardJazzStatic4 from "@/components/LeaderboardJazzStatic4";
import LeaderboardJazzStatic5 from "@/components/LeaderboardJazzStatic5";
import SpinWheelUpdatedVoucher from "@/components/SpinWheelUpdatedVoucher";
import GamesPageNew from "@/components/GamesPageNew";
import SpinWheelUpdatedVoucher2 from "@/components/SpinWheelUpdatedVoucher2";
import SpinWheelUpdatedVoucher3 from "@/components/SpinWheelUpdatedVoucher3";
import HeroTournamentPageStatic from "@/components/HeroTournamentPageStatic";

const UserIdHandler = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const testId = searchParams.get("testId");
    if (testId) {
      try {
        const decodedId = atob(testId);
        if (decodedId) {
          localStorage.setItem("userId", decodedId);
        }
      } catch (error) {
        console.error("Error decoding testId in UserIdHandler:", error);
      }
    }
  }, [searchParams]);

  return null;
};

const routes = [
  {
    path: "/",
    element: (
      <>
        <UserIdHandler /> {/* runs once on `/` */}
        <Home /> {/* your API runs here */}
      </>
    ),
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/games/:game_id",
    element: <PlayGamesUpdatedNew />,
  },

  {
    path: "/notification",
    element: <NotificationPage />,
  },

  {
    path: "/spinandwin",
    element: <SpinWheelUpdatedVoucher3 />,
  },
  {
    path: "/settingsStatic",
    element: <SettingsPageNewStatic />,
  },
  {
    path: "/games",
    element: <GamesPageNewTesting />,
  },
  {
    path: "/games/viewAll",
    element: <ViewAllGames />,
  },
  {
    path: "/terms",
    element: <TermsOfUsePage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPageNew />,
  },
  {
    path: "/tournament-history",
    element: <TournamentHistory />,
  },
  {
    path: "/tournamentPageStatic",
    element: <HeroTournamentPageStatic />,
  },
  {
    path: "/leaderboardStatic",
    element: <LeaderboardJazzStatic />,
  },

];

export { routes };

