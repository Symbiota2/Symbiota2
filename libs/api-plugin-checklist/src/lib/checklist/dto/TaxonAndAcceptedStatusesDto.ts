// The default controller fetches all of the records
//     @Get()
//     @ApiResponse({ status: HttpStatus.OK, type: TaxonDto, isArray: true })
//     @ApiOperation({
//         summary: "Retrieve a list of taxons.  The list can be narrowed by taxon IDs and/or a taxa authority."
//     })
//     async findAll(@Query() findAllParams: TaxonFindAllParams): Promise<TaxonDto[]> {
//         const taxons = await this.taxa.findAll(findAllParams)
//         if (!taxons) {
//             return []
//         }
//         const taxonDtos = taxons.map(async (c) => {
//             const taxon = new TaxonDto(c)
//             return taxon
//         });
//         return Promise.all(taxonDtos)
//     }