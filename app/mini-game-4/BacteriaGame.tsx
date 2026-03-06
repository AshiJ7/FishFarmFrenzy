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
        const BODY_SEGMENT_COUNT = 8;
        const SEGMENT_SPACING = 12;
        const MOVE_SPEED = 220;
        const MAX_NUTRIENTS = 6;
        // toxicity gained per second per waste item on screen
        const TOXICITY_RATE = 2;
        const MAX_TOXICITY = 100;

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
            preload: function (this: any) {},

            create: function (this: any) {
              // --- Background ---
              const bg = this.add.graphics();
              bg.fillStyle(0x0a2a3a, 1);
              bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
              bg.lineStyle(1, 0x0d3548, 0.4);
              for (let x = 0; x < GAME_WIDTH; x += 40) {
                bg.lineBetween(x, 0, x, GAME_HEIGHT);
              }
              for (let y = 0; y < GAME_HEIGHT; y += 40) {
                bg.lineBetween(0, y, GAME_WIDTH, y);
              }

              // --- Textures ---
              const headGfx = this.make.graphics({ x: 0, y: 0, add: false });
              headGfx.fillStyle(0x4caf50, 1);
              headGfx.fillCircle(24, 24, 22);
              headGfx.fillStyle(0x66cc6a, 1);
              headGfx.fillCircle(22, 22, 14);
              headGfx.fillStyle(0x2e7d32, 1);
              headGfx.fillCircle(20, 20, 6);
              headGfx.fillStyle(0x81d4fa, 0.8);
              headGfx.fillCircle(30, 18, 3);
              headGfx.fillCircle(28, 30, 2);
              headGfx.generateTexture("bacteria_head", 48, 48);

              const bodyGfx = this.make.graphics({ x: 0, y: 0, add: false });
              bodyGfx.fillStyle(0x4caf50, 0.7);
              bodyGfx.fillCircle(12, 12, 10);
              bodyGfx.fillStyle(0x66cc6a, 0.5);
              bodyGfx.fillCircle(11, 11, 6);
              bodyGfx.generateTexture("bacteria_body", 24, 24);

              // Nutrient (ammonia) — bright cyan
              const nutrientGfx = this.make.graphics({ x: 0, y: 0, add: false });
              nutrientGfx.fillStyle(0x00e5ff, 1);
              nutrientGfx.fillCircle(16, 16, 14);
              nutrientGfx.fillStyle(0x80f3ff, 1);
              nutrientGfx.fillCircle(11, 11, 6);
              nutrientGfx.generateTexture("nutrient", 32, 32);

              // Waste product — brown
              const wasteGfx = this.make.graphics({ x: 0, y: 0, add: false });
              wasteGfx.fillStyle(0x8d6e63, 1);
              wasteGfx.fillCircle(12, 12, 10);
              wasteGfx.fillStyle(0x6d4c41, 1);
              wasteGfx.fillCircle(9, 9, 5);
              wasteGfx.generateTexture("waste", 24, 24);

              // --- Spawn helpers (defined early so overlap callbacks can use them) ---
              this.spawnNutrient = () => {
                const margin = 50;
                const x = Phaser.Math.Between(margin, GAME_WIDTH - margin);
                const y = Phaser.Math.Between(margin, GAME_HEIGHT - margin);
                this.nutrientGroup.create(x, y, "nutrient");
              };

              this.spawnWaste = (x: number, y: number) => {
                const ox = Phaser.Math.Clamp(
                  x + Phaser.Math.Between(-40, 40),
                  20,
                  GAME_WIDTH - 20
                );
                const oy = Phaser.Math.Clamp(
                  y + Phaser.Math.Between(-40, 40),
                  20,
                  GAME_HEIGHT - 20
                );
                this.wasteGroup.create(ox, oy, "waste");
              };

              // --- Groups ---
              this.nutrientGroup = this.physics.add.staticGroup();
              this.wasteGroup = this.physics.add.staticGroup();

              // Spawn initial nutrients
              for (let i = 0; i < MAX_NUTRIENTS; i++) {
                this.spawnNutrient();
              }

              // --- Body segments (rendered before head) ---
              this.positionHistory = [] as { x: number; y: number }[];
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

              // --- Bacteria head ---
              this.bacteriaHead = this.physics.add.sprite(
                GAME_WIDTH / 2,
                GAME_HEIGHT / 2,
                "bacteria_head"
              );
              this.bacteriaHead.setCollideWorldBounds(true);
              this.bacteriaHead.setDrag(100);
              this.bacteriaHead.setMaxVelocity(MOVE_SPEED);

              // --- Overlaps ---
              this.physics.add.overlap(
                this.bacteriaHead,
                this.nutrientGroup,
                (head: any, nutrient: any) => {
                  nutrient.destroy();
                  this.score += 10;
                  this.scoreText.setText("Score: " + this.score);
                  this.spawnWaste(head.x, head.y);
                  this.spawnNutrient();
                },
                undefined,
                this
              );

              this.physics.add.overlap(
                this.bacteriaHead,
                this.wasteGroup,
                (_head: any, waste: any) => {
                  waste.destroy();
                  this.score += 5;
                  this.scoreText.setText("Score: " + this.score);
                },
                undefined,
                this
              );

              // --- Game state ---
              this.score = 0;
              this.toxicity = 0;
              this.gameOver = false;

              // --- UI ---
              this.scoreText = this.add
                .text(10, 10, "Score: 0", {
                  fontSize: "18px",
                  color: "#80cbc4",
                  fontFamily: "sans-serif",
                })
                .setScrollFactor(0);

              // Toxicity bar
              const toxBg = this.add.graphics();
              toxBg.fillStyle(0x333333, 1);
              toxBg.fillRect(GAME_WIDTH - 215, 10, 200, 20);

              this.toxicityBar = this.add.graphics();

              this.add.text(GAME_WIDTH - 215, 34, "Toxicity", {
                fontSize: "13px",
                color: "#ef9a9a",
                fontFamily: "sans-serif",
              });

              this.fishLabel = this.add
                .text(GAME_WIDTH / 2, 10, "Fish: Alive", {
                  fontSize: "16px",
                  color: "#80cbc4",
                  fontFamily: "sans-serif",
                })
                .setOrigin(0.5, 0);

              this.add.text(
                10,
                GAME_HEIGHT - 30,
                "Cyan = nutrients (+10pts)   Brown = waste (+5pts, reduces toxicity)",
                {
                  fontSize: "13px",
                  color: "#607d8b",
                  fontFamily: "sans-serif",
                }
              );

              // Store constants for update
              this.MOVE_SPEED = MOVE_SPEED;
              this.SEGMENT_SPACING = SEGMENT_SPACING;
              this.TOXICITY_RATE = TOXICITY_RATE;
              this.MAX_TOXICITY = MAX_TOXICITY;
              this.GAME_WIDTH = GAME_WIDTH;
              this.GAME_HEIGHT = GAME_HEIGHT;
            },

            update: function (this: any, _time: number, delta: number) {
              if (this.gameOver) return;

              const head = this.bacteriaHead;
              if (!head) return;

              // --- Move toward cursor ---
              const pointer = this.input.activePointer;
              const dx = pointer.worldX - head.x;
              const dy = pointer.worldY - head.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist > 8) {
                const angle = Math.atan2(dy, dx);
                const speedFactor = Math.min(dist / 100, 1);
                head.setVelocity(
                  Math.cos(angle) * this.MOVE_SPEED * speedFactor,
                  Math.sin(angle) * this.MOVE_SPEED * speedFactor
                );
                head.setRotation(angle);
              } else {
                head.setVelocity(0, 0);
              }

              // --- Body segments ---
              this.positionHistory.unshift({ x: head.x, y: head.y });
              const maxHistory =
                this.bodySegments.length * this.SEGMENT_SPACING + 1;
              if (this.positionHistory.length > maxHistory) {
                this.positionHistory.length = maxHistory;
              }
              for (let i = 0; i < this.bodySegments.length; i++) {
                const index = (i + 1) * this.SEGMENT_SPACING;
                const pos =
                  this.positionHistory[
                    Math.min(index, this.positionHistory.length - 1)
                  ];
                if (pos) {
                  this.bodySegments[i].setPosition(pos.x, pos.y);
                }
              }

              // --- Toxicity ---
              const wasteCount = this.wasteGroup.getChildren().length;
              if (wasteCount > 0) {
                this.toxicity += (this.TOXICITY_RATE * wasteCount * delta) / 1000;
              }
              this.toxicity = Math.min(this.toxicity, this.MAX_TOXICITY);

              // Redraw toxicity bar
              this.toxicityBar.clear();
              const barWidth = (this.toxicity / this.MAX_TOXICITY) * 200;
              const barColor =
                this.toxicity > 70
                  ? 0xff1744
                  : this.toxicity > 40
                  ? 0xffa726
                  : 0x66bb6a;
              this.toxicityBar.fillStyle(barColor, 1);
              this.toxicityBar.fillRect(
                this.GAME_WIDTH - 215,
                10,
                barWidth,
                20
              );

              // --- Game over ---
              if (this.toxicity >= this.MAX_TOXICITY) {
                this.gameOver = true;
                this.bacteriaHead.setVelocity(0, 0);
                this.fishLabel.setText("Fish: DEAD").setColor("#ff1744");
                this.add
                  .text(
                    this.GAME_WIDTH / 2,
                    this.GAME_HEIGHT / 2,
                    "GAME OVER\nThe fish died from toxicity!\nFinal Score: " +
                      this.score,
                    {
                      fontSize: "32px",
                      color: "#ff1744",
                      fontFamily: "sans-serif",
                      align: "center",
                    }
                  )
                  .setOrigin(0.5);
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
