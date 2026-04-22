import { HeroIllustration } from './hero-illustration';
import { Leaf } from 'lucide-react';

const AFFIRMATIONS = [
  'Believe in your progress.',
  'Small steps, beautiful growth.',
  'Tend it gently; it will bloom.',
  'You are exactly where you need to be.',
  'One patient day at a time.',
];

export function HeroCard({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greet =
    hour < 5
      ? 'Still up'
      : hour < 12
        ? 'Good morning'
        : hour < 17
          ? 'Good afternoon'
          : hour < 21
            ? 'Good evening'
            : 'Winding down';

  const affirmation =
    AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  return (
    <section className="hero-card relative overflow-hidden rounded-[28px] px-6 md:px-8 py-7 md:py-8 ring-1 ring-foreground/[0.04]">
      <div className="relative grid md:grid-cols-[200px_1fr] gap-5 md:gap-6 items-center">
        <HeroIllustration className="w-44 md:w-52 text-[var(--leaf-ink)] justify-self-center md:justify-self-start" />

        <div className="text-center md:text-left">
          <h1 className="font-display text-[28px] md:text-[34px] leading-[1.05] tracking-[-0.028em] font-medium text-[var(--hero-ink)]">
            {greet}, <span className="whitespace-nowrap">{name}!</span>
          </h1>
          <p className="text-[14px] md:text-[15px] text-[var(--hero-ink-soft)] mt-2 max-w-[46ch] mx-auto md:mx-0">
            You&rsquo;re doing amazing. Small steps today, beautiful growth
            tomorrow.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 rounded-full bg-[var(--hero-pill)] ring-1 ring-[var(--hero-pill-ring)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--hero-ink)]">
            <Leaf className="size-3.5" strokeWidth={2} />
            {affirmation}
          </div>
        </div>
      </div>
    </section>
  );
}
