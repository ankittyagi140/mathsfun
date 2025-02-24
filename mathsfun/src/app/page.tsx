'use client';
import { useState, useEffect, useRef } from 'react';
import AppCard from '../components/AppCard';
import { Search } from 'lucide-react';
import { allPuzzleApps } from '../utils/allPuzzleApps';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import dynamic from 'next/dynamic';

interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  path: string;
}

const allApps: App[] = allPuzzleApps;

const AppGrid = ({
  apps,
  title,
}: {
  apps: App[],
  title: string,
  onAddApp?: (app: App) => void,
  showAddButton?: boolean,
  installedApps?: Set<string>
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-semibold mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            title={app.name}
            description={app.description}
            href={app.path}
            icon={app.icon}
            id={app.id}
            className="text-xs sm:text-sm md:text-base lg:text-lg"
          />
        ))}
      </div>
    </div>
  );
};

const FloatingEmojis = dynamic(
  () => import('../components/FloatingEmojis'),
  { 
    ssr: false,
    loading: () => null
  }
);

const Home = () => {
  const [addedAppIds, setAddedAppIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const saved = localStorage.getItem('addedAppIds');
    if (saved) setAddedAppIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('addedAppIds', JSON.stringify(addedAppIds));
  }, [addedAppIds]);


  useEffect(() => {
    const interval = setInterval(async () => {
      await controls.start({
        scale: [1, 1.3, 0.9, 1.1, 1],
        rotate: [0, 15, -15, 10, 0],
        transition: { duration: 1, type: 'sprint' }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [controls]);

  const handleSearchClick = () => {
    if (searchRef.current) {
      searchRef.current.style.border = '2px solid #facc1580';
    }
  };

  const handleAppClick = (app: App) => () => {
    router.push(app.path);
  }
  // const myApps = allApps.filter(app => addedAppIds.includes(app.id));

  const filteredApps = allApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className='flex flex-col min-h-screen bg-transparent'>
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex gap-4 sm:gap-6">
              <div className="flex-1">
                <>
                  <div className="mb-6 sm:mb-8">
                    <div className="hover:scale-105 transition-transform duration-300 hover:-translate-y-1 will-change-transform">
                      <motion.div
                        animate={controls}
                        initial={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto cursor-pointer"
                      >
                        <Image 
                          src='/maths2fun.png' 
                          alt='maths2fun logo' 
                          className="w-full h-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] object-contain mx-auto"
                          width={320}
                          height={320}
                          sizes="(max-width: 640px) 200px, 
                                 (max-width: 768px) 240px,
                                 (max-width: 1024px) 280px,
                                 320px"
                          quality={85}
                          priority={true}
                        />
                        <FloatingEmojis />
                      </motion.div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 bg-white/30 backdrop-blur-md rounded-lg shadow-md">
                      <div className="relative w-full">
                        <div className="flex items-center border rounded-lg px-3 py-2 sm:px-4 sm:py-2"
                          ref={searchRef}
                        >
                          <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search Apps here..."
                            className="ml-2 flex-1 outline-none bg-transparent text-xs sm:text-sm md:text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onClick={handleSearchClick}
                          />
                        </div>

                        {isSearchFocused && searchQuery && (
                          <div className="absolute z-100 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
                            {filteredApps.length > 0 ? (
                              filteredApps.map((app) => (
                                <div
                                  key={app.id}
                                  onClick={handleAppClick(app)}
                                  className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3 sm:gap-4"
                                >
                                  <span className="text-xl sm:text-2xl md:text-3xl">{app.icon}</span>
                                  <div>
                                    <h3 className="font-medium text-sm sm:text-base md:text-lg">{app.name}</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-500">{app.category}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-gray-500 text-sm sm:text-base md:text-lg">No apps found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* {myApps.length > 0 && (
                    <AppGrid
                      apps={myApps}
                      title="My Apps"
                    />
                  )} */}

                  <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                    </div>
                    <AppGrid
                      apps={allApps}
                      title="Maths Puzzles"
                    />
                  </section>
                </>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* <ClientOnlyAnimated /> */}
    </div>
  );
};

export default Home;
