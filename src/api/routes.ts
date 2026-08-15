import { createRouter } from 'vue-router'
import { createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HOME',
    component: () => import('../src/components/Hero.vue'),
    meta: { title: 'Geometric Intelligence Engine' }
  },
  {
    path: '/engine',
    name: 'ENGINE',
    component: () => import('../src/components/EngineDashboard.vue'),
    meta: { title: 'Geometry Engine' }
  },
  {
    path: '/projects',
    name: 'PROJECTS',
    component: () => import('../src/components/ProjectBrowser.vue'),
    meta: { title: 'Project Library' }
  },
  {
    path: '/blueprints',
    name: 'BLUEPRINT_LIBRARY',
    component: () => import('../src/components/BlueprintLibrary.vue'),
    meta: { title: 'Blueprint Library' }
  },
  {
    path: '/research',
    name: 'RESEARCH',
    component: () => import('../src/components/ResearchWorkspace.vue'),
    meta: { title: 'Research' }
  },
  {
    path: '/documentation',
    name: 'DOCUMENTATION',
    component: () => import('../src/components/DocumentationCenter.vue'),
    meta: { title: 'Documentation' }
  },
  {
    path: '/activity',
    name: 'PUBLIC_ACTIVITY',
    component: () => import('../src/components/ActivityFeed.vue'),
    meta: { title: 'Public Activity' }
  },
  {
    path: '/support',
    name: 'SUPPORT_GIE',
    component: () => import('../src/components/SupportPanel.vue'),
    meta: { title: 'Support GIE' }
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
