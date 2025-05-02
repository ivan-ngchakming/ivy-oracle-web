import { createDataAttribute } from "next-sanity"
import { config } from "@/sanity/client"
import Info from "./Info"
import React from "react"
import Block from "./Block"

type BlockRendererProps = {
  block: BlockType
  index: number
  pageId: string
  pageType: string
}

type BlocksType = {
  [key: string]: React.FC<any>;
};

type BlockType = {
  _type: string;
  _key: string;
};

const Blocks: BlocksType = {
  infoSection: Info,
  block: Block,
};

export function BlockRenderer({ block, index, pageId, pageType }: BlockRendererProps) {
  if (typeof Blocks[block._type] !== "undefined") {
  return <div
    data-sanity={createDataAttribute({
      ...config,
      id: pageId,
      type: pageType,
      path: `blocks[_key=="${block._key}"]`,
    }).toString()}
  >
    {React.createElement(Blocks[block._type], {
      key: block._key,
      block: block,
      index: index,
    })}
    </div>
  }

  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key },
  );
}
