export interface ChildSubmenuItem {
  id: number;
  label: string;
  href: string;
  target?: string;
  description?: any;
}

export interface SubmenuItem {
  id: number;
  label: string;
  href: string;
  target?: string;
  Description?: any;
  childSubmenu?: ChildSubmenuItem[];
}

export interface MenuItem {
  id: number;
  label: string;
  href: string;
  target?: string;
  description?: any;
  submenu?: SubmenuItem[];
}
