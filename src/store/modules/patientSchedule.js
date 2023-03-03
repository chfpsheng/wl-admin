const patientSchedule = {
    state: {
      refresh: false,
    },
    mutations: {
      updateRefresh(state, refresh) {
        state.refresh = refresh
      }
    }
  }
  
  export default patientSchedule