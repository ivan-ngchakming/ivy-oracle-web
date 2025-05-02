import { createDataAttribute } from "next-sanity"
import { config } from "@/sanity/client"
import InfoBlock from "./InfoBlock"
import React from "react"
import BlockBlock from "./BlockBlock"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"


type BlockRendererProps = {
  block: BlockType
  index: number
  pageId: string
  pageType: string
}

type BlocksType = {
  [key: string]: React.FC<any>
}

type BlockType = {
  _type: string
  _key: string
  image?: any
  alt?: string
}

const ImageBlock: React.FC<{ block: BlockType }> = ({ block }) => {
  const imageUrl = urlForImage(block.image)?.url()
  
  if (!imageUrl) return null
  
  return (
    <div className="my-8">
      <Image
        src={imageUrl}
        alt={block.alt || ''}
        width={1200}
        height={800}
        className="w-full h-auto"
      />
    </div>
  )
}

const Blocks: BlocksType = {
  infoSection: InfoBlock,
  block: BlockBlock,
  imageType: ImageBlock,
}

export default function BlockRenderer({ block, index, pageId, pageType }: BlockRendererProps) {
  if (typeof Blocks[block._type] !== "undefined") {
    return (
      <div
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
    )
  }

  return (
    <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
      A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
    </div>
  )
}
