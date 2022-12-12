import { JwtPayload } from "jsonwebtoken";

type UserRequest = {
  id: number | undefined;
  name: string;
  email: string;
} & JwtPayload;

export { UserRequest };
