import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import type {
  PostDTO,
  UserDTO,
  LoginDTO,
  JwtPayload,
  RegisterDTO,
  RegisterPostDTO,
  RequestResponse,
  UpdatePostDTO,
} from "@/utils/types.ts";

export function useToken() {
  return {
    getToken(): string | null {
      return localStorage.getItem("access-token");
    },
    decode(): JwtPayload {
      const token = this.getToken();
      return jwtDecode<JwtPayload>(token!);
    },
    isLoggedIn(): boolean {
      const token = this.getToken();
      if (token) {
        const expirationDate = this.decode().exp * 1000;
        const now = dayjs().valueOf();

        return expirationDate - now > 0;
      }
      return false;
    },
    clear(): void {
      localStorage.removeItem("access-token");
    },
  };
}

export function useClientApi() {
  const baseUrl = "http://localhost:4500/api";
  return {
    handleError(error: unknown) {
      console.log(error);
      return { error: (error as Error).message };
    },
    async login(credential: LoginDTO): Promise<RequestResponse> {
      try {
        const response = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credential),
        });
        const token = await response.text();
        localStorage.setItem("access-token", token);
        return {};
      } catch (error) {
        return this.handleError(error);
      }
    },
    async createAccount(user: RegisterDTO): Promise<RequestResponse> {
      try {
        await fetch(`${baseUrl}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        return {};
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getUserById(userId: string): Promise<RequestResponse<UserDTO>> {
      try {
        const response = await fetch(`${baseUrl}/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const user = await response.json();
        return { data: user };
      } catch (error) {
        return this.handleError(error);
      }
    },
    async createPost(post: RegisterPostDTO): Promise<RequestResponse<string>> {
      try {
        const response = await fetch(`${baseUrl}/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        });
        const id = await response.json();
        return { data: id };
      } catch (error) {
        return this.handleError(error);
      }
    },
    async editPost(post: UpdatePostDTO): Promise<RequestResponse> {
      try {
        await fetch(`${baseUrl}/post/${post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: post.content,
            title: post.title,
          }),
        });
        return {};
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getPostById(postId: string): Promise<RequestResponse<PostDTO>> {
      try {
        const response = await fetch(`${baseUrl}/post/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const post = await response.json();
        return { data: post };
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getAllPosts(): Promise<RequestResponse<PostDTO[]>> {
      try {
        const response = await fetch(`${baseUrl}/post`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const posts = await response.json();
        return { data: posts };
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getUserPosts(userId: string): Promise<RequestResponse<PostDTO[]>> {
      try {
        const response = await fetch(`${baseUrl}/user/${userId}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const posts = await response.json();
        return { data: posts };
      } catch (error) {
        return this.handleError(error);
      }
    },
  };
}
