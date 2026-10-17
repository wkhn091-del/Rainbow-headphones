export type AnchorPose = {
  scroll: number;
  x: number;
  y: number;
  h: number;
  rx: number;
  ry: number;
  rz: number;
};

let cache: AnchorPose[] = [];

function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== ancestor) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
}

function readAnchors(root: ParentNode = document): AnchorPose[] {
  const scope =
    root instanceof HTMLElement && root.classList.contains("nexa-ps")
      ? root
      : (document.querySelector(".nexa-ps") as HTMLElement | null);
  const els = (scope ?? document).querySelectorAll<HTMLElement>(".anchor");
  return Array.from(els).map((el) => {
    const section = el.closest(".s") as HTMLElement | null;
    const cs = getComputedStyle(el);
    const scroll =
      scope && section ? offsetWithin(section, scope) : (section?.offsetTop ?? 0);
    return {
      scroll,
      x: parseFloat(cs.left),
      y: parseFloat(cs.top),
      h: el.offsetHeight,
      rx: parseFloat(el.dataset.rx ?? "0"),
      ry: parseFloat(el.dataset.ry ?? "0"),
      rz: parseFloat(el.dataset.rz ?? "0"),
    };
  });
}

export function getAnchors(): AnchorPose[] {
  if (!cache.length) cache = readAnchors();
  return cache;
}

export function refreshAnchors(root?: ParentNode) {
  cache = readAnchors(root ?? document);
  window.dispatchEvent(new Event("anchors:refresh"));
}

export function bindAnchorRefresh(root: HTMLElement) {
  let t: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    clearTimeout(t);
    t = setTimeout(() => refreshAnchors(root), 150);
  };
  window.addEventListener("resize", onResize);
  void document.fonts.ready.then(() => refreshAnchors(root));
  refreshAnchors(root);
  return () => {
    window.removeEventListener("resize", onResize);
    clearTimeout(t);
  };
}
