import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import type {
  TagDTO,
  PostDTO,
  UserDTO,
  LoginDTO,
  JwtPayload,
  RegisterDTO,
  UpdatePostDTO,
  RegisterPostDTO,
  RequestResponse,
} from "@/utils/types.ts";

export function useToken() {
  return {
    getToken(): string | null {
      return localStorage.getItem("access-token");
    },
    decode(): JwtPayload {
      const token = this.getToken();
      if (token) {
        return jwtDecode<JwtPayload>(token!);
      }
      return {} as JwtPayload;
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
    info() {
      return this.decode();
    },
    clear(): void {
      localStorage.removeItem("access-token");
    },
  };
}

const getHeader = (hasContentType: boolean = true) => {
  const token = useToken().getToken();
  const headers = new Headers();
  if (hasContentType) {
    headers.append("Content-Type", "application/json");
  }
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export function useClientApi() {
  const baseUrl = "http://localhost:4500/api";

  return {
    handleError(error: unknown) {
      console.log(error);
      return { error: (error as Error).message };
    },
    async handleResponse(r: Response, isJson?: boolean) {
      if(r.ok) {
        const data = isJson ? await r.json() : await r.text();
        return {data}
      }

      const message = await r.text();
      return {
        error: message ?? r.statusText
      }
    },
    async login(credential: LoginDTO): Promise<RequestResponse> {
      try {
        const response = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: getHeader(),
          body: JSON.stringify(credential),
        });

        if (response.ok) {
          const token = await response.text();
          localStorage.setItem("access-token", token);
          return {};
        }

        return {
          error: response.statusText,
        };
      } catch (error) {
        return this.handleError(error);
      }
    },
    async createAccount(user: RegisterDTO): Promise<RequestResponse> {
      try {
        const response = await fetch(`${baseUrl}/auth/register`, {
          method: "POST",
          headers: getHeader(),
          body: JSON.stringify(user),
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getUserById(userId: string): Promise<RequestResponse<UserDTO>> {
      try {
        const response = await fetch(`${baseUrl}/user/${userId}`, {
          method: "GET",
          headers: getHeader(),
        });
        return this.handleResponse(response, true);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async createPost(post: RegisterPostDTO): Promise<RequestResponse<string>> {
      console.log("post to stringify", post);
      try {
        const response = await fetch(`${baseUrl}/post`, {
          method: "POST",
          headers: getHeader(),
          body: JSON.stringify(post),
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async editPost(post: UpdatePostDTO): Promise<RequestResponse> {
      try {
        const response = await fetch(`${baseUrl}/post/${post.id}`, {
          method: "PUT",
          headers: getHeader(),
          body: JSON.stringify({
            content: post.content,
            title: post.title,
          }),
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async draftPost(postId: string): Promise<RequestResponse> {
      try {
        const response = await fetch(`${baseUrl}/post/${postId}/draft`, {
          method: "PUT",
          headers: getHeader(),
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async publishPost(postId: string): Promise<RequestResponse> {
      try {
        const response = await fetch(`${baseUrl}/post/${postId}/publish`, {
          method: "PUT",
          headers: getHeader(),
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async deletePost(postId: string): Promise<RequestResponse> {
      try {
        const response = await fetch(`${baseUrl}/post/${postId}`, {
          method: "DELETE",
          headers: getHeader(),
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getPostById(postId: string): Promise<RequestResponse<PostDTO>> {
      try {
        const response = await fetch(`${baseUrl}/post/${postId}`, {
          method: "GET",
          headers: getHeader(),
        });
        return this.handleResponse(response, true);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getAllPosts(): Promise<RequestResponse<PostDTO[]>> {
      try {
        const response = await fetch(`${baseUrl}/post`, {
          method: "GET",
          headers: getHeader(),
        });
        return this.handleResponse(response, true);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getPostsByTag(tag: string): Promise<RequestResponse<PostDTO[]>> {
      try {
        const response = await fetch(`${baseUrl}/${tag}/post`, {
          method: "GET",
          headers: getHeader(),
        });
        return this.handleResponse(response, true);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getUserPosts(userId: string): Promise<RequestResponse<PostDTO[]>> {
      try {
        const response = await fetch(`${baseUrl}/user/${userId}/posts`, {
          method: "GET",
          headers: getHeader(),
        });
        return this.handleResponse(response, true);
      } catch (error) {
        return this.handleError(error);
      }
    },
    async getAllTags(): Promise<RequestResponse<TagDTO[]>> {
      try {
        const response = await fetch(`${baseUrl}/tag`, {
          method: "GET",
          headers: getHeader(),
        });
        return this.handleResponse(response, true);
      } catch (error) {
        return this.handleError(error);
      }
    },

    async createTag(tag: TagDTO): Promise<RequestResponse<string>> {
      try {
        const response = await fetch(`${baseUrl}/tag`, {
          method: "POST",
          headers: getHeader(),
          body: JSON.stringify(tag),
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },

    async editTag(tag: TagDTO): Promise<RequestResponse> {
      try {
        const response = await fetch(`${baseUrl}/tag/${tag.id}`, {
          method: "PUT",
          headers: getHeader(),
          body: JSON.stringify(tag),
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },

    async getFileById(fileId: string): Promise<RequestResponse<string>> {
      try {
        const response = await fetch(`${baseUrl}/media/${fileId}`, {
          method: "GET",
          headers: getHeader(),
        });

        if(response.ok) {
          const file = await response.clone().blob();
          return { data: URL.createObjectURL(file) };
        }

        return {
          error: response.statusText
        }
      } catch (error) {
        return this.handleError(error);
      }
    },

    async createFile(file: File): Promise<RequestResponse<string>> {
      console.log("File", file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${baseUrl}/media`, {
          method: "POST",
          headers: getHeader(false),
          body: formData,
        });
        return this.handleResponse(response);
      } catch (error) {
        return this.handleError(error);
      }
    },
  };
}
