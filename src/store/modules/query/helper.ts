import { ss } from '@/utils/storage'
const LOCAL_NAME = 'queryStorage'
export interface QueryInfo {
  model: string
  title: string
  repository: string
  tool: string
}

export interface QueryState {
  queryInfo: QueryInfo
}

export function defaultSetting(): QueryState {
  return {
    queryInfo: {
      model: '1',
      title: '',
      repository: '',
      tool: '',
    },
  }
}

export function getLocalState(): QueryState {
  const localSetting: QueryState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: QueryState): void {
  ss.set(LOCAL_NAME, setting)
}
