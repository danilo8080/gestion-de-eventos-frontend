import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Registro from '../views/Registro.vue'

import contactos from '../views/Contactos/Index.vue'
import eventos from '../views/Eventos/Index.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/registro',
      name: 'registro',
      component: Registro
    },
    {
      path: '/contactos',
      name: 'contactos',
      component: contactos
    },
    {
      path: '/eventos',
      name: 'eventos',
      component: eventos
    }
  ]
})

router.beforeEach(async(to)=>{
  const publicPages = ['/login','/registro']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()
  if (authRequired && !auth.user){
    auth.returnUrl = to.fullPath
    return '/login'
  }
})



export default router
