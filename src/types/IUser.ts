export interface IUser {
  id: number;
  username: string;
  email: string;
  // friends: IFriend[];
  // groups: IGroup[];
}

export interface IFriend {
  id: number;
  username: string;
}

export interface IGroup {
  id: number;
  name: string;
  created_by: number;
  members: IFriend[];
}

// status?: "online" | "offline" | "away";
