import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "@/sanity/client";
import { Sections } from "@/components/Sections";
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

  console.log(data);

  return (
    <Layout
      title={data.title}
      bannerTitle={data.title}
    >
      <div className="container mx-auto min-h-[50vh]">
        <Sections
          documentId={data._id}
          documentType={data._type}
          sections={data.sections}
        />
      </div>
    </Layout>
  );
}