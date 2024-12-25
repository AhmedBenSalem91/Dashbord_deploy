import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../utils/auth'
import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: DefaultLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true } ,
    children: [
      //profile
      {
        path: '/profile',
        name: 'Profile',
  
        component: () => import('@/views/profile.vue'),
         
      },
      //users
      {
        path: '/users-management',
        name: 'Gestion des Utilisateurs',
  
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/users-management/list-users',
        children: [
          {
            path: '/users-management/add-user',
            name: 'Ajouter Utilisateurs',
      
            component: () => import('@/views/UI/users/Add-user.vue'),
          },
          {
            path: '/users-management/list-users',
            name: 'Liste des utilisateurs',
      
            component: () => import('@/views/users-management.vue'),
          },
          {
            path: '/users-management/update-user/:id',
            name: 'Modifier Utilisateurs',
      
            component: () => import('@/views/UI/users/Update-user.vue'),
          },
        ],
      },
      {
        path: '/villas-management',
        name: 'Gestion des Villas',
  
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/villas-management/list-villas',
        children: [
          {
            path: '/villas-management/add-villa',
            name: 'Ajouter Des Villas',
      
            component: () => import('@/views/UI/villas/Add-villa.vue'),
          },
          {
            path: '/villas-management/list-villas',
            name: 'Liste des Villas',
      
            component: () => import('@/views/villas-management.vue'),
          },
          {
            path: '/villas-management/update-villa/:id',
            name: 'Modifier Villas',
      
            component: () => import('@/views/UI/villas/Update-villa.vue'),
          },
        ],
      },
      //home page management pathhh
      {
        path: '/home-page-management',
        name: 'Gestion page Accueil',
  
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/home-page-management/cover',
        children: [
          {
            path: '/home-page-management/cover',
            name: 'couverture',
      
            component: () => import('@/views/home-page-management/couverture.vue'),
          },
          {
            path: '/home-page-management/update-cover',
            name: 'Modifier couverture',
      
            component: () => import('@/views/UI/home/cover/update-cover.vue'),
          },
          {
            path: '/home-page-management/services-et-expertises',
            name: 'Section services et expertises',
      
            component: () => import('@/views/home-page-management/services-et-expertises.vue'),
          },
          {
            path: '/home-page-management/update-services-expertises',
            name: 'Modifier services et expertises',
      
            component: () => import('@/views/UI/home/service/update-services-expertises.vue'),
          },
          {
            path: '/home-page-management/a-propos',
            name: 'Section à propos de nous',
      
            component: () => import('@/views/home-page-management/section-a-propos.vue'),
          },
          {
            path: '/home-page-management/update-about',
            name: 'Modifier section a propos de nous',
      
            component: () => import('@/views/UI/home/about/update-about.vue'),
          },
        ],
      },
      //footer path
      {
        path: '/footer-management',
        name: 'Gestion des liens Footer',
  
        component: () => import('@/views/footer-management.vue'),
      },
      // team path
      {
        path: '/team-management',
        name: 'Gestion des Membres d equipe',
  
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/team-management/members-list',
        children: [
          {
            path: '/team-management/add-member',
            name: 'Ajouter Des membres',
      
            component: () => import('@/views/UI/team/Add-member.vue'),
          },
          {
            path: '/team-management/members-list',
            name: 'Liste des Membres',
      
            component: () => import('@/views/team-management.vue'),
          },
          {
            path: '/team-management/update-member/:id',
            name: 'Modifier membre d equipe',
      
            component: () => import('@/views/UI/team/Update-member.vue'),
          },
        ],
      },
      //blog path
      {
        path: '/blog-management',
        name: 'Gestion des Blogs',
  
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/blog-management/blogs-list',
        children: [
          {
            path: '/blog-management/add-blog',
            name: 'Ajouter Des Blogs',
      
            component: () => import('@/views/UI/blog/Add-blog.vue'),
          },
          {
            path: '/blog-management/blogs-list',
            name: 'Liste des Blogs',
      
            component: () => import('@/views/blog-management.vue'),
          },
          {
            path: '/blog-management/update-blog/:id',
            name: 'Modifier blog',
      
            component: () => import('@/views/UI/blog/Update-blog.vue'),
          },
        ],
      },
      //mails path
      {
        path: '/mails',
        name: 'mails',
  
        component: () => import('@/views/mails.vue'),
      },

      {
        path: '/dashboard',
        name: 'Dashboard',
  
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'),
      },
      ],
  },
  {
    path: '/pages',
    // redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register/:token',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
      {
        path: 'register',
        name: 'Register-new',
        component: () => import('@/views/pages/RegisterNew'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  /* scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  }, */
})

// Global route guard to check authentication
router.beforeEach((to, from, next) => {
  // If the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      // If user is not authenticated, redirect to login
      next({ name: 'Login' })
    } else {
      // If authenticated, allow the navigation
      next()
    }
  } else {
    // If the route does not require authentication, allow navigation
    next()
  }
})

export default router
