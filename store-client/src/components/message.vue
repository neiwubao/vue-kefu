<script>
export default {
    vuex: {
        getters: {
            user: ({ user }) => user,
            session: ({ sessions, currentSessionId }) => sessions.find(session => session.id === currentSessionId)
        }
    },
    data () {
        return {
            noticeMessage: ''
        };
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            var m = '';
            var h = '';
            if(date.getMinutes()<10){
                m = '0';
            }
            if(date.getHours()<10){
                h = '0';
            }
            var month = date.getMonth() + 1;
            var curDate = new Date(new Date().getTime()-24*60*60*1000);
            if(date < curDate){
                return month + '月' + date.getDate() + '日';
            }else{
                return month + '月' + date.getDate() + '日 ' + h + date.getHours() + ':' + m + date.getMinutes();
            }
        }
    },
    directives: {
        // 发送消息后滚动到底部
        'scroll-bottom' () {
            this.vm.$nextTick(() => {
                this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight;
            });
        }
    },
    sockets:{
        unLine: function(data){
            //console.log('客户已经下线');
            this.noticeMessage = '客户已经下线';
        }
    },
    methods: {
      del_message: function(score){
          this.removeByValue(score)
          let storeSessionId = sessionStorage.getItem('storeSessionId');
          let rand = sessionStorage.getItem('rand');
          this.$socket.emit('del_message', {adminid:storeSessionId, guestid:this.session.id,score:score});
          this.$socket.emit('lastGuestMessage', {
              from:'admin',
              adminid:'1',
              userid:this.session.id,
              rand:rand
          })
      },
      removeByValue: function(score) {
        let arr = this.session.messages;
        for(var i=0; i<arr.length; i++) {
          if(arr[i].date.getTime() == score) {
            arr.splice(i, 1);
            break;
          }
        }
      }
    },

};
</script>

<template>
<div class="message" v-scroll-bottom="session.messages">
    <ul v-if="session">
        <li v-for="item in session.messages">
            <p class="time">
                <span>{{ item.date | time}}</span>
            </p>
            <div class="main" :class="{ self: item.self }">
                <img class="avatar" width="30" height="30" :src="item.self ? user.img : session.user.img" />
                <div v-if="item.content" class="text">
                  {{ item.content }}
                  <div class="del" @click="del_message(item.date.getTime())">[删除]</div>
                </div>
                <img v-if="item.img" class="img" :src="item.img" />
                <section v-if="item.id" class="user-consult_goods mr0">
                  <img v-if="item.pic" height="100" width="100" :src="item.pic">
                  <div class="info"><a href="http://www.ydc0755.com/Home/Goods/goodsInfo/id/{{ item.id }}.html" target="_blank">
                  <label>{{ item.name }}</label>
                  </a>
                  <em>￥{{ item.price }}</em>
                  <div class="del" @click="del_message(item.date.getTime())">[删除]</div>
                  </div>
                </section>
            </div>
        </li>
    </ul>
    <p class="time" v-if="noticeMessage"><span>{{noticeMessage}}</span></p>
</div>
</template>

<style lang="less" scoped>
.message {
    padding: 10px 15px;
    overflow-y: scroll;

    li {
        margin-bottom: 15px;
        .del{
          display:none;float:right;margin-left:10px;
        }
        &:hover .del{
          display:block;
        }
    }
    .time {
        margin: 7px 0;
        text-align: center;

        > span {
            display: inline-block;
            padding: 0 18px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #dcdcdc;
        }
    }
    .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    .img {
      width: 20rem;
    }
    .text {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        max-width: ~'calc(100% - 40px)';
        min-height: 30px;
        line-height: 2.5;
        font-size: 12px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fafafa;
        }
    }

    .self {
        text-align: right;

        .avatar {
            float: right;
            margin: 0 0 0 10px;
        }
        .text {
            background-color: #b2e281;

            &:before {
                right: inherit;
                left: 100%;
                border-right-color: transparent;
                border-left-color: #b2e281;
            }
        }
    }

    .mr0{margin: 0px!important;}
    .user-consult_goods {
        margin: 10px;
        padding: 10px;
        border: 1px solid #ddd;
        display: -webkit-box;
        background-color: #fff;
        -webkit-box-shadow: 0 1px 1px #e8e8e8;
    }
    .user-consult_goods img {
        max-width: 80px;
        max-height: 80px;
    }
    .user-consult_goods .info {
        -webkit-box-flex: 1;
        height: 80px;
        padding-left: 10px;
        padding-top: 0rem;
    }
    .user-consult_goods .info em {
        display: block;
        height: 20px;
        line-height: 20px;
        color: #D40000;
        font-size: 14px;
    }
    .user-consult_goods .info span {
        display: block;
        height: 20px;
        line-height: 20px;
        color: #666;
        font-size: 12px;
        margin-left: 0rem;border: 1px solid orange;width:60px;text-align: center;border-radius:5px;float:right;
    }
    .user-consult_goods a {
        display: -webkit-box;
        text-decoration: none;
    }
    .user-consult_goods .info label {
        display: block;
        width: 100%;
        height: 40px;
        line-height: 20px;
        color: #333;
        font-size: 14px;
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
    }

}
</style>
