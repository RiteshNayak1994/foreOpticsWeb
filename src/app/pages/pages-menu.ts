import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Risk Summary',
    icon: {icon: 'globe-americas', pack: 'fas'},
    link: '/dashboard/riskSummary'
  },
  {
    title: 'Risk Profile',
    icon: {icon: 'chalkboard', pack: 'fas'},
    link: '/dashboard/riskProfile'
  },
  {
    title: 'Risk Trend',
    icon: {icon: 'chart-line', pack: 'fas'},
    link: '/dashboard/riskTrend'
  },
  {
    title: 'Forecasting',
    icon: {icon: 'chart-area', pack: 'fas'},
    link: '/dashboard/forecast'
  },
  {
    title: 'Profile',
    icon: {icon: 'user-circle', pack: 'fas'},
    link: '/profile'
  },
  {
    title: 'Settings',
    group: true
  },
  {
    title: 'User Management',
    icon: {icon: 'users-cog', pack: 'fas'},
    children:[
      {
        title: 'Users',
        link: '/uram/users',
      },
      {
        title: 'Roles',
        link: '/uram/roles'
      },
      {
        title: 'Permission Sets',
        link: '/uram/permissionsets'
      },
      {
        title: 'Permissions',
        link: '/uram/permissions'
      }
    ]
  },
  {
    title: 'Logout',
    icon: {icon: 'power-off', pack: 'fas'},
    link: '/auth/logout'
  }
];
