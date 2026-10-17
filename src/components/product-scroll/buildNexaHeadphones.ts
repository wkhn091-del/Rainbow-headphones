import * as THREE from "three";

/**
 * Procedural headphones matching the user's target still:
 * glossy black oval cups · matte headband · chrome pin hinges.
 * Separated parts for future explode — not the old monitor-cans GLB.
 */
export function buildNexaHeadphones() {
  const root = new THREE.Group();
  root.name = "nexa-headphones-procedural";

  const glossyBlack = new THREE.MeshPhysicalMaterial({
    color: "#0a0a0c",
    metalness: 0.55,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.35,
  });
  const matteBand = new THREE.MeshPhysicalMaterial({
    color: "#121214",
    metalness: 0.15,
    roughness: 0.72,
    clearcoat: 0.1,
    clearcoatRoughness: 0.6,
    envMapIntensity: 0.55,
  });
  const chrome = new THREE.MeshPhysicalMaterial({
    color: "#d8dce2",
    metalness: 1,
    roughness: 0.12,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.5,
  });
  const cushion = new THREE.MeshPhysicalMaterial({
    color: "#1a1a1c",
    metalness: 0.02,
    roughness: 0.9,
    clearcoat: 0,
    envMapIntensity: 0.3,
  });

  // Headband — thick torus arc (top half)
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.055, 20, 64, Math.PI),
    matteBand,
  );
  band.rotation.z = Math.PI;
  band.position.y = 0.08;
  band.name = "headband";
  root.add(band);

  // Inner pad on band
  const bandPad = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.028, 12, 48, Math.PI * 0.85),
    cushion,
  );
  bandPad.rotation.z = Math.PI;
  bandPad.position.y = 0.06;
  bandPad.scale.set(1, 1, 0.85);
  bandPad.name = "headband-pad";
  root.add(bandPad);

  const makeCup = (side: -1 | 1) => {
    const g = new THREE.Group();
    g.name = side < 0 ? "cup-L" : "cup-R";
    g.position.set(side * 0.42, -0.22, 0);

    // Glossy outer shell — flattened sphere / oval
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 48, 32),
      glossyBlack,
    );
    shell.scale.set(0.85, 1.05, 0.55);
    shell.name = "shell";
    g.add(shell);

    // Soft cushion ring facing inward
    const pad = new THREE.Mesh(
      new THREE.TorusGeometry(0.13, 0.045, 16, 40),
      cushion,
    );
    pad.rotation.y = Math.PI / 2;
    pad.position.x = side * -0.06;
    pad.scale.set(1, 1.15, 1);
    pad.name = "cushion";
    g.add(pad);

    // Inner disc
    const inner = new THREE.Mesh(
      new THREE.CircleGeometry(0.11, 32),
      cushion,
    );
    inner.rotation.y = Math.PI / 2;
    inner.position.x = side * -0.045;
    inner.name = "inner";
    g.add(inner);

    // Chrome hinge pin (signature of the ref image)
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.14, 24),
      chrome,
    );
    pin.rotation.z = Math.PI / 2;
    pin.position.set(side * -0.02, 0.16, 0);
    pin.name = "chrome-pin";
    g.add(pin);

    // Short chrome collar
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.04, 20),
      chrome,
    );
    collar.rotation.z = Math.PI / 2;
    collar.position.set(side * 0.02, 0.16, 0);
    collar.name = "chrome-collar";
    g.add(collar);

    return g;
  };

  root.add(makeCup(-1));
  root.add(makeCup(1));

  // Center origin
  const box = new THREE.Box3().setFromObject(root);
  const center = new THREE.Vector3();
  box.getCenter(center);
  root.position.sub(center);

  return root;
}
