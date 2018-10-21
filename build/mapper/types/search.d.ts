import { Microsoft } from "gd-sprest-def";
import { IBase } from "../../utils/types";
/**
 * Search
 */
export interface ISearch extends IBase<ISearch, Microsoft.Office.Server.Search.REST.SearchResult> {
    /** Method to execute a search query.
     * @param settings - The search request settings.
    */
    postquery(settings: Microsoft.Office.Server.Search.REST.SearchRequest): IBase<Microsoft.Office.Server.Search.REST.SearchResult>;
    /** Method to execute a search query.
     * @param settings - The search request settings.
    */
    searchquery(settings: Microsoft.Office.Server.Search.REST.SearchRequest): IBase<Microsoft.Office.Server.Search.REST.SearchResult>;
}
