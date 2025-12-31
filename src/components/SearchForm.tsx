import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, ArrowRightLeft, Search } from 'lucide-react';
import { SearchParams } from '@/types/travel';
import { CityAutocomplete } from './CityAutocomplete';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch({ origin, destination, date });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_auto] gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">From</label>
            <CityAutocomplete
              value={origin}
              onChange={setOrigin}
              placeholder="Origin city"
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mb-0.5"
            onClick={() => {
              setOrigin(destination);
              setDestination(origin);
            }}
            aria-label="Swap cities"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">To</label>
            <CityAutocomplete
              value={destination}
              onChange={setDestination}
              placeholder="Destination city"
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full gap-2" size="lg">
            <Search className="h-4 w-4" />
            Search Routes
          </Button>
        </div>
      </div>
    </form>
  );
};
