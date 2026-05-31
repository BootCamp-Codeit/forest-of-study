// src/config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '공부의 숲 API',
    version: '1.0.0',
    description: '스터디, 포인트, 습관, 집중, 이모지 API 명세',
  },
  servers: [
    {
      url: 'https://beginner-project-be.onrender.com',
      description: 'Render production server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // 라우트 파일에서 JSDoc 읽어오는 경로
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
