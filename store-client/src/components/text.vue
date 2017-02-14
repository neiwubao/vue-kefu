<script>
import { actions } from '../store';

export default {
    vuex: {
        actions: actions,
        getters: {
            currentId: ({ currentSessionId }) => currentSessionId,
            adminId: ({ storeSessionId }) => storeSessionId
        }
    },
    data () {
        return {
            content: ''
        };
    },
    methods: {
        onKeyup (e) {
            if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                this.sendMessage(this.content);
                this.$socket.emit('adminMessage', {
                    userid:this.currentId,
                    content:this.content,
                    adminid:this.adminId,
                });
                this.content = '';
            }
        },
        send () {
            if(this.content){
                this.sendMessage(this.content);
                this.$socket.emit('adminMessage', {
                    userid:this.currentId,
                    content:this.content,
                    adminid:this.adminId
                });
                this.content = '';
            }else{
                alert('请先输入内容');
            }
        },
        addPic() {
            document.getElementById('file').click()
        },
        sendpic(){
            var file = document.querySelector('input[type=file]').files[0];
            var reader = new FileReader();
            if (file) {
                reader.readAsDataURL(file);
                var newthis = this;
                reader.onloadend = function (e) {
                    newthis.sendMessage(reader.result,'img');
                    document.getElementById('file').value = '';
                    newthis.$socket.emit('adminFile', {
                        guestid:newthis.currentId,
                        content:reader.result,
                        adminid:newthis.adminId,
                        type:'img'
                    });
                }
            }
        }
    }
};
</script>

<template>
<div class="text">
    <div class="bar">
        <i @click="addPic" class="glyphicon glyphicon-picture"></i><input type="file" id="file" value="" @change="sendpic">
    </div>
    <textarea placeholder="按 按钮 或者 Ctrl + Enter 发送" v-model="content" @keyup="onKeyup"></textarea>
    <button @click="send">发 送</button>
</div>
</template>

<style lang="less" scoped>
.text {
    height: 160px;
    border-top: solid 1px #ddd;
    .bar{
        height:25px;
        .glyphicon{
            margin-left:20px;
            line-height:20px;
        }
    }
    textarea {
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        font-family: "Micrsofot Yahei";
        resize: none;
    }

    button {
        position: absolute;
        width: 5rem;
        bottom: 2rem;
        right: 2rem;
        background-color:blue;
        color:#fff;
        border:0;
    }
    #file{
        display:none;
    }
}
</style>
