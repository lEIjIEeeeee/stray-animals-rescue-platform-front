export function getUserAvatar(url: string) {
  if (url === '' || url === null) {
    return '/src/assets/user/default_avatar.png'
  } else {
    return url
  }
}
