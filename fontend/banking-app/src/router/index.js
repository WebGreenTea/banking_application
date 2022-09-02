import { createWebHistory, createRouter } from "vue-router";
import HomeComponents from "@/components/HomeComponents.vue";
import LoginComponents from "@/components/LoginComponents.vue";
import RegisterComponent from "@/components/RegisterComponent.vue";
import AccountComponent from "@/components/AccountComponent.vue";


//import About from "@/views/About.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeComponents,
  },
  {
    path: "/login",
    name: "login",
    component: LoginComponents,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterComponent,
  },

  {
    path: "/account",
    name: "account",
    component: AccountComponent,
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;