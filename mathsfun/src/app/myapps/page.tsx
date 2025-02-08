import AppCard from '@/components/AppCard';
import { Calculator, Puzzle, BrainCircuit, Shapes } from 'lucide-react';

const apps = [
  {
    title: "Math Combinations",
    description: "Create number combinations using basic operations",
    icon: <Calculator className="h-6 w-6" />,
    href: "/games/combinations"
  },
  {
    title: "Puzzle Challenge",
    description: "Solve math puzzles to unlock achievements",
    icon: <Puzzle className="h-6 w-6" />,
    href: "/games/puzzles"
  },
  // ... other apps
];

export default function MyApps() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {apps.map((app) => (
        <AppCard
          key={app.title}
          title={app.title}
          description={app.description}
          icon={app.icon}
          href={app.href ?? '/fallback-route'}
        />
      ))}
    </div>
  );
} 