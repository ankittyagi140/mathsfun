// import { Metadata } from 'next';
import { allPuzzleApps } from '@/utils/allPuzzleApps';
import { notFound } from 'next/navigation';
import GameCard from '@/components/GameCard';
import { Metadata } from 'next';

// ✅ Correct PageProps type
interface PageProps {
  params: Promise<{ slug: string }>;
}

// ✅ Ensure generateMetadata is synchronous
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params; // ✅ No async behavior
  const puzzle = allPuzzleApps.find(p => p.path === `/puzzles/${slug}`);

  return {
    title: `${puzzle?.name || 'Math Puzzle'} | Maths2Fun`,
    description: puzzle?.description || 'Interactive math puzzle challenge',
    openGraph: {
      images: puzzle?.icon ? [{ url: puzzle.icon }] : [],
    },
  };
}

// ✅ Ensure params is used correctly
export  default async function PuzzlePage({ params }: PageProps) {
  const { slug } = await params; // ✅ No async behavior
  const puzzle = allPuzzleApps.find(p => p.path === `/puzzles/${slug}`);

  if (!puzzle) {
    return notFound();
  }

  return (
    <div className="puzzle-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            "name": puzzle.name,
            "url": `https://maths2fun.com/puzzles/${slug}`,
            "playMode": "SinglePlayer",
            "gamePlatform": "Web",
            "author": {
              "@type": "Organization",
              "name": "Maths2Fun"
            }
          })
        }}
      />
      <div className="min-h-screen p-8 bg-white">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          🎮 {puzzle.name}
        </h1>
        <p className="text-lg text-center text-gray-700">{puzzle.description}</p>

        <div className="max-w-xl mx-auto mt-6">
          <GameCard
            key={puzzle.id}
            title={puzzle.name}
            description={puzzle.description}
            href={puzzle.path}
            emoji={puzzle.icon}
          />
        </div>
      </div>
    </div>
  );
}
