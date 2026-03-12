import {
	EmployeeInfo,
	ME,
	StudentInfo,
} from '@/shared/zustand/user-info/user-info.types';
import { create } from 'zustand';

export type InfoType = Array<StudentInfo> | StudentInfo | EmployeeInfo;

export type UserInfoState = {
	me?: ME;
	info?: InfoType;
	config?: object;
	setMe: (me?: ME) => void;
	setInfo: (info?: InfoType) => void;
	updateConfig: (config: object) => void;
};

export const useUserInfoStore = create<UserInfoState>((set) => ({
	me: undefined,
	info: undefined,
	config: undefined,
	setMe: (me?: ME) => set({ me }),
	setInfo: (info?: InfoType) => set({ info }),
	updateConfig: (config: object) => set({ config }),
}));
