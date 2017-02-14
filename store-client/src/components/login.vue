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
            apiUrl:'http://www.ydc0755.com/index.php/Admin/api/login'
        };
    },
    methods: {
        do_login(){
            this.notice = '';
            if(this.username == '' || this.username == ''){
                this.notice = '用户名密码不能为空';
                return true;
            }
            this.$http.get(this.apiUrl+'&username='+this.username+'&password='+this.password).then(response => {
                console.log(response.body);
                if(response.body.status==1){
                    this.notice = '登录成功';
                    console.log('手动执行登录--->'+response.body.result.id);
                    this.$socket.emit('adminLogin', {adminid:response.body.result.id, adminname:response.body.result.user_name});
                    this.setLogin(response.body.result.id);
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
        <img src="http://www.ydc0755.com/public/upload/logo/2017/07-26/f75b537f25b9491c376d637f33e482bf.png">
        <p>客服系统0.9.10.2</p>
        <br>
    </div>
	<div class="input-group input-group-lg">
	  <span class="input-group-addon" id="basic-addon1">用户名</span>
	  <input type="text" class="form-control" placeholder="请输入用户名f"  v-model="username" aria-describedby="basic-addon1">
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
    margin: 10% auto;
    background-color: #fff;
    padding: 10px;
    width: 360px;
    .input-group{
    	margin-bottom:5px;
    }
}
</style>
