import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * BernabeuHero3DCanvas
 * Lightweight 3D WebGL Holographic Santiago Bernabéu Stadium & 15-Star Royal Crown Orbital Ring
 * Built according to `threejs-skills` (`threejs-fundamentals` r186: THREE.Timer, setAnimationLoop, DPR cap 2, full GPU disposal).
 */
export const BernabeuHero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Graceful fallback if WebGL context is unavailable
      return;
    }

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 460;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 5.4, 9.8);
    camera.lookAt(0, 0, 0);

    const rootGroup = new THREE.Group();
    rootGroup.rotation.x = -0.18;
    scene.add(rootGroup);

    const disposables: Array<{ dispose: () => void }> = [];

    // 1. Holographic Tactical Pitch Wireframe (Bernabéu Turf Proportions 10.5 x 6.8)
    const pitchGroup = new THREE.Group();
    rootGroup.add(pitchGroup);

    const goldLineMat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.42,
    });
    const blueLineMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.25,
    });
    disposables.push(goldLineMat, blueLineMat);

    // Outer pitch boundary + halfway line
    const pw = 7.6;
    const ph = 4.9;
    const borderPts = [
      new THREE.Vector3(-pw / 2, 0, -ph / 2),
      new THREE.Vector3(pw / 2, 0, -ph / 2),
      new THREE.Vector3(pw / 2, 0, ph / 2),
      new THREE.Vector3(-pw / 2, 0, ph / 2),
      new THREE.Vector3(-pw / 2, 0, -ph / 2),
    ];
    const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
    disposables.push(borderGeo);
    pitchGroup.add(new THREE.Line(borderGeo, goldLineMat));

    const midPts = [
      new THREE.Vector3(0, 0, -ph / 2),
      new THREE.Vector3(0, 0, ph / 2),
    ];
    const midGeo = new THREE.BufferGeometry().setFromPoints(midPts);
    disposables.push(midGeo);
    pitchGroup.add(new THREE.Line(midGeo, goldLineMat));

    // Center circle
    const circlePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      circlePts.push(new THREE.Vector3(Math.cos(a) * 0.95, 0, Math.sin(a) * 0.95));
    }
    const circleGeo = new THREE.BufferGeometry().setFromPoints(circlePts);
    disposables.push(circleGeo);
    pitchGroup.add(new THREE.Line(circleGeo, goldLineMat));

    // Left & Right Penalty Boxes
    const makeBox = (sign: number) => {
      const xEdge = (pw / 2) * sign;
      const xIn = xEdge - 1.25 * sign;
      const zHalf = 1.45;
      const pts = [
        new THREE.Vector3(xEdge, 0, -zHalf),
        new THREE.Vector3(xIn, 0, -zHalf),
        new THREE.Vector3(xIn, 0, zHalf),
        new THREE.Vector3(xEdge, 0, zHalf),
      ];
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      disposables.push(g);
      return new THREE.Line(g, blueLineMat);
    };
    pitchGroup.add(makeBox(-1));
    pitchGroup.add(makeBox(1));

    // 2. Bernabéu Architectural Stadium Tiers (3 Concentric Elliptical Rings)
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    [
      { rx: 4.8, rz: 3.3, y: 0.45, mat: blueLineMat },
      { rx: 5.5, rz: 3.85, y: 0.95, mat: goldLineMat },
      { rx: 6.15, rz: 4.35, y: 1.45, mat: blueLineMat },
    ].forEach((tier) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const theta = (i / 96) * Math.PI * 2;
        pts.push(
          new THREE.Vector3(Math.cos(theta) * tier.rx, tier.y, Math.sin(theta) * tier.rz)
        );
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      disposables.push(g);
      ringGroup.add(new THREE.Line(g, tier.mat));
    });

    // 3. 15 UEFA Champions League Stars Orbital Crown Ring (La Decimoquinta)
    const crownStarsGroup = new THREE.Group();
    crownStarsGroup.position.y = 1.65;
    rootGroup.add(crownStarsGroup);

    const starGeo = new THREE.OctahedronGeometry(0.11, 0);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0xf5d061,
      wireframe: false,
    });
    disposables.push(starGeo, starMat);

    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.position.set(
        Math.cos(angle) * 3.4,
        Math.sin(angle * 3) * 0.12,
        Math.sin(angle) * 2.35
      );
      crownStarsGroup.add(starMesh);
    }

    // 4. Golden Bernabéu Stadium Atmosphere Particles
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 4.5 - 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf5d061,
      size: 0.055,
      transparent: true,
      opacity: 0.55,
    });
    disposables.push(particleGeo, particleMat);
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Pointer Parallax Interaction
    let targetRotY = 0;
    let targetRotX = -0.18;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
      targetRotY = nx * 0.22;
      targetRotX = -0.18 + ny * 0.08;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop with THREE.Timer (r186 standard)
    const timer = new THREE.Timer();
    renderer.setAnimationLoop((timestamp: number) => {
      timer.update(timestamp);
      const elapsed = timer.getElapsed();

      crownStarsGroup.rotation.y = elapsed * 0.22;
      ringGroup.rotation.y = -elapsed * 0.05;
      particles.rotation.y = elapsed * 0.03;

      rootGroup.rotation.y += (targetRotY + Math.sin(elapsed * 0.35) * 0.08 - rootGroup.rotation.y) * 0.04;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.04;

      renderer?.render(scene, camera);
    });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
      disposables.forEach((d) => d.dispose());
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-85"
    />
  );
};
