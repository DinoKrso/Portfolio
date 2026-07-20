/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Concentric ripple layers for the intro reveal, largest first (warm dark -> cream)
const RIPPLES = [
  { size: 460, color: "#17150f" },
  { size: 320, color: "#2c2416" },
  { size: 190, color: "#E1E0CC" },
];

// Lowpoly material shortcut for the warm, flat-shaded room look
function matte(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0,
    flatShading: true,
    ...opts,
  });
}

function box(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  return mesh;
}

// Builds the entire stylized developer room out of primitives.
// Layout: floor at y=0, back wall at z=-2.6, left wall (shelf) at x=-5.6,
// right wall (window) at x=5.6. Desk with glowing monitor against the back wall.
function buildRoom(scene: THREE.Scene) {
  const room = new THREE.Group();

  // Palette
  const wallMat = matte(0x181410);
  const floorMat = matte(0x120f0c);
  const woodMat = matte(0x4a3421);
  const darkWoodMat = matte(0x33241a);
  const deviceMat = matte(0x1c1c1e, { roughness: 0.6 });
  const creamMat = matte(0x8a8672);

  // Floor + rug
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), floorMat);
  floor.rotation.x = -Math.PI / 2;
  room.add(floor);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(2.4, 24), matte(0x2a2018));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.4, 0.01, 0.6);
  room.add(rug);

  // Walls
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), wallMat);
  backWall.position.set(0, 3, -2.6);
  room.add(backWall);
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), wallMat.clone());
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-5.6, 3, 2);
  room.add(leftWall);
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), wallMat.clone());
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(5.6, 3, 2);
  room.add(rightWall);

  // Window on the right wall with a cool "moonlight" pane
  const windowFrame = box(0.12, 2.2, 3.0, darkWoodMat, 5.55, 2.6, 0.6);
  room.add(windowFrame);
  const windowPane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 2.0),
    new THREE.MeshStandardMaterial({
      color: 0x1c2d40,
      emissive: 0x2a4a66,
      emissiveIntensity: 0.55,
      roughness: 1,
    })
  );
  windowPane.rotation.y = -Math.PI / 2;
  windowPane.position.set(5.48, 2.6, 0.6);
  room.add(windowPane);
  const windowBar = box(0.1, 2.0, 0.06, darkWoodMat, 5.46, 2.6, 0.6);
  room.add(windowBar);

  // Desk against the back wall
  const deskTop = box(3.6, 0.1, 1.5, woodMat, 0, 1.05, -1.7);
  room.add(deskTop);
  const legPositions: [number, number][] = [
    [-1.65, -1.1],
    [1.65, -1.1],
    [-1.65, -2.3],
    [1.65, -2.3],
  ];
  legPositions.forEach(([lx, lz]) => {
    room.add(box(0.09, 1.0, 0.09, darkWoodMat, lx, 0.5, lz));
  });

  // Monitor: stand, bezel and a glowing screen
  room.add(box(0.5, 0.05, 0.3, deviceMat, 0, 1.13, -2.0));
  room.add(box(0.08, 0.35, 0.08, deviceMat, 0, 1.3, -2.0));
  room.add(box(1.7, 1.05, 0.07, deviceMat, 0, 1.85, -2.05));
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x9db8cc,
    emissive: 0x87b0d6,
    emissiveIntensity: 1.15,
    roughness: 1,
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 0.9), screenMat);
  screen.position.set(0, 1.85, -2.01);
  room.add(screen);

  // Keyboard, mouse, mug
  room.add(box(0.95, 0.045, 0.32, deviceMat, -0.1, 1.13, -1.45));
  room.add(box(0.14, 0.05, 0.2, deviceMat, 0.65, 1.13, -1.45));
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.18, 10), creamMat);
  mug.position.set(-1.2, 1.19, -1.5);
  room.add(mug);

  // Books on the desk
  room.add(box(0.35, 0.07, 0.25, matte(0x6e4a2f), 1.3, 1.14, -2.0));
  room.add(box(0.32, 0.07, 0.23, matte(0x3d4a35), 1.28, 1.21, -2.02));
  room.add(box(0.3, 0.06, 0.22, matte(0x59452c), 1.32, 1.275, -1.98));

  // Wall shelf with books (left side)
  const shelfY = [2.4, 3.1];
  shelfY.forEach((sy) => {
    room.add(box(0.06, 0.05, 2.4, darkWoodMat, -5.5, sy, 1.2));
  });
  const bookColors = [0x6e4a2f, 0x3d4a35, 0x59452c, 0x50392b, 0x445138, 0x63503a, 0x3b3129];
  bookColors.forEach((c, i) => {
    const h = 0.32 + (i % 3) * 0.05;
    const b = box(0.16, h, 0.05 + (i % 2) * 0.03, matte(c));
    b.position.set(-5.44, 2.43 + h / 2, 0.28 + i * 0.24);
    b.rotation.x = (i % 3 === 2 ? 0.06 : 0);
    room.add(b);
  });
  bookColors.slice(0, 5).forEach((c, i) => {
    const h = 0.3 + ((i + 1) % 3) * 0.05;
    const b = box(0.16, h, 0.06, matte(c));
    b.position.set(-5.44, 3.13 + h / 2, 0.5 + i * 0.28);
    room.add(b);
  });

  // Plant: pot + leafy cones
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.3, 8), matte(0x8a5a3a));
  pot.position.set(2.6, 0.15, -1.9);
  room.add(pot);
  const leafMat = matte(0x3f5a37);
  [
    [0, 0.62, 0, 0.28, 0.5],
    [0.16, 0.5, 0.1, 0.2, 0.42],
    [-0.15, 0.52, -0.06, 0.22, 0.4],
    [0.02, 0.78, -0.1, 0.16, 0.34],
  ].forEach(([ox, oy, oz, r, h]) => {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), leafMat);
    leaf.position.set(2.6 + ox, oy, -1.9 + oz);
    room.add(leaf);
  });

  // Desk lamp with warm bulb
  room.add(box(0.16, 0.03, 0.16, deviceMat, -1.5, 1.12, -2.05));
  const lampArm = box(0.04, 0.5, 0.04, deviceMat, -1.5, 1.38, -2.05);
  lampArm.rotation.z = 0.35;
  room.add(lampArm);
  const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 8), matte(0x2a2a2c, { roughness: 0.5 }));
  lampHead.position.set(-1.62, 1.62, -2.02);
  lampHead.rotation.z = 2.4;
  room.add(lampHead);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffdca8, emissive: 0xffc987, emissiveIntensity: 2 })
  );
  bulb.position.set(-1.66, 1.58, -2.0);
  room.add(bulb);

  // Posters on the back wall
  const poster1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.1), matte(0x2c3a4a, { emissive: 0x16222e, emissiveIntensity: 0.4 }));
  poster1.position.set(-2.6, 3.1, -2.58);
  poster1.rotation.z = 0.02;
  room.add(poster1);
  const poster2 = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9), matte(0x4a3a2c, { emissive: 0x2e2216, emissiveIntensity: 0.4 }));
  poster2.position.set(2.4, 3.2, -2.58);
  poster2.rotation.z = -0.03;
  room.add(poster2);
  const poster3 = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.7), matte(0x3a4a3a, { emissive: 0x1c2e1c, emissiveIntensity: 0.35 }));
  poster3.position.set(-1.4, 3.6, -2.58);
  room.add(poster3);

  // Chair
  const chairSeat = box(0.55, 0.07, 0.5, matte(0x26211c), 0.85, 0.62, -0.4);
  room.add(chairSeat);
  const chairBack = box(0.55, 0.7, 0.07, matte(0x26211c), 0.85, 1.0, -0.12);
  chairBack.rotation.x = -0.12;
  room.add(chairBack);
  room.add(box(0.06, 0.6, 0.06, deviceMat, 0.85, 0.31, -0.3));

  // Side table with a small stack of boxes/books
  room.add(box(0.9, 0.08, 0.6, darkWoodMat, -3.6, 0.55, -1.9));
  room.add(box(0.08, 0.55, 0.08, darkWoodMat, -3.9, 0.27, -2.1));
  room.add(box(0.08, 0.55, 0.08, darkWoodMat, -3.3, 0.27, -2.1));
  room.add(box(0.08, 0.55, 0.08, darkWoodMat, -3.9, 0.27, -1.7));
  room.add(box(0.08, 0.55, 0.08, darkWoodMat, -3.3, 0.27, -1.7));
  room.add(box(0.4, 0.09, 0.3, matte(0x50392b), -3.6, 0.63, -1.9));
  room.add(box(0.35, 0.08, 0.26, matte(0x445138), -3.62, 0.71, -1.88));

  scene.add(room);
  return { screenMat };
}

