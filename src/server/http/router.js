// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 5 节“架构设计”中的 HTTP 路由分发。
const escapeRegExp = ({ value }) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createMatcher = ({ pattern }) => {
  if (pattern === '/') {
    return (pathname) => (pathname === '/' ? {} : null);
  }

  const paramNames = [];
  const regexSource = pattern
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      if (segment.startsWith(':')) {
        paramNames.push(segment.slice(1));
        return '([^/]+)';
      }

      return escapeRegExp({ value: segment });
    })
    .join('/');

  const matcher = new RegExp(`^/${regexSource}$`);

  return (pathname) => {
    const match = pathname.match(matcher);

    if (!match) {
      return null;
    }

    return Object.fromEntries(
      paramNames.map((paramName, index) => [
        paramName,
        decodeURIComponent(match[index + 1])
      ])
    );
  };
};

export const createRoute = ({ method, pattern, handler }) =>
  Object.freeze({
    method,
    handler,
    matchPath: createMatcher({ pattern })
  });

export const createRouter = ({ routes }) =>
  Object.freeze({
    match: ({ method, pathname }) => {
      for (const route of routes) {
        if (route.method !== method) {
          continue;
        }

        const params = route.matchPath(pathname);

        if (params) {
          return {
            handler: route.handler,
            params
          };
        }
      }

      return null;
    }
  });
