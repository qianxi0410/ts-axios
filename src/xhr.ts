import { parseHeaders } from './helpers/headers'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const { data = null, url, method = 'get', responseType, timeout } = config

		const request = new XMLHttpRequest()

		if (timeout) {
			request.timeout = timeout
		}

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

			if (response.status >= 200 && response.status < 300) {
				resolve(response)
			} else {
				reject(new Error(`Request failed with status code ${response.status}`))
			}
		}

		request.onerror = function handleError() {
			reject(new Error('Network Error'))
		}

		request.ontimeout = function handleTimeout() {
			reject(new Error(`Timeout of ${timeout} ms exceeded`))
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
