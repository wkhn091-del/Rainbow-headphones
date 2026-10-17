/** Product cinema reel — world → explode → detail (video scrub). */

export const CINEMA = {
  scrubSrc: "/videos/product/cinema-scrub.mp4",
  /** Product-first still — headphones (not world/space plate) */
  poster: "/images/lifestyle/nexa-real-desk.jpg",
  /** Scroll distance for pin scrub — kept short so M3 strip is reachable */
  trackVh: 280,
  chapters: [
    {
      id: "world",
      src: "/videos/product/scrub-02.mp4",
      poster: "/videos/product/poster-02.jpg",
      start: 0,
      end: 1 / 3,
      eyebrow: "01 · עולם",
      title: "רחוק.\nואז קרוב.",
      body: "מתחילים מהחלל. הגלילה שלכם מקרבת — תראו מה מחכה ברגע הבא.",
      nextTease: "הבא: הפירוק",
    },
    {
      id: "explode",
      src: "/videos/product/scrub-01.mp4",
      poster: "/videos/product/poster-01.jpg",
      start: 1 / 3,
      end: 2 / 3,
      eyebrow: "02 · פירוק",
      title: "שכבה.\nאחרי שכבה.",
      body: "דרייבר, סליל, שבב — נפתח ביד שלכם. עוד רגע אחד עד המגע.",
      nextTease: "הבא: המגע",
    },
    {
      id: "detail",
      src: "/videos/product/scrub-03.mp4",
      poster: "/videos/product/poster-03.jpg",
      start: 2 / 3,
      end: 1,
      eyebrow: "03 · מגע",
      title: "קרוב.\nשלכם.",
      body: "ברזל, רשת, LED — מהצילום האמיתי שלכם. אחרי זה: האוזנייה במרחב.",
      nextTease: "המשך · 3D",
    },
  ],
} as const;

export type CinemaChapter = (typeof CINEMA.chapters)[number];
