import { ref } from 'vue'

const useMainDisabled = () => {
  const mainDisabled = ref(false)
  const openMainDisabled = () => {
    mainDisabled.value = true
  }
  const closeMainDisabled = () => {
    mainDisabled.value = false
  }
  return { mainDisabled, openMainDisabled, closeMainDisabled }
}
export default useMainDisabled
