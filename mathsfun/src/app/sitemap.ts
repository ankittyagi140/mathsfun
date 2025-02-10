export default async function sitemap() {
  const quizzes = await getAllQuizzes();
  
  return [
    {
      url: 'https://maths2fun.com',
      lastModified: new Date(),
    },
    ...quizzes.map(quiz => ({
      url: `https://maths2fun.com/quizzes/${quiz.slug}`,
      lastModified: quiz.updatedAt,
    })),

  ];
} 