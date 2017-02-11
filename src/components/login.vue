<script>
import { actions } from '../store';
export default {
    vuex: {
        actions: actions,
        getters: {
            login: ({ loginIf }) => loginIf
        }
    },
    data () {
        return {
            username: '',
            password: '',
            notice:'',
            apiUrl:'https://api.1taocheng.cn/?service=Store.Login'
        };
    },
    methods: {
        do_login(){
            this.notice = '';
            if(this.username == '' || this.username == ''){
                this.notice = '用户名密码不能为空';
                return true;
            }
            this.$http.jsonp(this.apiUrl+'&username='+this.username+'&password='+this.password).then(response => {
                if(response.body.ret==200){
                    this.notice = response.body.data.ru_id;
                    this.setLogin(response.body.data.ru_id);
                    this.$socket.emit('storeLogin', {store:response.body.data.ru_id, username:'厂家'});
                }else{
                    this.notice = response.body.msg;
                }
            }, response => {
                this.notice = response.status ? '请求状态'+response.status : '';
            });
        }
    }
};
</script>
<template>
<div class="loginbox">
    <div class="text-center">
        <img src="http://www.1taocheng.cn/themes/myds/images/logo.png">
        <p>客服系统 * 商家后台</p>
        <br>
    </div>
	<div class="input-group input-group-lg">
	  <span class="input-group-addon" id="basic-addon1">用户名</span>
	  <input type="text" class="form-control" placeholder="请输入用户名"  v-model="username" aria-describedby="basic-addon1">
	</div>
	<div class="input-group input-group-lg">
	  <span class="input-group-addon" id="basic-addon1">密&nbsp;&nbsp;&nbsp;码</span>
	  <input type="password" class="form-control" placeholder="请输入密码" v-model="password" aria-describedby="basic-addon1">
	</div>
    <div class="text-center">
        <p v-if="notice">{{notice}}</p>
        <button type="button" class="btn btn-primary" @click="do_login">登 陆</button>
    </div>
</div>
</template>

<style scoped lang="less">
.loginbox{
	position: relative;
    box-sizing: border-box;
    border-radius: 5px;
    margin: 30% auto;
    background-color: #fff;
    width: 360px;
    .input-group{
    	margin-bottom:5px;
    }
}
</style>