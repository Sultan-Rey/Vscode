KATALOG Ecommerce Angular app

This app is powered by Firebase Firestore database. before using it you have to formally create
the Non-sql documents and collection necessary into a firebase project.

> Firestore collection needs

    - brands 
        contains documents about available brands of products
    - categories
        All categories of product available
    - homepane
        Definite the placement, the name, the button of each panel in the homepage
    - product
        contains a document for each product available.
    - user
        contains a document for each user of the application

PS : see src > models, the document's fields of each collection are simular to his model.


> initiate

    The initial application is running a test firesbase project, created by the author of this app
    - please do not use it for production purposes.
    - create your own firebase project and release the test values by yours in src > app > app.module

ps : If you have any problem to initiate this app please contact the author.

> Services

    src > app > firestore-data.service contains all methods that you will need to communicate with the firestore Db


