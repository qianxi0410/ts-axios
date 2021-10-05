import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
	const { data = null, url, method = 'get' } = config

	const request = new XMLHttpRequest()

	request.open(method.toUpperCase(), url, true)

	Object.keys(config.headers).forEach(name => {
		if (data === null && name.toLowerCase() === 'content-type') {
			delete config.headers[name]
		} else {
			request.setRequestHeader(name, config.headers[name])
		}
	})

	request.send(data)
}
