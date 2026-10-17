"use client";

import dynamic from "next/dynamic";

export const ContinueResumeLazy = dynamic(
  () =>
    import("./ContinueResume").then((m) => m.ContinueResume),
  { ssr: false, loading: () => null },
);
