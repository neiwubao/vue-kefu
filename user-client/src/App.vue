<script>
import { actions } from './store';

import Card from 'components/card';
import List from 'components/list';
import Text from 'components/text';
import Message from 'components/message';

export default {
    components: { Card, List, Text, Message },
    vuex: {
        actions: actions,
        getters: {
            loginUser: ({ userSessionId }) => userSessionId
        }
    },
    data () {
        return {
            storeid: 0,
            userid:0,
            apiUrl:'http://www.ydc0755.com/Home/Api/kfinfo',
            logo:'',nickname:''
        };
    },
    created () {
        let token = '';
        let user_id = '0';
        let cookie = document.cookie.split(";");
        for(var k in cookie){
            var item = cookie[k].split("=");
            var key = item[0];
            key = key.replace(/(^\s*)|(\s*$)/g, "");
            if(key == 'user_id'){
               user_id = item[1];
            }
            if(key == 'token'){
               token = item[1];
            }
        }
        if (user_id) {
            this.userid = user_id;
            this.token = token;
            this.$http.get(this.apiUrl+'&token='+token+'&user_id='+user_id).then(response => {
                console.log(response.body);
                this.nickname = response.body.nickname;
                this.logo = response.body.logo;
                this.$socket.emit('guestLogin', {guestid:'user_'+user_id, username:response.body.nickname, logo:response.body.logo});
            }, response => {
                let notice = response.status ? '请求状态'+response.status : '';
                console.log(notice);
            });
        }else{
            console.log('用户未找到');
        }
    },
    sockets:{
        guestLogin: function(data){
            if(this.loginUser) return true;
            console.log(data);
            var userinfo = {
              id:this.userid,
              name:this.nickname,
              img:this.logo
            };
            this.initData(userinfo);
            this.$socket.emit('listGuestMessage', {
                adminid:1,
                page:1,
                from:'user',
                guestid:'user_'+this.userid
            });
        },
        adminMessage: function(data){
            console.log(data);
            data.self = false;
            data.date = new Date(Date.parse(data.time));
            this.getMessage(data);
        },
        listGuestMessage: function(data){
            console.log('接收聊天记录');
            console.log(data);
            let messagelist = data.result;
            let msg = new Object;
            msg.store = data.store;
            for(var i=messagelist.length-1;i>=0;i--){
                var json = JSON.parse(messagelist[i]);
                msg.content = json.content;
                msg.user = data.user;
                msg.date = new Date(Date.parse(json.time));
                msg.self = json.type == 'guest' ? true : false;
                if(json.file == 'pic'){
                  msg.type = 'img';
                }else if(json.file == 'pro'){
                  msg.type = 'pro';
                }else{
                  msg.type = 'text';
                }
                this.getMessage(msg);
            }
        },
        userFile: function(data){
            console.log('发送了图片');
        },
        adminPic: function(data){
            console.log('收到了图片');
            console.log(data);
            data.self = false;
            data.date = new Date(data.time);
            data.type = 'img';
            this.getMessage(data);
        },
    }
}
</script>

<template>
<div id="app">
    <div class="sidebar">
        <card></card>
        <list></list>
    </div>
    <div class="main">
        <message></message>
        <text></text>
    </div>
</div>
</template>

<style lang="less" scoped>
#app {
    margin: 0px auto;
    width: 1000px;
    height: 80%;
    min-height: 600px;
    padding-top: 100px;

    overflow: hidden;
    border-radius: 3px;

    .sidebar, .main {
        height: 100%;
    }
    .sidebar {
        float: left;
        width: 280px;
        color: #f4f4f4;
        background-color: #2e3238;
    }
    .main {
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }
    .text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    .message {
        height: ~'calc(100% - 160px)';
    }
}
</style>
