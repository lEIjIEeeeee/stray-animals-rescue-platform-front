import Cookies from 'js-cookie'

const TokenKey = 'token'
const UserType = 'UserType'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserType() {
  return Cookies.get(UserType)
}

export function setUserType(userType) {
  return Cookies.set(UserType, userType)
}

export function removeUserType() {
  return Cookies.remove(UserType)
}
