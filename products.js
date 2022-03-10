import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.prod.min.js';
import pagination from './pagination.js';

let productModal = '';
let delModal = '';

const app = createApp({
    //區域註冊：分頁元件
    components:{
        pagination
    },
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'mylmii',
            products: [],
            isNew: false, //用來分辨是新增或編輯模式
            tempProduct: {
                imagesUrl: [],
            },
            //存放 pagination 資訊
            pagination: {},
        }
    },
    methods: {
        checkLogin() {
            // 確認是否登入
            const url = `${this.apiUrl}/api/user/check`
            axios.post(url)
                .then(res => {
                    this.getProduct();
                })
                .catch(err => {
                    alert(err.data.message);
                    window.location = "index.html";
                })
        },
        getProduct(page = 1) { //參數預設值，讓預設為第一頁
            //query 的用法為 ?page=頁數
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        openModal(isNew, item) {
            if (isNew === 'new') {
                this.tempProduct = { //清空物件
                    imagesUrl: [],
                };
                this.isNew = true; //新增模式
                productModal.show();
            }
            else if (isNew === 'edit') {
                //使用淺拷貝避免外層物件一起更動，以及避免單圖產品無法追加圖片
                this.tempProduct = { imagesUrl: [], ...item };
                this.isNew = false; //編輯模式
                productModal.show();
            }
            else if (isNew === 'delete') {
                this.tempProduct = { ...item }; //為了能夠帶上品項名稱
                delModal.show();
            }
        }
    },
    mounted() {
        // 取得 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)mylToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
    }
});

// 全域註冊：新增與編輯用 Modal
app.component('productModal',{
    data(){
        return{
            apiUrl:'https://vue3-course-api.hexschool.io/v2',
            apiPath:'mylmii'
        }
    },
    //抓取 app 中的 tempProduct 的資料
    props:['tempProduct', 'isNew'],
    template:'#templateForProductModal',
    methods:{
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let httpMethod = 'post';

            //根據 isNew 來判斷要串接 post 還是 put 
            if (!this.isNew) {
                //編輯狀態
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put';
            }
            // post 和 put 要帶的參數相同，整體架構也相同，所以可以寫在一起
            axios[httpMethod](url, { data: this.tempProduct })
                .then(res => {
                    alert(res.data.message);
                    productModal.hide();
                    // getProduct 是外層方法，這裡使用 emit
                    this.$emit('get-product');
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
    },
    mounted(){
        productModal = new bootstrap.Modal(document.getElementById('productModal'), { keyboard: false });
    }
})

// 全域註冊：刪除用 Modal
app.component('delModal',{
    data(){
        return{
            apiUrl:'https://vue3-course-api.hexschool.io/v2',
            apiPath:'mylmii'
        }
    },
    props:['tempProduct'],
    template:'#templateForDelModal',
    methods:{
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    delModal.hide();
                    this.$emit('get-product');
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
    },
    mounted(){
        delModal = new bootstrap.Modal(document.getElementById('delProductModal'), { keyboard: false });
    }
})

app.mount('#app');