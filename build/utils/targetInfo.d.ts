import { IRequestInfo, ITargetInfo } from "../definitions";
/*********************************************************************************************************************************/
/*********************************************************************************************************************************/
export declare class TargetInfo {
    /*********************************************************************************************************************************/
    /*********************************************************************************************************************************/
    constructor(targetInfo: ITargetInfo);
    /*********************************************************************************************************************************/
    /*********************************************************************************************************************************/
    readonly bufferFl: boolean;
    readonly callback: (...args) => void;
    readonly isBatchRequest: boolean;
    requestData: any;
    readonly requestDigest: string;
    readonly requestInfo: IRequestInfo;
    requestHeaders: object;
    requestMethod: string;
    requestUrl: string;
    /*********************************************************************************************************************************/
    /*********************************************************************************************************************************/
    private targetInfo;
    /*********************************************************************************************************************************/
    /*********************************************************************************************************************************/
    private getDomainUrl();
    private static getQueryStringValue(key);
    private setRequestUrl();
}
