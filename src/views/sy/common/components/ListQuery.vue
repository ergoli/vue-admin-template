<template>
  <div style="padding:20px;background-color:#F7F6F5;">
    <el-form v-if="definitionData && definitionData.query && definitionData.query.items" ref="currentForm" :model="currentForm" label-width="120px" style="padding:20px;background-color:#FFFFFF;">
      <el-row :gutter="10">
        <template v-for="(item,key) in definitionData.query.items">
          <el-col :xs="definitionData.query.layout.xs" :sm="definitionData.query.layout.sm" :md="definitionData.query.layout.md" :lg="definitionData.query.layout.lg" :xl="definitionData.query.layout.xl" :key="key">
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
      <el-form-item>
        <el-button type="primary" @click="submitForm('currentForm')">查询</el-button>
        <el-button @click="resetForm('currentForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div v-if="definitionData && definitionData.list && definitionData.list.columns" style="margin-top:20px;padding:20px;background-color:#FFFFFF;">
      <el-row style="width:100%;">
        <el-button v-for="(item,index) in definitionData.list.button.buttons" :key="index" type="primary" plain style="margin:10px 10px 0 0" @click="listButtonClick(item.code)">{{ item.caption }}</el-button>
      </el-row>
      <el-table v-if="definitionData.list.columns.length" :data="listData" empty-text="无相关记录！" stripe border fit highlight-current-row style="width:100%;margin-top:10px;">
        <el-table-column type="index" width="50"/>
        <el-table-column type="selection"/>
        <template v-for="(item,index) in definitionData.list.columns">
          <el-table-column v-if="item.isShow" :label="item.label" :key="index" align="center">
            <template slot-scope="scope">
              <div :style="{ textAlign: item.align }" @click="tableEdit(scope.row._PK_)">{{ scope.row[item.code] }}</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { dict, def, query, exp } from '@/api/sy/common'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'

export default {
  name: 'ArticleList',
  components: { Pagination },
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
    serviceId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      definitionData: '',
      isListOption: true,
      listData: [],
      total: 100,
      listQuery: {
        page: 1,
        limit: 20
      },
      originalForm: {},
      currentForm: {},
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
      this.definitionData = ''
      this.isListOption = true
      this.listData = []
      this.originalForm = {}
      this.currentForm = {}
      this.getDefinition()
    }
  },
  created() {
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
        const originalForm = {}
        const currentForm = {}
        const items = (this.definitionData && this.definitionData.query && this.definitionData.query.items) || {}
        for (const key in items) {
          originalForm[items[key].code] = ''
          currentForm[items[key].code] = ''
          if (items[key].type === 'text' && items[key].mode === 'treeSelect') {
            currentForm[items[key].code + '__NAME'] = ''
          }
        }
        this.originalForm = originalForm
        this.currentForm = currentForm
        this.getList()
      })
    },
    getList() {
      const that = this
      const serviceId = this.serviceId
      const form = {}
      for (const key in this.originalForm) {
        if (this.currentForm[key] && Array.isArray(this.currentForm[key]) && this.currentForm[key].length) {
          form[key] = this.currentForm[key].join(',')
        } else if (this.currentForm[key]) {
          form[key] = this.currentForm[key]
        }
      }
      form._columns = this.isListOption
      form._page_num = this.listQuery.page
      // form._page_size = this.listQuery.limit
      form._total = true
      query(serviceId, form).then(res => {
        that.isListOption = false
        if (res._columns) {
          that.definitionData.list.columns = res._columns
        }
        if (res._page) {
          that.listQuery.page = res._page.curr_page
          that.listQuery.limit = res._page.page_size
        }
        that.listData = res.data || []
        that.total = Number(res._total)
      })
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.currentForm)
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.getList()
      })
    },
    listButtonClick(code) {
      const serviceId = this.serviceId
      if (code === 'add') {
        this.$router.push({
          path: 'create',
          query: {
            SERVICE_ID: serviceId
          }
        })
      } else if (code === 'batchSave') {
        console.log(code)
      } else if (code === 'delete') {
        console.log(code)
      } else if (code === 'exp') {
        const form = {}
        exp(serviceId, form).then(res => {
          const expNameArray = res.headers['content-disposition'].split("''")
          const expName = decodeURIComponent(expNameArray[expNameArray.length - 1])
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', expName)
          document.body.appendChild(link)
          link.click()
        })
      }
    },
    tableEdit(pk) {
      const serviceId = this.serviceId
      this.$router.push({
        path: 'edit',
        query: {
          SERVICE_ID: serviceId,
          _PK_: pk
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
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

