import React, { useEffect, useRef, useState } from "react";
import { playGameApi, playLiveTournament, updateLiveTournamentScore } from "../../apiServices/igplApi";

interface GameViewerNewProps {
  fromGame?: boolean
  url: string;
  name?: string;
  orientation: "Portrait" | "Landscape";
  onClose: () => void;
  game?: any;
}

const GameViewerNew: React.FC<GameViewerNewProps> = ({ fromGame, url, name, orientation, onClose, game }) => {
  console.log("GameViewerNew props:", url);
  const [dimensions, setDimensions] = useState({ width: 360, height: 640 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);



  const containerRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const checkIsMobile = () => {
      const mobileWidthThreshold = 768;
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileRegex = /android|iphone|ipad|ipod|webos|blackberry|windows phone/;
      return window.innerWidth <= mobileWidthThreshold || mobileRegex.test(userAgent);
    };

    setIsMobile(checkIsMobile());

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.visualViewport?.height || window.innerHeight;

      const aspectRatioPortrait = 360 / 640;
      const aspectRatioLandscape = 640 / 360;

      if (checkIsMobile()) {
        setDimensions({ width: screenWidth, height: screenHeight });
      } else {
        if (orientation.toLowerCase() === "portrait") {
          let width = screenWidth * 0.9;
          let height = width / aspectRatioPortrait;

          if (height > screenHeight * 0.9) {
            height = screenHeight * 0.9;
            width = height * aspectRatioPortrait;
          }

          setDimensions({ width, height });
        } else {
          let width = screenWidth * 0.95;
          let height = width / aspectRatioLandscape;

          if (height > screenHeight * 0.95) {
            height = screenHeight * 0.95;
            width = height * aspectRatioLandscape;
          }

          setDimensions({ width, height });
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleVisualViewportResize = () => {
      if (checkIsMobile()) {
        const visualWidth = window.visualViewport?.width || window.innerWidth;
        const visualHeight = window.visualViewport?.height || window.innerHeight;
        setDimensions({ width: visualWidth, height: visualHeight });
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleVisualViewportResize);
    }

    const onFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleVisualViewportResize);
      }
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, [orientation]);

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!document.fullscreenElement && element) {
      element.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };


  const updateTournamentScore = async () => {
    try {
      const response = await updateLiveTournamentScore(
        game?.tournament_id,
        game?.gameInfo?.game_gameboost_id,
        game?.player_profile_id
      );
      if (response?.status) {
        // console.log("Live Tournament fetched successfully:", response?.data);
      } 
      // else {
      //   console.error("Failed to fetch Live Tournament API");
      // }
    } catch (error) {
      console.error("Error fetching Live Tournament:", error);
    } finally {
      onClose();
    }
  };

  const handleCloseFrame = () => {
    if(fromGame){
      onClose();
    } else{
      updateTournamentScore();
    }
  }


  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        zIndex: 9999,
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden",
        padding: isMobile ? "0" : "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: isMobile ? "100vw" : `${dimensions.width}px`,
          maxWidth: "100%",
          height: "40px",
          backgroundColor: "#1a1a1a",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          borderTopLeftRadius: isMobile ? "0" : "12px",
          borderTopRightRadius: isMobile ? "0" : "12px",
          fontSize: "14px",
          position: "relative",
          zIndex: 10000,
        }}
      >
        <span className="btn rounded px-2 py-0" style={{ cursor: "pointer", fontSize: "12px", border: "1px solid white" }} onClick={handleCloseFrame}>
          <i className="bi bi-arrow-left-short text-white" style={{ fontSize: "16px" }}></i>
        </span>
        <span style={{ fontWeight: "bold" }}>{name}</span>
        <span
          style={{ cursor: "pointer", fontSize: "18px" }}
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <i className={isFullscreen ? "bi bi-fullscreen" : "bi bi-fullscreen"}></i>
        </span>
      </div>

      {/* Iframe */}
      <div
        style={{
          width: isMobile ? "100vw" : `${dimensions.width}px`,
          height: isMobile ? `calc(100vh - 40px)` : `${dimensions.height}px`,
          maxWidth: "100%",
          maxHeight: "100%",
          boxShadow: isMobile ? "none" : "0 0 10px rgba(255,255,255,0.3)",
          borderBottomLeftRadius: isMobile ? "0" : "12px",
          borderBottomRightRadius: isMobile ? "0" : "12px",
          overflow: "hidden",
          flex: isMobile ? "1 1 auto" : "none",
        }}
      >
        <iframe
          id="game-iframe"
          src={url}
          title="Game Viewer"
          width="100%"
          height="100%"
          style={{ border: "none", display: "block" }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default GameViewerNew;