import { ref } from 'vue'

const usePopup = () => {
  const show = ref(false)
  const openPopup = () => {
    show.value = true
  }
  const closePopup = () => {
    show.value = false
  }
  return { show, openPopup, closePopup }
}
export default usePopup
