"use client";

import { useEffect, useRef, useState } from "react";

export default function BacteriaGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      try {
        const PhaserModule = await import("phaser");
        const Phaser: any = PhaserModule?.default ?? PhaserModule;

        if (gameRef.current) {
          try {
            gameRef.current.destroy(true);
          } catch (e) {
            console.warn("Error destroying previous Phaser game:", e);
          }
          gameRef.current = null;
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        const GAME_WIDTH = 800;
        const GAME_HEIGHT = 600;

        // Number of body segments trailing behind the head
        const BODY_SEGMENT_COUNT = 8;
        // Spacing between each segment (in pixels of delay)
        const SEGMENT_SPACING = 12;
        // How quickly the head moves toward the cursor
        const MOVE_SPEED = 220;

        const config: any = {
          type: Phaser.AUTO,
          parent: containerRef.current,
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: "#0a2a3a",
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0 },
              debug: false,
            },
          },
          scene: {
            preload: function (this: any) {
              // All textures created procedurally in create()
            },

            create: function (this: any) {
              // --- Draw water background with subtle grid ---
              const bg = this.add.graphics();
              // Dark water gradient feel
              bg.fillStyle(0x0a2a3a, 1);
              bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
              // Subtle grid lines to give sense of movement/scale
              bg.lineStyle(1, 0x0d3548, 0.4);
              for (let x = 0; x < GAME_WIDTH; x += 40) {
                bg.lineBetween(x, 0, x, GAME_HEIGHT);
              }
              for (let y = 0; y < GAME_HEIGHT; y += 40) {
                bg.lineBetween(0, y, GAME_WIDTH, y);
              }

              // --- Create bacteria head texture ---
              const headGfx = this.make.graphics({ x: 0, y: 0, add: false });
              // Outer membrane
              headGfx.fillStyle(0x4caf50, 1);
              headGfx.fillCircle(24, 24, 22);
              // Inner body lighter shade
              headGfx.fillStyle(0x66cc6a, 1);
              headGfx.fillCircle(22, 22, 14);
              // Nucleus
              headGfx.fillStyle(0x2e7d32, 1);
              headGfx.fillCircle(20, 20, 6);
              // Small organelle dots
              headGfx.fillStyle(0x81d4fa, 0.8);
              headGfx.fillCircle(30, 18, 3);
              headGfx.fillCircle(28, 30, 2);
              headGfx.generateTexture("bacteria_head", 48, 48);

              // --- Create body segment texture ---
              const bodyGfx = this.make.graphics({ x: 0, y: 0, add: false });
              bodyGfx.fillStyle(0x4caf50, 0.7);
              bodyGfx.fillCircle(12, 12, 10);
              bodyGfx.fillStyle(0x66cc6a, 0.5);
              bodyGfx.fillCircle(11, 11, 6);
              bodyGfx.generateTexture("bacteria_body", 24, 24);

              // --- Position history for trailing body segments ---
              this.positionHistory = [] as { x: number; y: number }[];

              // --- Create body segments (rendered behind the head) ---
              this.bodySegments = [] as any[];
              for (let i = BODY_SEGMENT_COUNT - 1; i >= 0; i--) {
                const scale = 0.95 - i * 0.07;
                const alpha = 0.9 - i * 0.07;
                const seg = this.add.image(
                  GAME_WIDTH / 2,
                  GAME_HEIGHT / 2,
                  "bacteria_body"
                );
                seg.setScale(Math.max(scale, 0.3));
                seg.setAlpha(Math.max(alpha, 0.3));
                this.bodySegments.push(seg);
              }

              // --- Create head sprite with physics ---
              this.bacteriaHead = this.physics.add.sprite(
                GAME_WIDTH / 2,
                GAME_HEIGHT / 2,
                "bacteria_head"
              );
              this.bacteriaHead.setCollideWorldBounds(true);
              this.bacteriaHead.setDrag(100);
              this.bacteriaHead.setMaxVelocity(MOVE_SPEED);

              // --- UI label ---
              this.add
                .text(10, 10, "Move your mouse to guide the bacteria", {
                  fontSize: "16px",
                  color: "#80cbc4",
                  fontFamily: "sans-serif",
                })
                .setScrollFactor(0);

              // Store constants for update
              this.MOVE_SPEED = MOVE_SPEED;
              this.SEGMENT_SPACING = SEGMENT_SPACING;
            },

            update: function (this: any) {
              const head = this.bacteriaHead;
              if (!head) return;

              const pointer = this.input.activePointer;
              const dx = pointer.worldX - head.x;
              const dy = pointer.worldY - head.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              // Move toward cursor if it's far enough away (dead zone to prevent jitter)
              if (dist > 8) {
                const angle = Math.atan2(dy, dx);
                // Scale speed so bacteria slows down near cursor
                const speedFactor = Math.min(dist / 100, 1);
                head.setVelocity(
                  Math.cos(angle) * this.MOVE_SPEED * speedFactor,
                  Math.sin(angle) * this.MOVE_SPEED * speedFactor
                );
                // Rotate head to face movement direction
                head.setRotation(angle);
              } else {
                head.setVelocity(0, 0);
              }

              // Record position history
              this.positionHistory.unshift({ x: head.x, y: head.y });
              // Keep only as many positions as we need
              const maxHistory =
                this.bodySegments.length * this.SEGMENT_SPACING + 1;
              if (this.positionHistory.length > maxHistory) {
                this.positionHistory.length = maxHistory;
              }

              // Place each body segment at a past position
              for (let i = 0; i < this.bodySegments.length; i++) {
                const index = (i + 1) * this.SEGMENT_SPACING;
                const pos = this.positionHistory[
                  Math.min(index, this.positionHistory.length - 1)
                ];
                if (pos) {
                  this.bodySegments[i].setPosition(pos.x, pos.y);
                }
              }
            },
          },
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
        };

        gameRef.current = new Phaser.Game(config);
      } catch (err: any) {
        const message = err?.message || String(err);
        console.error("BacteriaGame initialization error:", err);
        setError(message);
      }
    })();

    return () => {
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true);
        } catch (e) {
          console.error("Error destroying Phaser game:", e);
        }
        gameRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div
        style={{
          width: 800,
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fee",
        }}
      >
        <div style={{ color: "#900", maxWidth: 700 }}>
          <strong>Game initialization error:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: 800, height: 600 }} />;
}
