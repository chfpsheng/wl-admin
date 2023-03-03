const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  defaultPatient: state => state.patient,
  selectedConversation: state => state.selectedConversationId,
  tabsName: state => state.activeName,
  hidden: state => {
    // eslint-disable-next-line no-unused-vars
    const temp = state.current
    if (typeof document.hasFocus !== 'function') {
      return document.hidden
    }
    return !document.hasFocus()
  }
}
export default getters
