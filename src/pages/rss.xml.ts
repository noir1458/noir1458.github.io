import rss from "@astrojs/rss";
import { SITE } from "@/config";
import { getPublishedPosts, postDescription, postUrl } from "@/utils/content";

export async function GET(context: { site?: URL }) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? new URL(SITE.url),
    items: posts.map((post) => ({
      title: post.data.title,
      description: postDescription(post),
      pubDate: post.data.publishedAt,
      link: postUrl(post),
      categories: post.data.categories
    })),
    customData: `<language>${SITE.language}</language>`
  });
}
