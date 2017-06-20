import { IBase, IResults, IUser, IUserCreationInformation, IUserQueryResults } from "..";
/**
 * Users
 */
export interface IUsers extends IResults<IUser>, IBase<IResults<IUser>, IResults<IUserQueryResults>> {
    /**
     * Adds a site to the site collection.
     * @param userInfo - The user creation information.
     */
    add(userInfo: IUserCreationInformation): IUser;
    /**
     * Gets the user with the specified email address.
     * @param email - The email of the user to get.
     */
    getByEmail(email: any): IUser;
    /**
     * Gets the user with the specified member identifier (ID).
     * @param id - The ID of the user to get.
     */
    getById(id: any): IUser;
    /**
     * Gets the user with the specified login name.
     * @param loginName - The login name of the user to get, passed as an alias in the query string.
     */
    getByLoginName(loginName: any): IUser;
    /**
     * Method to get the next set of results.
     */
    next(): IUsers;
    /**
     * Removes the user with the specified ID.
     * @param id - The ID of the user to remove.
     */
    removeById(id: any): IBase;
    /**
     * Removes the user with the specified login name.
     * @param loginName - The login name of the user to remove.
     */
    removeByLoginName(loginName: any): IBase;
}