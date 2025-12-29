import { TravelOption, TransportMode } from '@/types/travel';
import { TravelCard } from './TravelCard';
import { Plane, Bus, Ship } from 'lucide-react';

interface TransportSectionProps {
  mode: TransportMode;
  options: TravelOption[];
}

const getSectionConfig = (mode: TransportMode) => {
  switch (mode) {
    case 'air':
      return {
        title: 'By Air',
        icon: <Plane className="h-6 w-6" />,
        description: 'Fastest way to reach your destination',
        gradient: 'from-primary/20 to-primary/5',
      };
    case 'land':
      return {
        title: 'By Land',
        icon: <Bus className="h-6 w-6" />,
        description: 'Buses and trains for comfortable ground travel',
        gradient: 'from-secondary/20 to-secondary/5',
      };
    case 'water':
      return {
        title: 'By Water',
        icon: <Ship className="h-6 w-6" />,
        description: 'Ferries and cruises for scenic journeys',
        gradient: 'from-chart-1/20 to-chart-1/5',
      };
  }
};

export const TransportSection = ({ mode, options }: TransportSectionProps) => {
  const config = getSectionConfig(mode);

  // Sort land options: buses first, then trains
  const sortedOptions = mode === 'land'
    ? [...options].sort((a, b) => {
        if (a.type === 'bus' && b.type === 'train') return -1;
        if (a.type === 'train' && b.type === 'bus') return 1;
        return 0;
      })
    : options;

  return (
    <section className="mb-10">
      <div className={`rounded-xl bg-gradient-to-r ${config.gradient} p-6 mb-6`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-card text-primary shadow-sm">
            {config.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
            <p className="text-muted-foreground">{config.description}</p>
          </div>
          <div className="ml-auto">
            <span className="text-sm font-medium bg-card px-3 py-1 rounded-full shadow-sm text-foreground">
              {options.length} option{options.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedOptions.map((option) => (
          <TravelCard key={option.id} option={option} />
        ))}
      </div>
    </section>
  );
};
