import { NbMenuItem } from '@nebular/theme';
import { enumPermissions } from '../@core/common-helper';

export const MENU_ITEMS: any[] = [
  {
    title: 'Dashboard',
    icon: { icon: 'chalkboard', pack: 'fas' },
    url: '/superadmin',
    permission: [enumPermissions.SuperAdminDashboard]
  },
  {
    title: 'Risk Summary',
    icon: { icon: 'globe-americas', pack: 'fas' },
    link: '/dashboard/riskSummary',
    permission: [enumPermissions.ListSalesReps]
  },
  {
    title: 'Risk Profile',
    icon: { icon: 'chalkboard', pack: 'fas' },
    link: '/dashboard/riskProfile',
    permission: [enumPermissions.ListSalesReps]
  },
  {
    title: 'Risk Trend',
    icon: { icon: 'chart-line', pack: 'fas' },
    link: '/dashboard/riskTrend',
    permission: [enumPermissions.ListSalesReps]
  },
  {
    title: 'Forecasting',
    icon: { icon: 'chart-area', pack: 'fas' },
    link: '/dashboard/forecast',
    permission: [enumPermissions.ListSalesReps]
  },
  {
    title: 'Profile',
    icon: { icon: 'user-circle', pack: 'fas' },
    link: '/profile',
    permission: [enumPermissions.EditProfile]
  },
  {
    title: 'Settings',
    group: true,
    permission: [enumPermissions.ListUsers, enumPermissions.TenantConfiguration]
  },
  {
    title: 'User Management',
    icon: { icon: 'users-cog', pack: 'fas' },
    permission: [enumPermissions.ListUsers],
    children: [
      {
        title: 'Users',
        link: '/uram/users',
        permission: [enumPermissions.ListUsers]
      },
      {
        title: 'Roles',
        link: '/uram/roles',
        permission: [enumPermissions.ListRoles]
      },
      {
        title: 'Permission Sets',
        link: '/uram/permissionsets',
        permission: [enumPermissions.ListPermissionSets]
      },
      {
        title: 'Permissions',
        link: '/uram/permissions',
        permission: [enumPermissions.ListPermissions]
      }
    ]
  },
  {
    title: 'Logout',
    icon: { icon: 'power-off', pack: 'fas' },
    link: '/auth/logout'
  },
  {
    title: 'Return',
    icon: { icon: 'share', pack: 'fas' },
    link: '/auth/returnlogin',
    hidden: true,
    permission: [],
    specailMenuName: "ImpersonateLoginBack"
  }
];
