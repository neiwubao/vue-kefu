<script>
import { actions } from './store';

import Login from 'components/login'
import Card from 'components/card';
import List from 'components/list';
import Text from 'components/text';
import Message from 'components/message';

export default {
    components: { Card, List, Text, Message, Login },
    vuex: {
        actions: actions,
        getters: {
            loginStatus: ({ loginIf }) => loginIf,
            loginStore: ({ storeSessionId }) => storeSessionId
        }
    },
    data () {
        return {
            store: '',
        };
    },
    created () {
        let storeSessionId = sessionStorage.getItem('storeSessionId');
        let rand = sessionStorage.getItem('rand');
        this.adminid = storeSessionId;
        if(this.adminid){
            console.log('自动执行登录--->'+this.adminid);
            this.$socket.emit('adminLogin', {adminid:this.adminid, adminname:'管理员',rand:rand});
        }else{
            console.log('请先登录');
        }
    },
    sockets:{
        adminLogin: function(data){
            //console.log(data);
            if(sessionStorage.getItem('rand') && data.rand != sessionStorage.getItem('rand')){
              console.log(data.rand+'---其他端口刷新了页面---'+sessionStorage.getItem('rand'));
              return true;
            }
            sessionStorage.setItem('rand',data.rand);
            let userlist = data.users
            let mystore = {name:data.name,logo:data.logo,id:'1'}
            this.initData(userlist,mystore);
            for(var k in userlist){
                this.$socket.emit('lastGuestMessage', {
                    from:'admin',
                    adminid:'1',
                    userid:userlist[k].from,
                    rand:data.rand
                })
                this.$socket.emit('listGuestMessage', {
                    adminid:'1',
                    guestid:userlist[k].from,
                    page:1,
                    from:'admin',
                    rand:data.rand
                });
            }
        },
        lastGuestMessage: function(data){
            if(data.rand != sessionStorage.getItem('rand')){
              console.log('---其他端口刷新了页面---');
              return true;
            }
            data.time = new Date(Date.parse(data.time));
            data.storeid = data.store;
            this.setUser(data);
        },
        listGuestMessage: function(data){
            if(data.rand != sessionStorage.getItem('rand')){
              console.log('---其他端口刷新了页面---');
              return true;
            }
            //console.log(data);
            let messagelist = data.result;
            let msg = new Object;
            for(var i=messagelist.length-1;i>=0;i--){
                var json = JSON.parse(messagelist[i]);
                msg.content = json.content;
                msg.user = data.guest;
                msg.date = new Date(Date.parse(json.time));
                msg.self = json.type == 'guest' ? false : true;
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
        adminFile: function(data){
            console.log(data);
        }
    }
}
</script>
<template>
<div id="app" v-if="loginStatus">
    <div class="sidebar">
        <card></card>
        <list></list>
    </div>
    <div class="main">
        <message></message>
        <text></text>
    </div>
</div>
<div v-else="loginStatus">
    <login></login>
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
