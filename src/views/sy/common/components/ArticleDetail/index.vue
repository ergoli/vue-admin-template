<template>
  <div v-if="definitionData">
    <el-radio-group v-model="serviceId">
      <el-radio-button v-for="item in tabArray" :key="item.linkServId" :label="item.linkServId">{{ item.title }}</el-radio-button>
    </el-radio-group>
    <template v-if="serviceId === params.SERVICE_ID">
      <card :definition-data="definitionData" :article-data="articleData" :active-names="activeNames" :original-form="originalForm" :current-form="currentForm" :params="params" :is-edit="isEdit"/>
    </template>
    <template v-else>
      <list-query :service-id="serviceId"/>
    </template>
    <el-tabs v-model="cardServiceId" tab-position="top">
      <el-tab-pane v-for="item in definitionData.cardOption.cardLink" :key="item.linkServId" :label="item.title" :name="item.linkServId">
        <!--<card :definition-data="definitionData" :article-data="articleData" :active-names="activeNames" :original-form="originalForm" :current-form="currentForm" :params="params" :is-edit="isEdit"/>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { def, byid } from '@/api/sy/common'
import ListQuery from '../ListQuery'
import Card from './Card'

export default {
  name: 'ArticleDetail',
  components: { ListQuery, Card },
  filters: {
    convertDataType(value, dataType) {
      if (dataType === 'STR') {
        return String(value)
      } else if (dataType === 'NUM') {
        return Number(value)
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: '',
      isCreateTab: true, // 是否生成tab，默认加载页面生成tab
      tabArray: [],
      serviceId: '',
      definitionData: '',
      articleData: '',
      originalForm: {},
      currentForm: {},
      activeNames: [],
      cardServiceId: '',
      cardDefinitionData: '',
      cardArticleData: '',
      cardOriginalForm: {},
      cardCurrentForm: {},
      cardActiveNames: [],
      treeSelectItem: '',
      treeSelectData: '',
      treeDefaultProps: {
        children: 'CHILD',
        label: 'N',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    uploadUrl() {
      return process.env.BASE_API + '/file/upload'
    }
  },
  watch: {
    serviceId() {
      console.log(this.serviceId)
      if (this.serviceId === this.params.SERVICE_ID) {
        this.getDefinition()
      }
    },
    // cardServiceId() {
    //   console.log(this.cardServiceId)
    //   this.getCardDefinition()
    // }
  },
  created() {
    this.params = this.$route.query
    this.serviceId = this.params.SERVICE_ID
    // this.getDefinition()
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
        if (this.isCreateTab && (this.serviceId === this.params.SERVICE_ID) && this.definitionData.cardOption && this.definitionData.cardOption.tabLink) { // 生成tab的数组
          const tabArray = []
          let index = 0
          const object = {}
          object.linkServId = this.params.SERVICE_ID
          object.title = '基础信息'
          tabArray[index] = object
          index = index + 1
          const tabLink = this.definitionData.cardOption.tabLink
          for (const key in tabLink) {
            const object = {}
            object.linkServId = tabLink[key].linkServId
            object.title = tabLink[key].title
            tabArray[index] = object
            index = index + 1
          }
          this.tabArray = tabArray
          this.isCreateTab = false
        }
        if (this.definitionData.cardOption && this.definitionData.cardOption.cardLink && Object.keys(this.definitionData.cardOption.cardLink).length) {
          const cardArray = []
          let index = 0
          const cardLink = this.definitionData.cardOption.cardLink
          for (const key in cardLink) {
            const object = {}
            object.linkServId = cardLink[key].linkServId
            object.title = cardLink[key].title
            cardArray[index] = object
            index = index + 1
          }
          this.cardServiceId = cardArray[0].linkServId
        }
        const originalForm = {}
        const currentForm = {}
        const activeNames = []
        const groups = (this.definitionData && this.definitionData.cardOption && this.definitionData.cardOption.groups) || {}
        for (const groupKey in groups) {
          if (!groups[groupKey].close) {
            activeNames.push(groups[groupKey].code)
          }
          const items = groups[groupKey].items
          for (const key in items) {
            originalForm[items[key].code] = ''
            currentForm[items[key].code] = ''
            if (items[key].type === 'text' && items[key].mode === 'treeSelect') {
              currentForm[items[key].code + '__NAME'] = ''
            }
          }
        }
        this.activeNames = activeNames
        this.getArticle(originalForm, currentForm)
      })
    },
    getArticle(originalForm, currentForm) {
      const serviceId = this.serviceId
      const form = {}
      if (this.isEdit && this.params._PK_) {
        form._PK_ = this.params._PK_
      } else {
        form._pass_data = true
      }
      byid(serviceId, form).then(res => {
        this.articleData = res.data
        for (const key in originalForm) {
          originalForm[key] = this.articleData[key]
        }
        for (const key in currentForm) {
          currentForm[key] = this.articleData[key]
        }
        this.originalForm = originalForm
        this.currentForm = currentForm
      })
    },
    getCardDefinition() {
      const cardServiceId = this.cardServiceId
      const form = {}
      const cardDefinitionData = JSON.parse(localStorage.getItem('cardServiceId')) || ''
      if (cardDefinitionData.timeStamp) {
        form.timeStamp = cardDefinitionData.timeStamp
      }
      def(cardServiceId, form).then(res => {
        if (res.data) {
          this.cardDefinitionData = res.data
          localStorage.setItem('cardServiceId', JSON.stringify(this.cardDefinitionData))
        } else {
          this.cardDefinitionData = cardDefinitionData
        }
        const cardOriginalForm = {}
        const cardCurrentForm = {}
        const cardActiveNames = []
        const groups = (this.cardDefinitionData && this.cardDefinitionData.cardOption && this.cardDefinitionData.cardOption.groups) || {}
        for (const groupKey in groups) {
          if (!groups[groupKey].close) {
            cardActiveNames.push(groups[groupKey].code)
          }
          const items = groups[groupKey].items
          for (const key in items) {
            cardOriginalForm[items[key].code] = ''
            cardCurrentForm[items[key].code] = ''
            if (items[key].type === 'text' && items[key].mode === 'treeSelect') {
              cardCurrentForm[items[key].code + '__NAME'] = ''
            }
          }
        }
        this.cardActiveNames = cardActiveNames
        this.getCardArticle(cardOriginalForm, cardCurrentForm)
      })
    },
    getCardArticle(cardOriginalForm, cardCurrentForm) {
      const cardServiceId = this.cardServiceId
      const form = {}
      if (this.isEdit && this.params._PK_) {
        form._PK_ = this.params._PK_
      } else {
        form._pass_data = true
      }
      byid(cardServiceId, form).then(res => {
        this.cardArticleData = res.data
        for (const key in cardOriginalForm) {
          cardOriginalForm[key] = this.cardArticleData[key]
        }
        for (const key in cardCurrentForm) {
          cardCurrentForm[key] = this.cardArticleData[key]
        }
        this.cardOriginalForm = cardOriginalForm
        this.cardCurrentForm = cardCurrentForm
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-radio-group {
    padding: 20px 20px 0
  }
  .el-tabs {
    padding: 0 20px 20px
  }
</style>

