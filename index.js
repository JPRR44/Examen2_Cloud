// Juan Pablo Ramos Robles
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config()

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.apikey,
  }),
  serviceUrl: process.env.url,
});
const response = {
  statusCode: 200,
  body: JSON.stringify('Hello from Lambda!'),
};
exports.handler = async (event) => {

  const analyzeParams = {
    'text': event.historial_clinico
  };

  naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
      return JSON.stringify(analysisResults, null, 2)
    })
    .catch(err => {
      console.log('error:', err);
      return err;
    });
};
