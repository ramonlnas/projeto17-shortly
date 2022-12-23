import joi from "joi"


export const userSchema = joi.object({
  name: joi.string().required().min(1).max(100),
  email: joi.string().email().required(),
  password: joi.string().required().min(1),
  confirmPassword: joi.ref("password"),
});

export const sessionSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(1),
});
