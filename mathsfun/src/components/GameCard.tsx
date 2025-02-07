import Link from 'next/link';

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  emoji: string;
}

const GameCard = ({ title, description, href, emoji }: GameCardProps) => {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex items-start gap-4">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard; 