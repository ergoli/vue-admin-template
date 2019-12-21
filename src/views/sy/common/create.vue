<template>
  <card :is-edit="false" :service-id="serviceId" :pk="pk"/>
</template>

<script>
import Card from './components/Card'

export default {
  name: 'Create',
  components: { Card },
  data() {
    return {
      serviceId: '',
      pk: ''
    }
  },
  created() {
    this.serviceId = this.$route.query.SERVICE_ID
  }
}
</script>
