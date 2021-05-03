// Juan Pablo Ramos Robles 715592

// Manda a llamar a NLU
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

// Instancia de NAtual Language

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    // Mandamos llamar las variabls de entorno
    apikey: process.env.apikey,
  }),
  serviceUrl: process.env.url,
});
// Exportamos el handler
exports.handler = async (event) => {
  // Tiene limite de dos ya que es lo que nos pide
  const analyzeParams = {
    'text': event.historial,
    'features': {
      'entities': {
        'emotion': true,
        'sentiment': true,
        'limit': 2
      },
      'keywords': {
        'emotion': true,
        'sentiment': true,
        'limit': 2
      }
    }
  };

  // Resultado del analizer
  const res = await naturalLanguageUnderstanding.analyze(analyzeParams)
  return res;
};
