/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h1: ({ children, value }) => (
        <h1 className="scroll-mt-20 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl group relative">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute -left-6 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        </h1>
      ),
      h2: ({ children, value }) => (
        <h2 className="mt-4 scroll-mt-20 text-3xl tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl group relative">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute -left-6 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3 className="text-xl uppercase font-light text-gray-900/70">
          {children}
        </h3>
      ),
      h4: ({ children, value }) => (
        <h4 className="text-lg uppercase font-light text-gray-900/70">
          {children}
        </h4>
      ),
    },
    marks: {
      
    },
  };

  return (
    <div
      className={["prose prose-a:text-red-500", className]
        .filter(Boolean)
        .join(" ")}
    >
      <PortableText components={components} value={value} />
    </div>
  );
}
