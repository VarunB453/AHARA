import { Flame, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { regions } from '@/data/recipes';
import { cn } from '@/lib/utils';

interface FilterSectionProps {
  selectedRegion: string;
  selectedSpice: string | null;
  selectedTime: string | null;
  onRegionChange: (region: string) => void;
  onSpiceChange: (spice: string | null) => void;
  onTimeChange: (time: string | null) => void;
}

const spiceLevels = [
  { id: 'mild', label: 'Mild', flames: 1 },
  { id: 'medium', label: 'Medium', flames: 2 },
  { id: 'hot', label: 'Hot', flames: 3 },
];

const cookingTimes = [
  { id: 'quick', label: 'Quick (<30 min)', max: 30 },
  { id: 'medium', label: 'Medium (30-60 min)', min: 30, max: 60 },
  { id: 'slow', label: 'Slow Cook (60+ min)', min: 60 },
];

const FilterSection = ({
  selectedRegion,
  selectedSpice,
  selectedTime,
  onRegionChange,
  onSpiceChange,
  onTimeChange,
}: FilterSectionProps) => {
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-soft">
      {/* Region Filter */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">Region</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => onRegionChange(region)}
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      {/* Spice Level Filter */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">Spice Level</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {spiceLevels.map((level) => (
            <Button
              key={level.id}
              variant={selectedSpice === level.id ? 'default' : 'outline'}
              size="sm"
              className={cn(
                "h-8 gap-1 text-xs",
                selectedSpice === level.id && (
                  level.id === 'mild' ? 'bg-spice-mild hover:bg-spice-mild/90' :
                  level.id === 'medium' ? 'bg-spice-medium hover:bg-spice-medium/90' :
                  'bg-spice-hot hover:bg-spice-hot/90'
                )
              )}
              onClick={() => onSpiceChange(selectedSpice === level.id ? null : level.id)}
            >
              {Array.from({ length: level.flames }).map((_, i) => (
                <Flame key={i} className="h-3 w-3" />
              ))}
              {level.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Cooking Time Filter */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">Cooking Time</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {cookingTimes.map((time) => (
            <Button
              key={time.id}
              variant={selectedTime === time.id ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => onTimeChange(selectedTime === time.id ? null : time.id)}
            >
              {time.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
