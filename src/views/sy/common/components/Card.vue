<template>
  <div v-if="definitionData && articleData" class="app-container">
    <el-form ref="currentForm" :model="currentForm" label-width="150px">
      <el-button v-for="item in definitionData.card.button.buttons" :key="item._PK_" type="primary" plain @click="formButtonClick(item.code)">{{ item.caption }}</el-button>
      <el-collapse v-model="activeNames">
        <template v-for="groupItem in definitionData.card.groups">
          <el-collapse-item v-if="groupItem.title" v-show="!groupItem.hidden" :name="groupItem.code" :key="groupItem.code">
            <template slot="title">{{ groupItem.title }}</template>
            <el-card>
              <el-row :gutter="10">
                <template v-for="(item) in getItemInfoList(groupItem.items)">
                  <el-col :xs="definitionData.card.layout.xs" :sm="definitionData.card.layout.sm" :md="definitionData.card.layout.md" :lg="definitionData.card.layout.lg" :xl="definitionData.card.layout.xl" :key="item.code">
                    <el-form-item v-if="item.type === 'text' && item.mode === 'default' && !item.hidden" :label="item.lable">
                      <el-input v-model="currentForm[item.code]" placeholder="请输入内容"/>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'text' && item.mode === 'treeSelect' && !item.hidden" :label="item.lable">
                      <el-popover placement="bottom" width="400" trigger="focus">
                        <div v-if="treeSelectData" class="treeSelectContent">
                          <el-tree :props="treeDefaultProps" :load="loadNode" lazy @node-click="handleNodeClick"/>
                        </div>
                        <el-input slot="reference" :key="currentForm[item.code]" :value="currentForm[item.code + '__NAME']" placeholder="请选择" prefix-icon="el-icon-search" @focus="getDictionary(item)"/>
                      </el-popover>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'password' && !item.hidden" :label="item.lable">
                      <el-input v-model="currentForm[item.code]" type="password"/>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'image' && !item.hidden" :label="item.lable">
                      <el-upload :action="uploadUrl" :data="uploadData(item.code)" :show-file-list="false" :on-success="handleImageSuccess">
                        <img v-if="currentForm[item.code]" :src="currentForm[item.code]">
                        <el-button v-else size="small" type="primary">点击上传</el-button>
                      </el-upload>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'radio' && !item.hidden" :label="item.lable">
                      <el-radio-group v-model="currentForm[item.code]">
                        <el-radio v-for="radioItem in definitionData.dicts[item.dictId].CHILD" :label="radioItem.K | convertDataType(item.dataType)" :key="radioItem.K">{{ radioItem.N }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'date' && item.range && !item.hidden" :label="item.lable">
                      <el-date-picker v-model="currentForm[item.code]" :format="item.config.format" :value-format="item.config.format" unlink-panels type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'date' && !item.hidden" :label="item.lable">
                      <el-date-picker v-model="currentForm[item.code]" :format="item.config.format" :value-format="item.config.format" type="date" placeholder="选择日期"/>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'select' && !item.hidden" :label="item.lable" style="width:100%">
                      <el-select v-model="currentForm[item.code]" :multiple="item.multiple" placeholder="请选择">
                        <el-option v-for="selectItem in definitionData.dicts[item.dictId].CHILD" :key="selectItem.K" :label="selectItem.N" :value="selectItem.K | convertDataType(item.dataType)"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
            </el-card>
          </el-collapse-item>
          <el-card v-else v-show="!groupItem.hidden" :name="groupItem.code" :key="groupItem.code">
            <el-row :gutter="10">
              <template v-for="(item,key) in groupItem.items">
                <el-col :xs="definitionData.card.layout.xs" :sm="definitionData.card.layout.sm" :md="definitionData.card.layout.md" :lg="definitionData.card.layout.lg" :xl="definitionData.card.layout.xl" :key="key">
                  <el-form-item v-if="item.type === 'text' && item.mode === 'default' && !item.hidden" :label="item.lable">
                    <el-input v-model="currentForm[item.code]" placeholder="请输入内容"/>
                  </el-form-item>
                  <el-form-item v-else-if="item.type === 'text' && item.mode === 'treeSelect' && !item.hidden" :label="item.lable">
                    <el-popover placement="bottom" width="400" trigger="focus">
                      <div v-if="treeSelectData" class="treeSelectContent">
                        <el-tree :props="treeDefaultProps" :load="loadNode" lazy @node-click="handleNodeClick"/>
                      </div>
                      <el-input slot="reference" :key="currentForm[item.code]" :value="currentForm[item.code + '__NAME']" placeholder="请选择" prefix-icon="el-icon-search" @focus="getDictionary(item)"/>
                    </el-popover>
                  </el-form-item>
                  <el-form-item v-else-if="item.type === 'password' && !item.hidden" :label="item.lable">
                    <el-input v-model="currentForm[item.code]" type="password"/>
                  </el-form-item>
                  <el-form-item v-else-if="item.type === 'image' && !item.hidden" :label="item.lable">
                    <el-upload action="https://jsonplaceholder.typicode.com/posts/">
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-else-if="item.type === 'radio' && !item.hidden" :label="item.lable">
                    <el-radio-group v-model="currentForm[item.code]">
                      <el-radio v-for="radioItem in definitionData.dicts[item.dictId].CHILD" :label="radioItem.K | convertDataType(item.dataType)" :key="radioItem.K">{{ radioItem.N }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="item.type === 'date' && !item.hidden" :label="item.lable">
                    <el-date-picker v-model="currentForm[item.code]" :format="item.config.format" :value-format="item.config.format" type="date" placeholder="选择日期"/>
                  </el-form-item>
                  <el-form-item v-if="item.type === 'select' && !item.hidden" :label="item.lable" style="width:100%">
                    <el-select v-model="currentForm[item.code]" :multiple="item.multiple" placeholder="请选择">
                      <el-option v-for="selectItem in definitionData.dicts[item.dictId].CHILD" :key="selectItem.K" :label="selectItem.N" :value="selectItem.K | convertDataType(item.dataType)"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-card>
        </template>
      </el-collapse>
    </el-form>
    <el-tabs v-model="cardLinkServiceId" tab-position="top">
      <el-tab-pane v-for="item in definitionData.card.topLink" :key="item.linkServId" :label="item.title" :name="item.linkServId">
        <list-query :service-id="item.linkServId"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { dict, def, byid, save } from '@/api/sy/common'
import { getToken } from '@/utils/auth'
import ListQuery from './ListQuery'

export default {
  name: 'ArticleDetail',
  components: { ListQuery },
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
    },
    serviceId: {
      type: String,
      required: true
    },
    pk: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      params: '',
      definitionData: '',
      articleData: '',
      originalForm: {},
      currentForm: {},
      activeNames: [],
      cardLinkServiceId: '',
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
  created() {
    this.params = this.$route.query
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
        if (this.definitionData.card && this.definitionData.card.cardTopLink && Object.keys(this.definitionData.card.cardTopLink).length) {
          const cardArray = []
          let index = 0
          const cardLink = this.definitionData.card.cardTopLink
          for (const key in cardLink) {
            const object = {}
            object.linkServId = cardLink[key].linkServId
            object.title = cardLink[key].title
            cardArray[index] = object
            index = index + 1
          }
          this.cardLinkServiceId = cardArray[0].linkServId
        }
        const originalForm = {}
        const currentForm = {}
        const activeNames = []
        const groups = (this.definitionData && this.definitionData.card && this.definitionData.card.groups) || {}
        for (const groupKey in groups) {
          if (!groups[groupKey].close) {
            activeNames.push(groups[groupKey].code)
          }
          const items = groups[groupKey].items
          for (let i = 0; i < items.length; i++) {
            const key = items[i]
            originalForm[key] = ''
            currentForm[key] = ''
            if (this.definitionData.items[key].type === 'text' && this.definitionData.items[key].mode === 'treeSelect') {
              currentForm[key + '__NAME'] = ''
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
      if (this.isEdit && this.pk) {
        form._PK_ = this.pk
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
    uploadData(transStr) {
      const form = {}
      form.transStr = transStr
      form._token = getToken()
      return form
    },
    handleImageSuccess(res, file) {
      console.log(res, file)
      this.currentForm[res.transStr] = res.FILE_PATH
    },
    formButtonClick(code) {
      const serviceId = this.serviceId
      const originalForm = this.originalForm
      const currentForm = this.currentForm
      const form = {}
      if (code === 'save') {
        for (const key in originalForm) {
          if (currentForm[key] !== originalForm[key]) {
            form[key] = currentForm[key]
          }
        }
        if (Object.keys(form).length) {
          if (this.isEdit && this.pk) {
            form._PK_ = this.pk
          }
          save(serviceId, form).then(res => {
            if (res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
            } else if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
            this.getDefinition()
          })
        }
      }
    },
    getDictionary(treeSelectItem) {
      const form = {}
      form.dictId = treeSelectItem.dictId
      form.layers = 1
      dict(form).then(res => {
        this.treeSelectItem = treeSelectItem
        this.treeSelectData = res.data
      })
    },
    handleUploadSuccess(res) {
      console.log(res)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeSelectData.CHILD)
      }
      const form = {}
      form.dictId = this.treeSelectItem.dictId
      form.parentKey = node.data.K
      dict(form).then(res => {
        const array = res.data.CHILD
        const selectTreeArray = []
        array.forEach(function(item, index) {
          selectTreeArray[index] = item
          if (!item.CHILD) {
            selectTreeArray[index].leaf = true
          }
        }, this)
        return resolve(selectTreeArray)
      })
    },
    handleNodeClick(data) {
      if (!data.CHILD) {
        this.currentForm[this.treeSelectItem.code] = data.K
        this.currentForm[this.treeSelectItem.code + '__NAME'] = data.N
      }
    },
    getItemInfoList(itemCodes) {
      const itemInfoList = new Array(itemCodes.length)
      for (let i = 0; i < itemCodes.length; i++) {
        itemInfoList[i] = this.definitionData.items[itemCodes[i]]
      }
      return itemInfoList
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-button {
    margin: 0 10px 10px 0
  }
  .el-form-item {
    height: 40px
  }
  .el-select {
    width: 100%
  }
      
  .el-input {
    width: 100%
  }
  .el-date-editor {
    width: 100%
  }
  .el-upload
    img {
      width: 50px;
      height: 50px
    }
  .el-form-item >>> .el-range-separator {
    width: 30px
  }
  .el-tabs {
    padding: 20px 0
  }
</style>

