<template>
  <div>
    <el-radio-group v-model="serviceId">
      <el-radio-button v-for="item in tabArray" :key="item.linkServId" :label="item.linkServId">{{ item.title }}</el-radio-button>
    </el-radio-group>
    <template v-if="serviceId === $route.query.SERVICE_ID">
      <card :is-edit="true" :service-id="serviceId" :pk="pk"/>
    </template>
    <template v-else>
      <list-query :service-id="serviceId"/>
    </template>
  </div>
</template>

<script>
import { def } from '@/api/sy/common'
import ListQuery from './components/ListQuery'
import Card from './components/Card'

export default {
  name: 'Edit',
  components: { ListQuery, Card },
  data() {
    return {
      serviceId: '',
      pk: '',
      tabArray: [],
      definitionData: ''
    }
  },
  created() {
    this.serviceId = this.$route.query.SERVICE_ID
    this.pk = this.$route.query._PK_
    this.getDefinition()
  },
  methods: {
    getDefinition() {
      const serviceId = this.serviceId
      const form = {}
      const definitionData = JSON.parse(localStorage.getItem('serviceId')) || ''
      if (definitionData.timeStamp) {
        form.timeStamp = definitionData.timeStamp
      }
      def(serviceId, form).then(res => {
        if (res.data) {
          this.definitionData = res.data
          localStorage.setItem('serviceId', JSON.stringify(this.definitionData))
        } else {
          this.definitionData = definitionData
        }
        if (this.definitionData && this.definitionData.tabLink && Object.keys(this.definitionData.tabLink).length) { // 生成tab的数组
          const tabArray = []
          let index = 0
          const object = {}
          object.linkServId = this.serviceId
          object.title = '基础信息'
          tabArray[index] = object
          index = index + 1
          const tabLink = this.definitionData.tabLink
          for (const key in tabLink) {
            const object = {}
            object.linkServId = tabLink[key].linkServId
            object.title = tabLink[key].title
            tabArray[index] = object
            index = index + 1
          }
          this.tabArray = tabArray
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-radio-group {
    padding: 20px 20px 0
  }
</style>
