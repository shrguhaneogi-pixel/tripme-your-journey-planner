import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SearchForm } from '@/components/SearchForm';
import { TransportSection } from '@/components/TransportSection';
import { mockTravelOptions } from '@/data/mockTravelData';
import { SearchParams, TransportMode } from '@/types/travel';
import { Compass } from 'lucide-react';

const Index = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setHasSearched(true);
  };

  const filteredOptions = useMemo(() => {
    // In a real app, this would filter based on origin/destination
    // For demo, we return all options when a search is made
    return mockTravelOptions;
  }, [searchParams]);

  const airOptions = filteredOptions.filter((o) => o.mode === 'air');
  const landOptions = filteredOptions.filter((o) => o.mode === 'land');
  const waterOptions = filteredOptions.filter((o) => o.mode === 'water');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <main className="container mx-auto px-4 -mt-8 relative z-10">
        <SearchForm onSearch={handleSearch} />
        
        {hasSearched && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Showing travel options from{' '}
                <span className="font-semibold text-foreground">{searchParams?.origin}</span>
                {' '}to{' '}
                <span className="font-semibold text-foreground">{searchParams?.destination}</span>
              </p>
            </div>

            {airOptions.length > 0 && (
              <TransportSection mode="air" options={airOptions} />
            )}

            {landOptions.length > 0 && (
              <TransportSection mode="land" options={landOptions} />
            )}

            {waterOptions.length > 0 && (
              <TransportSection mode="water" options={waterOptions} />
            )}

            {airOptions.length === 0 && landOptions.length === 0 && waterOptions.length === 0 && (
              <div className="text-center py-16">
                <div className="p-4 rounded-full bg-muted inline-block mb-4">
                  <Compass className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No routes found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-primary/10 inline-block mb-4">
              <Compass className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to explore?</h3>
            <p className="text-muted-foreground">
              Enter your origin and destination to discover available travel options
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 TripMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
