export interface PageMeta {
  page: number
  size: number
  totalPage: number
  totalElements: number
}

export interface PageResponse<T> {
  data: T[]
  meta: PageMeta
}
