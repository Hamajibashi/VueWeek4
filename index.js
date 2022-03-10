import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.prod.min.js';

const app = {
    data(){
        return{
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        login(){
            const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(api,this.user)
    .then( res=>{
        console.log(res);
        //從 res 中取出 Token 以及 expired 期限
        const {token,expired} = res.data;
        document.cookie = `mylToken=${token}; expires=${new Date(expired)};`;
        
        //登入成功後轉到 products 頁面
        window.location="products.html"
    })
    .catch( err=>{
        console.dir(err);
        alert(err.data.message);
    })
        }
    }
}
createApp(app).mount('#app');