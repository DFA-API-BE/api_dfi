import express from 'express';
import employeeController from '../controllers/employeeController';
const router = express.Router();

router.get('/', employeeController.getEmployees);
router.post('/', employeeController.storeEmployees);
router.put('/:id', employeeController.updateEmployees);
router.delete('/:id', employeeController.deleteEmployees);

export { router as employeesRoutes };
