// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 5 节“架构设计”和第 7 节“API 设计”。
import { HttpError } from '../shared/httpError.js';
import { sendError } from '../shared/response.js';
import { readJsonBody, requestNeedsJsonBody } from './readJsonBody.js';
import { createRoute, createRouter } from './router.js';
import { serveStaticAsset } from './staticFiles.js';

const createApiRouter = ({ leaderboardController, healthController }) =>
  createRouter({
    routes: [
      createRoute({
        method: 'GET',
        pattern: '/api/health',
        handler: healthController.get
      }),
      createRoute({
        method: 'GET',
        pattern: '/api/scores',
        handler: leaderboardController.list
      }),
      createRoute({
        method: 'GET',
        pattern: '/api/scores/:id',
        handler: leaderboardController.get
      }),
      createRoute({
        method: 'POST',
        pattern: '/api/scores',
        handler: leaderboardController.create
      }),
      createRoute({
        method: 'PATCH',
        pattern: '/api/scores/:id',
        handler: leaderboardController.update
      }),
      createRoute({
        method: 'DELETE',
        pattern: '/api/scores/:id',
        handler: leaderboardController.remove
      })
    ]
  });

const buildRequestContext = async ({ req, res, params, url }) => ({
  req,
  res,
  params,
  query: Object.fromEntries(url.searchParams),
  body: requestNeedsJsonBody({ method: req.method })
    ? await readJsonBody({ req })
    : undefined
});

const isStaticGetRequest = ({ method, pathname }) =>
  method === 'GET' && !pathname.startsWith('/api/');

export const createApp = ({
  leaderboardController,
  healthController,
  staticDir
}) => {
  const router = createApiRouter({ leaderboardController, healthController });

  return async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
      const method = req.method ?? 'GET';
      const match = router.match({ method, pathname: url.pathname });

      if (match) {
        const context = await buildRequestContext({
          req,
          res,
          params: match.params,
          url
        });

        await match.handler(context);
        return;
      }

      if (isStaticGetRequest({ method, pathname: url.pathname })) {
        await serveStaticAsset({
          pathname: url.pathname,
          staticDir,
          res
        });
        return;
      }

      throw new HttpError({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: '请求路径不存在。'
      });
    } catch (error) {
      sendError({ res, error });
    }
  };
};
