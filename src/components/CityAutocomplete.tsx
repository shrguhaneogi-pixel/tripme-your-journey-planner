import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { cities } from '@/data/mockTravelData';

interface City {
  name: string;
  code: string;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string, code: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const CityAutocomplete = ({
  value,
  onChange,
  placeholder,
  icon,
}: CityAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0 && value !== filtered[0]?.name);
    } else {
      setFilteredCities(cities);
      setIsOpen(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: City) => {
    onChange(city.name, city.code);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (value) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredCities(cities);
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value, '')}
          onFocus={handleFocus}
          className={cn(icon && 'pl-10')}
        />
      </div>
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCities.map((city) => (
            <button
              key={city.code}
              type="button"
              onClick={() => handleSelect(city)}
              className={cn(
                'w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                city.name === value && 'bg-accent text-accent-foreground'
              )}
            >
              <span className="font-medium">{city.name}</span>
              <span className="ml-2 text-muted-foreground">({city.code})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
