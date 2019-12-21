import request from '@/utils/request'
import requestHeaders from '@/utils/requestHeaders'

export function dict(data) {
  return request({
    url: '/SY_COMM_INFO/dict',
    method: 'get',
    params: data
  })
}

export function def(serviceId, data) {
  return request({
    url: '/' + serviceId + '/def',
    method: 'get',
    params: data
  })
}

export function query(serviceId, data) {
  return request({
    url: '/' + serviceId + '/query',
    method: 'get',
    params: data
  })
}

export function byid(serviceId, data) {
  return request({
    url: '/' + serviceId + '/byid',
    method: 'get',
    params: data
  })
}

export function add(serviceId, data) {
  return request({
    url: '/' + serviceId + '/add',
    method: 'post',
    params: data
  })
}

export function save(serviceId, data) {
  return request({
    url: '/' + serviceId + '/save',
    method: 'post',
    params: data
  })
}

export function exp(serviceId, data) {
  return requestHeaders({
    url: '/' + serviceId + '/exp',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}
