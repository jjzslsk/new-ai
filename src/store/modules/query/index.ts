import { defineStore } from 'pinia'
import type { QueryInfo, QueryState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'

export const useQueryStore = defineStore('query-store', {
  state: (): QueryState => getLocalState(),
  actions: {
    updateQueryInfo(queryInfo: Partial<QueryInfo>) {
      this.queryInfo = { ...this.queryInfo, ...queryInfo }
      this.recordState()
    },

    resetQueryInfo() {
      this.queryInfo = { ...defaultSetting().queryInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
