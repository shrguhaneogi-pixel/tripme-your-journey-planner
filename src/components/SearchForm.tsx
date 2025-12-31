import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, ArrowRightLeft, Search, Users, Minus, Plus } from 'lucide-react';
import { SearchParams } from '@/types/travel';
import { CityAutocomplete } from './CityAutocomplete';
import { Toggle } from '@/components/ui/toggle';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch({ origin, destination, date, returnDate: tripType === 'round-trip' ? returnDate : undefined, tripType, adults, children });
    }
  };

  const adjustCount = (type: 'adults' | 'children', delta: number) => {
    if (type === 'adults') {
      setAdults(prev => Math.max(1, Math.min(20, prev + delta)));
    } else {
      setChildren(prev => Math.max(0, Math.min(20, prev + delta)));
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

        {/* Second Row: Trip Type, Return Date, Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-4 pt-4 border-t border-border">
          {/* Trip Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Trip Type</label>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Toggle
                pressed={tripType === 'one-way'}
                onPressedChange={() => setTripType('one-way')}
                className="flex-1 data-[state=on]:bg-background data-[state=on]:shadow-sm"
              >
                One-way
              </Toggle>
              <Toggle
                pressed={tripType === 'round-trip'}
                onPressedChange={() => setTripType('round-trip')}
                className="flex-1 data-[state=on]:bg-background data-[state=on]:shadow-sm"
              >
                Round-trip
              </Toggle>
            </div>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Return Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={tripType === 'one-way'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !returnDate && 'text-muted-foreground',
                    tripType === 'one-way' && 'opacity-50'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, 'PPP') : <span>Pick a return date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(d) => date ? d < date : false}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Passengers */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Passengers</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Users className="mr-2 h-4 w-4" />
                  {adults} Adult{adults !== 1 ? 's' : ''}, {children} Child{children !== 1 ? 'ren' : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="start">
                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Adults</p>
                      <p className="text-xs text-muted-foreground">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => adjustCount('adults', -1)}
                        disabled={adults <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{adults}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => adjustCount('adults', 1)}
                        disabled={adults >= 20}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Children</p>
                      <p className="text-xs text-muted-foreground">Age 2-11</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => adjustCount('children', -1)}
                        disabled={children <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{children}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => adjustCount('children', 1)}
                        disabled={children >= 20}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </form>
  );
};
