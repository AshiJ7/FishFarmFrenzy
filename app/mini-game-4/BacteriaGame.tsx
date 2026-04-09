"use client";

import { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext"; 

export default function BacteriaGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();

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
        const GW = 960, GH = 700;
        const PLANT_H = 140;
        const UI_H = 90;
        const WATER_TOP = PLANT_H;
        const WATER_BOT = GH - UI_H;
        const BODY_SEGS = 8;
        const SEG_SPACE = 14;
        const BASE_SPEED = 220;
        const PLANT_COUNT = 3;
        const GROWTH_MAX = 5;

        // Stage 3 — Danger system
        const AMMONIA_DANGER_THRESHOLD = 6;
        const NITRITE_DANGER_THRESHOLD = 8;
        const BASE_SPAWN_INTERVAL = 3000;
        const MIN_SPAWN_INTERVAL = 800;
        const SPAWN_ACCELERATION = 15; // ms faster each spawn

        // Stage 4 — Feeding + Combos
        const FEEDING_INTERVAL = 25000;
        const FEEDING_BURST_MIN = 4;
        const FEEDING_BURST_MAX = 6;
        const COMBO_WINDOW = 5000;

        // Stage 5 — Oxygen
        const OXYGEN_DEPLETION_RATE = 100 / 35; // %/s
        const OXYGEN_PER_BUBBLE = 12;
        const BUBBLE_SPAWN_INTERVAL = 3000;
        const LOW_OXYGEN_THRESHOLD = 25;
        const LOW_OXYGEN_SPEED_MULT = 0.25;

        const config: any = {
          type: Phaser.AUTO,
          parent: containerRef.current,
          width: GW,
          height: GH,
          physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
          scene: {
            preload() {},

            create(this: any) {
              this.GW = GW; this.GH = GH;
              this.WATER_TOP = WATER_TOP; this.WATER_BOT = WATER_BOT;
              this.SEG_SPACE = SEG_SPACE;
              this.activeBacteria = "ns";
              this.score = 0;
              this.totalGrown = 0;
              this.gameOver = false;
              this.comboStreak = 0;
              this.totalCombos = 0;
              this.oxygen = 100;
              this.spawnInterval = BASE_SPAWN_INTERVAL;
              this.firstBubbleShown = false;

              // Coach mode: first-time guided walkthrough before normal gameplay begins.
              // While in coach mode, normal spawn / feeding / oxygen timers are paused so
              // the player can learn the cycle without pressure.
              this.coachMode = true;
              // waitAmmonia -> waitSwitch -> waitNitrite -> waitSwitchBack -> done
              this.coachStep = "waitAmmonia";

              // ── Background ──────────────────────────────────────────
              const bg = this.add.graphics().setDepth(0);

              // Plant zone — very light so plants pop
              bg.fillStyle(0xEAF5EA, 1);
              bg.fillRect(0, 0, GW, PLANT_H);

              // Water column — light aqua blue
              bg.fillStyle(0xCCE8F4, 1);
              bg.fillRect(0, WATER_TOP, GW, WATER_BOT - WATER_TOP);

              // Caustic light dapples
              for (let i = 0; i < 10; i++) {
                const cx = Phaser.Math.Between(50, GW - 50);
                const cy = Phaser.Math.Between(WATER_TOP + 30, WATER_BOT - 30);
                bg.fillStyle(0xffffff, 0.18);
                bg.fillEllipse(cx, cy, Phaser.Math.Between(50, 110), Phaser.Math.Between(25, 50));
              }

              // Subtle grid
              bg.lineStyle(1, 0x4A8E9E, 0.12);
              for (let x = 0; x <= GW; x += 50) bg.lineBetween(x, WATER_TOP, x, WATER_BOT);
              for (let y = WATER_TOP; y <= WATER_BOT; y += 50) bg.lineBetween(0, y, GW, y);

              // UI bar — light teal-mint panel
              bg.fillStyle(0xE2F0EC, 1);
              bg.fillRect(0, WATER_BOT, GW, UI_H);

              // Zone dividers
              bg.lineStyle(2, 0x4A8E9E, 0.6);
              bg.lineBetween(0, WATER_TOP, GW, WATER_TOP);
              bg.lineBetween(0, WATER_BOT, GW, WATER_BOT);

              // Air stone (Stage 5)
              bg.fillStyle(0x8a8a7a, 1);
              bg.fillRoundedRect(GW / 2 - 20, WATER_BOT - 14, 40, 12, 4);
              bg.fillStyle(0x9a9a8a, 1);
              bg.fillRoundedRect(GW / 2 - 16, WATER_BOT - 12, 32, 8, 3);

              // Soil beds and root lines
              const plantXs: number[] = [];
              for (let i = 0; i < PLANT_COUNT; i++) {
                const px = Math.round((GW / PLANT_COUNT) * (i + 0.5));
                plantXs.push(px);
                bg.fillStyle(0x5D4037, 1);
                bg.fillRect(px - 40, PLANT_H - 22, 80, 22);
                bg.fillStyle(0x795548, 1);
                bg.fillRect(px - 38, PLANT_H - 20, 76, 16);
                bg.lineStyle(2, 0x6D4C30, 0.8);
                bg.lineBetween(px, PLANT_H, px, WATER_TOP + 45);
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

              // Fish — more saturated for light background
              mkTex(g => {
                g.fillStyle(0x2a7fa0, 0.85);
                g.fillEllipse(24, 14, 36, 18);
                g.fillStyle(0x2a7fa0, 0.8);
                g.fillTriangle(38, 14, 52, 6, 52, 22);
                g.fillStyle(0x1a5f80, 0.8);
                g.fillCircle(14, 11, 3);
                g.fillStyle(0x4A8E9E, 0.4);
                g.fillEllipse(22, 11, 14, 6);
              }, "fish", 56, 28);

              // Oxygen bubble — slightly darker for visibility on light bg
              mkTex(g => {
                g.fillStyle(0x5BAED6, 0.75); g.fillCircle(8, 8, 7);
                g.fillStyle(0xB8E0F8, 0.9); g.fillCircle(6, 6, 3);
              }, "o2bubble", 16, 16);

              // Food pellet
              mkTex(g => {
                g.fillStyle(0x8B4513, 1); g.fillCircle(6, 6, 5);
                g.fillStyle(0xA0522D, 1); g.fillCircle(5, 5, 3);
              }, "food_pellet", 12, 12);

              // ── Reaction chain HUD (top of plant zone) ──────────────
              // Persistent visual of the nitrogen cycle so players can always
              // see the relationship between molecules and bacteria without
              // having to reread a tutorial modal.
              const chainBg = this.add.graphics().setDepth(9);
              chainBg.fillStyle(0xffffff, 0.82);
              chainBg.fillRoundedRect(80, 3, GW - 160, 26, 13);
              chainBg.lineStyle(1.5, 0x4A8E9E, 0.45);
              chainBg.strokeRoundedRect(80, 3, GW - 160, 26, 13);

              const chainY = 16;
              const chainParts: Array<{ text: string; color: string; x: number }> = [
                { text: "NH\u2083",             color: "#c0392b", x: 225 },
                { text: "\u2192",               color: "#5C5444", x: 260 },
                { text: "Nitrosomonas",         color: "#1a7a40", x: 330 },
                { text: "\u2192",               color: "#5C5444", x: 400 },
                { text: "NO\u2082\u207B",       color: "#a07810", x: 440 },
                { text: "\u2192",               color: "#5C5444", x: 480 },
                { text: "Nitrobacter",          color: "#7d3c98", x: 550 },
                { text: "\u2192",               color: "#5C5444", x: 620 },
                { text: "NO\u2083\u207B",       color: "#1a7a40", x: 665 },
                { text: "\u2192 \uD83C\uDF3F",  color: "#5C5444", x: 715 },
              ];
              for (const p of chainParts) {
                this.add.text(p.x, chainY, p.text, {
                  fontSize: "13px", color: p.color,
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5).setDepth(10);
              }

              // ── Plants ──────────────────────────────────────────────
              this.plants = plantXs.map((px: number) => ({
                x: px,
                growth: 0,
                gfx: this.add.graphics().setDepth(1),
              }));

              this.drawPlants = () => {
                const B = PLANT_H - 22; // soil surface y-coordinate (= 98)
                for (const p of this.plants) {
                  p.gfx.clear();
                  const x = p.x;
                  const g = p.growth;
                  if (g === 0) {
                    // Tiny seedling (~18px tall)
                    p.gfx.fillStyle(0x2D6B1E, 1);
                    p.gfx.fillRect(x - 1, B - 16, 3, 16);
                    p.gfx.fillStyle(0x4CAF50, 1);
                    p.gfx.fillEllipse(x, B - 18, 12, 8);
                  } else if (g === 1) {
                    // Sprout (~35px tall)
                    p.gfx.fillStyle(0x2D6B1E, 1);
                    p.gfx.fillRect(x - 1, B - 32, 3, 32);
                    p.gfx.fillStyle(0x43A047, 1);
                    p.gfx.fillEllipse(x - 9, B - 26, 20, 14);
                    p.gfx.fillEllipse(x + 9, B - 20, 20, 14);
                    p.gfx.fillStyle(0x66BB6A, 1);
                    p.gfx.fillEllipse(x, B - 32, 16, 12);
                  } else if (g === 2) {
                    // Small plant (~50px tall)
                    p.gfx.fillStyle(0x1B5E20, 1);
                    p.gfx.fillRect(x - 2, B - 48, 4, 48);
                    p.gfx.fillStyle(0x388E3C, 1);
                    p.gfx.fillEllipse(x - 13, B - 38, 26, 18);
                    p.gfx.fillEllipse(x + 13, B - 30, 26, 18);
                    p.gfx.fillStyle(0x4CAF50, 1);
                    p.gfx.fillEllipse(x, B - 48, 24, 18);
                  } else if (g === 3) {
                    // Medium plant (~65px tall)
                    p.gfx.fillStyle(0x1B5E20, 1);
                    p.gfx.fillRect(x - 2, B - 62, 4, 62);
                    p.gfx.fillStyle(0x2E7D32, 1);
                    p.gfx.fillEllipse(x, B - 60, 36, 24);
                    p.gfx.fillEllipse(x - 17, B - 44, 28, 22);
                    p.gfx.fillEllipse(x + 17, B - 44, 28, 22);
                    p.gfx.fillStyle(0x43A047, 1);
                    p.gfx.fillEllipse(x, B - 54, 24, 18);
                  } else if (g === 4) {
                    // Large plant with fruit (~78px tall)
                    p.gfx.fillStyle(0x1B5E20, 1);
                    p.gfx.fillRect(x - 2, B - 74, 4, 74);
                    p.gfx.fillStyle(0x2E7D32, 1);
                    p.gfx.fillEllipse(x, B - 72, 40, 28);
                    p.gfx.fillEllipse(x - 19, B - 54, 30, 24);
                    p.gfx.fillEllipse(x + 19, B - 54, 30, 24);
                    p.gfx.fillStyle(0x388E3C, 1);
                    p.gfx.fillEllipse(x, B - 64, 28, 20);
                    p.gfx.fillStyle(0xF9C400, 1);
                    p.gfx.fillCircle(x, B - 80, 7);
                  } else {
                    // Fully grown — lush with multiple fruits (~90px tall)
                    p.gfx.fillStyle(0x1B5E20, 1);
                    p.gfx.fillRect(x - 2, B - 86, 4, 86);
                    p.gfx.fillStyle(0x1B5E20, 1);
                    p.gfx.fillEllipse(x, B - 84, 46, 30);
                    p.gfx.fillEllipse(x - 21, B - 64, 32, 24);
                    p.gfx.fillEllipse(x + 21, B - 64, 32, 24);
                    p.gfx.fillStyle(0x2E7D32, 1);
                    p.gfx.fillEllipse(x, B - 76, 36, 24);
                    p.gfx.fillStyle(0xF9C400, 1);
                    p.gfx.fillCircle(x, B - 90, 7);
                    p.gfx.fillCircle(x - 15, B - 78, 5);
                    p.gfx.fillCircle(x + 15, B - 78, 5);
                    p.gfx.fillStyle(0xE65100, 1);
                    p.gfx.fillCircle(x - 8, B - 62, 4);
                    p.gfx.fillCircle(x + 8, B - 62, 4);
                  }
                }
              };
              this.drawPlants();

              // ── Fish ────────────────────────────────────────────────
              this.fishes = [
                { spr: this.add.image(140, 220, "fish").setDepth(1).setAlpha(0.7), dir: 1, baseSpd: 33, spd: 33 },
                { spr: this.add.image(520, 360, "fish").setDepth(1).setAlpha(0.7).setFlipX(true), dir: -1, baseSpd: 26, spd: 26 },
                { spr: this.add.image(310, 455, "fish").setDepth(1).setAlpha(0.7), dir: 1, baseSpd: 40, spd: 40 },
              ];

              // ── Physics groups ──────────────────────────────────────
              this.ammoniaGroup = this.physics.add.staticGroup();
              this.nitriteGroup = this.physics.add.staticGroup();
              this.nitrateGroup = this.physics.add.group();
              this.bubbleGroup = this.physics.add.group();

              // ── Molecule helpers ────────────────────────────────────
              this.spawnAmmonia = (x?: number, y?: number) => {
                const sx = x ?? Phaser.Math.Between(50, GW - 50);
                const sy = y ?? Phaser.Math.Between(WATER_TOP + 45, WATER_BOT - 45);
                const spr = this.ammoniaGroup.create(sx, sy, "ammonia").setDepth(2);
                spr.label = this.add.text(sx, sy - 22, "NH\u2083", {
                  fontSize: "11px", color: "#B83A1A",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5).setDepth(3);
                this.tweens.add({
                  targets: spr,
                  alpha: { from: 1, to: 0.6 },
                  duration: 800,
                  yoyo: true,
                  repeat: -1,
                });
              };

              this.dropNitrite = (ox: number, oy: number) => {
                const x = Phaser.Math.Clamp(ox + Phaser.Math.Between(-28, 28), 30, GW - 30);
                const y = Phaser.Math.Clamp(oy + Phaser.Math.Between(-18, 18), WATER_TOP + 25, WATER_BOT - 25);
                const spr = this.nitriteGroup.create(x, y, "nitrite").setDepth(2);
                spr.createdAt = this.time.now;
                spr.label = this.add.text(x, y - 20, "NO\u2082\u207B", {
                  fontSize: "11px", color: "#8B6914",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5).setDepth(3);
                this.tweens.add({
                  targets: spr,
                  alpha: { from: 1, to: 0.6 },
                  duration: 900,
                  yoyo: true,
                  repeat: -1,
                });
              };

              this.dropNitrate = (x: number, y: number, isCombo?: boolean) => {
                const spr = this.nitrateGroup.create(x, y, "nitrate").setDepth(2);
                spr.isCombo = isCombo || false;
                spr.label = this.add.text(x, y - 18, "NO\u2083\u207B", {
                  fontSize: "11px", color: "#2D5016",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5).setDepth(3);
                spr.setVelocityY(-65);
              };

              // (Initial ammonia spawning moved into startGameplay() so the
              // coach sequence can run on an empty-ish board before real play.)

              // ── Bacteria A: Nitrosomonas ────────────────────────────
              this.histA = [] as { x: number; y: number }[];
              this.segsA = [] as any[];
              for (let i = 0; i < BODY_SEGS; i++) {
                const s = this.add.image(200, 300, "ns_body")
                  .setScale(Math.max(0.95 - i * 0.07, 0.3))
                  .setAlpha(Math.max(0.9 - i * 0.07, 0.3))
                  .setDepth(4 - i * 0.1);
                this.segsA.push(s);
              }
              this.headA = this.physics.add.sprite(200, 300, "ns_head")
                .setMaxVelocity(BASE_SPEED).setDepth(5);

              // ── Bacteria B: Nitrobacter ─────────────────────────────
              this.histB = [] as { x: number; y: number }[];
              this.segsB = [] as any[];
              for (let i = 0; i < BODY_SEGS; i++) {
                const s = this.add.image(600, 300, "nb_body")
                  .setScale(Math.max(0.95 - i * 0.07, 0.3))
                  .setAlpha(0.28)
                  .setDepth(4 - i * 0.1);
                this.segsB.push(s);
              }
              this.headB = this.physics.add.sprite(600, 300, "nb_head")
                .setMaxVelocity(BASE_SPEED).setAlpha(0.3).setDepth(5);

              // ── Active bacteria halo + target molecule glow ─────────
              // Redrawn each frame in update(); the active bacteria gets a
              // pulsing ring in the colour of the food it should be eating,
              // and each currently-edible molecule gets a matching glow.
              this.targetGlowGfx = this.add.graphics().setDepth(1.8);
              this.haloGfx = this.add.graphics().setDepth(5.5);

              // Combo-window ring: drawn around any nitrite whose creation
              // is still inside COMBO_WINDOW so the player can see exactly
              // how long they have to chain NH₃ → NO₂⁻ for a Full Cycle bonus.
              this.comboRingGfx = this.add.graphics().setDepth(2.5);

              // ── Overlaps ────────────────────────────────────────────

              // Nitrosomonas eats ammonia → drops nitrite
              this.physics.add.overlap(this.headA, this.ammoniaGroup,
                (_head: any, spr: any) => {
                  if (this.gameOver || this.activeBacteria !== "ns") return;
                  if (spr.label) spr.label.destroy();
                  const sx = spr.x, sy = spr.y;
                  spr.destroy();
                  this.score += 10;
                  this.scoreText.setText("Score: " + this.score);
                  this.dropNitrite(sx, sy);

                  // Coach mode: first ammonia eaten → prompt for bacteria swap
                  if (this.coachMode && this.coachStep === "waitAmmonia") {
                    this.coachStep = "waitSwitch";
                    this.setCoachHint(
                      "Nice! That ammonia became nitrite (NO\u2082\u207B).\n" +
                      "Press SPACE to switch to the purple Nitrobacter."
                    );
                  }
                }, undefined, this);

              // Nitrobacter eats nitrite → drops nitrate (+ combo check)
              this.physics.add.overlap(this.headB, this.nitriteGroup,
                (head: any, spr: any) => {
                  if (this.gameOver || this.activeBacteria !== "nb") return;
                  const now = this.time.now;
                  const isCombo = spr.createdAt && (now - spr.createdAt < COMBO_WINDOW);

                  if (spr.label) spr.label.destroy();
                  const sx = spr.x, sy = spr.y;
                  spr.destroy();

                  if (isCombo) {
                    this.comboStreak++;
                    this.totalCombos++;
                    const bonus = 20 * this.comboStreak;
                    this.score += 15 + bonus;
                    const label = this.comboStreak > 1
                      ? `Full Cycle! \u00D7${this.comboStreak}  +${15 + bonus}`
                      : `Full Cycle!  +${15 + bonus}`;
                    const ct = this.add.text(head.x, head.y - 32, label, {
                      fontSize: "22px", color: "#F9C400",
                      fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                      stroke: "#5a3a00", strokeThickness: 4,
                    }).setOrigin(0.5).setDepth(15).setScale(0.5);
                    // Pop-in, then float up and fade.
                    this.tweens.add({
                      targets: ct, scale: 1.15,
                      duration: 180, ease: "Back.out",
                      onComplete: () => {
                        this.tweens.add({
                          targets: ct, y: head.y - 95, alpha: 0,
                          duration: 1200, onComplete: () => ct.destroy(),
                        });
                      },
                    });
                    // Update the persistent combo streak indicator in the UI bar.
                    this.comboText.setText(
                      `Full Cycle Streak: \u00D7${this.comboStreak}   \u00B7   Plants grow 2\u00D7 faster on combos!`
                    );
                    this.comboText.setStyle({ color: "#1a7a40" });
                  } else {
                    if (this.comboStreak > 0) {
                      // Streak just broke — reset the UI indicator to its idle state.
                      this.comboText.setText(
                        "Full Cycle Streak: \u00D70   \u00B7   Eat fresh NO\u2082\u207B (gold ring) within 5s for bonus!"
                      );
                      this.comboText.setStyle({ color: "#8B6914" });
                    }
                    this.comboStreak = 0;
                    this.score += 15;
                  }

                  this.scoreText.setText("Score: " + this.score);
                  this.dropNitrate(sx, sy, isCombo);

                  // Coach mode: full cycle completed once → now teach that
                  // SPACE is a two-way toggle by asking the player to switch
                  // back to Nitrosomonas before real gameplay begins.
                  if (this.coachMode && this.coachStep === "waitNitrite") {
                    this.coachStep = "waitSwitchBack";
                    this.setCoachHint(
                      "Great! You turned the nitrite into nitrate (NO\u2083\u207B) — plant food.\n" +
                      "Press SPACE again to switch back to the green Nitrosomonas."
                    );
                  }
                }, undefined, this);

              // Active bacterium eats oxygen bubbles
              const eatBubble = (head: any, bubble: any) => {
                if (this.gameOver) return;
                const isActive = (this.activeBacteria === "ns" && head === this.headA)
                  || (this.activeBacteria === "nb" && head === this.headB);
                if (!isActive) return;
                bubble.destroy();
                this.oxygen = Math.min(100, this.oxygen + OXYGEN_PER_BUBBLE);
              };
              this.physics.add.overlap(this.headA, this.bubbleGroup, eatBubble, undefined, this);
              this.physics.add.overlap(this.headB, this.bubbleGroup, eatBubble, undefined, this);

              // ── Switch mechanic ─────────────────────────────────────
              this.updateActiveLabel = () => {
                if (this.activeBacteria === "ns") {
                  this.activeText.setText("Active: Nitrosomonas \u00B7 Eats NH\u2083 \u2192 NO\u2082\u207B");
                  this.activeText.setStyle({ color: "#1a7a40" });
                } else {
                  this.activeText.setText("Active: Nitrobacter \u00B7 Eats NO\u2082\u207B \u2192 NO\u2083\u207B");
                  this.activeText.setStyle({ color: "#6B3FA0" });
                }
              };

              this.doSwitch = () => {
                if (this.gameOver) return;
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
                this.updateActiveLabel();

                // Coach mode: player just switched to Nitrobacter → prompt for nitrite
                if (this.coachMode && this.coachStep === "waitSwitch" && this.activeBacteria === "nb") {
                  this.coachStep = "waitNitrite";
                  this.setCoachHint(
                    "Now drag your purple Nitrobacter onto the yellow\n" +
                    "NO\u2082\u207B nitrite molecule to complete the cycle!"
                  );
                }

                // Coach mode: player switched back to Nitrosomonas → done, kick off real game
                if (this.coachMode && this.coachStep === "waitSwitchBack" && this.activeBacteria === "ns") {
                  this.coachStep = "done";
                  this.setCoachHint(
                    "Perfect! Press SPACE any time you want to switch bacteria."
                  );
                  // Two-part outro: first the "you got it" beat, then a pro-tip
                  // explaining the Full Cycle bonus mechanic before real play starts.
                  this.time.delayedCall(2200, () => {
                    this.setCoachHint(
                      "Pro tip: when you make a nitrite (NO\u2082\u207B), a shrinking\n" +
                      "gold ring shows how long you have to eat it for a\n" +
                      "Full Cycle bonus — extra score AND plants grow 2\u00D7 faster!"
                    );
                    this.time.delayedCall(4600, () => {
                      this.tweens.add({
                        targets: this.coachText, alpha: 0, duration: 500,
                        onComplete: () => { this.coachText.setVisible(false); },
                      });
                      this.startGameplay();
                    });
                  });
                }
              };

              const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
              spaceKey.on("down", () => this.doSwitch());

              // ── UI Bar — Row 1: Score, Active, Switch ───────────────
              this.scoreText = this.add.text(12, WATER_BOT + 5, "Score: 0", {
                fontSize: "14px", color: "#2C2416",
                fontFamily: "Nunito, sans-serif", fontStyle: "bold",
              }).setDepth(10);

              this.activeText = this.add.text(GW / 2, WATER_BOT + 5,
                "Active: Nitrosomonas \u00B7 Eats NH\u2083 \u2192 NO\u2082\u207B", {
                  fontSize: "11px", color: "#1a7a40",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5, 0).setDepth(10);

              this.add.text(GW - 12, WATER_BOT + 5, "[ SPACE to switch ]", {
                fontSize: "10px", color: "#4A8E9E",
                fontFamily: "Nunito, sans-serif",
              }).setOrigin(1, 0).setDepth(11)
                .setInteractive({ useHandCursor: true })
                .on("pointerover", function (this: any) { this.setStyle({ color: "#2C2416" }); })
                .on("pointerout", function (this: any) { this.setStyle({ color: "#4A8E9E" }); })
                .on("pointerdown", () => this.doSwitch());

              // ── UI Bar — Row 2: Danger gauges + Oxygen ──────────────
              this.gaugeGfx = this.add.graphics().setDepth(10);
              const gaugeY = WATER_BOT + 34;
              const barH = 12;

              this.add.text(15, gaugeY - 12, "NH\u2083 Danger", {
                fontSize: "9px", color: "#B83A1A",
                fontFamily: "Nunito, sans-serif", fontStyle: "bold",
              }).setDepth(10);
              this.add.text(280, gaugeY - 12, "NO\u2082\u207B Danger", {
                fontSize: "9px", color: "#8B6914",
                fontFamily: "Nunito, sans-serif", fontStyle: "bold",
              }).setDepth(10);
              this.add.text(545, gaugeY - 12, "O\u2082 Level", {
                fontSize: "9px", color: "#4A8E9E",
                fontFamily: "Nunito, sans-serif", fontStyle: "bold",
              }).setDepth(10);

              // Count only active (non-destroyed) sprites in a group
              this.liveCount = (group: any) =>
                group.getChildren().filter((c: any) => c.active).length;

              this.drawGauges = () => {
                this.gaugeGfx.clear();
                const y = gaugeY;
                const w = 220;

                // Ammonia gauge
                const ammoniaFill = Math.min(this.liveCount(this.ammoniaGroup) / AMMONIA_DANGER_THRESHOLD, 1);
                this.gaugeGfx.fillStyle(0xC8D0CC, 1);
                this.gaugeGfx.fillRoundedRect(15, y, w, barH, 3);
                if (ammoniaFill > 0) {
                  const c = ammoniaFill > 0.75 ? 0xff0000 : ammoniaFill > 0.5 ? 0xe74c3c : 0xc0392b;
                  this.gaugeGfx.fillStyle(c, 1);
                  this.gaugeGfx.fillRoundedRect(15, y, w * ammoniaFill, barH, 3);
                }

                // Nitrite gauge
                const nitriteFill = Math.min(this.liveCount(this.nitriteGroup) / NITRITE_DANGER_THRESHOLD, 1);
                this.gaugeGfx.fillStyle(0xC8D0CC, 1);
                this.gaugeGfx.fillRoundedRect(280, y, w, barH, 3);
                if (nitriteFill > 0) {
                  const c = nitriteFill > 0.75 ? 0xff8c00 : nitriteFill > 0.5 ? 0xf39c12 : 0xb7950b;
                  this.gaugeGfx.fillStyle(c, 1);
                  this.gaugeGfx.fillRoundedRect(280, y, w * nitriteFill, barH, 3);
                }

                // Oxygen gauge
                const oxygenFill = this.oxygen / 100;
                this.gaugeGfx.fillStyle(0xC8D0CC, 1);
                this.gaugeGfx.fillRoundedRect(545, y, w, barH, 3);
                if (oxygenFill > 0) {
                  const c = oxygenFill < 0.25 ? 0x5a8aae : oxygenFill < 0.5 ? 0x88b4d0 : 0xA8C8E8;
                  this.gaugeGfx.fillStyle(c, 1);
                  this.gaugeGfx.fillRoundedRect(545, y, w * oxygenFill, barH, 3);
                }

                // Flash oxygen bar border when critical
                if (this.oxygen < LOW_OXYGEN_THRESHOLD && this.oxygen > 0) {
                  if (Math.sin(this.time.now / 200) > 0) {
                    this.gaugeGfx.lineStyle(2, 0xFF7F5C, 0.8);
                    this.gaugeGfx.strokeRoundedRect(545, y, w, barH, 3);
                  }
                }
              };

              // ── UI Bar — Row 3: Plants + combo streak ───────────────
              this.plantsText = this.add.text(12, WATER_BOT + 54, "Plants grown: 0", {
                fontSize: "10px", color: "#5C5444",
                fontFamily: "Nunito, sans-serif",
              }).setDepth(10);

              // Persistent combo-mechanic helper text. Explains the bonus when
              // the streak is 0, celebrates it when the streak is active, and
              // is updated by the nitrite overlap handler.
              this.comboText = this.add.text(GW / 2, WATER_BOT + 54,
                "Full Cycle Streak: \u00D70   \u00B7   Eat fresh NO\u2082\u207B (gold ring) within 5s for bonus!", {
                  fontSize: "10px", color: "#8B6914",
                  fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                }).setOrigin(0.5, 0).setDepth(10);

              // (Old bottom-row text legend and "Plant Zone" label removed —
              // the reaction chain HUD at the top of the plant zone now
              // conveys the same information more visually.)

              // ── Feeding-time announcement text (used by startGameplay) ─
              this.feedingText = this.add.text(GW / 2, WATER_TOP + 30, "", {
                fontSize: "22px", color: "#B8860B",
                fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                stroke: "#fff", strokeThickness: 3,
              }).setOrigin(0.5).setDepth(15).setAlpha(0);

              // ── Coach hint box (centered near the top of the water) ────
              this.coachText = this.add.text(GW / 2, WATER_TOP + 50, "", {
                fontSize: "15px", color: "#2C2416",
                fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                backgroundColor: "#fff8e7",
                padding: { x: 16, y: 10 },
                align: "center",
              }).setOrigin(0.5, 0).setDepth(30);
              this.setCoachHint = (msg: string) => {
                this.coachText.setVisible(true);
                this.coachText.setAlpha(1);
                this.coachText.setText(msg);
              };

              // ── startGameplay: kicks off all the live-gameplay timers ──
              // Called immediately if coachMode is off, or by the coach
              // sequence once the player has completed one full cycle.
              this.startGameplay = () => {
                this.coachMode = false;

                // Spawn a few initial ammonia to get the player going
                for (let i = 0; i < 3; i++) this.spawnAmmonia();

                // Continuous ammonia spawning (Stage 3)
                this.spawnTimer = this.time.addEvent({
                  delay: this.spawnInterval,
                  callback: () => {
                    if (this.gameOver) return;
                    const fish = this.fishes[Phaser.Math.Between(0, this.fishes.length - 1)];
                    this.spawnAmmonia(
                      fish.spr.x + Phaser.Math.Between(-30, 30),
                      fish.spr.y + Phaser.Math.Between(-15, 15)
                    );
                    this.spawnInterval = Math.max(MIN_SPAWN_INTERVAL, this.spawnInterval - SPAWN_ACCELERATION);
                    this.spawnTimer.delay = this.spawnInterval;
                  },
                  loop: true,
                });

                // Feeding events (Stage 4)
                this.time.addEvent({
                  delay: FEEDING_INTERVAL,
                  callback: () => {
                    if (this.gameOver) return;

                    // Flash "Feeding Time!"
                    this.feedingText.setText("Feeding Time!");
                    this.feedingText.setAlpha(1);
                    this.tweens.add({
                      targets: this.feedingText, alpha: 0,
                      duration: 2500, delay: 1500,
                    });

                    // Food pellet drops
                    const pelletX = Phaser.Math.Between(200, GW - 200);
                    const pellet = this.add.image(pelletX, WATER_TOP + 10, "food_pellet").setDepth(6);
                    this.tweens.add({
                      targets: pellet,
                      y: (WATER_TOP + WATER_BOT) / 2,
                      duration: 1500,
                      onComplete: () => {
                        pellet.destroy();
                        if (this.gameOver) return;
                        // Stagger ammonia spawns so player can react
                        const burstCount = Phaser.Math.Between(FEEDING_BURST_MIN, FEEDING_BURST_MAX);
                        for (let i = 0; i < burstCount; i++) {
                          this.time.delayedCall(i * 800, () => {
                            if (this.gameOver) return;
                            const fish = this.fishes[Phaser.Math.Between(0, this.fishes.length - 1)];
                            this.spawnAmmonia(
                              fish.spr.x + Phaser.Math.Between(-40, 40),
                              fish.spr.y + Phaser.Math.Between(-25, 25)
                            );
                          });
                        }
                      },
                    });
                  },
                  loop: true,
                });

                // Oxygen bubbles (Stage 5)
                this.time.addEvent({
                  delay: BUBBLE_SPAWN_INTERVAL,
                  callback: () => {
                    if (this.gameOver) return;
                    const count = Phaser.Math.Between(2, 3);
                    for (let i = 0; i < count; i++) {
                      const bx = GW / 2 + Phaser.Math.Between(-25, 25);
                      const by = WATER_BOT - 20;
                      const bubble = this.bubbleGroup.create(bx, by, "o2bubble").setDepth(2);
                      bubble.setVelocityY(Phaser.Math.Between(-50, -35));
                      bubble.setVelocityX(Phaser.Math.Between(-12, 12));
                      bubble.wobbleOffset = Phaser.Math.FloatBetween(0, Math.PI * 2);
                    }

                    // Tooltip on first oxygen bubble appearance
                    if (!this.firstBubbleShown) {
                      this.firstBubbleShown = true;
                      const tip = this.add.text(GW / 2, WATER_TOP + 60,
                        "Bacteria need oxygen! Swim through\nbubbles to keep your bacteria energized.", {
                          fontSize: "13px", color: "#2C2416",
                          fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                          stroke: "#fff", strokeThickness: 2,
                          align: "center",
                          backgroundColor: "#ffffffcc",
                          padding: { x: 12, y: 8 },
                        }).setOrigin(0.5).setDepth(20);
                      this.time.delayedCall(4000, () => {
                        this.tweens.add({
                          targets: tip, alpha: 0, duration: 800,
                          onComplete: () => tip.destroy(),
                        });
                      });
                    }
                  },
                  loop: true,
                });
              };

              // ── Coach / gameplay kickoff ────────────────────────────
              if (this.coachMode) {
                // Seed a single ammonia molecule in the far bottom-right of the
                // water column — diagonally opposite from the Nitrosomonas
                // starting position (200, 300) and well clear of where the
                // cursor is likely to be after the user dismisses the React
                // info modal. This keeps the bacteria from accidentally eating
                // the food before the player has had a chance to read the hint.
                this.spawnAmmonia(GW - 120, WATER_BOT - 90);
                this.setCoachHint(
                  "Welcome! Take a moment to read this, then drag your green\n" +
                  "bacteria (Nitrosomonas) onto the red NH\u2083 ammonia molecule\n" +
                  "in the bottom-right of the tank to eat it."
                );
              } else {
                this.startGameplay();
              }

              // ── Game Over (Stage 3) ─────────────────────────────────
              this.triggerGameOver = (cause: string) => {
                if (this.gameOver) return;
                this.gameOver = true;

                if (user) {
    const ref = doc(db, "users", user.uid);
    getDoc(ref).then((snap) => {
      const data = snap.data();
      const alreadyCompleted = data?.bacteriaGameCompleted ?? false;
      if (!alreadyCompleted) {
        updateDoc(ref, {
          gamesCompleted: increment(1),
          bacteriaGameCompleted: true,
        });
      }
    });
  }

                this.headA.setVelocity(0, 0);
                this.headB.setVelocity(0, 0);

                // Fish death: flip upside-down, float to surface, pale
                for (const f of this.fishes) {
                  f.spr.setRotation(Math.PI);
                  f.spr.setAlpha(0.7);
                  f.spr.setTint(0xcccccc);
                  this.tweens.add({
                    targets: f.spr, y: WATER_TOP + 30,
                    duration: 2000, ease: "Sine.easeOut",
                  });
                }

                this.time.delayedCall(1200, () => {
                  // Dark overlay
                  this.add.rectangle(GW / 2, GH / 2, GW, GH, 0x000000, 0.75).setDepth(50);

                  this.add.text(GW / 2, 100, "Game Over", {
                    fontSize: "42px", color: "#FF7F5C",
                    fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                    stroke: "#000", strokeThickness: 4,
                  }).setOrigin(0.5).setDepth(51);

                  const causeMsg = cause === "ammonia"
                    ? "Fish died from ammonia (NH\u2083) poisoning!"
                    : "Fish died from nitrite (NO\u2082\u207B) poisoning!";
                  this.add.text(GW / 2, 160, causeMsg, {
                    fontSize: "18px", color: "#F5D7C8",
                    fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                  }).setOrigin(0.5).setDepth(51);

                  const stats = [
                    `Final Score: ${this.score}`,
                    `Plants Fully Grown: ${this.totalGrown}`,
                    `Full Cycle Combos: ${this.totalCombos}`,
                  ];
                  stats.forEach((txt, i) => {
                    this.add.text(GW / 2, 210 + i * 30, txt, {
                      fontSize: "16px", color: "#ffffff",
                      fontFamily: "Nunito, sans-serif",
                    }).setOrigin(0.5).setDepth(51);
                  });

                  const eduMsg = cause === "ammonia"
                    ? "In aquaponics, Nitrosomonas bacteria are essential\nfor converting toxic ammonia into less harmful nitrite."
                    : "Nitrite interferes with fish blood carrying oxygen.\nNitrobacter bacteria must convert it to safe nitrate.";
                  this.add.text(GW / 2, 330, eduMsg, {
                    fontSize: "13px", color: "#A8C8E8",
                    fontFamily: "Nunito, sans-serif", align: "center",
                  }).setOrigin(0.5).setDepth(51);

                  const btn = this.add.text(GW / 2, 420, "  Try Again  ", {
                    fontSize: "24px", color: "#B8D8A8",
                    fontFamily: "Nunito, sans-serif", fontStyle: "bold",
                    backgroundColor: "#3d5e30",
                    padding: { x: 24, y: 12 },
                  }).setOrigin(0.5).setDepth(51)
                    .setInteractive({ useHandCursor: true })
                    .on("pointerover", function (this: any) { this.setStyle({ color: "#ffffff", backgroundColor: "#6B8E4E" }); })
                    .on("pointerout", function (this: any) { this.setStyle({ color: "#B8D8A8", backgroundColor: "#3d5e30" }); })
                    .on("pointerdown", () => this.scene.restart());
                });
              };
            },

            // ═══════════════════════════════════════════════════════════
            // UPDATE LOOP
            // ═══════════════════════════════════════════════════════════
            update(this: any, _time: number, delta: number) {
              if (this.gameOver) return;

              const dt = delta / 1000;
              const ptr = this.input.activePointer;

              // ── Oxygen depletion (Stage 5) ──────────────────────────
              // Paused during coach mode so the tutorial isn't under pressure.
              if (!this.coachMode) {
                this.oxygen = Math.max(0, this.oxygen - OXYGEN_DEPLETION_RATE * dt);
              }
              const speedMult = this.oxygen <= 0 ? 0
                : this.oxygen < LOW_OXYGEN_THRESHOLD ? LOW_OXYGEN_SPEED_MULT
                : 1;
              const currentSpeed = BASE_SPEED * speedMult;

              // Gasp animation when low oxygen
              if (this.oxygen < LOW_OXYGEN_THRESHOLD) {
                const pulse = 0.8 + 0.2 * Math.sin(this.time.now / 150);
                const activeHead = this.activeBacteria === "ns" ? this.headA : this.headB;
                activeHead.setScale(pulse);
              } else {
                this.headA.setScale(1);
                this.headB.setScale(1);
              }

              // ── Move active bacteria ────────────────────────────────
              const isNS = this.activeBacteria === "ns";
              const head = isNS ? this.headA : this.headB;
              const hist = isNS ? this.histA : this.histB;
              const segs = isNS ? this.segsA : this.segsB;

              const dx = ptr.worldX - head.x;
              const dy = ptr.worldY - head.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist > 8 && currentSpeed > 0) {
                const angle = Math.atan2(dy, dx);
                const sf = Math.min(dist / 80, 1);
                head.setVelocity(
                  Math.cos(angle) * currentSpeed * sf,
                  Math.sin(angle) * currentSpeed * sf,
                );
                head.setRotation(angle);
              } else {
                head.setVelocity(0, 0);
              }

              // Clamp to water column
              const m = 22;
              head.x = Phaser.Math.Clamp(head.x, m, this.GW - m);
              head.y = Phaser.Math.Clamp(head.y, this.WATER_TOP + m, this.WATER_BOT - m);

              // ── Active bacteria halo + target molecule glow ─────────
              // Pulsing ring around the active bacteria in its target-food
              // colour, plus matching soft discs behind every edible molecule
              // so the player can always tell at a glance what to chase.
              {
                const targetGroup = isNS ? this.ammoniaGroup : this.nitriteGroup;
                const glowColor = isNS ? 0xe74c3c : 0xf1c40f;
                const t = this.time.now;
                const ringPulse = 0.55 + 0.25 * Math.sin(t / 260);

                this.haloGfx.clear();
                this.haloGfx.lineStyle(4, glowColor, Math.min(1, ringPulse + 0.15));
                this.haloGfx.strokeCircle(head.x, head.y, 26);
                this.haloGfx.lineStyle(2, glowColor, Math.max(0, ringPulse - 0.2));
                this.haloGfx.strokeCircle(head.x, head.y, 33);

                this.targetGlowGfx.clear();
                const glowAlpha = 0.22 + 0.15 * Math.sin(t / 320);
                for (const mol of targetGroup.getChildren()) {
                  if (!mol.active) continue;
                  this.targetGlowGfx.fillStyle(glowColor, glowAlpha);
                  this.targetGlowGfx.fillCircle(mol.x, mol.y, 22);
                }

                // ── Full Cycle combo window indicator ────────────────
                // Every nitrite that's still inside COMBO_WINDOW gets a
                // golden ring whose radius shrinks as the window closes.
                // This makes the "eat fresh nitrites for a bonus" mechanic
                // visually discoverable instead of hidden in the code.
                this.comboRingGfx.clear();
                for (const nit of this.nitriteGroup.getChildren()) {
                  if (!nit.active || !nit.createdAt) continue;
                  const elapsed = t - nit.createdAt;
                  if (elapsed >= COMBO_WINDOW) continue;
                  const remaining = 1 - elapsed / COMBO_WINDOW; // 1 → 0
                  const radius = 14 + 18 * remaining;
                  this.comboRingGfx.lineStyle(3, 0xF9C400, 0.5 + 0.5 * remaining);
                  this.comboRingGfx.strokeCircle(nit.x, nit.y, radius);
                  if (remaining > 0.35) {
                    this.comboRingGfx.lineStyle(1.5, 0xFFEB3B, (remaining - 0.35) * 0.9);
                    this.comboRingGfx.strokeCircle(nit.x, nit.y, radius + 5);
                  }
                }
              }

              // Body trail
              hist.unshift({ x: head.x, y: head.y });
              const maxLen = segs.length * this.SEG_SPACE + 1;
              if (hist.length > maxLen) hist.length = maxLen;
              for (let i = 0; i < segs.length; i++) {
                const idx = Math.min((i + 1) * this.SEG_SPACE, hist.length - 1);
                const pos = hist[idx];
                if (pos) segs[i].setPosition(pos.x, pos.y);
              }

              // ── Fish behavior + stress (Stage 3) ────────────────────
              const ammoniaCount = this.liveCount(this.ammoniaGroup);
              const nitriteCount = this.liveCount(this.nitriteGroup);
              const maxDanger = Math.max(
                ammoniaCount / AMMONIA_DANGER_THRESHOLD,
                nitriteCount / NITRITE_DANGER_THRESHOLD
              );

              for (const f of this.fishes) {
                if (maxDanger >= 0.75) {
                  f.spd = f.baseSpd * 2.5;
                  f.spr.setTint(0xFF7F5C);
                  f.spr.setAlpha(0.9);
                  if (Math.random() < 0.02) f.dir *= -1;
                } else if (maxDanger >= 0.5) {
                  f.spd = f.baseSpd * 1.8;
                  f.spr.clearTint();
                  f.spr.setAlpha(0.8);
                } else {
                  f.spd = f.baseSpd;
                  f.spr.clearTint();
                  f.spr.setAlpha(0.7);
                }

                f.spr.x += f.dir * f.spd * dt;
                if (f.spr.x > this.GW - 50) { f.dir = -1; f.spr.setFlipX(true); }
                if (f.spr.x < 50) { f.dir = 1; f.spr.setFlipX(false); }
              }

              // ── Redraw gauges before game-over check so bar shows full ─
              this.drawGauges();

              // ── Game over check (Stage 3) ───────────────────────────
              if (ammoniaCount >= AMMONIA_DANGER_THRESHOLD) {
                this.triggerGameOver("ammonia");
                return;
              }
              if (nitriteCount >= NITRITE_DANGER_THRESHOLD) {
                this.triggerGameOver("nitrite");
                return;
              }

              // ── Nitrate absorption ──────────────────────────────────
              for (const nr of [...this.nitrateGroup.getChildren()]) {
                if (!nr || !nr.active) continue;
                if (nr.label) { nr.label.x = nr.x; nr.label.y = nr.y - 18; }

                if (nr.y <= this.WATER_TOP + 18) {
                  let nearest = this.plants[0];
                  let minD = Infinity;
                  for (const p of this.plants) {
                    const d = Math.abs(nr.x - p.x);
                    if (d < minD) { minD = d; nearest = p; }
                  }
                  const growAmt = nr.isCombo ? 2 : 1;
                  if (nearest.growth < GROWTH_MAX) {
                    nearest.growth = Math.min(GROWTH_MAX, nearest.growth + growAmt);
                    if (nearest.growth >= GROWTH_MAX) {
                      this.totalGrown++;
                      this.plantsText.setText("Plants grown: " + this.totalGrown);
                    }
                    this.drawPlants();
                    const sparkTxt = nr.isCombo ? "\u2728\u00D72" : "\u2728";
                    const spark = this.add.text(nr.x, this.WATER_TOP + 4, sparkTxt, {
                      fontSize: "18px",
                    }).setDepth(12);
                    this.time.delayedCall(700, () => { if (spark?.active) spark.destroy(); });
                  }
                  if (nr.label) nr.label.destroy();
                  nr.destroy();
                }
              }

              // ── Oxygen bubbles movement (Stage 5) ───────────────────
              for (const b of [...this.bubbleGroup.getChildren()]) {
                if (!b || !b.active) continue;
                b.x += Math.sin(this.time.now / 500 + (b.wobbleOffset || 0)) * 0.3;
                if (b.y <= this.WATER_TOP) b.destroy();
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
        <div style={{ color: "#E49678", maxWidth: 700 }}>
          <strong>Game error:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: 800, height: 600 }} />;
}
