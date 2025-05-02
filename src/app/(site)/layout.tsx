import "@fortawesome/fontawesome-free/css/all.min.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { VisualEditing } from "next-sanity";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Ivy Oracle',
  description: 'Ivy oracle FTSO data provider on Flare and Songbird',
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-200 w-full">
      <SpeedInsights />
      <Analytics />
      {children}
      {(await draftMode()).isEnabled && (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </div>
  );
}
