import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Redireciona para o user-service
app.use('/users', createProxyMiddleware({
  target: 'http://user-service:3001', // nome do container Docker
  changeOrigin: true,
  pathRewrite: { '^/users': '' }
}));

// Redireciona para o activity-service
app.use('/activities', createProxyMiddleware({
  target: 'http://activity-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/activities': '' }
}));

app.listen(3000, () => {
  console.log('API Gateway rodando na porta 3000');
});

