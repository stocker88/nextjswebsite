export const coursePath = (slug: string) => `/learn/courses/${slug}/`;
export const lessonPath = (id: string) => `/learn/watch/${id}/`;
export const duration = (seconds: number) => seconds >= 3600
  ? `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m`
  : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
export const lessonSummary = (lesson: {description: string; title: string}) => {
  const text = lesson.description.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, 180) + (text.length > 180 ? '…' : '') : `Watch ${lesson.title} with Aness Hussein Ali in the free Stocks To Buy Now AI course library.`;
};
