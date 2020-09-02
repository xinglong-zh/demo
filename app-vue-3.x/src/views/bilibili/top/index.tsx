import { defineComponent } from 'vue';
import Login from './login'
import NavBotton from './navBotton'
import Search from './search'

export default defineComponent({
    name: 'top',
    data() {
        return {
            navButtons: [
                { text: '主站', url: 'www.bilibili.com', child: [], icon: '' },
                { text: '番剧', url: 'xxxxx', child: [], icon: '' },
                { text: '游戏中心', url: 'xxx', child: [], icon: '' }
            ]
        }
    },
    render() {
        return (
            <div class="top">
                <div>
                    {this.navButtons.map((nav) => { return <NavBotton navButton={nav}></NavBotton> })}
                </div>
                <Search></Search>
                <Login></Login>
            </div>
        )
    }
})