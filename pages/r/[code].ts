import type { NextApiRequest, NextApiResponse } from "next";

function getPlatform(userAgent: string) {
  if (/Android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  return "web";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const referralCode = String(req.query.code || "").trim().toUpperCase();
  const userAgent = String(req.headers["user-agent"] || "");
  const platform = getPlatform(userAgent);

  try {
    await fetch(
      "https://us-central1-stocker-fcda2.cloudfunctions.net/storeReferralClick",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            referralCode,
            userAgent,
            platform,
          },
        }),
      }
    );
  } catch (e) {
    console.error("storeReferralClick error:", e);
  }

  const redirectUrl =
    platform === "android"
      ? "https://play.google.com/store/apps/details?id=com.newcompany.stocker"
      : platform === "ios"
      ? "https://apps.apple.com/app/id1565527320"
      : "https://stockstobuynow.ai";

  res.redirect(302, redirectUrl);
}
