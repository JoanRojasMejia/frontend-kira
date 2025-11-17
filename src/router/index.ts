import { createRouter, createWebHistory } from 'vue-router'
import CreateLinkView from '@/presentation/views/CreateLinkView.vue'
import PaymentView from '@/presentation/views/PaymentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/create'
    },
    {
      path: '/create',
      name: 'CreateLink',
      component: CreateLinkView
    },
    {
      path: '/pay/:id',
      name: 'Payment',
      component: PaymentView
    }
  ]
})

export default router
