import { GetServerSideProps } from "next";

function getPlatform(userAgent: string) {
  if (/Android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  return "web";
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const referralCode = String(params?.code || "").trim().toUpperCase();

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
          referralCode,
          userAgent,
          platform,
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

  return {
    redirect: {
      destination: redirectUrl,
      permanent: false,
    },
  };
};

export default function ReferralPage() {
  return null;
}