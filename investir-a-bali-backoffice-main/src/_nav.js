export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
 
  {
    component: 'CNavTitle',
    name: 'Outils',
  }, 
  //gestion useeeeeeeeeeeers
  {
    component: 'CNavItem',
    name: 'Gestion des utilisateurs',
    to: '/users-management/list-users',
    icon: 'cil-people',
  },

  //gestion villaaaaaas
  {
    component: 'CNavItem',
    name: 'Gestion des Villas',
    to: '/villas-management',
    icon: 'cil-puzzle',
  },
  {
    component: 'CNavGroup',
    name: 'Gestion Page Accueil',
    to: '/home-page-management',
    icon: 'cil-notes',
    items: [
      {
        component: 'CNavItem',
        name: 'Couverture',
        to: '/home-page-management/cover',
      },
      {
        component: 'CNavItem',
        name: 'Services et expertises',
        to: '/home-page-management/services-et-expertises',
      },
      {
        component: 'CNavItem',
        name: 'A propos de nous',
        to: '/home-page-management/a-propos',
      }
    ]
    },
    {
      component: 'CNavItem',
      name: 'Gestion du Footer',
      to: '/footer-management',
      icon: 'cil-calculator',
    },
    {
      component: 'CNavItem',
      name: 'Gestion Equipe',
      to: '/team-management',
      icon: 'cil-people',
    },
    {
      component: 'CNavItem',
      name: 'Gestion Blog',
      to: '/blog-management',
      icon: 'cil-star',
    },
    {
      component: 'CNavItem',
      name: 'Boîte de réception',
      to: '/mails',
      icon: 'cil-envelope-closed',
    },
//pagessssssssssss
  /* {
    component: 'CNavTitle',
    name: 'Extras',
  },
  {
    component: 'CNavGroup',
    name: 'Pages',
    to: '/pages',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/pages/login',
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/pages/register',
      },
      {
        component: 'CNavItem',
        name: 'Error 404',
        to: '/pages/404',
      },
      {
        component: 'CNavItem',
        name: 'Error 500',
        to: '/pages/500',
      },
    ],
  }, */ 
]
