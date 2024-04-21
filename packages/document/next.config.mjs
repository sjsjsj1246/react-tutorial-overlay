import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import createMDX from '@next/mdx'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'export',
  trailingSlash: true
}
 
const withMDX = createMDX({
  extension: /.mdx?$/,
  options: {
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [remarkGfm],
    providerImportSource: '@mdx-js/react',
  },
})
 
export default withMDX(nextConfig)