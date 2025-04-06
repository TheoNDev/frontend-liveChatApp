import { IGroup, IUser } from "./IUser";

export interface IMessage {
  id: number;
  sender: IUser;
  message: string;
  date: Date;
}

export interface IDirectMessage extends IMessage {
  receiver: IUser;
}

export interface IGroupMessage extends IMessage {
  group: IGroup;
}
