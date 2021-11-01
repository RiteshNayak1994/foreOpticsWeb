import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Risk Profile',
    icon: {icon: 'desktop', pack: 'fas'},
    link: 'dashboard/riskProfile',
    home: true,
  },
  {
    title: 'Risk Trend',
    icon: {icon: 'chart-line', pack: 'fas'},
    link: 'dashboard/riskTrend',
    home: true,
  },
  {
    title: 'Forecasting',
    icon: {icon: 'chart-area', pack: 'fas'},
    link: 'dashboard/forecast',
    home: true,
  }
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     }
  //   ],
  // }
];
