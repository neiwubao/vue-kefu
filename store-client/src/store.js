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
        loginIf:'',
        deleteSessionId:''
    },
    mutations: {
        SET_LOGIN (state,ru_id) {
            console.log(ru_id);
            state.loginIf = true;
            state.storeSessionId = ru_id;
            sessionStorage.setItem('storeSessionId',compileStr(ru_id));

            function compileStr(code){ //对字符串进行加密
            var c=String.fromCharCode(code.charCodeAt(0)+code.length);
            for(var i=1;i<code.length;i++)
            {
              c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
            }
             return escape(c);   }
        },
        INIT_DATA (state,userlist,mystore) {
            state.loginIf = true;
            state.user = {
                name:mystore.name,
                img:mystore.logo
            }
            state.storeSessionId = mystore.id;
            console.log(mystore);
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
                        time:''
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
        GET_MESSAGE ({ sessions }, message) {
            //console.log(getmessage);
            let session = sessions.find(item => item.id == message.user);
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
                    id:message.user,
                    user:{
                        name:'',
                        img:'dist/images/1.jpg',
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
        IF_DELETE_SESSION(state, id) {
            console.log('shanchu'+id);
            state.deleteSessionId = id;
        },
        DELETE_SESSION(state, id) {
            state.sessions = state.sessions.filter(item => item.id != id);
            state.deleteSessionId = '';
        },
        SET_USER(state, userinfo) {
            let session = state.sessions.find(item => item.id == userinfo.user);
            if(session){
                session.user.name = userinfo.name;
                session.user.content = userinfo.content;
                session.user.img = userinfo.logo;
                session.user.time = userinfo.time;
            }
        },
        STORE_LOGOUT(state, ru_id){
            console.log('退出');
            state.loginIf = false;
            sessionStorage.setItem('storeSessionId','');
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
    ifdeleteSession: ({ dispatch }, id) => dispatch('IF_DELETE_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value),
    setUser: ({ dispatch }, userinfo) => dispatch('SET_USER', userinfo),
    setLogin: ({ dispatch }, ru_id) => dispatch('SET_LOGIN', ru_id),
    logout: ({ dispatch }, ru_id) => dispatch('STORE_LOGOUT', ru_id),
};
