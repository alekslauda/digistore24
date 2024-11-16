const MONGO_USERNAME = 'aslan';
const MONGO_PASSWORD = 'VlIyxpzR13L688eY';
const MONGO_DATABASE = 'digistore24';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.rsaeguy.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

enum HttpStatus {
  CREATED = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  INTERNAL_SERVER_ERROR = 500,
}

const APP_TOKEN = '1231iiakxz,aqweoiqi123'

export {  
  MONGO_URL,
  HttpStatus,
  APP_TOKEN
};
