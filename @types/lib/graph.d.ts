import * as Types from "../intellisense";
import { ITargetInfo } from "../utils";

/**
 * Graph
 */
export const Graph: IGraph;

/**
 * Graph
 */
export interface IGraph {
    /**
     * Creates an instance of the graph library.
     * @param accessToken - The access token for the graph api request.
     * @param version - The version of the graph to target.
     */
    (accessToken: string, version?: string): Types.IGraph;

    /**
     * Method to get the access token from a classic page.
     */
    getAccessToken(): Promise<Types.IGraphToken>;
}