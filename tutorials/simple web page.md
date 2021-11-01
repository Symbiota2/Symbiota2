
# How to Build a Web Page in Symbiota2

_by Curtis Dyreson, Evin Dunn, Darius Dumel, and Gary Fehlauer_

This tutorial shows how to write a web page in Symbiota2.  In particular, we focus on a web page that reads data from a Symbiota2 web service.

The front end in Symbiota2 uses Angular.  Angular is a technology for making it easier to write and maintain web-based user interfaces.  But there is a learning curve for Angular and Angular has a particular way of setting up the files needed to construct a web page.

A page is constructed from information in four folders.
<ol>
<li>
pages - The folder contains the pages.  There is one sub-folder for each page.  Each sub-folder contains the following files,.  We will assume that the sub-folder is named 
<code><em>pageName</em></code>. 
<ul>
<li>
<code><em>pageName</em>.html</code> - The page Template.  This file is a combination of HTML and Angular directives.
</li>
<li>
<code><em>pageName</em>.ts</code> - Code to process the page.
</li>
<li>
<code><em>pageName</em>.scss</code> - Stylesheet formatting for the page.
</li>
</ul>
</li>
<li>
services - The services folder contains code to communicate with the web services, fetching data from a web service or posting data to a web service.
</li>
<li>
dtos - A DTO is a data transfer object.  Each such object describes the structure of data passed by some service.
</li>
<li>
components - A component is a small part of a page.  Since features within a page often recur, components are a way of reusing code.  Components have a similar structure to pages.
</li>
</ol>
As an example we will focus on the taxon profile page.  The page is located in the following folder.
<ul>
<pre>
ui-plugin-taxonomy/src/lib/pages/taxon-profile
</pre>
</ul>

## The Taxon Profile Template file
The Template file controls how the page is displayed.  The header for the page is show below.
<ul>
<pre>
&lt;div>  
 &lt;h1>{{"taxon.profile.title" | translate}}&lt;/h1>  
&lt;/div>
</pre>
</ul>
The <code>&lt;h1></code> is HTML for a header at level one.  Within the header is usually a text string, but since Symbiota2 could be in several languages the string comes from a internationalization directory that has google translations of the text used in the page.  The directory lives at
<ul>
<pre>
ui-plugin-taxonomy/src/i8n
</pre>
</ul>
and has translation files for many languages.  In the Template the following code snippet is interpreted by Angular to get the title for the page and pipe it through the <code>translate</code> pipe (which takes the string from the appropriate i8n file).
<ul>
<pre>
 {{"taxon.profile.title" | translate}}
</pre>
</ul>

The page then shows information about the taxon.  We focus on only a single part of this display of information.
<pre>
 &lt;b *ngIf='taxon'>{{taxon.scientificName}}&lt;/b> 
</pre>
The code is an Angular directive <code>*ngIf='taxon'</code> that conditionally formats everything in the <code>&lt;b></code> (a bold tag) only if the <code>taxon</code> information exists (is non-null).

Information is synchronized between the Template and TS files by a technique called *binding*.  The relationship is through a <code>taxon</code> instance variable in the TS file.  So the Template page is checking to make sure that the variable has taxon information prior to formatting that information in the page.  This check is essential.  The taxon information is loaded asynchronously so the check will ensure that the information is not displayed until it is loaded.  If the taxon information is present then the following displays the <code>scientificName</code> field.
<ul>
<pre>
{{taxon.scientificName}}
</pre>
</ul>
The double braces indicate binding to the named field in the <code>taxon</code> key/value set.

To summarize, with binding we can pass information between (the evaluation of) the display (a Template file) and the code to process the display (a TS file).

## The Taxon Profile TS file
Fetching data from a web service to display in the page happens in the TS file. The dynamic aspects of the code are in the following file.
<ul>
<pre>
ui-plugin-taxonomy/src/lib/pages/taxon-profile/taxon-profile-page.component.ts
</pre>
</ul>
 An annotation at the top of the file informs Angular of the various parts of the page.
