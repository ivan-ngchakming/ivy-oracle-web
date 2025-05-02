import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const imageType = defineType({
  name: 'imageType',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Enables hotspot configuration for responsive cropping
      },
    }),
    defineField({
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Important for SEO and accessibility',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      imageUrl: 'image',
      title: 'caption',
      alt: 'alt',
    },
    prepare({imageUrl, title, alt}) {
      return {
        title: title || alt || 'Untitled Image',
        subtitle: 'Image',
        media: imageUrl,
      }
    },
  },
})
