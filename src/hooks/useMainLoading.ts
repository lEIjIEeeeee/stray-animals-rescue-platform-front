import { ref } from 'vue'

const useMainLoading = () => {
  const mainLoading = ref(false)
  const openMainLoading = () => {
    mainLoading.value = true
  }
  const closeMainLoading = () => {
    mainLoading.value = false
  }
  return { mainLoading, openMainLoading, closeMainLoading }
}
export default useMainLoading
