<template>
  <el-form-item :label="formItem.name" :prop="formItem.code" :rules="formItem.rules || []">
    <template v-if="formItem.type == 'input'" >
      <el-input 
        v-if="formItem.options.dataType == 'number' || formItem.options.dataType == 'integer' || formItem.options.dataType == 'float'"
        :type="formItem.options.dataType"
        v-model.number="dataModel"
        :placeholder="formItem.options.placeholder"
        :style="{width: formItem.options.width}"
        :disabled="formItem.options.disabled"
      >
        <i slot="suffix">
          {{widget.options.suffix}}
        </i>
      </el-input>
      <el-input 
        v-else
        :type="formItem.options.dataType"
        v-model="dataModel"
        :disabled="formItem.options.disabled"
        :placeholder="formItem.options.placeholder"
        :style="{width: formItem.options.width}"
      >
       <i slot="prefix" v-if="widget.options.prefix">
          {{widget.options.prefix}}
        </i>
        <i slot="suffix" v-if="widget.options.suffix">
          {{widget.options.suffix}}
        </i>
        <i slot="prepend" v-if="widget.options.prepend">
          {{widget.options.prepend}}
        </i>
        <i slot="append" v-if="widget.options.append">
          {{widget.options.append}}
        </i>
      </el-input>
    </template>

    <template v-if="formItem.type == 'textarea'">
      <el-input type="textarea" :rows="formItem.options.rows || 3"
        v-model="dataModel"
        :disabled="formItem.options.disabled"
        :placeholder="formItem.options.placeholder"
        :style="{width: formItem.options.width}"
      ></el-input>
    </template>

    <template v-if="formItem.type == 'number'">
      <el-input-number 
        v-model="dataModel" 
        :style="{width: widget.options.width}"
        :step="widget.options.step"
        controls-position="right"
        :disabled="widget.options.disabled"
        :min="widget.options.min"
        :max="widget.options.max"
      ></el-input-number>
    </template>

    <template v-if="formItem.type == 'radio'">
      <el-radio-group v-model="dataModel"
        :style="{width: formItem.options.width}"
        :disabled="formItem.options.disabled"
      >
        <el-radio
          :style="{display: formItem.options.inline ? 'inline-block' : 'block'}"
          :label="item.value" v-for="(item, index) in (formItem.options.remote ? formItem.options.remoteOptions : formItem.options.options)" :key="index"
        >
          <template v-if="formItem.options.remote">{{item.label}}</template>
          <template v-else>{{formItem.options.showLabel ? item.label : item.value}}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="formItem.type == 'checkbox'">
      <el-checkbox-group v-model="dataModel"
        :style="{width: formItem.options.width}"
        :disabled="formItem.options.disabled"
      >
        <el-checkbox
          
          :style="{display: formItem.options.inline ? 'inline-block' : 'block'}"
          :label="item.value" v-for="(item, index) in (formItem.options.remote ? formItem.options.remoteOptions : formItem.options.options)" :key="index"
        >
          <template v-if="formItem.options.remote">{{item.label}}</template>
          <template v-else>{{formItem.options.showLabel ? item.label : item.value}}</template>
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="formItem.type == 'time'">
      <el-time-picker 
        v-model="dataModel"
        :is-range="formItem.options.isRange"
        :placeholder="formItem.options.placeholder"
        :start-placeholder="formItem.options.startPlaceholder"
        :end-placeholder="formItem.options.endPlaceholder"
        :readonly="formItem.options.readonly"
        :disabled="formItem.options.disabled"
        :editable="formItem.options.editable"
        :clearable="formItem.options.clearable"
        :arrowControl="formItem.options.arrowControl"
        :value-format="formItem.options.format"
        :style="{width: formItem.options.width}"
      >
      </el-time-picker>
    </template>

    <template v-if="formItem.type=='date'">
      <el-date-picker
        v-model="dataModel"
        :type="formItem.options.type"
        :placeholder="formItem.options.placeholder"
        :start-placeholder="formItem.options.startPlaceholder"
        :end-placeholder="formItem.options.endPlaceholder"
        :readonly="formItem.options.readonly"
        :disabled="formItem.options.disabled"
        :editable="formItem.options.editable"
        :clearable="formItem.options.clearable"
        :value-format="formItem.options.timestamp ? 'timestamp' : formItem.options.format"
        :format="formItem.options.format"
        :style="{width: formItem.options.width}"
      >
      </el-date-picker>
    </template>

    <template v-if="formItem.type =='rate'">
      <el-rate v-model="dataModel"
        :max="formItem.options.max"
        :disabled="formItem.options.disabled"
        :allow-half="formItem.options.allowHalf"
      ></el-rate>
    </template>

    <template v-if="formItem.type == 'color'">
      <el-color-picker 
        v-model="dataModel"
        :disabled="formItem.options.disabled"
        :show-alpha="formItem.options.showAlpha"
      ></el-color-picker>
    </template>

    <template v-if="formItem.type == 'select'">
      <el-select
        v-model="dataModel"
        :disabled="formItem.options.disabled"
        :multiple="formItem.options.multiple"
        :clearable="formItem.options.clearable"
        :placeholder="formItem.options.placeholder"
        :style="{width: formItem.options.width}"
        :filterable="formItem.options.filterable"
      >
        <el-option v-for="item in (formItem.options.remote ? formItem.options.remoteOptions : formItem.options.options)" :key="item.value" :value="item.value" :label="formItem.options.showLabel || formItem.options.remote?item.label:item.value"></el-option>
      </el-select>
    </template>

    <template v-if="formItem.type=='switch'">
      <el-switch
        v-model="dataModel"
        :disabled="formItem.options.disabled"
      >
      </el-switch>
    </template>

    <template v-if="formItem.type=='slider'">
      <el-slider 
        v-model="dataModel"
        :min="formItem.options.min"
        :max="formItem.options.max"
        :disabled="formItem.options.disabled"
        :step="formItem.options.step"
        :show-input="formItem.options.showInput"
        :range="formItem.options.range"
        :style="{width: formItem.options.width}"
      ></el-slider>
    </template>

    <template v-if="formItem.type=='imgupload'">
      <fm-upload
        v-model="dataModel"
        :disabled="formItem.options.disabled"
        :style="{'width': formItem.options.width}"
        :width="formItem.options.size.width"
        :height="formItem.options.size.height"
        :token="formItem.options.token"
        :domain="formItem.options.domain"
        :multiple="formItem.options.multiple"
        :length="formItem.options.length"
        :is-qiniu="formItem.options.isQiniu"
        :is-delete="formItem.options.isDelete"
        :min="formItem.options.min"
        :is-edit="formItem.options.isEdit"
        :action="formItem.options.action"
      >
      </fm-upload>
    </template>

    <template v-if="formItem.type == 'editor'">
      <vue-editor
        v-model="dataModel"
        :style="{width: formItem.options.width}"
      >
      </vue-editor>
    </template>

    <template v-if="formItem.type == 'cascader'">
      <el-cascader
        v-model="dataModel"
        :disabled="formItem.options.disabled"
        :clearable="formItem.options.clearable"
        :placeholder="formItem.options.placeholder"
        :style="{width: formItem.options.width}"
        :options="formItem.options.remoteOptions"
      >

      </el-cascader>
    </template>

    <template v-if="formItem.type == 'text'">
      <span>{{dataModel}}</span>
    </template>
  </el-form-item>
