<script>
import { actions } from '../store';

export default {
    vuex: {
        actions: actions,
        getters: {
            // 过滤后的会话列表
            sessions: ({ sessions, filterKey }) => {
                let result = sessions.filter(session => session.user.name.includes(filterKey));
                console.log(result);
                return result;
            },
            // 当前会话index
            currentId: ({ currentSessionId }) => currentSessionId,
            deleteId: ({ deleteSessionId }) => deleteSessionId,
            loginStore: ({ storeSessionId }) => storeSessionId,
            currentLength: ({ currentLength }) => currentLength
        }
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if(date){
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                var curDate = new Date(new Date().getTime()-24*60*60*1000);
                if(date < curDate){
                    var month = date.getMonth() + 1;
                    return month + '月' + date.getDate() + '日';
                }else{
                    var m = '';
                    if(date.getMinutes()<10){
                        m = '0';
                    }
                    return date.getHours() + ':' + m + date.getMinutes();
                }
            }
        }
    },
    data () {
        return {
            length: ''
        };
    },
    created () {

    },
    methods: {
        deleteUser: function(){
            this.$socket.emit('deleteUser', {adminid:this.loginStore, guestid:this.deleteId});
            this.deleteSession(this.deleteId);
        },
        nodelete:function(){
            this.nodelSession();
        },
        hiddenUser:function(){
            this.deleteSession(this.deleteId);
        },
    },
    sockets:{
        guestMessage: function(data){
            //console.log(data);
            console.log('收到了消息')
            var audio = new Audio("/dist/dingdong.mp3");
            audio.play();
            var l = data.user;
            l=l.replace(/user_/g,"");
            data.self = false;
            data.date = new Date(Date.parse(data.time));
            if(data.file == 'pro'){
              data.type = 'pro';
            }else{
              data.type = 'text';
            }
            let session = this.sessions.find(item => item.id == data.user);
            if(session){
                console.log(data);
                this.getMessage(data);
                this.updateUser(data);
            }else{
                console.log('增加新会话');
                this.$socket.emit('lastGuestMessage', {
                    from:'admin',
                    adminid:'1',
                    userid:data.user,
                    rand:sessionStorage.getItem('rand')
                })
            }
        },
        guestFile: function(msg){
            msg.self = false;
            msg.date = new Date(Date.parse(msg.timeformat));
            msg.user = msg.userid;
            msg.type = 'img';
            console.log(msg);
            let session = this.sessions.find(item => item.id == msg.user);
            if(session){
              this.getMessage(msg);
            }else{
                console.log('增加新会话');
                this.$socket.emit('lastGuestMessage', {
                    from:'admin',
                    adminid:'1',
                    userid:msg.user,
                    rand:sessionStorage.getItem('rand')
                })
            }
        },
    }
};
</script>

<template>
<div class="list">
    <div v-if="deleteId" class="alert alert-danger" role="alert">用户{{deleteId}}<br>
        <button type="button" class="btn btn-default" @click="hiddenUser">隐藏</button>
        <button type="button" class="btn btn-default" @click="deleteUser">删除</button>
        <button type="button" class="btn btn-default" @click="nodelete">取消</button>
    </div>
    <ul v-if="sessions">
        <li v-for="item in sessions | orderBy 'user.time' -1" :class="{ active: item.id === currentId }" @click="selectSession(item.id)" >
            <div class="ext">
                <p class="attr ng-binding">{{item.user.time | time}}</p><i class="glyphicon glyphicon-{{item.user.icon}}" @click="ifdeleteSession(item.id)"></i>
            </div>
            <div class="avatar">
                <img class="img" :src="item.user.img">
                <em v-if="item.user.num" class="new_msg">{{item.user.num}}</em>
            </div>
            <div class="info">
                <h3 class="nickname">
                    <span class="nickname_text">{{item.user.name}}</span>
                </h3>
                <p class="msg">
                    <span>{{item.user.content}}</span>
                </p>
            </div>
        </li>
    </ul>
    <div v-if="currentLength">
        <div class="nobody">
            暂无会话中的客户聊天
        </div>
    </div>
</div>
</template>
<style scoped lang="less">
.list {
    li {
        padding: 12px 18px 11px;
        overflow: hidden;
        position: relative;
        border-bottom: 1px solid #292C33;
        cursor: pointer;
        transition: background-color .1s;
        &:hover {
            background-color: rgba(255, 255, 255, 0.03);
        }
        &.active {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
    .ext {
        float: right;
        color: #6b6f7c;
        font-size: 13px;
        text-align: right;
    }
    .avatar {
        float: left;
        margin-right: 10px;
        position: relative;
    }
    .avatar .img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 2px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
    }
    .info {
        overflow: hidden;
    }
    .nickname {
        font-weight: 400;
        font-size: 13px;
        color: #fff;
        line-height: 20px;margin-top: 0px;margin-bottom:0px;
    }
    .msg{
        margin-bottom:0px;
    }
    .nobody{
      text-align:center;
    }
    .new_msg{
        display: block;
        position: absolute;
        right: -10%;
        top: -0.5rem;
        padding: 0 .3rem;
        height: 1.3rem;
        line-height: 1.2rem;
        background: #FF0000;
        color: #fff;
        -moz-border-radius: .15rem;
        -webkit-border-radius: .15rem;
        border-radius: .85rem;
    }
}
</style>
