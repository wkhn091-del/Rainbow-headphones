import gsap from "gsap";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { getAnchors, type AnchorPose } from "./anchors";
import { buildNexaHeadphones } from "./buildNexaHeadphones";
import { NEXA_MODEL_URL } from "@/lib/3d/model-source";

/** Beats Studio 3 GLB ships cup-up; flip so headband is on top */
let FLIP = true;
let FRONT_Y = 0;

function readCalibration() {
  const params = new URLSearchParams(window.location.search);
  // ?flip toggles; default upright for this asset
  if (params.has("flip")) FLIP = !FLIP;
  FRONT_Y = Number(params.get("front") ?? "0") || 0;
  return params;
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function deg(n: number) {
  return THREE.MathUtils.degToRad(n);
}

function isMobile() {
  return window.innerWidth <= 767;
}

function vw(n: number) {
  return (n / 100) * window.innerWidth;
}

function vh(n: number) {
  return (n / 100) * window.innerHeight;
}

function pixelToWorld(px: number, py: number, heightPx: number, camera: THREE.PerspectiveCamera) {
  const k = (2 * Math.tan(deg(camera.fov) / 2) * camera.position.z) / window.innerHeight;
  return {
    x: (px - window.innerWidth / 2) * k,
    y: -(py - window.innerHeight / 2) * k,
    scale: heightPx * k,
    k,
  };
}

function fitModel(root: THREE.Object3D) {
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  root.position.set(0, 0, 0);
  root.scale.set(1, 1, 1);
  root.rotation.set(0, 0, 0);
  root.updateMatrixWorld(true);

  const box0 = new THREE.Box3().setFromObject(root);
  box0.getSize(size);
  if (size.x > size.y * 1.35 && size.x >= size.z) root.rotation.z = Math.PI / 2;
  else if (size.z > size.y * 1.35 && size.z >= size.x) root.rotation.x = -Math.PI / 2;

  if (FLIP) root.rotation.x += Math.PI;
  root.rotation.y += deg(FRONT_Y);

  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  box.getSize(size);
  box.getCenter(center);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const s = 1 / maxDim;
  root.scale.setScalar(s);
  root.position.set(-center.x * s, -center.y * s, -center.z * s);
}

/** Glossy black cups + chrome pins — readable on #070708 */
function polishGlossy(root: THREE.Object3D) {
  const glossy = new THREE.Color("#2a2a30");
  const matte = new THREE.Color("#3a3a42");
  const chrome = new THREE.Color("#e8ecf2");
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    o.frustumCulled = false;
    o.visible = true;
    const n = (o.name || "").toLowerCase();
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    o.material = mats.map((m) => {
      const phys = new THREE.MeshPhysicalMaterial({
        color: glossy.clone(),
        metalness: 0.55,
        roughness: 0.22,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.6,
        side: THREE.DoubleSide,
      });
      if (
        m instanceof THREE.MeshStandardMaterial ||
        m instanceof THREE.MeshPhysicalMaterial
      ) {
        if (m.map) phys.map = m.map;
        if (m.normalMap) phys.normalMap = m.normalMap;
        // Keep a hint of original lightness so dark GLBs don't vanish
        if (m.color) {
          const lum = m.color.r * 0.2 + m.color.g * 0.2 + m.color.b * 0.2;
          phys.color.offsetHSL(0, 0, Math.min(0.12, lum));
        }
      }
      if (n.includes("band") || n.includes("head")) {
        phys.color.copy(matte);
        phys.metalness = 0.25;
        phys.roughness = 0.65;
        phys.clearcoat = 0.2;
      } else if (
        n.includes("pin") ||
        n.includes("hinge") ||
        n.includes("screw") ||
        n.includes("metal") ||
        n.includes("yoke") ||
        n.includes("rod")
      ) {
        phys.color.copy(chrome);
        phys.metalness = 1;
        phys.roughness = 0.14;
      } else if (n.includes("pad") || n.includes("cushion") || n.includes("soft")) {
        phys.color.set("#2c2c32");
        phys.metalness = 0.02;
        phys.roughness = 0.88;
        phys.clearcoat = 0;
      }
      phys.transparent = false;
      phys.opacity = 1;
      phys.depthWrite = true;
      phys.needsUpdate = true;
      return phys;
    });
    o.castShadow = true;
  });
}

