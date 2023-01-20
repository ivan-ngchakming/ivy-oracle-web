import { Login } from "../types";
import { LoginAPI } from "../types/api";

export const mapLogin = (apiLogin: LoginAPI): Login => {
  return {
    message: String(apiLogin.message),
  };
};
