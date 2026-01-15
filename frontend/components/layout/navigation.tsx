import { getNavigation } from '@/lib/api/navigation';
import { getGlobal } from '@/lib/api/global';
import { NavigationClient } from './navigation-client';

interface NavigationProps {
  readonly lang?: string;
}

export async function Navigation({ lang = 'en' }: NavigationProps) {
  const [navData, globalData] = await Promise.all([
    getNavigation(lang),
    getGlobal(lang)
  ]);

  return <NavigationClient navData={navData} globalData={globalData} lang={lang} />;
}