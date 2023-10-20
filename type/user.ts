interface IUserInfo {
  id: number | null;
  email: string | null;
  name: string | null;
  profilePicture: string | null;
  about?: string;
}

export { IUserInfo };
