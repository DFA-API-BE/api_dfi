import { JwtPayload } from "jsonwebtoken";

type UserRequest = {
  id: number;
  name: string;
  email: string;
} & JwtPayload;

export { UserRequest };
