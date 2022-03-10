import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.prod.min.js';

let productModal = '';
let delModal='';

const app = {
    data(){
        return{
            apiUrl:'https://vue3-course-api.hexschool.io/v2',
            apiPath:'mylmii',
            products:[],
            isNew:false, //用來分辨是新增或編輯模式
            tempProduct:{
                imagesUrl:[],
                },
            }
        },
    methods:{
        checkLogin(){ 
            // 確認是否登入
                const url = `${this.apiUrl}/api/user/check`
                axios.post(url)
                .then(res=>{
                  this.getProduct();
                })
                .catch(err=>{
                  alert(err.data.message);
                  window.location="index.html";
                })
        },
        getProduct(){
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
            axios.get(url)
                .then(res=>{
                    this.products = res.data.products;
                })
                .catch(err=>{
                    alert(err.data.message);
                })
        },
        updateProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let httpMethod = 'post';
        
            //根據 isNew 來判斷要串接 post 還是 put 
            if(!this.isNew){
            //編輯狀態
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put';
            }
            // post 和 put 要帶的參數相同，整體架構也相同，所以可以寫在一起
            axios[httpMethod](url,{data:this.tempProduct})
                .then(res=>{
                    alert(res.data.message);
                    productModal.hide();
                    this.getProduct();
                })
                .catch(err=>{
                    alert(err.data.message);
                })
        },
        delProduct(){
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(res=>{
                    alert(res.data.message);
                    delModal.hide();
                    this.getProduct();
                })
                .catch(err=>{
                    alert(err.data.message);
                })
        },
        openModal(isNew, item){
            if(isNew === 'new'){
                this.tempProduct = { //清空物件
                    imagesUrl:[],
                };
                this.isNew = true; //新增模式
                productModal.show();
            }
            else if(isNew === 'edit'){
                //使用淺拷貝避免外層物件一起更動，以及避免單圖產品無法追加圖片
                this.tempProduct = {imagesUrl:[],...item};
                this.isNew = false; //編輯模式
                productModal.show();
            }
            else if(isNew === 'delete'){
                this.tempProduct = {...item}; //為了能夠帶上品項名稱
                delModal.show();	
            }
        }
    },
    mounted(){
        // 取得 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)mylToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();

        //使用 new 建立 Modal，拿到實體 DOM 並賦予到變數上
        //新增與編輯用 Modal，禁止使用者用 Esc 關閉 Modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'),{keyboard:false});

        //刪除用的 Modal，禁止使用者用鍵盤關閉 Modal
        delModal = new bootstrap.Modal(document.getElementById('delProductModal'),{keyboard:false});
    }
}

createApp(app).mount('#app');