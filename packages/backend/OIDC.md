# H OIDC 配置

Paper Station 使用后端管理的 Authorization Code Flow、S256 PKCE 和 public
client。OIDC 授权码及 Token 不经过前端。

## 必需配置

```dotenv
OIDC_ISSUER=https://sf.imouto.tech/oidc
OIDC_CLIENT_ID=<H 子应用 ID>
OIDC_REDIRECT_URI=https://<API 域名>/user/oidc/callback
SESSION_SECRET=<至少 32 字节的随机值>
TOKEN_SECRET=<本站 JWT 签名密钥>
FRONT_URL=https://<前端域名>
COOKIE_SECURE=true
```

`OIDC_REDIRECT_URI` 必须在 H 中完整登记。public client 不配置
`OIDC_CLIENT_SECRET`。本地 HTTP 调试时才可临时设置 `COOKIE_SECURE=false`。

前端只需要配置 `VITE_API`，且浏览器请求必须携带 credentials。

## 发布检查

1. 删除部署环境中的旧 `SSO_URL`、`SSO_ID`、`SSO_SECRET` 和
   `SSO_REDIRECT`。
2. 确认前端与 API 同站点；API CORS 只允许 `FRONT_URL`。
3. 运行 `pnpm --filter @paper-station/backend test` 和根目录
   `pnpm build`。
4. 从前端发起登录，确认 H 返回后先进入后端 callback，再跳到前端
   `/login`。
5. 检查地址栏、localStorage、sessionStorage、控制台和网络日志，不得出现
   OIDC ID Token 或 Access Token。
6. 验证取消授权、过期 callback、重复 callback 和错误 `state` 都会失败，且
   前端只显示稳定错误提示。
7. 验证配置和站点的新增、更新、删除请求均带 Cookie 和
   `X-CSRF-Token`，非法 Origin 请求返回 403。

## 回滚限制

本次没有数据库结构迁移，`users.ssoId` 继续使用原整型列。已确认 H OIDC
`sub` 与旧 SSO 用户 ID 完全相同；超出数据库 signed INT 范围或不是正十进制
整数的 `sub` 会被拒绝。回滚旧版应用前必须恢复旧 `SSO_*` 配置，但不应在
OIDC public client 部署中继续保留旧 Client Secret。

用户身份只取 ID Token 的 `sub`。展示名按 `name`、`preferred_username`、
`nickname`、`email`、`sub` 的顺序回退；展示资料不会参与账号匹配。
