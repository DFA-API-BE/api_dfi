import { Response } from 'express';

type ResponseType = {
  res: Response;
  statusCode?: number;
  message?: string | Array<string>;
  data?: unknown;
};

const responseHandler = ({
  res,
  statusCode = 200,
  message = 'success',
  data,
}: ResponseType) => {
  res.status(statusCode).send({
    message: message,
    data: data,
  });
};

export { responseHandler };
