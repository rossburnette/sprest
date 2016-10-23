# SharePoint 2013/Online REST Library
An easy way to develop against the SharePoint REST api.

*Please report issues. I am constantly updating/fixing/testing to make this library better.*

## Benefits:
* Generates the REST api url and formats it for app webs automatically.
* Global flag to execute requests on creation, to reduce the number of calls to the server.
* Parent property for easier development.
* PowerShell-Like experience in the browser console. (Synchronous Requests)
* Switch between asynchronous and synchronous requests by the object's property.
* Written in TypeScript with definition file for intellisense.

## Get Started:
### Node Package Manager (NPM)
```
npm install gd-sprest --save-dev
```

## TypeScript Definition (Intellisense)
I was finally able to put the definition file together, to ensure intellisense is available.
![Intellisense](https://raw.githubusercontent.com/gunjandatta/sprest/master/images/intellisense.png)

### Example Projects
[Bootstrap List](https://github.com/gunjandatta/sprest-list)
_Note - This is still in dev_

## Documentation:
### Executing Requests from the App Web
A global flag is used to determine if an app web request should execute requests against the host web. The host web will default to the SPHostUrl query string value.
*Note - This value is false by default*
```
$REST.DefaultRequestToHostWebFl = true;
```

### Asynchronous/Synchronous requests
All objects have the following constructors [Object] and [Object]_Async.

#### Examples
_**Asynchronous Request**_
```
new Web_Async(function(web) { ... });
```

_**Synchronous Request**_
```
var web = new Web();
```

### Execute on Creation
A global flag is used to determine if the request should be executed on creation. This option can save a request to the server.
*Note - This value is true by default.*
```
$REST.ExecuteOnCreationFl = false;
```

### Fewer Requests to the Server
Having the execute on creation boolean option, if set to false will construct the url of the base object without making a request to the server.

#### Example - Creating a List
##### Synchronously
```
// This will create the web object, but not execute the request.
var web = new $REST.Web(false);

// This will execute the request to create a list
var list = web.addList({
    BaseTemplate: 100,
    Description: "This is a test list.",
    Title: "Test"
});
```

##### Asynchronously
```
// This will create the web object, set the asynchronous flag and not execute a request to the server
(new $REST.Web_Async(false))
// This will execute a request to the server to create a list
.addList({
    BaseTemplate: 100,
    Description: "This is a test list.",
    Title: "Test"
})
// This will execute after the list is created
.done(function(list) {
    // Additional code goes here
});
```

#### Example - Query a List
```
// This will execute one request to the server to get list items
var items = (new $REST.ListItems("[List Name]", false)).query({
    // OData properties - Refer to the OData section for additional details
});

// Examples of getting items by CAML queries
(new $REST.List("Site Assets", false)).getItemsByQuery("<Query><Where><Gt><FieldRef Name='ID' /><Value Type='Integer'>0</Value></Gt></Where></Query>");
(new $REST.List("Site Assets", false)).getItems("<View Scope='RecursiveAll'><Query><Where><Eq><FieldRef Name='FileLeafRef' /><Value Type='File'>sprest.js</Value></Eq></Where></Query></View>");
```

### Optional Input
All constructors take have the following optional parameters:
```
// The target information and execute request flags are optional
new Object([Object Specific Input Parameters], executeRequestFl);
new Object([Object Specific Input Parameters], targetInfo);
new Object([Object Specific Input Parameters], targetInfo, executeRequestFl);

// Asynchronous methods can take either a target information object, or the callback function
new Object_Async([Object Specific Input Parameters], targetInfo, executeRequestFl);
new Object_Async([Object Specific Input Parameters], function(obj) { ... }, executeRequestFl);
```

#### Target Information
The target information consists of the following properties:
* asyncFl - Flag to determine if the request should executes asynchronously or synchronously.
* bufferFl - Flag to determine if the output of the request is a file stream.
* callback - Required for asynchronous request. Executed after execution.
* data - Template used for passing the method parameters in the body of the request.
* defaultToWebFl - Flag to determine if the url should default to the current web url, site url otherwise.
* method - The request method type.
* endpoint - The api endpoint.
* url - The server relative site/web url to execute the request against.

#### Execute Request Flag
The executeRequestFl parameter will default to the global $REST.ExecuteOnCreationFl value.

### PowerShell-Like Experience
Since the library can be executed synchronously, the user can execute commands in the browser's console window and interact with the SharePoint site in a command-line interface.

*Note - The commands will execute under the security of the current user.*
*Note - SharePoint online may reject synchronous requests. It's better to use asynchronous requests.*

### OData Queries
Each collection will have a generic "query" method with the input of the OData query operations. The oData object consists of the following properties:
* Expand - A collection of strings representing the field names to expand.
* Filter - A collection of strings representing the filters to apply.
* OrderBy - A collection of strings representing the fields to order by.
* QueryString - A read-only property representing the query string value of the oData object.
* Select - A collection of strings representing the field names to select.
* Skip - The number of objects to skip.
* Top - The maximum number of objects to return.

#### Query List Collection
```
// Get the lists for the current web, but don't execute a request to the server
var lists = new $REST.Lists(false);

// Query for the 'Dev' list
lists.query({
    Filter: ["Title eq 'Dev'"]
});
```

#### Query List Item Collection
```
// Get the 'Dev' list, but don't execute a request to the server
(new $REST.ListItems_Async("Dev", false))
// Query for my items, expanding the created by information
.query({
    Select: ["Title", "Author/Id", "Author/Title"],
    Expand: ["Author"],
    Filter: ["AuthorId eq 11"]
})
// Execute code after the request is complete
.done(function(items:$REST.ListItems) {
    // Code goes here
});
```

## Test:
I wrote a sample test file. To run it, upload the [test folder](https://github.com/gunjandatta/sprest/tree/master/test) contents to a SharePoint library and access to the "test.aspx" page. This will test the basic functionality of the library.

Refer to the [test script](https://github.com/gunjandatta/sprest/blob/master/test/test.js) file for detailed examples of using the library.

### File/Folder
![File/Folder Test](https://raw.githubusercontent.com/gunjandatta/sprest/master/images/test-file.png)

### List/Item
![List/Item Test](https://raw.githubusercontent.com/gunjandatta/sprest/master/images/test-list.png)

### Content Type/Field
![Content Type/Field Test](https://raw.githubusercontent.com/gunjandatta/sprest/master/images/test-field.png)

## Examples:
*Note - The examples below will execute one request to the server.*

### Content Type
_**List**_
```
// Get the 'Document' content type in the 'Documents' library
new $REST.ContentType("Document", "Documents");
```

_**Web**_
```
// Get the 'Item' content type in the current web
new $REST.ContentType("Item");
```

### Content Types
_**List**_
```
// Get the content types in the 'Documents' library
new $REST.ContentTypes("documents");
```

_**Web**_
```
// Get the content types in the current web
new $REST.ContentTypes();
```

### Field
_**List**_
```
new $REST.Fields("Title", "documents");
```

_**Web**_
```
new $REST.Fields("Title");
```

### Fields
_**List**_
```
new $REST.Fields("documents");
```

_**Web**_
```
new $REST.Fields();
```

### File
_**List**_
#### Asynchronously
```
// This will get the Forms subfolder of the documents library, set the asynchronous flag, and not execute request
new $REST.Folder_Async("Forms", "Documents", false)
// This will get the file asynchronously
.getFile("EditForm.aspx")
.done(function(file) {
    // Code executes after we have the file object
});
```

#### Synchronously
```
// This will get the file synchronously
new $REST.File("sprest.js", "documents");
```

_**Web**_
```
new $REST.File("/sites/dev/shared documents/forms/EditForm.aspx");
```

### Files
_**List**_
```
new $REST.Files("documents");
```

_**Web**_
```
new $REST.Files();
```

### Folder
_**List**_
```
new $REST.Folder("sprest.js", "documents");
```

_**Web**_
```
new $REST.Folder("/sites/dev/shared documents/sprest.js");
```

### Folders
_**List**_
```
new $REST.Folders("documents");
```

_**Web**_
```
new $REST.Folders();
```

### List
```
new $REST.List("documents");
```

### Lists
```
new $REST.Lists();
```

### List Item
```
new $REST.ListItems(1, "documents");
```

### List Items
_**All Items**_
```
new $REST.ListItems("documents");
```

_**CAML Query**_
```
// Get the list items, but do not execute a request to the server
(new $REST.ListItems_Async("documents", false))
// Get the items
.getItemsByQuery("<Query><Where><Gt><FieldRef Name='ID' /><Value Type='Integer'>0</Value></Gt></Where></Query>")
// Execute after the request completes
.done(function(items)) {
    // Code goes here
}
```

### Role Assignments
_**List**_
```
new $REST.RoleAssignments("documents");
```

_**Web**_
```
new $REST.RoleAssignments();
```

### Role Definitions
```
new $REST.RoleDefinitions();
```

### Site
```
new $REST.Site();
```

### Site Groups
```
new $REST.SiteGroups();
```

### User Custom Actions
_**Site**_
```
new $REST.UserCustomActions();
```

_**Web**_
```
new $REST.UserCustomActions(true);
```

### Users
```
new $REST.Users();
```

### View
```
new $REST.View("all items", "documents");
```

### Views
```
new $REST.Views("documents");
```

### Web
```
new $REST.Web();
```
