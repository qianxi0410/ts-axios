import { parseHeaders } from './helpers/headers'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const { data = null, url, method = 'get', responseType } = config

		const request = new XMLHttpRequest()

		if (responseType) {
			request.responseType = responseType
		}

		request.open(method.toUpperCase(), url, true)

		request.onreadystatechange = function handleLoad() {
			if (request.readyState !== 4) {
				return
			}

			const responseHeaders = parseHeaders(request.getAllResponseHeaders())
			const responseData =
				responseType && responseType !== 'text' ? request.response : request.responseText
			const response: AxiosResponse = {
				data: responseData,
				status: request.status,
				statusText: request.statusText,
				headers: responseHeaders,
				config,
				request
			}
			resolve(response)
		}

		request.onerror = function handleError() {
			reject(new Error('Network Error'))
		}

		Object.keys(config.headers).forEach(name => {
			if (data === null && name.toLowerCase() === 'content-type') {
				delete config.headers[name]
			} else {
				request.setRequestHeader(name, config.headers[name])
			}
		})

		request.send(data)
	})
}
