/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
    state: {
        // 当前用户
        userSessionId: '',
        user: {
            name: '会员',
            img: 'dist/images/2.png'
        },
        //
        currentAdminId:1,
        // 聊天记录列表
        session: [],
        // 过滤出只包含这个key的会话
        filterKey: '',
        //当前商品ID
        currentGoodsId:''
    },
    mutations: {
        INIT_DATA (state,userinfo) {
            state.userSessionId = userinfo.id;
            state.user = {
                name:userinfo.name,
                img:userinfo.img
            }
            console.log('数据初始化');
            state.session = {
                admin:{
                    name:'客服',
                    img:'http://www.ydc0755.com/template/mobile/new2/static/images/kflogo.png',
                    time:'',
                    content:''
                },
                messages:[]
            };
        },
        // 发送消息
        SEND_MESSAGE ({ session }, content, type) {
            if(type=='img'){
                session.messages.push({
                    img: content,
                    date: new Date(),
                    self: true
                });
            }else if(type == 'pro'){
                session.messages.push({
                    id: message.content.id,
                    name: message.content.name,
                    pic: 'http://www.ydc0755.com'+message.content.pic,
                    price: message.content.price,
                    date: message.date,
                    self: message.self
                });
            }else{
                session.messages.push({
                    content: content,
                    date: new Date(),
                    self: true
                });
            }
        },
        //接收消息
        GET_MESSAGE ({ session }, message) {
          console.log(message)

          if(message.type == 'img'){
              session.messages.push({
                  img: message.content,
                  date: message.date,
                  self: message.self
              });
          }else if(message.type == 'pro'){
              session.messages.push({
                  id: message.content.id,
                  name: message.content.name,
                  pic: 'http://www.ydc0755.com'+message.content.pic,
                  price: message.content.price,
                  date: message.date,
                  self: message.self
              });
          }else{
              session.messages.push({
                  content: message.content,
                  date: message.date,
                  self: message.self
              });
          }
        },
        // 搜索
        SET_FILTER_KEY (state, value) {
            state.filterKey = value;
        },
    }
});

store.watch(
    (state) => state.session,
    (val) => {
        localStorage.setItem('vue-chat-session', JSON.stringify(val));
    },
    {
        deep: true
    }
);

export default store;
export const actions = {
    initData: ({ dispatch }, userinfo) => dispatch('INIT_DATA', userinfo),
    sendMessage: ({ dispatch }, content, type) => dispatch('SEND_MESSAGE', content, type),
    getMessage: ({ dispatch }, message) => dispatch('GET_MESSAGE', message),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value)
};
