import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const quiz = await getQuizData(params.slug);
  
  return {
    title: `${quiz.title} - Maths2Fun`,
    description: `Learn ${quiz.topic} through interactive problems and solutions`,
    alternates: {
      canonical: `https://maths2fun.com/quizzes/${params.slug}`,
    },
  };

} 