import { defineComponent, ref } from 'vue';
import Login from './login'
import NavBotton from './navBotton'
import Search from './search'
import Logo from './logo'
import './top.scss'

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
        const top = ref(null)
        return (
            <div class="top" ref={top}>
                <div class="nav-content">
                    <ul>
                        {this.navButtons.map((nav) => { return <NavBotton navButton={nav}></NavBotton> })}
                    </ul>
                </div>
                <Search></Search>
                <Login></Login>
                <Logo class="logo"></Logo>
            </div>
        )
    }
})