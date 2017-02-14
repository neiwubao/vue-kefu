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
            store: ''
        };
    },
    created () {
        let storeSessionId = sessionStorage.getItem('storeSessionId');
        this.store = uncompileStr(storeSessionId);
        if(this.store && storeSessionId){
            console.log(this.store);
            this.$socket.emit('storeLogin', {store:this.store, username:'厂家'});
        }else{
            console.log('请先登录');
        }
        function uncompileStr(code){
         code=unescape(code);
         var c=String.fromCharCode(code.charCodeAt(0)-code.length);
         for(var i=1;i<code.length;i++)
         {
          c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
         }
         return c;   }
    },
    sockets:{
        storeLogin: function(data){
            console.log('执行了登录操作1');
            let userlist = data.users
            let mystore = {
                name:data.name,
                logo:data.logo,
                id:this.store
            }

            this.initData(userlist,mystore);
            for(var k in userlist){
                this.$socket.emit('lastMessage', {
                    from:'store',
                    store:this.store,
                    userid:userlist[k].from
                })
                this.$socket.emit('listMessage', {
                    store:this.store,
                    userid:userlist[k].from,
                    page:1,
                    from:'store'
                });
            }
        },
        userMessage: function(data){
            console.log(data);
            var l = data.user;
            l=l.replace(/user_/g,"");
            //console.log(l);
            data.self = false;
            data.date = new Date(Date.parse(data.time));
            data.type = 'text';
            this.getMessage(data);
            this.$socket.emit('lastMessage', {
                from:'store',
                store:this.store,
                userid:'user_'+l
            })
        },
        lastMessage: function(data){
            console.log(data);
            data.time = new Date(Date.parse(data.time));
            data.storeid = data.store;
            this.setUser(data);
        },
        listMessage: function(data){
            //console.log(data);
            let messagelist = data.result;
            let msg = new Object;
            for(var i=messagelist.length-1;i>=0;i--){
                var json = JSON.parse(messagelist[i]);
                msg.content = json.content;
                msg.user = data.user;
                msg.date = new Date(Date.parse(json.time));
                msg.self = json.type == 'user' ? false : true;
                msg.type = 'text';
                this.getMessage(msg);
            }
        },
        userFile: function(data){
            data.self = false;
            data.date = new Date(Date.parse(data.time));
            data.user = data.userid;
            data.type = 'img';
            this.getMessage(data);
        },
        storeFile: function(data){
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
