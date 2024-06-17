'use client';

import { SidebarItems } from '@/types';
import {
  Bot,
  HomeIcon
} from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Home', href: '/', icon: HomeIcon },
    { label: 'PJOK', href: '/chat/pjok', icon: Bot },
    { label: 'Bahasa Indonesia', href: '/chat/bahasa', icon: Bot },
    {
      href: '/chat/pkn',
      icon: Bot,
      label: 'PKN',
    },
  ],
};

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
