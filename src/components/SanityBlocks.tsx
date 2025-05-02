'use client'

import {createDataAttribute, useOptimistic} from '@sanity/visual-editing'
import type {SanityDocument} from '@sanity/client'
import { config } from '@/sanity/client'
import BlockRenderer from './blocks/BlockRenderer'

type Block = {
  _key: string
  _type: string
}

type PageData = {
  _id: string
  _type: string
  blocks?: Block[]
}

type BlocksProps = {
  documentId: string
  documentType: string
  blocks?: Block[]
}

export default function Blocks({documentId, documentType, blocks: initialBlocks}: BlocksProps) {
  const blocks = useOptimistic<Block[] | undefined, SanityDocument<PageData>>(
    initialBlocks,
    (currentBlocks, action) => {
      if (action.id === documentId && action.document.blocks) {
        return action.document.blocks
      }
      return currentBlocks
    },
  )

  if (!blocks?.length) {
    return null
  }

  return (
    <div
      data-sanity={createDataAttribute({
        ...config,
        id: documentId,
        type: documentType,
        path: 'blocks',
      }).toString()}
    >
      {blocks.map((block, index) => (
        <div
          key={block._key}
          data-sanity={createDataAttribute({
            ...config,
            id: documentId,
            type: documentType,
            path: `blocks[_key=="${block._key}"]`,
          }).toString()}
        >
          {/* Render your section content here */}
          <BlockRenderer 
            key={block._key}
            index={index}
            block={block}
            pageId={documentId}
            pageType={documentType}
          />
        </div>
      ))}
    </div>
  )
}