type Waypoint = { x: number; y: number; rx: number; rz: number };

function midWaypoint(a: AnchorPose, b: AnchorPose, i: number): Waypoint {
  if (isMobile()) {
    return i === 0
      ? { x: vw(50), y: vh(60), rx: 6, rz: 2 }
      : { x: vw(50), y: vh(45), rx: 6, rz: 0 };
  }
  return i === 0
    ? { x: vw(40), y: vh(68), rx: 6, rz: 2 }
    : { x: vw(40), y: vh(47), rx: 6, rz: 0 };
}

function quad(a: number, m: number, b: number, t: number) {
  const c = 2 * m - (a + b) / 2;
  const u = 1 - t;
  return u * u * a + 2 * u * t * c + t * t * b;
}

export type Headphones3DHandle = { destroy: () => void };

export function startHeadphones3D(canvas: HTMLCanvasElement): Headphones3DHandle {
  const params = readCalibration();
  const upright = params.has("upright");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 1.1;

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(-4, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd8d6d2, 0.4);
  fill.position.set(5, 2, 4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.4);
  rim.position.set(0, 3, -6);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;

  const canGroup = new THREE.Group();
  canGroup.rotation.order = "XZY";
  const floatGroup = new THREE.Group();
  canGroup.add(floatGroup);
  scene.add(canGroup);


  let modelReady = false;
  let introFired = false;
  let introP = upright ? 1 : 0;
  const mats: THREE.Material[] = [];

  const applyIntroMats = (opacity: number) => {
    mats.forEach((m) => {
      m.transparent = opacity < 0.999;
      m.opacity = opacity;
      m.depthWrite = opacity >= 0.999;
    });
  };

  const collectMats = (root: THREE.Object3D) => {
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const list = Array.isArray(o.material) ? o.material : [o.material];
      list.forEach((m) => {
        if (m) mats.push(m);
      });
    });
  };

  const maybeIntro = () => {
    if (!modelReady || !introFired || upright || introP >= 1) return;
    gsap.to(
      { p: introP },
      {
        p: 1,
        duration: 1.1,
        ease: "power3.out",
        onUpdate() {
          introP = (this.targets()[0] as { p: number }).p;
        },
      },
    );
  };

  const mountModel = (root: THREE.Object3D, applyPolish = true, source = "glb") => {
    while (floatGroup.children.length) {
      floatGroup.remove(floatGroup.children[0]!);
    }
    mats.length = 0;
    const wrap = new THREE.Group();
    wrap.add(root);
    fitModel(root);
    if (applyPolish) polishGlossy(root);
    else {
      root.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        o.frustumCulled = false;
        o.visible = true;
        const list = Array.isArray(o.material) ? o.material : [o.material];
        list.forEach((m) => {
          if (!m) return;
          m.side = THREE.DoubleSide;
          m.transparent = false;
          m.opacity = 1;
          m.depthWrite = true;
          if (
            m instanceof THREE.MeshStandardMaterial ||
            m instanceof THREE.MeshPhysicalMaterial
          ) {
            m.envMapIntensity = Math.max(m.envMapIntensity ?? 1, 1.2);
            m.metalness = Math.min(m.metalness, 0.85);
            m.roughness = Math.max(m.roughness, 0.18);
            // Studio black cups — keep enough value to read on #070708
            if (m.color.getHSL({ h: 0, s: 0, l: 0 }).l < 0.12) {
              m.color.set("#1c1c22");
            } else {
              m.color.offsetHSL(0, 0, -0.04);
            }
            m.metalness = Math.max(m.metalness, 0.45);
            m.roughness = Math.min(m.roughness, 0.35);
          }
          m.needsUpdate = true;
        });
      });
    }
    collectMats(root);
    applyIntroMats(1);
    floatGroup.add(wrap);
    modelReady = true;
    introP = 1;
    const box = new THREE.Box3().setFromObject(wrap);
    const size = box.getSize(new THREE.Vector3());
    let meshCount = 0;
    root.traverse((o) => {
      if (o instanceof THREE.Mesh) meshCount += 1;
    });
    (window as unknown as { __nexa3d?: object }).__nexa3d = {
      source,
      modelReady,
      size: size.toArray(),
      meshes: meshCount,
      matCount: mats.length,
    };
  };

  // User GLB: Downloads/beats_studio_3_heaphones.glb → /models/can.glb
  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
  loader.setDRACOLoader(draco);
  loader.load(
    `${NEXA_MODEL_URL}?v=beats-studio-3`,
    (gltf) => {
      // Keep authored materials — full polish was crushing this GLB to invisible
      mountModel(gltf.scene, false, "glb");
    },
    undefined,
    (err) => {
      console.warn("[nexa3d] GLB failed, using procedural", err);
      mountModel(buildNexaHeadphones(), true, "procedural");
    },
  );

  const onIntro = () => {
    introFired = true;
    maybeIntro();
  };
  window.addEventListener("intro:can", onIntro);

  let mouseX = 0;
  let mouseY = 0;
  let smX = 0;
  let smY = 0;
  const onMove = (e: MouseEvent) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove);

  const onRefresh = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  };
  window.addEventListener("anchors:refresh", onRefresh);

  // Absolute scroll of product-scroll root
  const root = canvas.closest(".nexa-ps") as HTMLElement | null;

  const readScrollY = () => {
    const lenis = (window as unknown as { __lenis?: { scroll: number } }).__lenis;
    const y = typeof lenis?.scroll === "number" ? lenis.scroll : window.scrollY;
    const rootTop = root?.offsetTop ?? 0;
    return y - rootTop;
  };

  const poseFromScroll = () => {
    const anchors = getAnchors();
    if (!anchors.length || !modelReady) return;

    const scrollY = readScrollY();

    if (upright) {
      const p = pixelToWorld(window.innerWidth / 2, window.innerHeight / 2, vh(50), camera);
      canGroup.position.set(p.x, p.y, 0);
      canGroup.scale.setScalar(p.scale);
      canGroup.rotation.set(0, 0, 0);
      floatGroup.position.y = 0;
      floatGroup.rotation.set(0, 0, 0);
      applyIntroMats(1);
      return;
    }

    let A = anchors[0]!;
    let B = anchors[anchors.length - 1]!;
    let t = 0;
    let seg = 0;

    if (scrollY <= anchors[0]!.scroll) {
      A = B = anchors[0]!;
      t = 0;
    } else if (scrollY >= anchors[anchors.length - 1]!.scroll) {
      A = B = anchors[anchors.length - 1]!;
      t = 1;
    } else {
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i]!;
        const b = anchors[i + 1]!;
        if (scrollY >= a.scroll && scrollY <= b.scroll) {
          A = a;
          B = b;
          seg = i;
          t = easeInOutQuad((scrollY - a.scroll) / Math.max(1, b.scroll - a.scroll));
          break;
        }
      }
    }

    const M = midWaypoint(A, B, seg);
    const px = A === B ? A.x : quad(A.x, M.x, B.x, t);
    const py = A === B ? A.y : quad(A.y, M.y, B.y, t);
    const h = THREE.MathUtils.lerp(A.h, B.h, t);
    const rx = A === B ? A.rx : quad(A.rx, M.rx, B.rx, t);
    const ry = THREE.MathUtils.lerp(A.ry, B.ry, t) + t * 360;
    const rz = A === B ? A.rz : quad(A.rz, M.rz, B.rz, t);

    // Soft entrance motion only — can stays fully opaque
    const ip = Math.max(introP, 0.35);
    // Keep cans above the bottom seam (was getting swallowed by next section / sticky)
    const bottomSafe = isMobile() ? vh(14) : vh(10);
    const pyIntro = Math.min(
      py + vh(10) * (1 - introP),
      window.innerHeight - h * 0.55 - bottomSafe,
    );
    const world = pixelToWorld(px, pyIntro, h, camera);
    const rzOff = 18 * (1 - introP);
    const ryOff = -55 * (1 - introP);
    const scaleMul = THREE.MathUtils.lerp(0.9, 1, ip);
    // Last plate (Quiet/NEXA): shrink so full silhouette fits the seat
    const lastIdx = anchors.length - 1;
    const onLast =
      A === anchors[lastIdx] ||
      (seg === lastIdx - 1 && t > 0.55);
    const fitMul = onLast ? (isMobile() ? 0.62 : 0.68) : 0.92;

    // Guard against bad layout numbers killing the pose
    const safeScale = Number.isFinite(world.scale) && world.scale > 0 ? world.scale : 2.2;
    const sx = Number.isFinite(world.x) ? world.x : 0;
    const sy = Number.isFinite(world.y) ? world.y : 0;

    canGroup.position.set(sx, sy, 0);
    canGroup.scale.setScalar(safeScale * scaleMul * fitMul);
    canGroup.rotation.set(deg(rx || 0), deg((ry || 0) + ryOff), deg((rz || 0) + rzOff));
    applyIntroMats(1);

    const dbg = (window as unknown as { __nexa3d?: Record<string, unknown> }).__nexa3d;
    if (dbg) {
      dbg.pose = { sx, sy, scale: safeScale * scaleMul, scrollY, px, py, h };
    }
  };

  const tick = () => {
    poseFromScroll();
    if (!modelReady) {
      renderer.render(scene, camera);
      return;
    }
    if (!upright) {
      const t = performance.now() / 1000;
      floatGroup.position.y = Math.sin(t * 1.2) * 0.02;
      const idleRz = Math.sin(t * 0.9) * deg(1.5);
      smX += (mouseX - smX) * 0.06;
      smY += (mouseY - smY) * 0.06;
      const parY = THREE.MathUtils.clamp(smX * deg(3), deg(-3), deg(3));
      const parX = THREE.MathUtils.clamp(-smY * deg(2), deg(-3), deg(3));
      floatGroup.rotation.set(
        THREE.MathUtils.clamp(parX, deg(-3), deg(3)),
        THREE.MathUtils.clamp(parY, deg(-3), deg(3)),
        THREE.MathUtils.clamp(idleRz, deg(-3), deg(3)),
      );
    }
    renderer.render(scene, camera);
  };

  gsap.ticker.add(tick);

  // Reveal as cinema hands off — start slightly early so the can continues down
  const showCanvas = (on: boolean) => {
    canvas.style.opacity = on ? "1" : "0";
    canvas.style.visibility = on ? "visible" : "hidden";
    if (on && !introFired) {
      introFired = true;
      maybeIntro();
    }
  };
  const io = new IntersectionObserver(
    ([e]) => {
      // Hide as soon as the block mostly leaves — never float over #buy
      const buy = document.getElementById("buy");
      const buyTop = buy?.getBoundingClientRect().top ?? Infinity;
      const buyCovering = buyTop < window.innerHeight * 0.95;
      showCanvas(
        Boolean(
          e?.isIntersecting &&
            e.intersectionRatio >= 0.06 &&
            !buyCovering,
        ),
      );
    },
    { threshold: [0, 0.06, 0.12, 0.25, 0.5], rootMargin: "0px 0px -8% 0px" },
  );
  if (root) io.observe(root);

  return {
    destroy() {
      gsap.ticker.remove(tick);
      window.removeEventListener("intro:can", onIntro);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("anchors:refresh", onRefresh);
      io.disconnect();
      draco.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

// Allow calibration overrides from console
export function setCanCalibration(opts: { flip?: boolean; front?: number }) {
  if (opts.flip !== undefined) FLIP = opts.flip;
  if (opts.front !== undefined) FRONT_Y = opts.front;
}
