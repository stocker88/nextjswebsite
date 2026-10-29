import {coursePath, lessonPath} from './learning-format';
import snapshot from '../data/learning/catalog.json';

export type Lesson = typeof snapshot.videos[number];
const descriptions = {
  'options-for-beginners': {
    title: 'Options, from the beginning.', shortTitle: 'Options for beginners',
    description: 'Understand calls, puts, pricing and the Greeks. Build the foundations before studying more complex option setups.',
    topics: ['Calls & puts', 'Implied volatility', 'The Greeks', 'Execution & breakeven'],
    level: 'Foundations → applied', accent: 'purple',
  },
  'stocks-for-beginners': {
    title: 'Make your money work.', shortTitle: 'Stocks for beginners',
    description: 'Start with the essentials: portfolio allocation, investment horizons, sectors and the signals behind a stock idea.',
    topics: ['Portfolio allocation', 'Time horizons', 'Investment styles', 'Stock signals'],
    level: 'Start here', accent: 'mint',
  },
  'setups-and-signals': {
    title: 'Learn to read the setup.', shortTitle: 'Setups & signals 101',
    description: 'Connect a trading idea to its risks and catalysts. Explore market, earnings, industry, insider and institutional signals.',
    topics: ['Market exposure', 'Earnings strategies', 'Insider & fund activity', 'Corporate actions'],
    level: 'Build on the basics', accent: 'blue',
  },
};
export const lessons: Lesson[] = snapshot.videos;
export const courses = snapshot.courses.map(course => ({
  ...course, ...descriptions[course.slug as keyof typeof descriptions],
  durationSeconds: course.videoIds.reduce((sum, id) => sum + (lessons.find(v => v.id === id)?.durationSeconds || 0), 0),
  thumbnail: lessons.find(v => v.id === course.videoIds[0])!.thumbnail,
}));
export type Course = typeof courses[number];
export const learningPaths = () => ['/learn/', ...courses.map(c => coursePath(c.slug)), ...lessons.map(v => lessonPath(v.id))];
