export function buildRoutePath(path) {
    const routeParametersPath = /:([a-zA-Z]+)/g

    const paramsWithParams = path.replaceAll(routeParametersPath, '(?<$1>[a-z0-9\-_]+)')

    const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)

    return pathRegex
}