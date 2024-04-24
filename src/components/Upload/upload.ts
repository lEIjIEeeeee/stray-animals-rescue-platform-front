import { uploadFileApi } from '@/views/common/common.api'

export type UploadBizType = 'AVATAR' | 'ANIMAL' | 'POST' | 'CONTRIBUTION' | 'NOTICE' | 'COMMON'

export async function uploadFile(
  file: File,
  uploadBizType: UploadBizType,
  options: {
    next?: any
    complete?: any
    error?: any
  }
) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('uploadBizType', uploadBizType)
    options.next && options.next(50)
    const data = await uploadFileApi(formData)
    options.complete(data.data)
  } catch (e) {
    console.log(e)
    options.error && options.error()
  }
}
