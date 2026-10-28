export const ARCHIVE_PAGE_SIZE = 30;

export function archivePath(year: number, page = 1) {
  return `/archives/${year}/${page > 1 ? `page/${page}/` : ""}`;
}

export function archivePages<T>(groups: [number, T[]][]) {
  return groups.flatMap(([year, posts]) => {
    const totalPages = Math.ceil(posts.length / ARCHIVE_PAGE_SIZE);
    return Array.from({ length: totalPages }, (_, index) => ({
      year,
      posts: posts.slice(index * ARCHIVE_PAGE_SIZE, (index + 1) * ARCHIVE_PAGE_SIZE),
      currentPage: index + 1,
      totalPages,
      totalPosts: posts.length,
      firstPost: index * ARCHIVE_PAGE_SIZE + 1
    }));
  });
}
