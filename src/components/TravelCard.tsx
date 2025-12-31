import { TravelOption } from '@/types/travel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Plane, Bus, Train, Ship, Anchor } from 'lucide-react';

interface TravelCardProps {
  option: TravelOption;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'flight':
      return <Plane className="h-5 w-5" />;
    case 'bus':
      return <Bus className="h-5 w-5" />;
    case 'train':
      return <Train className="h-5 w-5" />;
    case 'ferry':
      return <Ship className="h-5 w-5" />;
    case 'cruise':
      return <Anchor className="h-5 w-5" />;
    default:
      return null;
  }
};

export const TravelCard = ({ option }: TravelCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left section with icon and provider */}
          <div className="bg-primary/5 p-4 md:p-6 flex items-center gap-4 md:min-w-[200px]">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              {getIcon(option.type)}
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{option.provider}</h4>
              <p className="text-sm text-muted-foreground capitalize">{option.type}</p>
              {option.class && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {option.class}
                </Badge>
              )}
            </div>
          </div>

          {/* Middle section with times */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-between md:justify-start gap-4 md:gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{option.departureTime}</p>
                <p className="text-sm text-muted-foreground">{option.origin}</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center max-w-[150px]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{option.duration}</span>
                </div>
                <div className="w-full h-px bg-border relative my-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Direct</span>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{option.arrivalTime}</p>
                <p className="text-sm text-muted-foreground">{option.destination}</p>
              </div>
            </div>

            {/* Amenities */}
            {option.amenities && option.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {option.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs font-normal">
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          

          {/* Right section with price */}
          <div className="p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-border bg-accent/30 md:min-w-[150px]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">from</p>
              <div className="flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">{option.price}</span>
              </div>
            </div>
            <a href={option.bookingUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
              <Button className="w-full">Select</Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
