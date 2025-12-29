import heroImage from '@/assets/hero-travel.jpg';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Scenic travel destinations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Find Your Perfect Journey
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Compare travel options by air, land, and water. Discover the best routes to your destination.
          </p>
        </div>
      </div>
    </section>
  );
};
