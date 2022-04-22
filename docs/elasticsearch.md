# Elasticsearch, Kibana, and Logstash

_by Curtis Dyreson_

Symbiota2 users often want to *search* data, for example to search for occurrence records in a particular region of the world.  Users also want to obtain aggregate, statistical data about their site such as a graph of the number of occurrence records added to a collection over time.  To meet both needs, Symbiota2 utilizes the *Elasticsearch stack*.

The stack consists of three parts, as described below.
 1. Elasticsearch - Elasticsearch is a search engine.  A search engine indexes a data collection and supports various kinds of searches on the data.
 2. Kibana - Kibana is a user-interface builder and display system.  Users can build visualizations and search interfaces using Kibana.
 3. Logstash - Logstash is software for feeding data to Elasticsearch.  In Symbiota2 we use Logstash to extract data from the Symbiota2 database and pipe it into Elasticsearch.

In common parlance the stack is often referred to as the *ELK stack* or just *ELK*.

 ## Using ELK in Symbiota2
 We added ELK to Docker for (relatively) easy installation and maintenance in Symbiota2.  If you would like to use a different ELK stack, for instance, if your site already runs ELK, then you can modify these instructions to utilize your setup.

### Configure the Environment Variables
The following Environment Variables are utilized in the ELK  stack, Docker compose, and Symbiota2 setup, so configure them as needed.  If you don't know a particular setting, don't worry, just use the default setting (but be sure to change the passwords!).  You configure the variables by editing the .env file.

| Environment variable                     | Description                                                                             | Default                      |
|------------------------------------------|-----------------------------------------------------------------------------------------|------------------------------|
| SYMBIOTA2_ENABLE_ELASTICSEARCH           | Will Elasticsearch be used?                                                             | 1                            |  
| SYMBIOTA2_ELASTICSEARCH_VERSION          | Version of elasticsearch and kibana to use                                                         | "8.1.2"                     |  
| SYMBIOTA2_ELASTICSEARCH_DATA_FOLDER      | Where is Elasticsearch data stored?                                                     | "./elasticsearch/data"       |  
| SYMBIOTA2_ELASTICSEARCH_PORT             | Port for Elasticsearch                                                                  | 9200                         |  
| SYMBIOTA2_ELASTICSEARCH_USER             | Elasticsearch user                                                                      | elastic                      |  
| SYMBIOTA2_ELASTICSEARCH_PASSWORD         | Elasticsearch password (change this!)                                                   | hellothere                        | 
| SYMBIOTA2_KIBANA_PASSWORD         | kibana_system user password (change this!)                                                   | hellothere                        | 
| SYMBIOTA2_LOGSTASH_PASSWORD         | logstash_system user password (change this!)                                                   | hellothere                        |   
| SYMBIOTA2_ELASTICSEARCH_ENV_JAVA_OPTIONS | Set java options, such as memory use for Elasticsearch                                  | "ES_JAVA_OPTS=-Xmx4g -Xms4g" |  
| SYMBIOTA2_KIBANA_PORT                    | Port for Kibana                                                                         | 5601                         |  
| SYMBIOTA2_LOGSTASH_PORT                  | Port for Logstash                                                                       | 5600                         |  
| SYMBIOTA2_LOGSTASH_ENV_JAVA_OPTIONS      | Java options for Logstash                                                               | "-Xmx256m -Xms256m"          |  
| SYMBIOTA2_LOGSTASH_VERSION               | Version of Logstash to use                                                              | "8.1.2"                     |  
| SYMBIOTA2_LOGSTASH_FOLDER                | Folder for pipeline definitions                                                         | "./logstash"                 |  
| SYMBIOTA2_LOGSTASH_CONFIG_FOLDER         | Folder for logstash config                                                              | "./logstash/config"          |
|------------------------------------------|-----------------------------------------------------------------------------------------|------------------------------|

### Run Docker Compose
Use the following Docker compose to get Symbiota2 plus ELK up and running.

    docker compose -f docker-compose-nossl-threenode.yml up -d

This command will run the same Docker compose as the normal Symbiota2 setup (it will not impact Redis, the DB, or S3 containers).  The compose file for ELK is adapted from the Elasticsearch example compose file.  It sets up three containers (three nodes) for providing search services (so if one fails, there are two backup nodes ready to run).  The three node setup is recommended for production systems.  It also turns on XPack security, but the Docker compose turns off encrypted (TLS/SSL) communication between the nodes.  The reason is that encrypted communication works great with only Elasticsearch and Kibana but Logstash has trouble talking to Elasticsearch.  So rather than having an installer go through the certificate creation process, we decided to simplify and turn off encrypted communication.

