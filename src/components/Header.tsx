import { Compass } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-foreground">TripMe</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            My Trips
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>
      </div>
    </header>
  );
};
