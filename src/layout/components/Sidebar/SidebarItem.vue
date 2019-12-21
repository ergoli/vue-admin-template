<template>
  <div v-if="item" class="menu-wrapper">
    <template v-if="!(item.CHILD && item.CHILD.length)">
      <el-menu-item :index="item.K" @click="sidebarItemClick(item.INFO)">
        <div class="title">
          <i class="el-icon-document"/>
          <span class="title-text">{{ item.N }}</span>
        </div>      
      </el-menu-item>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.K" popper-append-to-body>
      <template slot="title">
        <div class="title">
          <i class="el-icon-tickets"/>
          <span class="title-text">{{ item.N }}</span>
        </div>      
      </template>
      <template v-for="child in item.CHILD">
        <sidebar-item
          v-if="child.CHILD&&child.CHILD.length"
          :item="child"
          :key="child.K"
          class="nest-menu" />
        <el-menu-item v-else :index="child.K" :key="child.K" @click="sidebarItemClick(child.INFO)">
          <div class="title">
            <i class="el-icon-document"/>
            <span class="title-text">{{ child.N }}</span>
          </div>
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: [Object, Array, String],
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    sidebarItemClick(info) {
      if (info) {
        this.$router.push({
          path: '/article',
          query: {
            SERVICE_ID: info
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .title{
    display: flex;
    align-items: center;
  }
  .title-text{
    display: block;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
