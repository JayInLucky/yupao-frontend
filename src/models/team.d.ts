import {UserType} from "./user";

/**
 * 用户类别
 */
export type TeamType = {
    id: number;
    name: string;
    description: string;
    expireTime?:Date;
    maxNum:number;
    password:string;
    // todo 定义枚举值更规范
    status: number;
    createTime: Date;
    updateTime: Date;
    createUser?: UserType;
    hasJoinNum?: number;
};

