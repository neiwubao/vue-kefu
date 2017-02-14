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
        storeSessionId: '',
        user: {
            name: '厂家',
            img: 'dist/images/1.jpg'
        },
        // 会话列表
        sessions: [],
        // 当前选中的会话
        currentSessionId: '',
        // 过滤出只包含这个key的会话
        filterKey: '',
        loginIf:false,
        currentLength:true,
        deleteSessionId:''
    },
    mutations: {
        SET_LOGIN (state,ru_id) {
            console.log(ru_id);
            state.storeSessionId = ru_id;
            sessionStorage.setItem('storeSessionId',ru_id);
        },
        INIT_DATA (state,userlist,mystore) {
            state.loginIf = true;
            state.user = {
                name:mystore.name,
                img:mystore.logo
            }
            state.storeSessionId = mystore.id;
            console.log('初始化数据')
            for(var k in userlist){
                if(k==0){
                    state.currentSessionId = userlist[k].from;
                }
                state.sessions.push({
                    id:userlist[k].from,
                    user:{
                        name:userlist[k].name,
                        img:'dist/images/2.png',
                        content:'',
                        time:'',
                        icon:'remove',
                        num:0
                    },
                    messages:[]
                });

            }
            if(userlist.length){
                state.currentLength = false;
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
            session.user.time = new Date();
            session.user.content = content;
        },

        //接收消息
        GET_MESSAGE ({ sessions }, message) {
            let session = sessions.find(item => item.id == message.user);
            if(session){
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
            }
        },
        // 选择会话
        SELECT_SESSION (state, id) {
            state.currentSessionId = id;
            let session = state.sessions.find(item => item.id == id);
            if(session){
                session.user.icon = 'remove';
                session.user.num = 0;
            }
        },
        // 搜索
        SET_FILTER_KEY (state, value) {
            state.filterKey = value;
        },
        IF_DELETE_SESSION(state, id) {
            //console.log('shanchu'+id);
            state.deleteSessionId = id;
        },
        DELETE_SESSION(state, id) {
            state.sessions = state.sessions.filter(item => item.id != id);
            state.deleteSessionId = '';
        },
        NODEL_SESSION(state) {
            state.deleteSessionId = '';
        },
        UPDATE_USER(state, userinfo){
            let session = state.sessions.find(item => item.id == userinfo.user);
            if(session){
                if(userinfo.type == 'pro'){
                  userinfo.content = '产品';
                }
                session.user.content = userinfo.content;
                session.user.time = userinfo.date;
                session.user.icon = 'eye-open';
                session.user.num = session.user.num + 1
                console.log(session);
            }
        },
        SET_USER(state, userinfo) {
            if(state.sessions){
                let session = state.sessions.find(item => item.id == userinfo.user);
                if(session){
                    session.user.name = userinfo.name;
                    session.user.content = userinfo.content;
                    session.user.img = userinfo.logo;
                    session.user.time = userinfo.time;
                    session.user.icon = 'remove2';
                }else{
                    console.log('--2--');
                    state.sessions.push({
                        id:userinfo.user,
                        user:{
                            name:userinfo.name,
                            img:userinfo.logo,
                            content:userinfo.content,
                            time:userinfo.time
                        },
                        messages:[
                            {
                                content: userinfo.content,
                                date: new Date(),
                                self: false
                            }
                        ],
                    });
                    state.currentLength = false;
                }
            }else{
                console.log('--3--');
                state.sessions.push({
                    id:userinfo.user,
                    user:{
                        name:userinfo.name,
                        img:userinfo.logo,
                        content:userinfo.content,
                        time:userinfo.time
                    },
                    messages:[],
                });
            }
        },
        STORE_LOGOUT(state, ru_id){
            console.log('退出');
            state.loginIf = false;
            sessionStorage.removeItem('storeSessionId');
            sessionStorage.removeItem('rand');
            state.storeSessionId = '';
            state.sessions = [];
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
    initData: ({ dispatch }, userlist, mystore) => dispatch('INIT_DATA', userlist, mystore),
    sendMessage: ({ dispatch }, content, type) => dispatch('SEND_MESSAGE', content, type),
    getMessage: ({ dispatch }, message) => dispatch('GET_MESSAGE', message),
    selectSession: ({ dispatch }, id) => dispatch('SELECT_SESSION', id),
    deleteSession: ({ dispatch }, id) => dispatch('DELETE_SESSION', id),
    nodelSession: ({ dispatch }) => dispatch('NODEL_SESSION'),
    ifdeleteSession: ({ dispatch }, id) => dispatch('IF_DELETE_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value),
    setUser: ({ dispatch }, userinfo) => dispatch('SET_USER', userinfo),
    updateUser: ({ dispatch }, userinfo) => dispatch('UPDATE_USER', userinfo),
    setLogin: ({ dispatch }, ru_id) => dispatch('SET_LOGIN', ru_id),
    logout: ({ dispatch }, ru_id) => dispatch('STORE_LOGOUT', ru_id),
};
