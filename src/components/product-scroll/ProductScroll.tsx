"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bindAnchorRefresh } from "./anchors";
import { startWave } from "./wave";
import { startHeadphones3D } from "./headphones3d";
import "./product-scroll.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * After Scroll Cinema — Blue Soda–style 3D scroll with real Nexa headphones GLB.
 * Lands into #buy commerce below.
 */
export function ProductScroll() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    if (new URLSearchParams(window.location.search).has("debug")) {
      document.body.classList.add("debug");
    }

    // Lenis is global (SmoothScroll) — do not double-instantiate
    const stopWave = startWave(
      root.querySelector(".wave path") as SVGPathElement | null,
      gsap.ticker,
    );

    // Premium wash starts at "האוזנייה במרחב" and stays through פירוק + NEXA
    const colorTrigger = ScrollTrigger.create({
      trigger: root.querySelector(".s1"),
      start: "top 70%",
      endTrigger: root,
      end: "bottom top",
      onEnter: () => document.body.classList.add("nexa-ps-on-color"),
      onEnterBack: () => document.body.classList.add("nexa-ps-on-color"),
      onLeave: () => document.body.classList.remove("nexa-ps-on-color"),
      onLeaveBack: () => document.body.classList.remove("nexa-ps-on-color"),
    });

    // Hide fixed canvas before #buy paints over the Quiet/NEXA seat
    const buyEl = document.getElementById("buy");
    const buyHide = buyEl
      ? ScrollTrigger.create({
          trigger: buyEl,
          start: "top 95%",
          onEnter: () => {
            const c = document.getElementById("nexa-ps-canvas");
            if (c) {
              c.style.opacity = "0";
              c.style.visibility = "hidden";
            }
          },
          onLeaveBack: () => {
            const c = document.getElementById("nexa-ps-canvas");
            const ps = root.getBoundingClientRect();
            if (c && ps.bottom > 120 && ps.top < window.innerHeight * 0.9) {
              c.style.opacity = "1";
              c.style.visibility = "visible";
            }
          },
        })
      : null;

    const unbindAnchors = bindAnchorRefresh(root);
    const scene = startHeadphones3D(canvas);

    // Intro — when product scroll enters (handoff from cinema)
    const introIo = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        introIo.disconnect();
        const tl = gsap.timeline({ delay: 0.05 });
        tl.call(() => window.dispatchEvent(new Event("intro:can")), [], 0);
        tl.from(
          root.querySelector(".eyebrow"),
          { y: 12, opacity: 0, duration: 0.7, ease: "power3.out" },
          0,
        );
        tl.from(
          root.querySelectorAll(".hero-title .line > span"),
          { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12 },
          0.1,
        );
        tl.from(
          [root.querySelector(".hero-actions"), root.querySelector(".hero-note")],
          { y: 20, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          0.5,
        );
        tl.from(
          root.querySelectorAll(".ps-badge, .scroll-cue"),
          { opacity: 0, duration: 0.8 },
          0.7,
        );
      },
      { threshold: 0.05, rootMargin: "12% 0px 0px 0px" },
    );
    introIo.observe(root);

    ScrollTrigger.create({
      trigger: root.querySelector(".s2"),
      start: "top 65%",
      toggleActions: "play none none reverse",
      animation: gsap.from(root.querySelector(".flavour h2 > span"), {
        yPercent: 110,
        duration: 0.9,
        ease: "power4.out",
        immediateRender: false,
      }),
    });
    ScrollTrigger.create({
      trigger: root.querySelector(".s2"),
      start: "top 60%",
      toggleActions: "play none none reverse",
      animation: gsap.from(root.querySelectorAll(".flavour .sub, .flavour .body"), {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        immediateRender: false,
      }),
    });

    ScrollTrigger.create({
      trigger: root.querySelector(".s3"),
      start: "top 40%",
      toggleActions: "play none none reverse",
      animation: gsap.from(root.querySelectorAll(".word > span"), {
        yPercent: 110,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        immediateRender: false,
      }),
    });
    gsap.fromTo(
      root.querySelector(".glow"),
      { scale: 0.6, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector(".s3"),
          start: "top 70%",
          end: "top top",
          scrub: true,
        },
      },
    );
    gsap.fromTo(
      root.querySelector(".ground"),
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector(".s3"),
          start: "top 30%",
          end: "top top",
          scrub: true,
        },
      },
    );

    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      introIo.disconnect();
      colorTrigger.kill();
      buyHide?.kill();
      stopWave();
      unbindAnchors();
      scene.destroy();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && root.contains(st.trigger as Node)) st.kill();
      });
      document.body.classList.remove("nexa-ps-on-color", "debug");
    };
  }, []);

  return (
    <section ref={rootRef} className="nexa-ps" aria-label="Nexa — גלילת מוצר תלת־ממד">
      <canvas id="nexa-ps-canvas" ref={canvasRef} />

      <div className="ps-badge" aria-hidden>
        <svg viewBox="0 0 100 100">
          <defs>
            <path
              id="nexa-badge-circle"
              d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            />
          </defs>
          <text>
            <textPath
              href="#nexa-badge-circle"
              textLength="238"
              lengthAdjust="spacing"
            >
              STUDIO · ANC · 40H · NEXA ·{" "}
            </textPath>
          </text>
          <path
            className="leaf"
            d="M57 41c-9 1-15 7-15 15 0 1 0 2 .3 3 8 0 14-6 14.7-18z"
          />
          <path className="vein" d="M44 57l9-11" />
        </svg>
      </div>

      <main>
        <section className="s s1">
          <div className="ps-orbit" aria-hidden />
          <div className="ps-ring" aria-hidden />
          <ul className="ps-chips" aria-hidden>
            <li>ANC</li>
            <li>48H</li>
            <li>IPX4</li>
          </ul>
          <div className="hero-copy">
            <p className="eyebrow">Nexa Pro · Studio Edition</p>
            <h2 className="hero-title">
              <span className="line">
                <span>האוזנייה.</span>
              </span>
              <span className="line">
                <span>במרחב.</span>
              </span>
            </h2>
            <p className="hero-lede">
              הרגע שבו הרעש נעלם — והמיקוד חוזר
            </p>
            <p className="hero-pull">
              גללו. תראו. תרגישו את המשקל לפני שמחליטים.
            </p>
            <div className="hero-actions">
              <a className="link" href="#nexa-flavour">
                המשיכו לפירוק <span>←</span>
              </a>
            </div>
          </div>
          <div className="hero-note">
            <span className="rule" />
            <strong>ברזל. רשת. שקט.</strong>
            <p>מהסרט אל המודל — בלי לחץ קופה כאן.</p>
          </div>
          <div className="scroll-cue">
            <span>Scroll</span>
            <i />
          </div>
          <div
            className="anchor"
            id="anchor-1"
            data-rx="14"
            data-ry="-25"
            data-rz="16"
          />
        </section>

        <section className="s s2" id="nexa-flavour">
          <div className="ps-orbit ps-orbit--soft" aria-hidden />
          <div
            className="anchor"
            id="anchor-2"
            data-rx="14"
            data-ry="-30"
            data-rz="26"
          />
          <div className="flavour">
            <p className="flavour-kicker">Feel first</p>
            <h2 className="mask">
              <span>תרגישו את השקט</span>
            </h2>
            <p className="sub">קשת טיטניום · כריות אקוסטיות · דרייבר 40 מ״מ</p>
            <p className="body">
              סובבו בתלת־ממד. תראו את הזווית והמשקל — בלי החלטה עדיין. רק
              התנסות.
            </p>
            <ul className="flavour-pull">
              <li>«סוף סוף שקט בזום»</li>
              <li>«יום שלם בלי ציד שקע»</li>
              <li>«משקל שמורגש — לא מעיק»</li>
            </ul>
            <ul className="flavour-specs">
              <li>
                <span>קשת</span>
                <strong>טיטניום</strong>
              </li>
              <li>
                <span>דרייבר</span>
                <strong>40 מ״מ</strong>
              </li>
              <li>
                <span>משקל</span>
                <strong>~280ג</strong>
              </li>
            </ul>
          </div>
        </section>

        <section className="s s3">
          <svg
            className="wave"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="nexa-wave-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#141820" />
                <stop offset=".45" stopColor="#2a3038" />
                <stop offset="1" stopColor="#d8d6d2" />
              </linearGradient>
            </defs>
            <path fill="url(#nexa-wave-grad)" />
          </svg>
          <div className="glow" />
          <div className="ground" />
          <div className="s3-ornament s3-ornament--a" aria-hidden />
          <div className="s3-ornament s3-ornament--b" aria-hidden />
          <p className="s3-tag">Silent Gallery</p>
          <h2 className="word left">
            <span>Quiet</span>
          </h2>
          <h2 className="word right">
            <span>Nexa</span>
          </h2>
          <p className="s3-caption">עיצוב שלא צועק — שקט שכן</p>
          <div
            className="anchor"
            id="anchor-3"
            data-rx="8"
            data-ry="0"
            data-rz="0"
          />
        </section>
      </main>
    </section>
  );
}
