import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SearchForm } from '@/components/SearchForm';
import { TransportSection } from '@/components/TransportSection';
import { mockTravelOptions } from '@/data/mockTravelData';
import { SearchParams, TravelOption } from '@/types/travel';
import { Compass, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Index = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flightResults, setFlightResults] = useState<TravelOption[]>([]);
  const { toast } = useToast();

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setHasSearched(true);
    setIsLoading(true);
    setFlightResults([]);

    try {
      // Call the edge function to search for real flights
      const { data, error } = await supabase.functions.invoke('search-flights', {
        body: {
          origin: params.originCode,
          destination: params.destinationCode,
          departureDate: params.date ? format(params.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          returnDate: params.returnDate ? format(params.returnDate, 'yyyy-MM-dd') : undefined,
          adults: params.adults,
          children: params.children,
        },
      });

      if (error) {
        console.error('Search error:', error);
        toast({
          title: 'Search failed',
          description: 'Unable to fetch flight results. Showing sample data instead.',
          variant: 'destructive',
        });
        // Fall back to mock data on error
        setFlightResults([]);
      } else if (data?.flights) {
        setFlightResults(data.flights);
        if (data.flights.length === 0) {
          toast({
            title: 'No flights found',
            description: 'Try different dates or destinations.',
          });
        } else {
          toast({
            title: 'Flights found!',
            description: `Found ${data.flights.length} flight options.`,
          });
        }
      }
    } catch (err) {
      console.error('Error calling search function:', err);
      toast({
        title: 'Connection error',
        description: 'Could not connect to the flight search service.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use real flight results if available, otherwise show mock land/water options
  const airOptions = flightResults.length > 0 ? flightResults : [];
  
  // Filter mock data for land and water options that match the search
  const landOptions = hasSearched 
    ? mockTravelOptions.filter((o) => o.mode === 'land')
    : [];
  const waterOptions = hasSearched 
    ? mockTravelOptions.filter((o) => o.mode === 'water')
    : [];

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

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Searching for the best travel options...</p>
              </div>
            )}

            {!isLoading && (
              <>
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
                      Try adjusting your search criteria or dates
                    </p>
                  </div>
                )}
              </>
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
