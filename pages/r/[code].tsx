import { GetServerSideProps } from "next";
import crypto from "crypto";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value || "").digest("hex");
}

function getIp(req: any) {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "";
}

export default function ReferralRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const referralCode = String(params?.code || "").trim().toUpperCase();
  const userAgent = String(req.headers["user-agent"] || "");

  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  const androidUrl =
    "https://play.google.com/store/apps/details?id=com.newcompany.stocker";

  const iosUrl =
    "https://apps.apple.com/app/id1565527320";

  const fallbackUrl = "https://stockstobuynow.ai";

  try {
    const ip = getIp(req);
    const ipHash = sha256(ip);

    const referrerSnap = await admin
      .firestore()
      .collection("users")
      .where("referralCode", "==", referralCode)
      .limit(1)
      .get();

    const referrerUid = referrerSnap.empty ? null : referrerSnap.docs[0].id;

    await admin.firestore().collection("referral_clicks").add({
      referralCode,
      referrerUid,
      ipHash,
      userAgent,
      platform: isAndroid ? "android" : isIOS ? "ios" : "web",
      matched: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error("Referral click error:", e);
  }

  return {
    redirect: {
      destination: isAndroid ? androidUrl : isIOS ? iosUrl : fallbackUrl,
      permanent: false,
    },
  };
};