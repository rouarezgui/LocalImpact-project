import { RegisterUser } from "../application/use-cases/register-user";
import { LoginUser } from "../application/use-cases/login-user";
import { VerifySession } from "../application/use-cases/verify-session";
import { LogoutUser } from "../application/use-cases/logout-user";

import { BcryptPasswordHasher } from "./bcrypt-password-hasher";
import { CryptoSessionTokenGenerator } from "./crypto-session-token-generator";
import { PrismaUserRepository } from "./prisma-user-repository";
import { PrismaSessionRepository } from "./prisma-session-repository";

import { ListUsers } from "../application/use-cases/list-users";
import { ChangeUserRole } from "../application/use-cases/change-user-role";

const userRepository = new PrismaUserRepository();
const sessionRepository = new PrismaSessionRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenGenerator = new CryptoSessionTokenGenerator();

export const authContainer = {
  registerUser: new RegisterUser(userRepository, passwordHasher),
  loginUser: new LoginUser(
    userRepository,
    sessionRepository,
    passwordHasher,
    tokenGenerator
  ),
  verifySession: new VerifySession(
    sessionRepository,
    userRepository,
    tokenGenerator
  ),
  logoutUser: new LogoutUser(sessionRepository, tokenGenerator),

  listUsers: new ListUsers(userRepository),
  changeUserRole: new ChangeUserRole(userRepository),
};
