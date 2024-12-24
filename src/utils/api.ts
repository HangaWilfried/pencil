import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

type RequestResponse<T = undefined> = {
  data?: T;
  error?: string;
};

export function useToken() {
  const payload = { exp: 0 };
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

export function useClientApi() {
  const baseUrl = "http://localhost:8000/api";

  return {
    handleError(error: unknown) {
      console.log(error);
      return { error: error.message };
    },
    async login(credential: {
      email: string;
      password: string;
    }): Promise<RequestResponse> {
      try {
        const { token, user } = await fetch(`${baseUrl}/login`, {
          method: "POST",
          body: JSON.stringify(credential),
        });
        localStorage.setItem("access-token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return {};
      } catch (error) {
        return this.handleError(error);
      }
    },
    async createAccount(user: {
      name: string;
      email: string;
      password: string;
    }): Promise<RequestResponse> {
      try {
        await fetch(`${baseUrl}/register`, {
          method: "POST",
          body: JSON.stringify(user),
        });
        return {};
      } catch (error) {
        return this.handleError(error);
      }
    },
    async createPost() {
      try {
        return {};
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getPostById() {
      try {
        return {};
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getAllPosts() {
      try {
        return {};
      } catch (error) {
        return this.handleError(error);
      }
    },
  };
}
