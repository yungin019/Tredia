import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tredia",
  description: "AI-Powered Market Analysis",
};

export default function Head() {
  return (
    <>
      <title>{metadata.title as string}</title>
      <meta name="description" content={metadata.description as string} />
    </>
  );
}
