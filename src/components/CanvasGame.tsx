import React, { useEffect, useRef } from "react";
import { useLanguage } from "./context/LanguageContext";

const CanvasGame = React.memo(() => {
  const { t } = useLanguage();
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  // Performance-focused refs
  const gameWidthRef = useRef(0);
  const gameHeightRef = useRef(0);
  const dprRef = useRef(1);

  const player = useRef({
    x: 30,
    y: 60,
    width: 20,
    height: 20,
    dy: 0,
    jumpForce: 8.5,
    grounded: false,
  });

  const obstacles = useRef<
    {
      x: number;
      y: number;
      width: number;
      height: number;
      passed: boolean;
      isBig?: boolean;
    }[]
  >([]);

  const clouds = useRef<{ x: number; y: number; speed: number }[]>([]);
  const framesSinceLastObstacle = useRef(0);
  const cloudTimer = useRef(0);
  const nextObstacleDelay = useRef(60 + Math.floor(Math.random() * 61));
  const isGamePaused = useRef(false);
  const restartTimeoutRef = useRef<number>();
  const isVisible = useRef(true);

  const resetGame = () => {
    obstacles.current = [];
    clouds.current = [];
    player.current.y = 60;
    player.current.dy = 0;
    player.current.grounded = false;
    framesSinceLastObstacle.current = 0;
    cloudTimer.current = 0;
    nextObstacleDelay.current = 80 + Math.floor(Math.random() * 81);
    scoreRef.current = 0;
    lastTimeRef.current = 0;
  };

  const handleCollision = () => {
    isGamePaused.current = true;
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = window.setTimeout(() => {
      resetGame();
      isGamePaused.current = false;
    }, 2000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleCanvas = () => {
      // CAP DPR at 2.0 for performance on high-end mobile screens
      const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      dprRef.current = dpr;
      gameWidthRef.current = rect.width;
      gameHeightRef.current = rect.height;
      
      ctx.scale(dpr, dpr);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible.current;
        isVisible.current = entry.isIntersecting;
        if (isVisible.current && !wasVisible) {
          lastTimeRef.current = performance.now();
          gameLoopRef.current = requestAnimationFrame(update);
        } else if (!isVisible.current && gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const resize = () => {
      if (canvas.offsetWidth) {
        scaleCanvas();
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const update = (currentTime: number) => {
      if (!isVisible.current) return;

      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = (currentTime - lastTimeRef.current) / 16.67; 
      lastTimeRef.current = currentTime;

      const width = gameWidthRef.current;
      const height = gameHeightRef.current;
      const groundY = height - 10;

      // 1. Clear the canvas
      ctx.clearRect(0, 0, width, height);

      if (!isGamePaused.current) {
        // Player Physics
        player.current.dy += 0.35 * deltaTime;
        player.current.y += player.current.dy * deltaTime;
        
        if (player.current.y + player.current.height > groundY) {
          player.current.y = groundY - player.current.height;
          player.current.dy = 0;
          player.current.grounded = true;
        }

        // Cloud Generation
        cloudTimer.current += deltaTime;
        if (cloudTimer.current > 120) {
          clouds.current.push({
            x: width,
            y: 10 + Math.random() * 30,
            speed: 0.3 + Math.random() * 0.4
          });
          cloudTimer.current = 0;
        }

        // Obstacle Generation
        framesSinceLastObstacle.current += deltaTime;
        if (framesSinceLastObstacle.current >= nextObstacleDelay.current) {
          const h = 14 + Math.random() * 18;
          obstacles.current.push({
            x: width,
            y: groundY - h,
            width: 14,
            height: h,
            passed: false,
            isBig: h > 24,
          });
          framesSinceLastObstacle.current = 0;
          nextObstacleDelay.current = 80 + Math.floor(Math.random() * 81);
        }
      }

      // 2. Batch Draw Clouds
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      for (let i = clouds.current.length - 1; i >= 0; i--) {
        const cloud = clouds.current[i];
        if (!isGamePaused.current) cloud.x -= cloud.speed * deltaTime;
        
        ctx.rect(cloud.x, cloud.y, 20, 6);
        ctx.rect(cloud.x + 5, cloud.y - 3, 10, 3);
        
        if (cloud.x < -30) clouds.current.splice(i, 1);
      }
      ctx.fill();

      // 3. Draw Ground
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // 4. Draw Player
      ctx.fillStyle = isGamePaused.current ? "#ff4444" : "#ffffff";
      ctx.beginPath();
      // @ts-ignore
      if (ctx.roundRect) {
        // @ts-ignore
        ctx.roundRect(player.current.x, player.current.y, player.current.width, player.current.height, 5);
      } else {
        ctx.rect(player.current.x, player.current.y, player.current.width, player.current.height);
      }
      ctx.fill();

      // 5. Batch Draw Obstacles & Logic
      const speed = isGamePaused.current ? 0 : 2.6 + scoreRef.current * 0.05;
      const p = player.current;
      const padding = 2;
      
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      for (let i = obstacles.current.length - 1; i >= 0; i--) {
        const obs = obstacles.current[i];
        if (!isGamePaused.current) {
          obs.x -= speed * deltaTime;
          
          // Collision Check
          if (p.x + padding < obs.x + obs.width && p.x + p.width - padding > obs.x &&
              p.y + padding < obs.y + obs.height && p.y + p.height - padding > obs.y) {
            handleCollision();
          }

          // Score check
          if (!obs.passed && obs.x + obs.width < p.x) {
            obs.passed = true;
            scoreRef.current++;
          }
        }
        
        // Draw path
        // @ts-ignore
        if (ctx.roundRect) {
          // @ts-ignore
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 3);
        } else {
          ctx.rect(obs.x, obs.y, obs.width, obs.height);
        }

        if (obs.x + obs.width < -50) obstacles.current.splice(i, 1);
      }
      ctx.fill();

      // Auto Jump AI
      if (player.current.grounded && !isGamePaused.current) {
        const nextObs = obstacles.current.find(o => o.x > player.current.x && o.x - player.current.x < 55);
        if (nextObs && Math.random() > 0.25) {
          player.current.dy = -player.current.jumpForce;
          player.current.grounded = false;
        }
      }

      // 6. Draw UI (Score & Overlay)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px 'Atom Sans', sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(`${tRef.current.score || "SCORE"}: ${scoreRef.current}`, width - 10, 10);

      if (isGamePaused.current) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px 'Atom Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tRef.current.gameOver || "GAME OVER", width / 2, height / 2 - 10);
        ctx.font = "10px 'Atom Sans', sans-serif";
        ctx.fillText(tRef.current.restarting || "RESTARTING...", width / 2, height / 2 + 10);
      }

      gameLoopRef.current = requestAnimationFrame(update);
    };

    gameLoopRef.current = requestAnimationFrame(update);
    return () => {
      observer.disconnect();
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full" 
      style={{ touchAction: 'none' }} 
    />
  );
});

export default CanvasGame;

