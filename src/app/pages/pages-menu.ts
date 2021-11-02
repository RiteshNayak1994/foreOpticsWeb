import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Risk Profile',
    icon: {icon: 'chalkboard', pack: 'fas'},
    link: '/dashboard/riskProfile',
    home: true,
  },
  {
    title: 'Risk Trend',
    icon: {icon: 'chart-line', pack: 'fas'},
    link: '/dashboard/riskTrend',
    home: true,
  },
  {
    title: 'Forecasting',
    icon: {icon: 'chart-area', pack: 'fas'},
    link: '/dashboard/forecast',
    home: true,
  },
  {
    title: 'Profile',
    icon: {icon: 'user-circle', pack: 'fas'},
    link: '/profile',
    home: true,
  },
  {
    title: 'Logout',
    icon: {icon: 'power-off', pack: 'fas'},
    link: '/auth/logout',
    home: true,
  }
];
