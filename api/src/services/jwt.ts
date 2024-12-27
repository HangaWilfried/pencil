import jwt from "jsonwebtoken";

import { prisma } from "./orm";
import { SECRET } from "./secret";
import type { User } from "@prisma/client";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

export const STRATEGY = new JwtStrategy(options, (jwt_payload, done) => {
  const user = prisma.user.findFirst({
    where: { id: jwt_payload.id },
  });
  if (user) return done(null, user);
  return done(null, false);
});

export const generateJWT = async (user: User): Promise<string> => {
  const payload = {
    email: user.email,
    lastname: user.lastname,
    firstname: user.firstname,
    id: user.id,
  };
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};