After you run the Docker compose, ELK plus Symbiota2 should be running.  You can check this by navigating to the following URL in your browser.

    http://localhost:9200

(If you changed the Elasticsearch port in your .env you'll have to use the port you changed it to).  Navigating to the URL will prompt for a login and password.  The login is "elastic" and the password is whatever you set it to in your .env.

You can also check out Kibana by navigating to 

    http://localhost:5601

(If you changed your Kibana port in your .env, use that port).

The login is `elastic` and the password is whatever you set it to in your `.env` for the `elastic` user (do not log in with the `kibana_system` user credentials).

Sometimes Kibana will fail to start because the `kibana_system` user password was unable to be set automatically (`kibana_system` is used by Kibana to communicate with Elasticsearch).  If so, use your Docker desktop to open a CLI window (command line window) and run the following command in the `Symbiota2-es01-1` Docker container.

    bin/elasticsearch-reset-password -u kibana_system -i

You will be prompted to enter a password and use the password that you set for the `kibana_system` user in the `.env`.

### Logstash
Logstash is setup to pipe data from the Symbiota2 database into Elasticsearch indexes.  The pipelines are specified in the `logstash/config/pipelines.yml` file, and each pipeline configuration is in the `logstash/pipeline` folder.  You can add more pipelines as needed by editing the configuration files appropriately.

A Logstash pipeline works by executing a database query and sending the result (in an appropriate format) to Elasticsearch for indexing.  To prevent data from being continually reindexed, each query generates a "last modified datetime" and Logstash processes the query results in timestamp order, picking up from where it last left off each time.  This synchronizes the Elasticsearch index to changes in the Symbiota2 database, so that when data is modified, the Elasticsearch index is also modified.  However, the synchronization does not account for data that is deleted (this is an endemic problem in Logstash/Elasticsearch/Database pipelines, not specific to Symbiota2).  So if deletes are frequent, it may be necessary to reindex periodically.

In any case, the Logstash container will continually poll the Elasticsearch containers for new data.  Logstash can be stopped and restarted as desired and will catch up as needed after being "turned off".

If Logstash is not working, the most likely reason is that the `logstash_system` user password was unable to be set automatically (`logstash_system` is used by Logstash to communicate with Elasticsearch).  If so, use your Docker desktop to open a CLI window (command line window) and run the following command in the `Symbiota2-es01-1` Docker container.

    bin/elasticsearch-reset-password -u logstash_system -i

You will be prompted to enter a password and use the password that you set for the `logstash_system` user in the `.env`.

### Getting the Built-in Kibana Dashboard Working
There are three Kibana dashboards that Symbiota2 has integrated into the front end.

 1. The spatial-module dashboard - Search for and display occurrences on a map.
 2. The collection-statistics dashboard - Show statistics on a per collection basis.
 3. The image-search dashboard - An example dashboard to demonstrate filtering and visualizations.

To integrate the dashboards with Symbiota2, do the following.

 1. Start the ELK stack.
 2. Start Kibana at http://localhost:5601 where 5601 is the Kibana port (you may have changed this in your `.env` file). Login to Kibana when prompted using the `elastic` user credentials. 
 3. From the Kibana home page, navigate to the `Stack Management` menu.
 4. From the `Stack Management` menu select `Saved Objects`.
 5. Choose to `Browse` to upload `Saved Objects`.  Within the Symbiota2 project navigate to `kibana/dashboards.njson` and upload that file.
 6. Return to the Kibana home page and navigate to `Dashboards`.  You should see three dashboards: `spatial-module`, `collection-statistics`, and `simple-image-search`.  Try each dashboard to ensure that the dashboards are working.  Skip the next step if the dashboards are working.
 7. If a dashboard is not working it will be because the indexes have not yet been created.  These indexes are created by reading the data from the database.  Logstash runs to create and populate the indexes.  There are more instructions for Logstash below.
 8. This step is necessary for now, until ELK supports links to dashboard names rather than internal identifiers.  We have to set up a link in the Symbiota2 user interface to the corresponding dashboard. In the dashboard menu, for each dashboard in turn do the following. <ol><li>Goto the `Share` tab.</li><li>Choose to `share a link` to the dashboard.</li><li>Copy the link to the `.env` file and the appropriate environment variable.  For instance the `$SYMBIOTA2_SPATIAL_MODULE_DASHBOARD` variable should be set to the copied text of the link (and enclosed within quotation marks).</li></ol>.
 9. Start or restart Symbiota2 and the dashboards will now work in the user interface.
> Written with [StackEdit](https://stackedit.io/).
