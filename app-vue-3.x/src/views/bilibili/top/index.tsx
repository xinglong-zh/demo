import { defineComponent } from 'vue';
import Login from './login'
import NavBotton from './navBotton'
import Search from './search'

export default defineComponent({
    name: 'top',
    render() {
        return (
            <div class="top">
                <NavBotton></NavBotton>
                <Search></Search>
                <Login></Login>
            </div>
        )
    }
})