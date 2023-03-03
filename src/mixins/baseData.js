export default {
  name: 'baseData',
  data() {
    return {
      mixinData: {
      }
    }
  },
  methods: {
    // 角色
    async roleDataMixins() {
      const params = {}
      let result = await this.$requestPost(
        `/cloud-user/sysRole/queryBySystem?systemCode=${this.$systemCode}`,
        params
      )
      if (result && result.code === 200) {
        result = result.data.map(item => {
          item = {
            roleSystem: item.roleSystem,
            value: item.id,
            label: item.roleName
          }
          return item
        })
      } else {
        result = []
      }
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    },
    // 性别-岗位
    async dicDataMixins(val) {
      const params = {}
      let result = await this.$requestPost(
        `/cloud-baseinfo/sysDictionary/queryByType?dicType=${val}`,
        params
      )
      if (result && result.code === 200) {
        result = result.data.map(item => {
          item = {
            value: item.itemCode,
            label: item.itemName
          }
          return item
        })
      } else {
        result = []
      }
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    },
    // 科室
    async deptDataMixins() {
      const params = {
        pageNo: 1,
        pageSize: 100
      }
      let result = await this.$requestPost(
        '/cloud-baseinfo/department/query',
        params
      )
      if (result && result.code === 200) {
        result = result.data.rows.map(item => {
          item = {
            value: item.id,
            label: item.name
          }
          return item
        })
      } else {
        result = []
      }
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    }
  }
}
