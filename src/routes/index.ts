import { createWebHistory, createRouter } from "vue-router";
import PostLayout from "@/views/post/PostLayout.vue";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}

const routes = [
  {
    path: "/",
    name: "home page",
    component: PostLayout,
    children: [
      {
        path: "",
        name: "posts list page",
        component: () => import("@/views/post/PostListPage.vue"),
      },
      {
        path: "post/:id",
        name: "post details page",
        component: () => import("@/views/post/PostDetailsPage.vue"),
      },
      {
        path: "post/create",
        name: "add post page",
        meta: { requiresAuth: true },
        component: () => import("@/views/post/CreatePostPage.vue"),
      },
    ],
  },
  {
    path: "/auth",
    name: "authentication page",
    component: () => import("@/views/auth/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "login page",
        component: () => import("@/views/auth/LoginPage.vue"),
      },
      {
        path: "register",
        name: "register page",
        component: () => import("@/views/auth/RegisterPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
