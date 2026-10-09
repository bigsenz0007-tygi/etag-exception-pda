import Vue from 'vue'
import VueRouter from 'vue-router'
import ExceptionHandle from '@/views/ExceptionHandle.vue'
import BindTag from '@/views/BindTag.vue'
import Complete from '@/views/Complete.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', name: 'exception', component: ExceptionHandle, meta: { title: '电子标签异常处置' } },
    { path: '/bind', name: 'bind', component: BindTag, meta: { title: '绑定电子标签' } },
    { path: '/complete', name: 'complete', component: Complete, meta: { title: '处置完成' } }
  ]
})

export default router
