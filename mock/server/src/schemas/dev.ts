import * as Yup from 'yup';

export const createSchema = () =>
  Yup.object().shape({
    name: Yup.string().max(255).required(),
    email: Yup.string().email().max(255).required(),
    message: Yup.string().max(1000).required(),
  });
