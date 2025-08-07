import { Router } from 'vue-router';
import SocketIOViewItem from '@/views/socketioviewitem.vue';

const router = new Router({
mode: 'history',
base: process.env.BASE_URL,
routes: [
{
path: '/socket.io/*',
component: SocketIOViewItem
}
]
});
