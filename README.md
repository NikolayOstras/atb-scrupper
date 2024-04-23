NodeJS app to scrupp products from intenet shop atb.
Using express to add rest api.

#Instalation 
npm i 
#Run
npm start
#Endpoints

GET /api/atb/urls - get categories urls (file src/data/atb/urls.js)
POST /api/atb/total - get quantity of pages in category.send in body categoryName
POST /api/atb/parse - get items from page. send in body categoryName, numberOfPage
