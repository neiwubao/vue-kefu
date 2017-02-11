<script>
import { actions } from '../store';

export default {
    vuex: {
        actions: actions,
        getters: {
            // 过滤后的会话列表
            sessions: ({ sessions, filterKey }) => {
                let result = sessions.filter(session => session.user.name.includes(filterKey));
                return result;
            },
            // 当前会话index
            currentId: ({ currentSessionId }) => currentSessionId,
            deleteId: ({ deleteSessionId }) => deleteSessionId
        }
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if(date){
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                return date.getHours() + ':' + date.getMinutes();
            }
        }
    },
    methods: {
        deleteUser: function(){
            console.log(this.deleteId);
            this.$socket.emit('deleteUser', {store:188, userid:this.deleteId});
            this.deleteSession(this.deleteId);
        },
        nodelete:function(){
            console.log(this.currentId);
            console.log(this.deleteId);
        }
    }
};
</script>

<template>
<div class="list">
    <div v-if="deleteId" class="alert alert-danger" role="alert">确认要删除用户{{deleteId}}吗？<br>
        <button type="button" class="btn btn-default" @click="deleteUser">删除</button>
        <button type="button" class="btn btn-default" @click="nodelete">取消</button>
    </div>
    <ul v-if="sessions">
        <li v-for="item in sessions" :class="{ active: item.id === currentId }" @click="selectSession(item.id)">
            <div class="ext">
                <p class="attr ng-binding">{{item.user.time | time}}</p><i class="glyphicon glyphicon-remove" @click="ifdeleteSession(item.id)"></i>
            </div>
            <div class="avatar">
                <img class="img" :src="item.user.img">
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
    <div v-else="sessions">
        sdfsdf
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
}
</style>