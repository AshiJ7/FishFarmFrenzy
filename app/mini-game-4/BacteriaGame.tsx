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
          try { gameRef.current.destroy(true); } catch {}
          gameRef.current = null;
        }
        if (containerRef.current) containerRef.current.innerHTML = "";

        // ── Constants ──────────────────────────────────────────────────
        const GW = 800, GH = 600;
        const PLANT_H = 90;   // plant zone: y 0..90
        const UI_H = 90;      // ui bar:     y 510..600
        const WATER_TOP = PLANT_H;          // 90
        const WATER_BOT = GH - UI_H;        // 510
        const BODY_SEGS = 8;
        const SEG_SPACE = 14;
        const SPEED = 220;
        const PLANT_COUNT = 3;
        const GROWTH_MAX = 5;

        const config: any = {
          type: Phaser.AUTO,
          parent: containerRef.current,
          width: GW,
          height: GH,
          physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
          scene: {
            preload() {},

            create(this: any) {
              // Store constants on scene
              this.GW = GW; this.GH = GH;
              this.WATER_TOP = WATER_TOP; this.WATER_BOT = WATER_BOT;
              this.SPEED = SPEED; this.SEG_SPACE = SEG_SPACE;
              this.activeBacteria = "ns"; // "ns" | "nb"
              this.score = 0;
              this.totalGrown = 0;

              // ── Background ──────────────────────────────────────────
              const bg = this.add.graphics().setDepth(0);

              // Plant zone
              bg.fillStyle(0x0d2a18, 1);
              bg.fillRect(0, 0, GW, PLANT_H);

              // Water column
              bg.fillStyle(0x0a1f35, 1);
              bg.fillRect(0, WATER_TOP, GW, WATER_BOT - WATER_TOP);

              // Subtle grid
              bg.lineStyle(1, 0x1a3d5c, 0.35);
              for (let x = 0; x <= GW; x += 50) bg.lineBetween(x, WATER_TOP, x, WATER_BOT);
              for (let y = WATER_TOP; y <= WATER_BOT; y += 50) bg.lineBetween(0, y, GW, y);

              // UI bar
              bg.fillStyle(0x06100f, 1);
              bg.fillRect(0, WATER_BOT, GW, UI_H);

              // Zone dividers
              bg.lineStyle(2, 0x2a8060, 1);
              bg.lineBetween(0, WATER_TOP, GW, WATER_TOP);
              bg.lineBetween(0, WATER_BOT, GW, WATER_BOT);

              // Soil beds and static root lines (drawn once in bg)
              const plantXs: number[] = [];
              for (let i = 0; i < PLANT_COUNT; i++) {
                const px = Math.round((GW / PLANT_COUNT) * (i + 0.5));
                plantXs.push(px);
                bg.fillStyle(0x5c3a1a, 1);
                bg.fillRect(px - 38, 2, 76, 20);
                bg.lineStyle(2, 0x7a5a30, 0.7);
                bg.lineBetween(px, 22, px, WATER_TOP + 45);
              }

              // ── Texture factory ────────────────────────────────────
              const mkTex = (fn: (g: any) => void, key: string, w: number, h: number) => {
                const g = this.make.graphics({ x: 0, y: 0, add: false });
                fn(g);
                g.generateTexture(key, w, h);
                g.destroy();
              };

              // Nitrosomonas head (green)
              mkTex(g => {
                g.fillStyle(0x1a7a40, 1); g.fillCircle(20, 20, 19);
                g.fillStyle(0x27ae60, 1); g.fillCircle(20, 20, 13);
                g.fillStyle(0x2ecc71, 1); g.fillCircle(20, 20, 7);
                g.fillStyle(0xabebc6, 0.8); g.fillCircle(26, 14, 4);
              }, "ns_head", 40, 40);

              mkTex(g => {
                g.fillStyle(0x1e8449, 0.9); g.fillCircle(10, 10, 9);
                g.fillStyle(0x27ae60, 0.6); g.fillCircle(9, 9, 5);
              }, "ns_body", 20, 20);

              // Nitrobacter head (blue/purple)
              mkTex(g => {
                g.fillStyle(0x5b2c6f, 1); g.fillCircle(20, 20, 19);
                g.fillStyle(0x7d3c98, 1); g.fillCircle(20, 20, 13);
                g.fillStyle(0x9b59b6, 1); g.fillCircle(20, 20, 7);
                g.fillStyle(0xe8daef, 0.8); g.fillCircle(26, 14, 4);
              }, "nb_head", 40, 40);

              mkTex(g => {
                g.fillStyle(0x6c3483, 0.9); g.fillCircle(10, 10, 9);
                g.fillStyle(0x8e44ad, 0.6); g.fillCircle(9, 9, 5);
              }, "nb_body", 20, 20);

              // Ammonia NH3 (red/orange)
              mkTex(g => {
                g.fillStyle(0x922b21, 1); g.fillCircle(16, 16, 15);
                g.fillStyle(0xe74c3c, 1); g.fillCircle(14, 13, 9);
                g.fillStyle(0xf1948a, 0.7); g.fillCircle(11, 10, 4);
              }, "ammonia", 32, 32);

              // Nitrite NO2 (yellow)
              mkTex(g => {
                g.fillStyle(0xb7950b, 1); g.fillCircle(14, 14, 13);
                g.fillStyle(0xffd966, 1); g.fillCircle(12, 12, 8);
                g.fillStyle(0xfff0a0, 0.7); g.fillCircle(10, 10, 4);
              }, "nitrite", 28, 28);

              // Nitrate NO3 (green)
              mkTex(g => {
                g.fillStyle(0x1a5e30, 1); g.fillCircle(13, 13, 12);
                g.fillStyle(0x27ae60, 1); g.fillCircle(11, 11, 7);
                g.fillStyle(0xa9dfbf, 0.7); g.fillCircle(9, 9, 3);
              }, "nitrate", 26, 26);

              // Fish (simple tilapia silhouette)
              mkTex(g => {
                g.fillStyle(0x1a6b8a, 0.6);
                g.fillEllipse(24, 14, 36, 18);
                g.fillStyle(0x1a6b8a, 0.55);
                g.fillTriangle(38, 14, 52, 6, 52, 22);
                g.fillStyle(0x0d4a6a, 0.55);
                g.fillCircle(14, 11, 3);
                g.fillStyle(0x7fb3c8, 0.3);
                g.fillEllipse(22, 11, 14, 6);
              }, "fish", 56, 28);

              // ── Plants ──────────────────────────────────────────────
              this.plants = plantXs.map((px: number) => ({
                x: px,
                growth: 0,
                gfx: this.add.graphics().setDepth(1),
              }));

              this.drawPlants = () => {
                for (const p of this.plants) {
                  p.gfx.clear();
                  const x = p.x;
                  const g = p.growth;
                  if (g === 0) {
                    p.gfx.fillStyle(0x27ae60, 1);
                    p.gfx.fillRect(x - 1, 14, 2, 6);
                  } else if (g === 1) {
                    p.gfx.fillStyle(0x27ae60, 1);
                    p.gfx.fillRect(x - 1, 8, 2, 12);
                    p.gfx.fillEllipse(x, 8, 16, 10);
                  } else if (g === 2) {
                    p.gfx.fillStyle(0x1e8449, 1);
                    p.gfx.fillRect(x - 1, 5, 2, 15);
                    p.gfx.fillEllipse(x - 9, 10, 18, 12);
                    p.gfx.fillEllipse(x + 9, 10, 18, 12);
                  } else if (g === 3) {
                    p.gfx.fillStyle(0x196f3d, 1);
                    p.gfx.fillRect(x - 1, 2, 2, 18);
                    p.gfx.fillEllipse(x, 4, 24, 16);
                    p.gfx.fillEllipse(x - 11, 12, 17, 13);
                    p.gfx.fillEllipse(x + 11, 12, 17, 13);
                  } else if (g === 4) {
                    p.gfx.fillStyle(0x145a32, 1);
                    p.gfx.fillRect(x - 1, 1, 2, 19);
                    p.gfx.fillEllipse(x, 3, 28, 18);
                    p.gfx.fillEllipse(x - 13, 11, 18, 14);
                    p.gfx.fillEllipse(x + 13, 11, 18, 14);
                    p.gfx.fillStyle(0xf9c400, 1);
                    p.gfx.fillCircle(x, 1, 4);
                  } else {
                    // Fully grown
                    p.gfx.fillStyle(0x0f4225, 1);
                    p.gfx.fillRect(x - 1, 0, 2, 20);
                    p.gfx.fillEllipse(x, 2, 34, 22);
                    p.gfx.fillEllipse(x - 15, 12, 20, 16);
                    p.gfx.fillEllipse(x + 15, 12, 20, 16);
                    p.gfx.fillStyle(0xf9c400, 1);
                    p.gfx.fillCircle(x, 0, 5);
                    p.gfx.fillCircle(x - 11, 4, 3);
                    p.gfx.fillCircle(x + 11, 4, 3);
                  }
                }
              };
              this.drawPlants();

              // ── Fish ────────────────────────────────────────────────
              this.fishes = [
                { spr: this.add.image(140, 220, "fish").setDepth(1).setAlpha(0.45), dir: 1, spd: 33 },
                { spr: this.add.image(520, 360, "fish").setDepth(1).setAlpha(0.45).setFlipX(true), dir: -1, spd: 26 },
                { spr: this.add.image(310, 455, "fish").setDepth(1).setAlpha(0.45), dir: 1, spd: 40 },
              ];

              // ── Physics groups ──────────────────────────────────────
              this.ammoniaGroup = this.physics.add.staticGroup();
              this.nitriteGroup = this.physics.add.staticGroup();
              this.nitrateGroup = this.physics.add.group();

              // ── Molecule helpers ────────────────────────────────────
              this.spawnAmmonia = () => {
                const x = Phaser.Math.Between(50, GW - 50);
                const y = Phaser.Math.Between(WATER_TOP + 45, WATER_BOT - 45);
                const spr = this.ammoniaGroup.create(x, y, "ammonia").setDepth(2);
                spr.label = this.add.text(x, y - 22, "NH₃", {
                  fontSize: "11px", color: "#f1948a",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5).setDepth(3);
              };

              this.dropNitrite = (ox: number, oy: number) => {
                const x = Phaser.Math.Clamp(ox + Phaser.Math.Between(-28, 28), 30, GW - 30);
                const y = Phaser.Math.Clamp(oy + Phaser.Math.Between(-18, 18), WATER_TOP + 25, WATER_BOT - 25);
                const spr = this.nitriteGroup.create(x, y, "nitrite").setDepth(2);
                spr.label = this.add.text(x, y - 20, "NO₂⁻", {
                  fontSize: "11px", color: "#ffd966",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5).setDepth(3);
              };

              this.dropNitrate = (x: number, y: number) => {
                const spr = this.nitrateGroup.create(x, y, "nitrate").setDepth(2);
                spr.label = this.add.text(x, y - 18, "NO₃⁻", {
                  fontSize: "11px", color: "#27ae60",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5).setDepth(3);
                spr.setVelocityY(-65);
              };

              // Spawn 5 initial ammonia
              for (let i = 0; i < 5; i++) this.spawnAmmonia();

              // ── Bacteria A: Nitrosomonas ─────────────────────────────
              // segs[0] = near head (big/bright), segs[7] = tail (small/dim)
              this.histA = [] as { x: number; y: number }[];
              this.segsA = [] as any[];
              for (let i = 0; i < BODY_SEGS; i++) {
                const s = this.add.image(200, 300, "ns_body")
                  .setScale(Math.max(0.95 - i * 0.07, 0.3))
                  .setAlpha(Math.max(0.9 - i * 0.07, 0.3))
                  .setDepth(4 - i * 0.1); // near-head renders on top
                this.segsA.push(s);
              }
              this.headA = this.physics.add.sprite(200, 300, "ns_head")
                .setMaxVelocity(SPEED).setDepth(5);

              // ── Bacteria B: Nitrobacter ──────────────────────────────
              this.histB = [] as { x: number; y: number }[];
              this.segsB = [] as any[];
              for (let i = 0; i < BODY_SEGS; i++) {
                const s = this.add.image(600, 300, "nb_body")
                  .setScale(Math.max(0.95 - i * 0.07, 0.3))
                  .setAlpha(0.28) // starts dimmed
                  .setDepth(4 - i * 0.1);
                this.segsB.push(s);
              }
              this.headB = this.physics.add.sprite(600, 300, "nb_head")
                .setMaxVelocity(SPEED).setAlpha(0.3).setDepth(5);

              // ── Overlaps ────────────────────────────────────────────
              // Nitrosomonas eats ammonia → drops nitrite
              this.physics.add.overlap(this.headA, this.ammoniaGroup,
                (head: any, spr: any) => {
                  if (this.activeBacteria !== "ns") return;
                  if (spr.label) spr.label.destroy();
                  spr.destroy();
                  this.score += 10;
                  this.scoreText.setText("Score: " + this.score);
                  this.dropNitrite(head.x, head.y);
                }, undefined, this);

              // Nitrobacter eats nitrite → drops nitrate
              this.physics.add.overlap(this.headB, this.nitriteGroup,
                (head: any, spr: any) => {
                  if (this.activeBacteria !== "nb") return;
                  if (spr.label) spr.label.destroy();
                  spr.destroy();
                  this.score += 15;
                  this.scoreText.setText("Score: " + this.score);
                  this.dropNitrate(head.x, head.y);
                }, undefined, this);

              // ── Switch mechanic ─────────────────────────────────────
              this.updateUI = () => {
                if (this.activeBacteria === "ns") {
                  this.activeText.setText("Active: Nitrosomonas  ·  Eats: NH₃ → NO₂⁻");
                  this.activeText.setStyle({ color: "#2ecc71" });
                } else {
                  this.activeText.setText("Active: Nitrobacter  ·  Eats: NO₂⁻ → NO₃⁻");
                  this.activeText.setStyle({ color: "#bb8fce" });
                }
              };

              this.doSwitch = () => {
                if (this.activeBacteria === "ns") {
                  this.activeBacteria = "nb";
                  this.headA.setVelocity(0, 0);
                  this.headA.setAlpha(0.3);
                  this.segsA.forEach((s: any) => s.setAlpha(0.28));
                  this.headB.setAlpha(1.0);
                  this.segsB.forEach((s: any, i: number) =>
                    s.setAlpha(Math.max(0.9 - i * 0.07, 0.3))
                  );
                } else {
                  this.activeBacteria = "ns";
                  this.headB.setVelocity(0, 0);
                  this.headB.setAlpha(0.3);
                  this.segsB.forEach((s: any) => s.setAlpha(0.28));
                  this.headA.setAlpha(1.0);
                  this.segsA.forEach((s: any, i: number) =>
                    s.setAlpha(Math.max(0.9 - i * 0.07, 0.3))
                  );
                }
                this.updateUI();
              };

              const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
              spaceKey.on("down", () => this.doSwitch());

              // ── UI Bar ──────────────────────────────────────────────
              this.scoreText = this.add.text(12, WATER_BOT + 8, "Score: 0", {
                fontSize: "16px", color: "#7ef0a8",
                fontFamily: "Nunito, sans-serif", fontStyle: "bold",
              }).setDepth(10);

              this.plantsText = this.add.text(12, WATER_BOT + 32, "Plants fully grown: 0", {
                fontSize: "12px", color: "#7ef0a8",
                fontFamily: "Nunito, sans-serif",
              }).setDepth(10);

              this.activeText = this.add.text(GW / 2, WATER_BOT + 8,
                "Active: Nitrosomonas  ·  Eats: NH₃ → NO₂⁻", {
                  fontSize: "13px", color: "#2ecc71",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5, 0).setDepth(10);

              this.add.text(GW / 2, WATER_BOT + 30,
                "🟢 Nitrosomonas: NH₃→NO₂⁻   🟣 Nitrobacter: NO₂⁻→NO₃⁻", {
                  fontSize: "11px", color: "#7a9ab0",
                  fontFamily: "Nunito, sans-serif",
                }).setOrigin(0.5, 0).setDepth(10);

              // Switch button (right side)
              this.add.text(GW - 12, WATER_BOT + 18, "[ SPACE / click to switch ]", {
                fontSize: "12px", color: "#90cce0",
                fontFamily: "Nunito, sans-serif",
              }).setOrigin(1, 0.5).setDepth(11)
                .setInteractive({ useHandCursor: true })
                .on("pointerover", function (this: any) { this.setStyle({ color: "#ffffff" }); })
                .on("pointerout", function (this: any) { this.setStyle({ color: "#90cce0" }); })
                .on("pointerdown", () => this.doSwitch());

              // Plant zone label
              this.add.text(8, 3, "🌿 Plant Zone", {
                fontSize: "11px", color: "#7ef0a8",
                fontFamily: "Nunito, sans-serif",
              }).setDepth(10);
            },

            update(this: any, _time: number, delta: number) {
              const dt = delta / 1000;
              const ptr = this.input.activePointer;

              // ── Move active bacteria toward cursor ──────────────────
              const isNS = this.activeBacteria === "ns";
              const head = isNS ? this.headA : this.headB;
              const hist = isNS ? this.histA : this.histB;
              const segs = isNS ? this.segsA : this.segsB;

              const dx = ptr.worldX - head.x;
              const dy = ptr.worldY - head.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist > 8) {
                const angle = Math.atan2(dy, dx);
                const sf = Math.min(dist / 80, 1);
                head.setVelocity(
                  Math.cos(angle) * this.SPEED * sf,
                  Math.sin(angle) * this.SPEED * sf,
                );
                head.setRotation(angle);
              } else {
                head.setVelocity(0, 0);
              }

              // Clamp to water column
              const m = 22;
              head.x = Phaser.Math.Clamp(head.x, m, this.GW - m);
              head.y = Phaser.Math.Clamp(head.y, this.WATER_TOP + m, this.WATER_BOT - m);

              // Body trail
              // segs[0] = near head → history index SEG_SPACE (1 step back)
              // segs[7] = tail     → history index 8*SEG_SPACE (furthest)
              hist.unshift({ x: head.x, y: head.y });
              const maxLen = segs.length * this.SEG_SPACE + 1;
              if (hist.length > maxLen) hist.length = maxLen;
              for (let i = 0; i < segs.length; i++) {
                const idx = Math.min((i + 1) * this.SEG_SPACE, hist.length - 1);
                const pos = hist[idx];
                if (pos) segs[i].setPosition(pos.x, pos.y);
              }

              // ── Fish idle movement ──────────────────────────────────
              for (const f of this.fishes) {
                f.spr.x += f.dir * f.spd * dt;
                if (f.spr.x > this.GW - 50) { f.dir = -1; f.spr.setFlipX(true); }
                if (f.spr.x < 50) { f.dir = 1; f.spr.setFlipX(false); }
              }

              // ── Nitrate rises and gets absorbed by plants ───────────
              for (const nr of [...this.nitrateGroup.getChildren()]) {
                if (!nr || !nr.active) continue;
                if (nr.label) { nr.label.x = nr.x; nr.label.y = nr.y - 18; }

                if (nr.y <= this.WATER_TOP + 18) {
                  // Find nearest plant
                  let nearest = this.plants[0];
                  let minD = Infinity;
                  for (const p of this.plants) {
                    const d = Math.abs(nr.x - p.x);
                    if (d < minD) { minD = d; nearest = p; }
                  }
                  if (nearest.growth < GROWTH_MAX) {
                    nearest.growth++;
                    if (nearest.growth >= GROWTH_MAX) {
                      this.totalGrown++;
                      this.plantsText.setText("Plants fully grown: " + this.totalGrown);
                    }
                    this.drawPlants();
                    const spark = this.add.text(nr.x, this.WATER_TOP + 4, "✨", {
                      fontSize: "18px",
                    }).setDepth(12);
                    this.time.delayedCall(700, () => { if (spark?.active) spark.destroy(); });
                  }
                  if (nr.label) nr.label.destroy();
                  nr.destroy();
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
        console.error("BacteriaGame error:", err);
        setError(err?.message || String(err));
      }
    })();

    return () => {
      if (gameRef.current) {
        try { gameRef.current.destroy(true); } catch {}
        gameRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div style={{ width: 800, height: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1f35" }}>
        <div style={{ color: "#f1948a", maxWidth: 700 }}>
          <strong>Game error:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: 800, height: 600 }} />;
}
