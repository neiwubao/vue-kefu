<script>
import { actions } from './store';

import Card from 'components/card';
import List from 'components/list';
import Text from 'components/text';
import Message from 'components/message';

export default {
    components: { Card, List, Text, Message },
    vuex: {
        actions: actions
    },
    data () {
        return {
            storeid: 0,
            userid:0
        };
    },
    created () {
        let talk_name = '';
        let user_id = '0';
        let cookie = document.cookie.split(";");
        for(var k in cookie){
            var item = cookie[k].split("=");
            var key = item[0];
            key = key.replace(/(^\s*)|(\s*$)/g, "");
            if(key == 'talk_name'){
               //var talk_name = item[1];
               console.log(item[1]);
            }
            if(key == 'user_id'){
               user_id = item[1];
            }
        }
        if (user_id) {
            this.userid = user_id;
            this.$socket.emit('userLogin', {userid:user_id, username:talk_name});
        }else{
            console.log('用户未找到');
        }
        var re = /store_id=([^\/]+)\&/;
        var re2 = /store_id=([^\/]+)/;
        if (re.test(window.location.search) || re2.test(window.location.search)) {
            let storeid = RegExp.$1;
            this.storeid = storeid;
        }else{
            console.log('厂家未找到');
        }
    },
    sockets:{
        userLogin: function(data){
            //console.log(data);
            let storelist = data.stores
            let in_store = storelist.find(item => item.from == this.storeid);
            if(in_store){

            }else{
                storelist.push({
                    from:this.storeid,
                    name:'厂家'
                });
            }
            let userinfo = {
                name:data.name,
                img:data.img,
                userid:this.userid
            }
            this.initData(userinfo,storelist,this.storeid);
            //console.log(storelist);
            for(var k in storelist){
                this.$socket.emit('lastMessage', {
                    from:'user',
                    store:storelist[k].from,
                    userid:'user_'+this.userid
                })
                this.$socket.emit('listMessage', {
                    store:storelist[k].from, 
                    page:1,
                    from:'user',
                    userid:'user_'+this.userid
                });
            }
        },
        lastMessage: function(data){
            //console.log(data);
            data.time = new Date(Date.parse(data.time));
            this.setStore(data);
        },
        storeMessage: function(data){
            //console.log(data);
            data.self = false;
            data.date = new Date(Date.parse(data.time));
            this.getMessage(data);
            //console.log(data.store);
            this.$socket.emit('lastMessage', {
                from:'user',
                store:data.store,
                userid:'user_'+this.userid
            })
        },
        listMessage: function(data){
            //console.log(data);
            let messagelist = data.result;
            let msg = new Object;
            msg.store = data.store;
            for(var i=messagelist.length-1;i>=0;i--){  
                var json = JSON.parse(messagelist[i]);
                msg.content = json.content;
                msg.user = data.user;
                msg.date = new Date(Date.parse(json.time));
                msg.self = json.type == 'user' ? true : false;
                this.getMessage(msg);
            }
        },
        userFile: function(data){
            console.log('发送了图片');
        },
        storePic: function(data){
            console.log('收到了图片');
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
