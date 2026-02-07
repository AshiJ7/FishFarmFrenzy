"use client";

import { useEffect, useRef, useState } from "react";
import type * as Phaser from "phaser";

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      try {
        const PhaserModule = await import("phaser");
        const PhaserLib: any = PhaserModule?.default ?? PhaserModule;

        const config: any = {
          type: PhaserLib.AUTO,
          parent: containerRef.current,
          width: 800,
          height: 600,
          backgroundColor: "#87ceeb",
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0 },
              debug: false,
            },
          },
          scene: {
            preload: function (this: any) {
              // no external assets; we'll create a texture from graphics
            },
            create: function (this: any) {
              // create a circular player texture
              const g = this.make.graphics({ x: 0, y: 0, add: false });
              g.fillStyle(0x008800, 1);
              g.fillCircle(32, 32, 28);
              g.generateTexture("player", 64, 64);

              // add player sprite with physics
              const player = this.physics.add.sprite(400, 300, "player");
              player.setCollideWorldBounds(true);
              player.setDrag(600, 600);
              player.setMaxVelocity(400, 400);

              // store references for update
              this.player = player;
              this.cursors = this.input.keyboard.createCursorKeys();

              // helpful label
              const label = this.add.text(10, 10, "Use arrow keys to move", { fontSize: "16px", color: "#003300" });
              label.setScrollFactor(0);
            },
            update: function (this: any) {
              const player = this.player as any;
              const cursors = this.cursors as any;
              if (!player || !cursors) return;

              const speed = 300;
              if (cursors.left.isDown) {
                player.setAccelerationX(-speed);
              } else if (cursors.right.isDown) {
                player.setAccelerationX(speed);
              } else {
                player.setAccelerationX(0);
              }

              if (cursors.up.isDown) {
                player.setAccelerationY(-speed);
              } else if (cursors.down.isDown) {
                player.setAccelerationY(speed);
              } else {
                player.setAccelerationY(0);
              }
            },
          },
          scale: {
            mode: PhaserLib.Scale.FIT,
            autoCenter: PhaserLib.Scale.CENTER_BOTH,
          },
        };

        gameRef.current = new PhaserLib.Game(config);
      } catch (err: any) {
        const message = err?.message || String(err);
        // eslint-disable-next-line no-console
        console.error("PhaserGame initialization error:", err);
        setError(message);
      }
    })();

    return () => {
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true);
        } catch (destroyErr) {
          // eslint-disable-next-line no-console
          console.error("Error destroying Phaser game:", destroyErr);
        }
        gameRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div style={{ width: 800, height: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "#fee" }}>
        <div style={{ color: "#900", maxWidth: 700 }}>
          <strong>Phaser initialization error:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: 800, height: 600 }} />;
}
