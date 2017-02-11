<script>
import { actions } from '../store';
export default {
    vuex: {
        actions: actions,
        getters: {
            user: ({ user }) => user,
            filterKey: ({ filterKey }) => filterKey
        }
    },
    methods: {
        onKeyup (e) {
            this.search(e.target.value);
        },
        logout() {
            this.logout();
        }
    }
};
</script>
<template>
<div class="card">
    <header>
        <img class="avatar" width="40" height="40" :alt="user.name" :src="user.img">
        <p class="name">{{user.name}}</p>
        <i class="glyphicon glyphicon-log-in" @click="logout" title="退出"></i>
    </header>
    <footer>
        <input class="search" type="text" placeholder="搜索..." @keyup="onKeyup | debounce 150">
    </footer>
</div>
</template>
<style scoped lang="less">
.card {
    padding: 12px;
    border-bottom: solid 1px #24272C;

    footer {
        margin-top: 10px;
    }
    .glyphicon-log-in{
        cursor: pointer;
    }
    .glyphicon{
        float:right;line-height: 33px;
    }
    .avatar, .name {
        vertical-align: middle;
    }
    .avatar {
        border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
        font-size: 16px;
    }
    .search {
        padding: 0 10px;
        width: 100%;
        font-size: 12px;
        color: #fff;
        height: 30px;
        line-height: 30px;
        border: solid 1px #3a3a3a;
        border-radius: 4px;
        outline: none;
        background-color: #26292E;
    }
}
</style>