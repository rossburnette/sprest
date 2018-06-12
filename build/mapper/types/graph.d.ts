import { IBase } from "../../utils/types";
/**
 * Graph Collection
 */
export interface IGraphCollection<T> {
    value: Array<T>;
}
/**
 * Graph Methods
 */
export interface IGraphMethods {
}
/**
 * Graph Query Properties
 */
export interface IGraphQueryProps {
    /**
     * Represents a collection of Azure Active Directory (Azure AD) groups.
     * Types: Office 365 Group, Dynamic Group or Security Group
     */
    groups(): IBase<IGraphCollection<IGraphGroup>>;
    /**
     * Represents an Azure Active Directory (Azure AD) group.
     * Types: Office 365 Group, Dynamic Group or Security Group
     * @param id - The group id.
     */
    groups(id: string): IBase<IGraphGroup>;
    /**
     * Represents a collection of Azure AD user accounts.
     */
    users(): IBase<IGraphCollection<IGraphUser>>;
    /**
     * Represents a collection of Azure AD user accounts.
     * @param id - The user id.
     */
    users(id: string): IBase<IGraphUser>;
}
/**
 * Graph Result
 */
export interface IGraphResult {
}
/**
 * Graph Query Result
 */
export interface IGraphQueryResult {
}
/**
 * Graph Token
 */
export interface IGraphToken {
    access_token: string;
    expires_on: string;
    resource: string;
    scope: string;
    token_type: string;
}
/**
 * Graph
 */
export interface IGraph extends IGraphMethods, IGraphQueryProps, IBase<IGraph, IGraphResult, IGraphQueryResult> {
    /**
     * Constructor
     * @param accessToken - The access token for the graph api request.
     * @param version - The version of the graph to target.
     */
    new (accessToken: string, version?: string): IGraph;
    /**
     * Method to get the access token from a classic page.
     */
    getAccessToken(): Promise<IGraphToken>;
}
/**
 * Graph Group
 */
export interface IGraphGroup {
    allowExternalSenders?: boolean;
    autoSubscribeNewMembers?: boolean;
    classification: string;
    createdDateTime: string;
    description: string;
    displayName: string;
    groupTypes: Array<string>;
    id: string;
    isSubscribedByMail?: boolean;
    mail: string;
    mailEnabled: boolean;
    mailNickname: string;
    onPremisesLastSyncDateTime: string;
    onPremisesSecurityIdentifier: string;
    onPremisesSyncEnabled: boolean;
    proxyAddresses: Array<string>;
    renewedDateTime: string;
    securityEnabled: boolean;
    unseenCount?: number;
    visibility: string;
}
/**
 * Graph User
 */
export interface IGraphUser {
    aboutMe?: string;
    accountEnabled?: boolean;
    assignedLicenses?: Array<string>;
    assignedPlans?: Array<string>;
    birthday?: string;
    businessPhones: Array<string>;
    city?: string;
    companyName?: string;
    country?: string;
    department?: string;
    displayName: string;
    givenName: string;
    hireDate?: string;
    id: string;
    imAddresses: Array<string>;
    interests: Array<string>;
    jobTitle: string;
    mail: string;
    mailNickname?: string;
    mobilePhone: string;
    mySite?: string;
    officeLocation: string;
    postalCode?: string;
    preferredLanguage: string;
    preferredName?: string;
    responsibilities?: Array<string>;
    schools?: Array<string>;
    skills?: Array<string>;
    state?: string;
    streetAddress?: string;
    surname: string;
    usageLocation?: string;
    userPrincipalName: string;
    userType?: string;
}
