// import createHttpError from 'http-errors';
// import * as fs from 'node:fs';
// import path from 'node:path';
// import swaggerUI from 'swagger-ui-express';

// export const swaggerDocs = () => {
//   try {
//     const swaggerDoc = JSON.parse(
//       fs.readFileSync(path.resolve('docs', 'swagger.json')).toString(),
//     );
//     return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
//   } catch (err) {
//     console.log(err);
//     return (req, res, next) =>
//       next(createHttpError(500, "Can't load swagger docs"));
//   }
// };

// export default swaggerDocs;