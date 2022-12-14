import { Request, Response } from 'express';
import { Employees, EmployeeData } from '../database/models/Employee';
import Joi from 'joi';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { Users } from '../database/models/Users';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';

const employeeSchema = Joi.object().keys({
  code: Joi.string().required(),
  siteCode: Joi.string().required(),
  type: Joi.string().required(),
  userId: Joi.number().required(),
});
const updateParamsschema = Joi.object().keys({
  id: Joi.number().required()
})

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
    return responseHandler({
      res,
      statusCode: 200,
      message: `Get All Employees ${req.query.type} Success`,
      data,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
};

const storeEmployees = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<never, never, EmployeeData, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const {name} = req.user as UserRequest;

    const validationEmployeeSchema = employeeSchema.validate(req.body);
    if (validationEmployeeSchema.error) {
      return responseHandler({
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

    return responseHandler({
      res,
      message: 'Create Employee Success!',
      data: storeEmployee,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
};

const updateEmployees = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<{id:string}, never, EmployeeData, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const {name} = req.user as UserRequest;
    const params = {
      id: req.params.id
    }
    const validationUpdateParams = updateParamsschema.validate(params);
    if(validationUpdateParams.error){
      return responseHandler({
        res,
        message: validationUpdateParams.error.message,
        statusCode: 400
      })
    }
    const validationemployeeSchema = employeeSchema.validate(req.body);
    if (validationemployeeSchema.error) {
      return responseHandler({
        res,
        message: validationemployeeSchema.error.message,
        statusCode: 400,
      });
    }
    const employee = await Employees.findOne({
      where: {
        id: params.id,
      },
    });
    if (employee === null) {
      return responseHandler({
        res,
        statusCode: 404,
        message: 'Employee not found',
      });
    } else {
      await employee.update({
        ...req.body,
        updatedBy: name,
      });
      return responseHandler({
        res,
        message: 'Update EMployee Success!',
        data: employee,
      });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
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
      return responseHandler({
        res,
        statusCode: 404,
        message: 'Employee not found',
      });
    } else {
      await employee.destroy();
      return responseHandler({
        res,
        message: 'Delete Employee Success!',
      });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
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
