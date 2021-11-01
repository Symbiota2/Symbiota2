# How to Build a Web Service in Symbiota2

_by Curtis Dyreson, Evin Dunn, Darius Dumel, and Gary Fehlauer_

This tutorial shows how to write an API endpoint in Symbiota2.

In Symbiota2 a web service has two main parts. 

1. A TypeORM *entity* (or set of entities)
2. A *controller* and a *service*

Let's consider each of these parts.

## TypeORM Entities
At an abstract level, an API endpoint maps database  _tables_ to  _objects_  in an  **_object-relational mapping_**  (_ORM_). The ORM helps to construct  _web services_ to access and modify data.

Symbiota2's ORM is given in the following folder:
<ul>
<code>libs/api-database/src/entities</code>
</ul>
The folder contains a folder for each related collection of Symbiota tables, e.g., the <code>taxonomy</code> folder has one TypeORM entity for each Symbiota database table.   As an example the <code>Taxon.entity.ts</code> is the ORM mapping for the <code>taxa</code> table in a Symbiota database.  The mapping has two parts.

1. A mapping for each database column.
2. A mapping for relationships from the <code>Taxon</code> entity to other entities.

The column mapping can change the name and/or type of each column and give additional constraints.  An example of part of the <code>Taxon</code>
entity is given below.

<ul>
<pre>
@Entity('taxa')
export class Taxon extends EntityProvider {  
    @PrimaryGeneratedColumn({ type: 'int', name: 'TID', unsigned: true })  
    id: number; 
    @Column('varchar', { name: 'SciName', length: 250 })  
    scientificName: string;
    ...
</pre>
</ul>

The entity is mapped by the <code>@Entity</code> annotation to the <code>taxa</code> table in the database.  The entity has fields which map to database columns, but the columns can be given names different than those in the corresponding database table.  For instance, the entity has the field <code>scientificName</code> that maps to the <code>SciName</code> column in the database table.  The longer name helps to promote readability and clarity.

The second part of the entity is the relationships to other entities.  An example is given below of the relationship to the <code>Image</code> entity.
<ul>
<pre>
@OneToMany(() => Image, (images) => images.taxon)  
images: Promise&lt;image[]>
</pre>
</ul>
The <code>@OneToMany</code> annotation establishes that this entity is related to one (or zero) to many <code>Image</code> entities through the <code>taxon</code> relationship in <code>Image</code>.
That relationship is a <code>@ManyToOne</code> relationship (the inverse to the <code>images</code> relationship) that relates the two entities through a <code>taxonID</code> field as shown below.
<ul>
<pre>
@ManyToOne(() => Taxon, (taxa) => taxa.images, {  
  onDelete: 'RESTRICT',  
  onUpdate: 'RESTRICT',  
})  
@JoinColumn([{ name: 'tid'}])  
taxon: Promise&lt;Taxon>
</pre>
</ul>

### Using TypeORM to write web services

The code for web services is in a folder with (at least) four files.  Suppose we want to create web services for the `Taxon` entity.  Then we create a `taxon` folder in  `libs/api-plugin-taxonomy/src`.  The folder will have the following files (initially).

1. `taxon.controller.ts` - the controller  (front-end for the web services)
2. `taxon.services.ts` - the services (back end for the web services)
3. `taxon.controller.spec.ts` - specification file for the controller
4. `taxon.services.spec.ts` - specification file for the services

We will focus on the first two files as the specification files are boilerplate for vanilla web services.

#### The Controller

Annotations control the documentation and path to the `TaxonController` class.
<pre>
  @ApiTags('Taxon')
  @Controller('taxon')  
  export class TaxonController {  ... }
</pre>
The `@ApiTags` annotation names the API endpoints in the Swagger documentation (which will be automatically generated from the annotations), while the `@Controller` annotation specifics the path (relative to the API endpoints home URL) to reach this set of endpoints.

Let's look at a controller that fetches data.

The following controller finds a <code>Taxon</code> using the <code>taxonID</code>.
<ul>
<pre>
@Get(':taxonid')  
@ApiResponse({ status: HttpStatus.OK, type: TaxonDto })  
@ApiOperation({  
    summary: "Find a taxon by the taxonID"  
})  
async findByTID(@Param('taxonid') id: number): Promise&lt;TaxonDto> {  
    const taxon = await this.taxons.findByTID(id)  
    const dto = new TaxonDto(taxon)  
    return dto  
}
</pre>
</ul>
The controller has several annotations as described below.
<ul>
<li>
The <code>@Get</code> annotation has a <code>':taxonid'</code> string that means the web service will require a <code>taxonID</code> to be appended to the URL when invoking the web service.  In other words it sets up a parameter to the web service that is part of the path.  The type of the parameter and how it is communicated as an argument to the controller is given by the <code>@Param</code> annotation.  The value is converted to a number and assigned to the <code>id</code> argument to the controller.  
</li>
<li>
The <code>@APIOperation</code> annotation is documentation for describing the web service in the automatically produced Swagger page (which describes all of the web services in Symbiota2).
</li>
<li>
The <code>@APIResponse</code> annotation describes the return type for the controller, in this case a <code>TaxonDto</code> (a taxon data transfer object). DTOs are used for data transfer to and from web services. They provide an additional layer of abstraction.  The back end service will provide a <code>Taxon</code> entity to the controller, which is then converted to the <code>TaxonDto</code> object by the following line of code.
<pre>
    const taxon = await this.taxons.findByTID(id)  
</pre>
</li>
</ul>
The final and (most important) part to the controller is that it works <em>asynchronously</em> with respect to the service.  The controller invokes the service and awaits its response, but the service has to read the entity from the database so it may take awhile to complete.  Instead of literally waiting for the response, the service sends to the controller a <code>Promise</code> that at some future point in time the read of the entity will complete.  The controller continues processing and returns a <code>Promise</code> that the data transfer object will be constructed once the entity has been read.  The asynchronous processing permits the application to make progress rather than waiting on database operations, which speeds overall response time.  The asynchronous processing complicates (to some extent) the programming of the controllers (and impacts the UI programming) but is common in database web applications because of the speed improvements.

#### The Service
Controllers invoke services which perform the actual database operations for managing data.  Below is the service for the controller described previously.
<ul>
<pre>
/*  
Find a taxon using a taxon ID.  
 */
 async findByTID(id: number): Promise&lt;Taxon> {  
    return this.myRepository.findOne({ where: {id: id} })  
}
</pre>
</ul>
TypeORM has two ways to invoke database operations: using the query builder and repository methods.  Both ways are documented in the TypeORM documentation, the query builder is the low-level, raw way to perform database operations (by constructing an SQL query explicitly) while the repository way abstracts away from the details of SQL by providing some commonly used database operations.  This service uses the repository's built-in <code>findOne</code> method which will implicitly execute an SQL query to find one row in the <code>taxa</code> table using the <code>tid</code>.   But rather than writing or constructing the query explicitly, as programmers we can simply use the <code>findOne</code> method passing to it the <code>id</code> (which maps to the <code>id</code> field in the <code>Taxon</code> entity).  

Note that the service is an <code>asynch</code> method that returns a <code>Promise</code>.


```
