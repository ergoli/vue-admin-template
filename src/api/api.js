import request from '@/utils/request'

export default {
  doAct: function(serviceId, act, data) {
    return request({
      url: '/' + serviceId + '/' + act,
      method: 'get',
      params: data
    })
  },
  doActGet: function(serviceId, act, data) {
    return request({
      url: '/' + serviceId + '/' + act,
      method: 'get',
      params: data
    })
  }
}
