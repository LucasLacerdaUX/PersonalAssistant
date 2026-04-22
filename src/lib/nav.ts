import type { ComponentType } from 'react';
import {
  HomeIcon,
  TodayIcon,
  PlanIcon,
  WishlistIcon,
  NotesIcon,
} from '@/components/shell/nav-icons';

export type NavAccent =
  | 'periwinkle'
  | 'sage'
  | 'rose'
  | 'butter'
  | 'clay'
  | 'lilac'
  | 'sky';

export type NavIcon = ComponentType<{ className?: string }>;

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  accent: NavAccent;
  matches: (pathname: string) => boolean;
};

export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: HomeIcon,
    accent: 'sage',
    matches: (p) => p === '/' || p === '',
  },
  {
    href: '/today',
    label: 'Today',
    icon: TodayIcon,
    accent: 'butter',
    matches: (p) => p.startsWith('/today'),
  },
  {
    href: '/plan',
    label: 'Plan',
    icon: PlanIcon,
    accent: 'clay',
    matches: (p) => p.startsWith('/plan'),
  },
  {
    href: '/wishlist',
    label: 'Wishlist',
    icon: WishlistIcon,
    accent: 'rose',
    matches: (p) => p.startsWith('/wishlist'),
  },
  {
    href: '/notes',
    label: 'Notes',
    icon: NotesIcon,
    accent: 'periwinkle',
    matches: (p) => p.startsWith('/notes'),
  },
];
