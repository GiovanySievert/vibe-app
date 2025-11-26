import axios from 'axios'

export const placesApi = axios.create({
  baseURL: 'http://localhost:3001/'
})

// if (__DEV__) {
//   attachAxiosLogging(placesApi)
// }

function attachAxiosLogging(instance: typeof placesApi) {
  instance.interceptors.request.use((config) => {
    ;(config as any).metadata = { start: Date.now() }

    const maskedHeaders = { ...config.headers }
    if (maskedHeaders?.Authorization) maskedHeaders.Authorization = '****'

    // console.log(
    //   '📤 [REQUEST]',
    //   config.method?.toUpperCase(),
    //   config.baseURL ? new URL(config.url ?? '', config.baseURL).toString() : config.url,
    //   '\nHeaders:',
    //   maskedHeaders,
    //   config.data ? '\nBody:' : '',
    //   config.data ?? ''
    // )

    try {
      const url = config.baseURL ? new URL(config.url ?? '', config.baseURL).toString() : (config.url ?? '')
      const h = Object.entries(maskedHeaders ?? {})
        .map(([k, v]) => `-H '${k}: ${v}'`)
        .join(' ')
      const d = config.data
        ? `--data '${typeof config.data === 'string' ? config.data : JSON.stringify(config.data)}'`
        : ''
      // console.log(`curl -X ${config.method?.toUpperCase()} ${h} ${d} '${url}'`)
    } catch {}

    return config
  })

  instance.interceptors.response.use(
    (response) => {
      const start = (response.config as any).metadata?.start ?? Date.now()
      const duration = Date.now() - start

      console.log(
        // '📥 [RESPONSE]',
        // response.config.method?.toUpperCase(),
        // response.status,
        // response.config.baseURL
        //   ? new URL(response.config.url ?? '', response.config.baseURL).toString()
        //   : response.config.url,
        // `\n⏱ ${duration}ms`,
        // '\nHeaders:',
        // response.headers,
        response.data != null ? '\nBody:' : '',
        response.data ?? ''
      )
      return response
    },
    (error) => {
      const cfg = error.config ?? {}
      const start = (cfg as any).metadata?.start ?? Date.now()
      const duration = Date.now() - start

      if (error.response) {
        console.log(
          '❌ [ERROR]',
          cfg.method?.toUpperCase(),
          error.response.status,
          cfg.baseURL ? new URL(cfg.url ?? '', cfg.baseURL).toString() : cfg.url,
          `\n⏱ ${duration}ms`,
          '\nHeaders:',
          error.response.headers,
          error.response.data != null ? '\nBody:' : '',
          error.response.data ?? ''
        )
      } else {
        console.log(
          '❌ [ERROR]',
          cfg.method?.toUpperCase(),
          cfg.baseURL ? new URL(cfg.url ?? '', cfg.baseURL).toString() : cfg.url,
          `\n⏱ ${duration}ms`,
          '\nMessage:',
          error.message
        )
      }

      return Promise.reject(error)
    }
  )
}
