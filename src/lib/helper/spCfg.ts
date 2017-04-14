import {Promise} from "../../utils";
import {
    ComplexTypes,
    IContentTypes,
    IField, IFields,
    IList, ILists,
    ISPCfgFieldInfo, ISPConfigProps, ISPCfgListInfo, ISPCfgViewInfo,
    IUserCustomAction, IUserCustomActions,
    IView
} from "../../definitions";
import {
    ContextInfo,
    List,
    Site,
    Web
} from "..";

/**
 * Next Code Update:
 * Update code to use web and lists object that are passed to each method.
 * Use the "done" to wait for all requests to complete, instead of using promises.
 * Test then release to npm.
 */

/*********************************************************************************************************************************/
// SharePoint Configuration
/*********************************************************************************************************************************/
export class SPConfig {
    /**
     * Global Properties
     */
    private _configuration:ISPConfigProps


     /**
      * Constructor
      */
    constructor(cfg:ISPConfigProps) {
        // Save the configuration
        this._configuration = cfg;
    }

    /**
     * Methods
     */

    // Method to create the content types
    createContentTypes = (contentTypes:IContentTypes) => {
        // TO DO
    }

    // Method to create the fields
    createFields = (fields:IFields, customFields:Array<ISPCfgFieldInfo>, listInfo?:ISPCfgListInfo) => {
        // Execute the request to get the fields
        fields.execute((fields:IFields) => {
            let counter = 0;
            let fldTitle:IField = null;
            let titleFieldName = listInfo ? listInfo.TitleFieldDisplayName : null;
            let listName = listInfo && listInfo.ListInformation ? listInfo.ListInformation.Title : null;

            // Parse the fields
            for(let i=0; i<fields.results.length; i++) {
                let field = fields.results[i];

                // See if this is the title field and we are updating it
                if(field.InternalName == "Title" && titleFieldName && titleFieldName != field.InternalName) {
                    // Update the field
                    field.update({ Title: titleFieldName }).execute((response) => {
                        // See if the response was successful
                        if(response.existsFl) {
                            // Log
                            console.log("[gd-sprest] The title field was successfully updated to '" + titleFieldName + "' for the '" + listName + "' list.");
                        } else {
                            // Log
                            console.log("[gd-sprest] Error updating the title field '" + titleFieldName + "' for the '" + listName + "' list.");
                        }
                    });

                    // Continue the loop
                    continue;
                }

                // Parse the custom fields
                for(let j=0; j<customFields.length; j++) {
                    // See if this is a custom field
                    if(customFields[j].Name == field.InternalName) {
                        // Increment the counter
                        counter ++;

                        // Log
                        console.log("[gd-sprest] The field '" + field.InternalName + "' already exists.");

                        // Save a reference to the field and break from the loop
                        customFields[j].Field = field;
                        break;
                    }
                }
            }

            // Parse the fields
            for(let i=0; i<customFields.length; i++) {
                // See if we need to create the field
                if(customFields[i].Field == null) {
                    // Log
                    console.log("[gd-sprest] Creating the field '" + customFields[i].Name + "' field.");

                    // Create the field, but wait for the previous request to complete first
                    fields.createFieldAsXml(customFields[i].SchemaXml).execute(true);
                }
            }
        });
    }

    // Method to create the lists
    private createLists = (lists:ILists, cfg:Array<ISPCfgListInfo>) => {
        // Ensure custom actions exist
        if(cfg == null || cfg.length == 0) { return; }

        // Parse the configuration
        for(let i=0; i<cfg.length; i++) {
            let listInfo = cfg[i].ListInformation;

            // Get the list
            lists.getByTitle(listInfo.Title).execute((list:IList) => {
                // See if the list exists
                if(list.existsFl) {
                    // Log
                    console.log("[gd-sprest] The list '" + listInfo.Title + "' already exists.");

                    // Update the list
                    this.updateList(list, cfg[i]);
                } else {
                    // Remove spaces from the list name
                    let listName = listInfo.Title;
                    listInfo.Title = listName.replace(/ /g, "");

                    // Add the list
                    lists.add(listInfo)
                    // Execute the request
                    .execute((list:IList) => {
                        // Update the list configuration
                        listInfo.Title = listName;

                        // See if we need to update the list
                        if(list.existsFl && list.Title != listName) {
                            // Update the list
                            list.update({ Title: listName }).execute(() => {
                                // Update the list
                                this.updateList(lists.getByTitle(listName), cfg[i]);
                            });
                        }
                    });
                }
            }, true);
        };
    }

