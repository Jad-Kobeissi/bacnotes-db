export interface TJWT {
  id: string;
  username: string;
  name: string;
  class: string;
}

export interface TUser {
  id: string;
  username: string;
  name: string | null;
  class: string;
  followers: TUser[];
  following: TUser[];
  posts: TPost[];
  viewedPosts: TPost[];
  likedPosts: TPost[];
  createdAt: Date;
  updatedAt: Date;
}
export interface TPost {
  id: string;
  title: string;
  content: string | null;
  author: TUser;
  authorId: string;
  viewedUsers: TUser[];
  likedUsers: TUser[];
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}
