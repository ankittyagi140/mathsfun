import { allPuzzleApps } from '@/utils/allPuzzleApps';

export default async function sitemap() {
  const quizzes = allPuzzleApps;
  
  return [
    {
      url: 'https://maths2fun.com',
      lastModified: new Date(),
    },
    ...quizzes.map(quiz => ({
      url: `https://www.maths2fun.com/quizzes/${encodeURIComponent(quiz.name)}`,
      lastModified: new Date(),
    })),
  ];
} 