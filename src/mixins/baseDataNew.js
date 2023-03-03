import { dicData } from './request'
export default {
  name: 'baseData',
  data() {
    return {
      mixinData: {
      }
    }
  },
  methods: {
    // 性别-岗位
    dicDataMixins(data) {
      return new Promise((resolve, reject) => {
        let result = []
        dicData(data).then((res) => {
          result = res.data.map(item => {
            item = {
              value: item.itemCode,
              label: item.itemName
            }
            return item
          })
          resolve(result)
        }).catch(() => {
          reject(result)
        })
      });
    },
  }
}
