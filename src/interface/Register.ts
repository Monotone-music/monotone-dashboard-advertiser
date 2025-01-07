import * as yup from "yup";


export interface RegisterData {
    username: string;
    password: string;
    displayName: string;
    email: string;
}

export const RegisterSchema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
    displayName: yup.string().required(),
    email: yup.string().required()
  })
  .required();
