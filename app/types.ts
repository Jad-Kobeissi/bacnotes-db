export interface TJWT {
  id: string;
  username: string;
  name: string;
  BACId: string;
}

export interface TUser {
  id: string;
  username: string;
  name: string | null;
  class: string;
  posts: TPost[];
  viewedPosts: TPost[];
  likedPosts: TPost[];
  followers: TUser[];
  following: TUser[];
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
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface TNote {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  subject: string;
  author: TUser;
  authorId: String;
  likes: Number;
  likedUsers: TUser[];
  createdAt: Date;
  updatedAt: Date;
}
export interface TAgendaItem {
  agendaId: Number;
  description: String;
  subject: String;
  updated_at: Date;
}
