import Cookies from "js-cookie";
import { BASE_URL } from "../constants";
import { mapLogin } from "../mappers/auth";

export const pingProtected = async () => {
  const res = await fetch(`${BASE_URL}/ping-protected`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Web3-Auth-Address": Cookies.get("ivy-auth-address") ?? "",
      "X-Web3-Auth-Signature": Cookies.get("ivy-auth-signature") ?? "",
    },
  }).then((res) => res.text());
  return res;
};

export const getLoginMessageToSign = async (address: string) => {
  const res = await fetch(`${BASE_URL}/auth/login?address=${address}`).then(
    (res) => res.json()
  );
  return mapLogin(res).message;
};
