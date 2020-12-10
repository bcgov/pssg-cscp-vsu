import { ILocationType } from "./client-search.interface";
import { IOptionSetVal } from "../enums-list"

export interface IClientDetails {
    clientNumber?: string;
    isCurrentName?: string;
    locationTypeCode?: ILocationType;
    personBirthDate?: string;
    personGenderIdentityCodeType?: string;
    personName?: string;

    notifications?: INotification[];
}

export interface INotification {
    notificationId: string;
    eventId: string;
    eventDate: Date;
    eventReferenceId: string;
    eventType: number;
    id: string;
}