    // Method to create the list views
    private createListViews = (list:IList, cfg:ISPCfgListInfo) => {
        // Ensure views exist
        if(cfg.ViewInformation == null || cfg.ViewInformation.length == 0) { return; }

        // Parse the views
        for(let i=0; i<cfg.ViewInformation.length; i++) {
            // Get the view
            list.Views().getByTitle(cfg.ViewInformation[i].ViewName).execute((view:IView) => {
                // Ensure the view exists
                if(view.existsFl) {
                    // Log
                    console.log("[gd-sprest] The view '" + cfg.ViewInformation[i].ViewName + "' already exists for the '" + cfg.ListInformation.Title + "' list.");

                    // Update the view
                    this.updateListView(view, cfg.ViewInformation[i]);
                } else {
                    // Log
                    console.log("[gd-sprest] Creating the '" + cfg.ViewInformation[i].ViewName + "' view for the '" + cfg.ListInformation.Title + "' list.");
                    
                    // Create the view
                    list.Views().add({
                        Title: cfg.ViewInformation[i].ViewName
                    }).execute((view:IView) => {
                        // Update the view
                        this.updateListView(view, cfg.ViewInformation[i]);
                    });
                }
            });
        }
    }

    // Method to create the user custom actions
    private createUserCustomActions = (customActions:IUserCustomActions, cfg:Array<ComplexTypes.UserCustomActionCreationInformation>) => {
        // Ensure custom actions exist
        if(cfg == null || cfg.length == 0) { return; }

        // Parse the configuration
        for(let i=0; i<cfg.length; i++) {
            // Query for this custom action
            customActions.query({
                Filter: "Name eq '" + cfg[i].Name + "'"
            })
            // Execute the request, while waiting for the previous request to complete
            .execute((ca:IUserCustomAction) => {
                // See if this custom action exists
                if(ca.existsFl) {
                    // Log
                    console.log("[gd-sprest] The custom action '" + cfg[i].Name + "' already exists.");
                } else {
                    // Create the custom action
                    customActions.add(cfg[i]).execute();
                }
            }, true);
        }
    }

    // Method to execute the request
    execute(webUrl?:string, callback?:any, index?:number) {
        let target:IContentTypes | IFields | ILists | IUserCustomActions;

        // Default the index
        index = typeof(index) === "number" ? index : 0;

        // Execute the method based on the index
        switch(index) {
            case 0:
                // Set the target
                target = (new Web(webUrl)).Fields();

                // Log
                console.log("[gd-sprest] Creating the site columns.");

                // Create the fields
                this.createFields(target, this._configuration.FieldCfg);
                break;
            case 1:
                // Set the target
                target = (new Web(webUrl)).ContentTypes();

                // Log
                //console.log("[gd-sprest] Creating the content types.");

                // Create the content types
                //this.createContentTypes(target);
                break;
            case 2:
                // Set the target
                target = (new Web(webUrl)).Lists();

                // Log
                console.log("[gd-sprest] Creating the lists.");

                // Create the lists
                this.createLists(target, this._configuration.ListCfg);
                break;
            case 3:
                // Set the target
                target = (new Site()).UserCustomActions();

                // Log
                console.log("[gd-sprest] Creating the site user custom actions.");

                // Create the user custom actions
                this.createUserCustomActions(target, this._configuration.CustomActionCfg ? this._configuration.CustomActionCfg.Site : null);
                break;
            case 4:
                // Set the target
                target = (new Web()).UserCustomActions();

                // Log
                console.log("[gd-sprest] Creating the web user custom actions.");

                // Create the user custom actions
                this.createUserCustomActions(target, this._configuration.CustomActionCfg ? this._configuration.CustomActionCfg.Web : null);
                break;
            default:
                // Log
                console.log("[gd-sprest] The configuration script completed.");

                // See if the callback exists
                if(callback && typeof(callback) === "function") {
                    // Execute the callback
                    callback();
                }
                return;
        }

        // Wait for the target requests to complete
        target.done(() => {
            // Execute the next method
            this.execute(webUrl, callback, index+1);
        });
    }

    // Method to update the list
    private updateList = (list:IList, cfg:ISPCfgListInfo) => {
        // Get the fields
        let fields = list.Fields();

        // Create the fields
        this.createFields(fields, cfg.CustomFields, cfg);

        // Wait for the requests to complete
        fields.done(() => {
            // Create the views
            this.createListViews(list, cfg);
        });
    }

    // Method to update the view
    private updateListView = (view:IView, cfg:ISPCfgViewInfo) => {
        // See if the view fields are defined
        if(cfg.ViewFields && cfg.ViewFields.length > 0) {
            // Log
            console.log("[gd-sprest] Updating the view fields for the '" + view.Title + "' view.");

            // Clear the view fields
            view.ViewFields().removeAllViewFields().execute(true);

            // Parse the view fields
            for(let i=0; i<cfg.ViewFields.length; i++) {
                // Add the view field
                view.ViewFields().addViewField(cfg.ViewFields[i]).execute(true);
            }
        }

        // See if we are updating the view properties
        if(cfg.JSLink || cfg.ViewQuery) {
            let props = {};

            // Log
            console.log("[gd-sprest] Updating the view properties for the '" + view.Title + "' view.");

            // Set the properties
            cfg.JSLink ? props["JSLink"] = cfg.JSLink : null;
            cfg.ViewQuery ? props["ViewQuery"] = cfg.ViewQuery : null;

            // Update the view
            view.update(props).execute(true);
        }

        // Wait for the view requests to complete
        view.done(() => {
            // Log
            console.log("[gd-sprest] The view '" + view.Title + "' was updated successfully.");
        });
    }
};