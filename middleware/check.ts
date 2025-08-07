import { useUserStore } from '~/stores/user';
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  await userStore.checkActive()
  if(!userStore.logged) {
    return navigateTo('/login')
  }
});
