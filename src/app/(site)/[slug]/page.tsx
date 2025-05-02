import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "@/sanity/client";
import SanityBlocks from "@/components/SanityBlocks";
import Layout from "@/components/Layout";

const query = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]`
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const data = await client.fetch(
    query,
    { slug },
    isEnabled
      ? {
        perspective: "previewDrafts",
        useCdn: false,
        stega: true,
      }
      : undefined
  );

  if (!data) {
    return <div>Page not found</div>;
  }

  return (
    <Layout
      title={data.title}
      bannerTitle={data.title}
    >
      <div className="container my-12 mx-auto min-h-[50vh]">
        <SanityBlocks
          documentId={data._id}
          documentType={data._type}
          blocks={data.blocks}
        />
      </div>
    </Layout>
  );
}
