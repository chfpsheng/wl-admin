const massModules = {
    state: {
        selectList:[],
    },
    getters: {

    },
    mutations: {
        addSelectList(state,val){
            state.selectList = val;
        },
        deleteAllSelect(state){
            state.selectList = []
        },
        selectAll(state,val){
            state.selectList = val;
        }
    },
    actions: {
        deleteSelect({state},payload){
            state.selectList = state.selectList.filter((item,index)=>{
                return item.id != payload
            })
        }
    }
  }
  
  export default massModules
  