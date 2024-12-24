import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

export function useToken() {
  let payload = { exp: 0 };
  const token = localStorage.getItem("access-token");

  if (token) {
    payload.exp = jwtDecode<{ exp: number }>(token).exp * 1000;
  }

  return {
    isValid(): boolean {
      return payload.exp - dayjs().valueOf() > 0;
    },
    clear(): void {
      localStorage.removeItem("access-token");
    },
  };
}
