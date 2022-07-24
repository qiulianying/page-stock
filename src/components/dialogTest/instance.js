import Vue from 'vue'
import ErrorMsg from './index.vue'

const MsgConstructor = Vue.extend(ErrorMsg)

console.log(3423423423)
console.log(MsgConstructor)

const instance = new MsgConstructor()

console.log(instance)

instance.$mount()



export default instance
