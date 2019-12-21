<template>
  <div v-if="definitionData && articleData" class="app-container">
    <el-form ref="cardCurrentForm" :model="cardCurrentForm" label-width="150px">
      <el-collapse v-model="activeNames">
        <template v-for="groupItem in definitionData.cardOption.groups">
          <el-collapse-item v-if="groupItem.title" v-show="!groupItem.hidden" :name="groupItem.code" :key="groupItem.code">
            <template slot="title">{{ groupItem.title }}</template>
            <el-card>
              <el-row :gutter="10">
                <template v-for="(item,key) in groupItem.items">
                  <el-col :xs="definitionData.cardOption.layout.xs" :sm="definitionData.cardOption.layout.sm" :md="definitionData.cardOption.layout.md" :lg="definitionData.cardOption.layout.lg" :xl="definitionData.cardOption.layout.xl" :key="key">
                    <el-form-item v-if="item.type === 'text' && item.mode === 'default' && !item.hidden" :label="item.lable">
                      <el-input v-model="cardCurrentForm[item.code]" placeholder="请输入内容"/>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'text' && item.mode === 'treeSelect' && !item.hidden" :label="item.lable">
                      <el-popover placement="bottom" width="400" trigger="focus">
                        <div v-if="treeSelectData" class="treeSelectContent">
                          <el-tree :props="treeDefaultProps" :load="loadNode" lazy @node-click="handleNodeClick"/>
                        </div>
                        <el-input slot="reference" :key="cardCurrentForm[item.code]" :value="cardCurrentForm[item.code + '__NAME']" placeholder="请选择" prefix-icon="el-icon-search" @focus="getDictionary(item)"/>
                      </el-popover>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'password' && !item.hidden" :label="item.lable">
                      <el-input v-model="cardCurrentForm[item.code]" type="password"/>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'image' && !item.hidden" :label="item.lable">
                      <el-upload :action="uploadUrl" :data="uploadData(item.code)" :show-file-list="false" :on-success="handleImageSuccess">
                        <img v-if="cardCurrentForm[item.code]" :src="cardCurrentForm[item.code]">
                        <el-button v-else size="small" type="primary">点击上传</el-button>
                      </el-upload>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'radio' && !item.hidden" :label="item.lable">
                      <el-radio-group v-model="cardCurrentForm[item.code]">
                        <el-radio v-for="radioItem in definitionData.dict[item.dictId].CHILD" :label="radioItem.K | convertDataType(item.dataType)" :key="radioItem.K">{{ radioItem.N }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'date' && item.range && !item.hidden" :label="item.lable">
                      <el-date-picker v-model="cardCurrentForm[item.code]" :format="item.config.format" :value-format="item.config.format" unlink-panels type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'date' && !item.hidden" :label="item.lable">
                      <el-date-picker v-model="cardCurrentForm[item.code]" :format="item.config.format" :value-format="item.config.format" type="date" placeholder="选择日期"/>
                    </el-form-item>
                    <el-form-item v-else-if="item.type === 'select' && !item.hidden" :label="item.lable" style="width:100%">
                      <el-select v-model="cardCurrentForm[item.code]" :multiple="item.multiple" placeholder="请选择">
                        <el-option v-for="selectItem in definitionData.dict[item.dictId].CHILD" :key="selectItem.K" :label="selectItem.N" :value="selectItem.K | convertDataType(item.dataType)"/>
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
                <el-col :xs="definitionData.cardOption.layout.xs" :sm="definitionData.cardOption.layout.sm" :md="definitionData.cardOption.layout.md" :lg="definitionData.cardOption.layout.lg" :xl="definitionData.cardOption.layout.xl" :key="key">
                  <el-form-item v-if="item.type === 'text' && item.mode === 'default' && !item.hidden" :label="item.lable">
                    <el-input v-model="cardCurrentForm[item.code]" placeholder="请输入内容"/>
                  </el-form-item>
                  <el-form-item v-else-if="item.type === 'text' && item.mode === 'treeSelect' && !item.hidden" :label="item.lable">
                    <el-popover placement="bottom" width="400" trigger="focus">
                      <div v-if="treeSelectData" class="treeSelectContent">
                        <el-tree :props="treeDefaultProps" :load="loadNode" lazy @node-click="handleNodeClick"/>
                      </div>
                      <el-input slot="reference" :key="cardCurrentForm[item.code]" :value="cardCurrentForm[item.code + '__NAME']" placeholder="请选择" prefix-icon="el-icon-search" @focus="getDictionary(item)"/>
                    </el-popover>
                  </el-form-item>
                  <el-form-item v-else-if="item.type === 'password' && !item.hidden" :label="item.lable">
                    <el-input v-model="cardCurrentForm[item.code]" type="password"/>
                  </el-form-item>
                  <el-form-item v-else-if="item.type === 'image' && !item.hidden" :label="item.lable">
                    <el-upload action="https://jsonplaceholder.typicode.com/posts/">
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item v-else-if="item.type === 'radio' && !item.hidden" :label="item.lable">
                    <el-radio-group v-model="cardCurrentForm[item.code]">
                      <el-radio v-for="radioItem in definitionData.dict[item.dictId].CHILD" :label="radioItem.K | convertDataType(item.dataType)" :key="radioItem.K">{{ radioItem.N }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="item.type === 'date' && !item.hidden" :label="item.lable">
                    <el-date-picker v-model="cardCurrentForm[item.code]" :format="item.config.format" :value-format="item.config.format" type="date" placeholder="选择日期"/>
                  </el-form-item>
                  <el-form-item v-if="item.type === 'select' && !item.hidden" :label="item.lable" style="width:100%">
                    <el-select v-model="cardCurrentForm[item.code]" :multiple="item.multiple" placeholder="请选择">
                      <el-option v-for="selectItem in definitionData.dict[item.dictId].CHILD" :key="selectItem.K" :label="selectItem.N" :value="selectItem.K | convertDataType(item.dataType)"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-card>
        </template>
      </el-collapse>
      <el-button v-for="item in definitionData.cardButton.buttons" :key="item._PK_" type="primary" plain style="margin:10px 10px 0 0" @click="handleButtonClick(item.code)">{{ item.caption }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { dict, save } from '@/api/sy/common'
import { getToken } from '@/utils/auth'

export default {
  name: 'Card',
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
    definitionData: {
      type: [Object, Array, String],
      required: true
    },
    articleData: {
      type: [Object, Array, String],
      required: true
    },
    activeNames: {
      type: Array,
      required: true
    },
    originalForm: {
      type: Object,
      required: true
    },
    currentForm: {
      type: Object,
      required: true
    },
    params: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cardCurrentForm: '',
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
    currentForm() {
      this.cardCurrentForm = JSON.parse(JSON.stringify(this.currentForm))
      // console.log(this.cardCurrentForm)
    }
  },
  methods: {
    uploadData(transStr) {
      const form = {}
      form.transStr = transStr
      form._token = getToken()
      return form
    },
    handleImageSuccess(res, file) {
      // console.log(res, file)
      this.cardCurrentForm[res.transStr] = res.FILE_PATH
    },
    handleButtonClick(code) {
      const serviceId = this.params.SERVICE_ID
      const originalForm = this.originalForm
      const cardCurrentForm = this.cardCurrentForm
      const form = {}
      if (code === 'save') {
        for (const key in originalForm) {
          if (cardCurrentForm[key] !== originalForm[key]) {
            form[key] = cardCurrentForm[key]
          }
        }
        // console.log(this.params)
        if (Object.keys(form).length) {
          if (this.isEdit && this.params._PK_) {
            form._PK_ = this.params._PK_
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
            this.$parent.getDefinition()
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
      // console.log(res)
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
        this.cardCurrentForm[this.treeSelectItem.code] = data.K
        this.cardCurrentForm[this.treeSelectItem.code + '__NAME'] = data.N
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>

