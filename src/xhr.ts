import { createError } from './helpers/error'
import { parseHeaders } from './helpers/headers'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const {
			data = null,
			url,
			method = 'get',
			responseType,
			timeout,
			cancelToken,
			withCredentials
		} = config

		const request = new XMLHttpRequest()

		if (withCredentials) {
			request.withCredentials = true
		}

		if (cancelToken) {
			cancelToken.promise.then(resason => {
				request.abort()
				reject(resason)
			})
		}

		if (timeout) {
			request.timeout = timeout
		}

		if (responseType) {
			request.responseType = responseType
		}

		request.open(method.toUpperCase(), url!, true)

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
				reject(
					createError(
						`Request failed with status code ${response.status}`,
						config,
						null,
						request,
						response
					)
				)
			}
		}

		request.onerror = function handleError() {
			reject(createError('Network Error', config, null, request))
		}

		request.ontimeout = function handleTimeout() {
			reject(
				createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
			)
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
