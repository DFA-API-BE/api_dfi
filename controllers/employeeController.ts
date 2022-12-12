import { Request, Response } from 'express';
import { Employees } from '../database/models/Employee';
import Joi from 'joi';
import { responseHandler } from '../utils/responseHandler';
import { Users } from '../database/models/Users';

type EmployeeRequest = {
  code: string;
  siteCode: string;
  type: string;
  userId: number;
};

const employeeSchema = Joi.object().keys({
  code: Joi.string().required(),
  siteCode: Joi.string().required(),
  type: Joi.string().required(),
  userId: Joi.number().required(),
});

const statusCodeRenderer = (status: string) => {
  switch (status) {
    case 'EREQUEST':
      return 400;
    default:
      return 500;
  }
};

const getEmployees = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const data = await Employees.findAll({
      where: {
        type,
      },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ['name', 'email'],
        },
      ],
    });
    responseHandler({
      res,
      statusCode: 200,
      message: `Get All Employees ${req.query.type} Success`,
      data,
    });
  } catch (e: any) {
    responseHandler({
      res: res,
      statusCode: 400,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.message,
    });
  }
};

const storeEmployees = async (
  req: Omit<Request, 'body'> & { body: EmployeeRequest },
  res: Response,
) => {
  try {
    const name = 'yusuf';

    const validationEmployeeSchema = employeeSchema.validate(req.body);
    if (validationEmployeeSchema.error) {
      responseHandler({
        res,
        message: validationEmployeeSchema.error.message,
        statusCode: 400,
      });
    }
    const storeEmployee = await Employees.create({
      ...req.body,
      createdBy: name,
      isActive: 1,
    });

    responseHandler({
      res,
      message: 'Create Employee Success!',
      data: storeEmployee,
    });
  } catch (e: any) {
    responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent.code),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
};

const updateEmployees = async (
  req: Omit<Request, 'body'> & { body: EmployeeRequest },
  res: Response,
) => {
  try {
    const name = 'yusuf';
    const id: string = req.params.id;
    const validationemployeeSchema = employeeSchema.validate(req.body);
    if (validationemployeeSchema.error) {
      responseHandler({
        res,
        message: validationemployeeSchema.error.message,
        statusCode: 400,
      });
    }
    const employee = await Employees.findOne({
      where: {
        id: id,
      },
    });
    if (employee === null) {
      responseHandler({
        res,
        statusCode: 404,
        message: 'Employee not found',
      });
    } else {
      await employee.update({
        ...req.body,
        updatedBy: name,
      });
      responseHandler({
        res,
        message: 'Update EMployee Success!',
        data: employee,
      });
    }
  } catch (e: any) {
    responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent.code),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
};

const deleteEmployees = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const employee = await Employees.findOne({
      where: {
        id: id,
      },
    });
    if (employee === null) {
      responseHandler({
        res,
        statusCode: 404,
        message: 'Employee not found',
      });
    } else {
      await employee.destroy();
      responseHandler({
        res,
        message: 'Delete Employee Success!',
      });
    }
  } catch (e: any) {
    responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent.code),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
};
export default {
  getEmployees,
  storeEmployees,
  updateEmployees,
  deleteEmployees,
};
