import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Risk Profile',
    icon: 'fas fa-chalkboard',
    link: 'dashboard/riskProfile',
    home: true,
  },
  {
    title: 'Risk Trend',
    icon: 'fas fa-chart-line',
    link: 'dashboard/riskTrend',
    home: true,
  },
  {
    title: 'Forecasting',
    icon: 'fas fa-chart-area',
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
