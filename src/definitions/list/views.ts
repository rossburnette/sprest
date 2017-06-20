import {
    IBase,
    IResults,
    IView, IViewCreationInformation, IViewQueryResults
} from "..";

/**
 * Views
 */
export interface IViews extends IResults<IView>, IBase<IResults<IView>, IResults<IViewQueryResults>> {
    /**
     * Adds a list view to the view collection.
     */
    add(parameters: IViewCreationInformation): IView;

    /**
     * Gets the list view with the specified ID.
     * @param id - The ID of the view.
     */
    getById(id): IView;

    /**
     * Gets the list view with the specified title.
     * @param title - The case-sensitive title of the view.
     */
    getByTitle(title): IView;

    /**
     * Method to get the next set of results.
     */
    next(): IViews;
}