import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('views/home/Home')
const Cart = () => import('views/cart/Cart')
const Category = () => import('views/category/Category')
const Profile = () => import('views/profile/Profile')


Vue.use(VueRouter)

const routes = [
  {
    path:'',
    redirect: '/home',
  },
  {
    name:Home,
    path:'/Home',
    component:Home
  },
  {
    name:Cart,
    path:'/Cart',
    component:Cart
  },
  {
    name:Category,
    path:'/Category',
    component:Category
  },
  {
    name:Profile,
    path:'/Profile',
    component:Profile
  },
]

const router = new VueRouter({
  routes,
  mode:'history'
})

export default router