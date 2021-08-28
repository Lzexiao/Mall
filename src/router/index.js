import Vue from "vue";
import VueRouter from "vue-router";

const Home = () => import("views/home/Home");
const Cart = () => import("views/cart/Cart");
const Category = () => import("views/category/Category");
const Profile = () => import("views/profile/Profile");
const Detail = () => import("views/detail/Detail");

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/home",
  },
  {
    name: Home,
    path: "/home",
    component: Home,
  },
  {
    name: Cart,
    path: "/cart",
    component: Cart,
  },
  {
    name: Category,
    path: "/category",
    component: Category,
  },
  {
    name: Profile,
    path: "/profile",
    component: Profile,
  },
  {
    name: Detail,
    path: "/detail/:iid",
    component: Detail,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
