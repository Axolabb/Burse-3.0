export default {
  mode: "history",
  base: "/",
  routes: [
    // bisherige Routen...
    {
        path: '/socket.io/*',  
        component: () => import('@/router/socket.io/socket.io.js')  
    },
  ],
};
