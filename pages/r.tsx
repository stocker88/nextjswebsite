import { useRouter } from "next/router";
import { useEffect } from "react";

function getPlatform(userAgent: string) {
  if (/Android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  return "web";
}

export default function ReferralPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const referralCode = String(router.query.code || "").trim().toUpperCase();
    if (!referralCode) {
      window.location.href = "https://stockstobuynow.ai";
      return;
    }

    const userAgent = navigator.userAgent || "";
    const platform = getPlatform(userAgent);

    fetch("https://us-central1-stocker-fcda2.cloudfunctions.net/storeReferralClick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referralCode,
        userAgent,
        platform,
      }),
    }).finally(() => {
      window.location.href =
        platform === "android"
          ? "https://play.google.com/store/apps/details?id=com.newcompany.stocker"
          : platform === "ios"
          ? "https://apps.apple.com/app/id1565527320"
          : "https://stockstobuynow.ai";
    });
  }, [router.isReady, router.query.code]);

  return null;
}