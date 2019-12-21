<template>
  <list-query :service-id="serviceId"/>
</template>

<script>
import ListQuery from './components/ListQuery'

export default {
  name: 'List',
  components: { ListQuery },
  data() {
    return {
      serviceId: ''
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.serviceId = to.query.SERVICE_ID
    next()
  },
  created() {
    this.serviceId = this.$route.query.SERVICE_ID
  }
}
</script>
