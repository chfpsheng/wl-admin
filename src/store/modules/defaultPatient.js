const defaultPatient = {
  state: {
    patient: {},
  },
  mutations: {
    updateDefaultPatient(state, patient) {
      state.patient = patient
    }
  }
}

export default defaultPatient