<ul><pre>
@Component({  
  selector: 'taxon-profile',  
  templateUrl: './taxon-profile-page.html',  
  styleUrls: ['./taxon-profile-page.component.scss'],  
})
</pre></ul>
The <code>selector</code> is the name of the folder, the <code>templateUrl</code> is the location of the Template page, and
the <code>styleUrls</code> is a list of stylesheet files for the page (typically there is just one).

The next part of the TS file specifies the class for the page, its instance variables, and a constructor.
<ul>
<pre>
export class TaxonProfilePageComponent implements OnInit {  
    // Instance variables
    ...
    taxon: TaxonListItem  // TaxonListItem is a DTO
    ... 
    constructor(  
        private readonly userService: UserService,    
        private readonly taxonStatusService: TaxonomicStatusService,  
        ...
        private router: Router,  
        private formBuilder: FormBuilder,  
        private currentRoute: ActivatedRoute  
      ) { }
   ...
   }
</pre>
</ul>
To fetch data and communicate with other parts of Symbiota2, the TS file uses services.  These services are passed to the constructor by Angular (using a technique called Injection). For instance the <code>UserService</code> provides management of users in the system.  It is easy to add a service to a TS file, just add it to the list of arguments to the constructor.  For instance the Taxon Profile TS file will have to know about taxon statuses so it has the <code>TaxonomicStatusService</code> as a parameter in the constructor.
<ul><pre>
private readonly taxonStatusService: TaxonomicStatusService
</pre></ul>

The next part of the TS file is a method that Angular calls when the page is loaded in a browser.  Put any initialization code in <code>ngOnInit()</code>.
<ul><pre>
ngOnInit() {  
    this.currentRoute.paramMap.subscribe(params => {  
        this.taxonID = params.get('taxonID')  
        // Load the profile  
        this.loadProfile(parseInt(this.taxonID))  
    }
</pre>
</ul>
The taxon profile page does two things on initialization. First it reads the <code>taxonID</code> which is passed to the page as a URL parameter (we'll describe how to set his up later in this tutorial).   Second, it loads the taxon's profile.  Below is part of the <code>loadProfile</code> method.
<ul><pre>
loadProfile(taxonID: number) {  
  this.taxonDescriptionBlockService.findBlocksByTaxonID(taxonID).subscribe((blocks) => {  
    blocks.forEach((block) => {  
      if (block.descriptionStatements.length > 0) {
        block.descriptionStatements = block.descriptionStatements.sort((a, b) => a.sortSequence - b.sortSequence)  
      }  
    })  
    this.blocks = blocks  
  }) 
  ...
}
</pre></ul>
The first line subscribes to an asynchronous service to fetch from a web service the blocks for the taxon.  When the service returns the blocks, then each block is processed by sorting the description statements within the block and the list of blocks is assigned to the <code>this.block</code> instance variable (making the fetched data available for display, if it had been previously skipped over by <code>*ngIf</code> directives).

## Adding the Page to Angular
To make the Taxon Profile page available to the Angular server, the page's class in the TS file has to be added to the following file.
<ul>
<pre>
ui-plugin-taxonomy/src/lib/taxonomy-plugin-module.ts
</pre>
</ul>
Add the class (in this example <code>TaxonProfilePageComponent</code>) to the <code>declarations</code> and <code>entryComponents</code> lists.
Also, create a <em>route</em> to the page by modifying the <code>routes()</code> method, adding a new route to the list as follows.
<ul>
<pre>
{  
  path: TaxonomyPlugin.TAXON_PROFILE_ROUTE,  
  component: TaxonProfilePageComponent  
}
</pre>
</ul>
The <code>component</code> is the class for the page.
The <code>path</code> specifies what URL locates the page.   In this case, the path is defined as follows (elsewhere in the file).
<ul>
<pre>
private static TAXON_PROFILE_ROUTE = "taxon/profile/:taxonID"
</pre>
</ul>
The <code>:taxonID</code> suffix indicates a URL parameter called 'taxonID' in the route.

## The Taxonomic Block Service
The front end uses services to manage data.  The services in turn invoke back end web services.  [TODO - describe DTOs and Services]

```

