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
        // 会话列表
        sessions: [],
        // 当前选中的会话
        currentSessionId: '',
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        INIT_DATA (state,userinfo,storelist,storeid) {
            //console.log('数据初始化');
            state.user = {
                name:userinfo.name,
                img:userinfo.img
            }
            state.userSessionId = userinfo.userid;
            if(storeid){
                state.currentSessionId = storeid;
            }
            for(var k in storelist){
                if(storeid){
                    
                }else{
                    if(k==0){
                        state.currentSessionId = storelist[k].from;
                    }
                }
                state.sessions.push({
                    id:storelist[k].from,
                    store:{
                        name:storelist[k].name,
                        img:'dist/images/1.jpg',
                        time:'',
                        content:''
                    },
                    messages:[]
                });
            }
        },
        // 发送消息
        SEND_MESSAGE ({ sessions, currentSessionId }, content, type) {
            let session = sessions.find(item => item.id === currentSessionId);
            if(type=='img'){
                session.messages.push({
                    img: content,
                    date: new Date(),
                    self: true
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
        GET_MESSAGE ({ sessions, currentSessionId }, message) {
            //console.log(message);
            let session = sessions.find(item => item.id == message.store);
            if(session){
                if(message.type == 'img'){
                    session.messages.push({
                        img: message.content,
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
               
            }else{
                sessions.push({
                    id:message.store,
                    store:{
                        name:'',
                        img:'dist/images/1.jpg',
                        time:'',
                        content:''
                    },
                    messages:[
                        {
                            content: message.content,
                            date: new Date(),
                            self: message.self
                        }
                    ]
                });
            }

        },
        // 选择会话
        SELECT_SESSION (state, id) {
            state.currentSessionId = id;
        },
        // 搜索
        SET_FILTER_KEY (state, value) {
            state.filterKey = value;
        },
        SET_STORE (state, storeinfo) {
            let session = state.sessions.find(item => item.id == storeinfo.store);
            if(session){
                session.store.name = storeinfo.name;
                session.store.img = storeinfo.logo;
                session.store.time = storeinfo.time;
                session.store.content = storeinfo.content;                
            }else{
                console.log('未找到已有厂家，是一个新厂家');
                state.sessions.push({
                    id:storeinfo.storeid,
                    store:{
                        name:storeinfo.storeid,
                        img:'dist/images/1.jpg',
                        time:'',
                        content:''
                    },
                    messages:[]
                });
            }
        }
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        //console.log('CHANGE: ', val);
        localStorage.setItem('vue-chat-session', JSON.stringify(val));
    },
    {
        deep: true
    }
);

export default store;
export const actions = {
    initData: ({ dispatch }, userinfo, storelist, storeid) => dispatch('INIT_DATA', userinfo, storelist, storeid),
    sendMessage: ({ dispatch }, content, type) => dispatch('SEND_MESSAGE', content, type),
    setStore: ({ dispatch }, storeinfo) => dispatch('SET_STORE', storeinfo),
    getMessage: ({ dispatch }, message) => dispatch('GET_MESSAGE', message),
    selectSession: ({ dispatch }, id) => dispatch('SELECT_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value)
};