export default function Room3DBg() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // The scene builds instantly, so the loader is a short branded count-up
  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 9 + Math.round(Math.random() * 14));
        if (next >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => setIsLoading(false), 250);
        }
        return next;
      });
    }, 80);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0908);
    scene.fog = new THREE.Fog(0x0a0908, 7, 24);

    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      60
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const { screenMat } = buildRoom(scene);

    // Lighting: dim warm ambience, warm desk lamp, cool monitor + window light
    scene.add(new THREE.HemisphereLight(0x3a3226, 0x0c0a08, 0.55));
    const lampLight = new THREE.PointLight(0xffc987, 14, 9, 2);
    lampLight.position.set(-1.6, 1.7, -1.8);
    scene.add(lampLight);
    const screenLight = new THREE.PointLight(0x87b0d6, 7, 6, 2);
    screenLight.position.set(0, 1.8, -1.5);
    scene.add(screenLight);
    const windowLight = new THREE.PointLight(0x4a6c8c, 6, 8, 2);
    windowLight.position.set(4.8, 2.6, 0.6);
    scene.add(windowLight);

    // Drifting dust motes in the light
    const dustCount = isMobile ? 60 : 140;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 9;
      dustPositions[i * 3 + 1] = 0.4 + Math.random() * 3.4;
      dustPositions[i * 3 + 2] = -2.2 + Math.random() * 6;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xe1e0cc,
      size: 0.02,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Camera journey through the five acts, scrubbed over the whole page scroll.
    // Mutable proxies tweened by the timeline; applied to the camera every frame.
    const camPos = { x: 5.4, y: 3.0, z: 6.8 };
    const look = { x: -0.4, y: 1.3, z: -1.2 };
    const fx = { screenGlow: 1.15 };

    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    // Act 2 (manifesto): dolly in toward the desk
    tl.to(camPos, { x: 2.2, y: 2.0, z: 4.4, duration: 1 }, 0)
      .to(look, { x: -0.2, y: 1.25, z: -1.6, duration: 1 }, 0)
      // Act 3 (gallery): track laterally across the room
      .to(camPos, { x: -3.2, y: 1.8, z: 4.0, duration: 1 }, 1)
      .to(look, { x: -0.6, y: 1.2, z: -1.5, duration: 1 }, 1)
      // Act 4 (tech): swing toward the shelf wall
      .to(camPos, { x: -4.2, y: 2.4, z: 1.6, duration: 1 }, 2)
      .to(look, { x: 0.9, y: 1.6, z: -1.7, duration: 1 }, 2)
      // Act 5 (contact): push in on the glowing monitor
      .to(camPos, { x: -0.1, y: 1.5, z: 0.6, duration: 1 }, 3)
      .to(look, { x: 0, y: 1.6, z: -2.0, duration: 1 }, 3)
      .to(fx, { screenGlow: 2.4, duration: 1 }, 3);

    let scrollTriggerInstance: ScrollTrigger | null = null;
    let initTimeout: ReturnType<typeof setTimeout> | null = null;
    const initScrollTrigger = () => {
      const scroller = document.getElementById("main-scroll-container");
      if (!scroller) {
        initTimeout = setTimeout(initScrollTrigger, 100);
        return;
      }
      scrollTriggerInstance = ScrollTrigger.create({
        animation: tl,
        scroller,
        start: 0,
        end: "max",
        scrub: 0.8,
      });
    };
    if (!prefersReducedMotion) initScrollTrigger();

    // Gentle mouse parallax on desktop
    const mouseOffset = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      gsap.to(mouseOffset, { x: nx * 0.35, y: -ny * 0.2, duration: 1, ease: "power2.out", overwrite: "auto" });
    };
    if (!prefersReducedMotion) window.addEventListener("mousemove", handleMouseMove);

    const clock = new THREE.Clock();
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const bob = prefersReducedMotion ? 0 : Math.sin(t * 0.5) * 0.045;
      camera.position.set(camPos.x + mouseOffset.x, camPos.y + bob + mouseOffset.y, camPos.z);
      camera.lookAt(look.x, look.y, look.z);

      // Subtle monitor flicker so the room feels alive
      screenMat.emissiveIntensity = fx.screenGlow + Math.sin(t * 2.7) * 0.06;
      dust.rotation.y = t * 0.008;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (initTimeout) clearTimeout(initTimeout);
      scrollTriggerInstance?.kill();
      tl.kill();
      gsap.killTweensOf(mouseOffset);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {/* Ripple Intro Loading Overlay: concentric theme-color circles that expand to reveal the site */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            id="room-loader-overlay"
            className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden pointer-events-none"
            exit={{
              opacity: 0,
              transition: { duration: 0.45, delay: prefersReducedMotion ? 0 : 1.0, ease: "easeOut" },
            }}
          >
            {RIPPLES.map((ripple, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{ width: ripple.size, height: ripple.size, backgroundColor: ripple.color }}
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.05, 1] }}
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }
                }
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { scale: 34, transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: i * 0.12 } }
                }
              />
            ))}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-black/60">
                Loading
              </span>
              <span className="font-mono text-xl font-bold tracking-widest text-black">
                {progress}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D room canvas layer */}
      <div
        ref={mountRef}
        id="room-3d-viewport"
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Cinematic dark vignette over the scene */}
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-70" />
    </>
  );
}
