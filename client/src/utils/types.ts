export type RequestResponse<T = undefined> = {
  data?: T;
  error?: string;
};

export type JwtPayload = {
  email: string;
  lastname: string;
  firstname: string;
  id: string;
  exp: number;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export type UserDTO = {
  firstname: string;
  lastname: string;
  email: string;
  id: string;
};

export type PostDTO = {
  likes: number;
  feedbacks: number;
  id: string;
  title: string;
  content: string;
  userId: string;
  medias: string[];
  tags: string[];
  status: string;
  createdAt: string;
};

export type RegisterPostDTO = {
  title: string;
  content: string;
  userId: string;
};

export type UpdatePostDTO = {
  title: string;
  content: string;
  id: string;
};

export type TagDTO = {
  id: string;
  createdAt: string;
  name: string;
  userId: string;
  description: string;
};
