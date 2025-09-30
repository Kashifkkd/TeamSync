import { ReadonlyURLSearchParams } from "next/navigation"

interface GenerateViewUrlOptions {
  baseUrl?: string
  paramName?: string
  defaultView?: string
}

export function generateViewUrl(
  view: string,
  searchParams: ReadonlyURLSearchParams,
  options: GenerateViewUrlOptions = {}
) {
  const {
    baseUrl = "",
    paramName = "view",
    defaultView = "all"
  } = options

  const params = new URLSearchParams(searchParams.toString())
  
  if (view === defaultView) {
    params.delete(paramName)
  } else {
    params.set(paramName, view)
  }
  
  const queryString = params.toString()
  return `${baseUrl}${queryString ? `?${queryString}` : ""}`
}

export function getCurrentView(
  searchParams: ReadonlyURLSearchParams,
  paramName: string = "view",
  defaultView: string = "all"
) {
  return searchParams.get(paramName) || defaultView
}

export function isValidView(
  view: string,
  validViews: string[] = ["all", "board", "list", "calendar", "table", "gantt"]
) {
  return validViews.includes(view)
}
