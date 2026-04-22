import type { LucideIcon } from 'lucide-react';
import { Calendar, CalendarDays, Heart, NotebookPen } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  matches: (pathname: string) => boolean;
};

export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Today',
    icon: Calendar,
    matches: (p) => p === '/' || p === '',
  },
  {
    href: '/plan',
    label: 'Plan',
    icon: CalendarDays,
    matches: (p) => p.startsWith('/plan'),
  },
  {
    href: '/wishlist',
    label: 'Wishlist',
    icon: Heart,
    matches: (p) => p.startsWith('/wishlist'),
  },
  {
    href: '/notes',
    label: 'Notes',
    icon: NotebookPen,
    matches: (p) => p.startsWith('/notes'),
  },
];
