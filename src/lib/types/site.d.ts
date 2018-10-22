import * as Types from "../../mapper/types";
import { IBase } from "../../utils/types/base";
import { ITargetInfoProps } from "../../utils/types";

/**
 * Site
 */
export interface ISite {
    /**
     * Creates an instance of the site library.
     * @param url - (Optional) The site url.
     * @param targetInfo - (Optional) The target information.
     */
    (url?: string, targetInfo?: ITargetInfoProps): Types.ISite;

    /**
     * Method to check if a site collection exists.
     * @param url - The absolute url of the site collection.
     */
    exists(url: string): IBase<Types.ISiteExists>;

    /**
     * Method to get the app context information.
     * @param siteUrl - The absolute url of the site.
     */
    getAppContext(siteUrl: string): IBase;

    /**
     * Method to get the url of a site, by its id.
     * @param id - The site id.
     */
    getUrlById(id: string): IBase<Types.ISiteUrl>;
}