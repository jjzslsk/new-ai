import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post, ajax } from '@/utils/request'
import { useQueryStore } from '@/store'
import { getUserSession } from '@/utils/functions'

export function fetchChatAPI<T = any>(
	prompt: string,
	options?: { conversationId?: string; parentMessageId?: string },
	signal?: GenericAbortSignal,
) {
	return post<T>({
		url: '/chat',
		data: { prompt, options },
		signal,
	})
}

export function fetchChatConfig<T = any>() {
	return post<T>({
		url: '/config',
	})
}

export function fetchRepositoryList<T = any>(params: any) {
	return ajax<T>({
		url: '/chat/file/query',
		params
	})
}
export function fetchRepositoryDel<T = any>(params: any) {
	return ajax<T>({
		url: '/chat/file/delete',
		params
	})
}
export function fetchRepositorySave<T = any>(params: any) {
	return ajax<T>({
		url: '/chat/vector/save',
		params
	})
}


export function fetchToolList<T = any>(params: any) {
	return ajax<T>({
		url: '/chat/tool/query',
		params
	})
}
export function fetchToolDel<T = any>(params: any) {
	return ajax<T>({
		url: '/chat/tool/delete',
		params
	})
}
export function fetchToolSave<T = any>(params: any) {
	return ajax<T>({
		url: '/chat/tool/add',
		params
	})
}

export function fetchChatAPIProcess<T = any>(
	params: {
		prompt: string
		options?: { conversationId?: string; parentMessageId?: string }
		signal?: GenericAbortSignal
		onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
	},
) {
	let data: Record<string, any> = {
		query: params.prompt,
		model: useQueryStore().queryInfo.model,
		title: useQueryStore().queryInfo.title,
		user_id: `${getUserSession('user_id')}`,
	}
	let headers: string = "";
	return post<T>({
		url: `/chat/queryaction`,
		headers: { 'Authorization': `Bearer ${headers}` },
		data,
		signal: params.signal,
		onDownloadProgress: params.onDownloadProgress,
	})
}

export function fetchSession<T>() {
	return post<T>({
		url: '/session',
	})
}

export function fetchVerify<T>(token: string) {
	return post<T>({
		url: '/verify',
		data: { token },
	})
}

