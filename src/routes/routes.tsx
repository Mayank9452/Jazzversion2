import BiddingPageLatest from "@/components/BiddingPageLatest";
import { lazy } from "react";
import { useAppSelector } from "@/app/hooks";
import Home from "@/pages/home/index";

const BiddingPage = lazy(() => import("@/components/BiddingPage"));
const DetailsPage = lazy(() => import("@/components/DetailsPage"));
const GamesPage = lazy(() => import("@/components/GamesPageNew"));
const LeaderboardPageNew = lazy(() => import("@/components/LeaderboardPageNew"));
const JazzLeaderboardNew = lazy(() => import("@/components/JazzLeaderboardNew"));
const NotificationPage = lazy(() => import("@/components/NotificationJazz"));
const PlayGamesUpdatedNew = lazy(() => import("@/components/PlayGamesUpdatedNew"));
const ProfilePage = lazy(() => import("@/components/ProfilePage"));
const TermsOfUsePage = lazy(() => import("@/components/TermsPageNew"));
const SettingsPageNew = lazy(() => import("@/components/SettingsPageNew"));
const SettingsPageNewStatic = lazy(() => import("@/components/SettingsPageNewStatic"));
const PrivacyPolicyPageNew = lazy(() => import("@/components/PrivacyPolicyPageNew"));
const TournamentHistory = lazy(() => import("@/components/TournamentHistory"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const Index = lazy(() => import("@/pages/home/index"));
const ViewAllGames = lazy(() => import("@/components/ViewAllGamesNew"));
const HeroTournamentPageNew = lazy(() => import("@/components/HeroTournamentPageNew"));
const HeroTournamentPageStatic = lazy(() => import("@/components/HeroTournamentPageStatic"));
const LeaderboardPage = lazy(() => import("@/pages/LeaderboardPage"));
const LeaderboardJazzStatic = lazy(() => import("@/components/LeaderboardJazzStatic"));
const LeaderboardJazzStatic3 = lazy(() => import("@/components/LeaderboardJazzStatic3"));

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

// const routes = [
//   { path: "/", element: <Index /> },
//   // { path: "/", element: <HomePage /> },
//   { path: "/dashboard", element: <HomePage /> },
//   {
//     path: "/games/:game_id",
//     element: <PlayGamesUpdatedNew />,
//   },
//   {
//     path: "/details",
//     element: <DetailsPage />,
//   },
//   {
//     path: "/leaderboard",
//     element: <LeaderboardPageNew />,
//   },
//   {
//     path: "/notification",
//     element: <NotificationPage />,
//   },
//   {
//     path: "/profile",
//     element: <ProfilePage />,
//   },
//   {
//     path: "/biddingPage",
//     element: <BiddingPageLatest />,
//   },
//   {
//     path: "/games",
//     element: <GamesPage />,
//   },
//   {
//     path: "/terms",
//     element: <TermsOfUsePage />,
//   },
// ];

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LeaderboardJazzStatic2 from "@/components/LeaderboardJazzStatic2";
import LeaderboardJazzStatic4 from "@/components/LeaderboardJazzStatic4";
import LeaderboardJazzStatic5 from "@/components/LeaderboardJazzStatic5";
import SpinWheelUpdatedVoucher from "@/components/SpinWheelUpdatedVoucher";

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
    path: "/details",
    element: <DetailsPage />,
  },
  {
    path: "/leaderboard",
    element: <JazzLeaderboardNew />,
  },
  {
    path: "/notification",
    element: <NotificationPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/settings",
    element: <SettingsPageNew />,
  },
  {
    path: "/spinandwin",
    element: <SpinWheelUpdatedVoucher />,
  },
  {
    path: "/settingsStatic",
    element: <SettingsPageNewStatic />,
  },
  {
    path: "/biddingPage",
    element: <BiddingPageLatest />,
  },
  {
    path: "/games",
    element: <GamesPage />,
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
    path: "/profile/privacy-policy",
    element: <PrivacyPolicyPageNew />,
  },
  {
    path: "/tournament-history",
    element: <TournamentHistory />,
  },
  {
    path: "/profile/tournamentHistory",
    element: <TournamentHistory />,
  },
  {
    path: "/tournamentPage",
    element: <HeroTournamentPageNew />,
  },
  {
    path: "/tournamentPageStatic",
    element: <HeroTournamentPageStatic />,
  },
  {
    path: "/leaderboardStatic",
    element: <LeaderboardJazzStatic />,
  },
  {
    path: "/leaderboardStatic2",
    element: <LeaderboardJazzStatic2 />,
  },
  {
    path: "/leaderboardPageStatic",
    element: <LeaderboardJazzStatic4 />,
  },
  {
    path: "/leaderboardStatic3",
    element: <LeaderboardJazzStatic3 />,
  },
  {
    path: "/leaderboardStatic4",
    element: <LeaderboardJazzStatic4 />,
  },
  {
    path: "/leaderboardStatic5",
    element: <LeaderboardJazzStatic5 />,
  },
  {
    path: "/LeaderBoard",
    element: <LeaderboardPage />,
  },
];

export { routes };