</template>

<script>
import FmUpload from './Upload'
export default {
  props: ['formItem', 'models', 'remote'],
  components: {
    FmUpload
  },
  data () {
    return {
      dataModel: this.models[this.formItem.code]
    }
  },
  created () {
    if (this.formItem.options.remote && this.remote[this.formItem.options.remoteFunc]) {
      this.remote[this.formItem.options.remoteFunc]((data) => {
        this.formItem.options.remoteOptions = data.map(item => {
          return {
            value: item[this.formItem.options.props.value],
            label: item[this.formItem.options.props.label],
            children: item[this.formItem.options.props.children]
          }
        })
      })
    }
    if (this.formItem.type === 'imgupload' && this.formItem.options.isQiniu) {
      this.remote[this.formItem.options.tokenFunc]((data) => {
        this.formItem.options.token = data
      })
    }
  },
  methods: {
  },
  watch: {
    dataModel: {
      deep: true,
      handler (val) {
        this.models[this.formItem.code] = val
        this.$emit('update:models', {
          ...this.models,
          [this.formItem.code]: val
        })
        this.$emit('input-change', val, this.formItem.code)
      }
    },
    models: {
      deep: true,
      handler (val) {
        this.dataModel = val[this.formItem.code]
      }
    }
  }
}
</script>