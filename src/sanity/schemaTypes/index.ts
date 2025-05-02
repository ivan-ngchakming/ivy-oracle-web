import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './objects/blockContentType'
import {categoryType} from './documents/categoryType'
import {postType} from './documents/postType'
import {authorType} from './documents/authorType'
import {pageType} from './documents/pageType'
import {infoSection} from './objects/infoSection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, pageType, infoSection],
}
