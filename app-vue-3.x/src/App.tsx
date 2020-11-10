import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import '@/assets/css/global.scss'

export default defineComponent({
  name: 'App',
  render() {
    return (
      <RouterView></RouterView>
    )
  }
})



