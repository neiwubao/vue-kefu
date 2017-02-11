<script>
import { actions } from '../store';

export default {
    vuex: {
        actions: actions,
        getters: {
            // 过滤后的会话列表
            sessions: ({ sessions, filterKey }) => {
                let result = sessions.filter(session => session.store.name.includes(filterKey));
                return result;
            },
            // 当前会话index
            currentId: ({ currentSessionId }) => currentSessionId
        }
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            return date.getHours() + ':' + date.getMinutes();
        }
    }
};
</script>

<template>
<div class="list">
    <ul>
        <li v-for="item in sessions" :class="{ active: item.id === currentId }" @click="selectSession(item.id)">
            <div class="ext">
                <p class="attr ng-binding"></p>
            </div>
            <div class="avatar">
                <img class="img" :src="item.store.img">
            </div>
            <div class="info">
                <h3 class="nickname">
                    <span class="nickname_text">{{item.store.name}}</span>
                </h3>
                <p class="msg">
                    <span>{{item.store.content}}</span>
                </p>
            </div>
        </li>
    </ul>
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