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

  // Resultado que se va a analizar con NLU
  const res = await naturalLanguageUnderstanding.analyze(analyzeParams)

  // Arreglo utilizado para las palabras claves
  let palabrasClave = []
  for (let i = 0; i < res.result.keywords.length; i++)  palabrasClave.push(res.result.keywords[i].text)
  //Arreglo usado paral as entidades
  let entidadesGroup = []
  for (let i = 0; i < res.result.entities.length; i++) entidadesGroup.push(res.result.entities[i].text)

  //Función para sacar la más grande
  function getMaxEmotion(emotions) {
    var top;
    var topValue;
    for (let emotion in emotions) {
      if (topValue == null) {
        top = emotion
        topValue = emotions[emotion]

      } else if (topValue < emotions[emotion]) {
        topValue = emotions[emotion]
        top = emotion
      }
    }
    // Este es tu emoción máxima
    return top;
  }

  // Con esto sacamos las palabras claves pero las descendentes
  let palabrasClaveDesc = {}
  // Recorremos result para llenar el objeto
  for (let i = 0; i < res.result.keywords.length; i++) {
    let nuevaClave = {
      "sentimiento": res.result.keywords[i].sentiment.label,
      "relevancia": res.result.keywords[i].relevance,
      "repeticiones": res.result.keywords[i].count,
      "emocion": getMaxEmotion(res.result.keywords[i].emotion)
    }
    // Se crea la nuea palabra clave
    palabrasClaveDesc[res.result.keywords[i].text] = nuevaClave
  }

  // Con esto sacamos las entidades 
  let entidadesDesc = {}
  //Recorremos result para llenar el objeto
  for (let i = 0; i < res.result.entities.length; i++) {
    let nuevaEntidad = {
      "tipo": res.result.entities[i].type,
      "sentimiento": res.result.entities[i].sentiment.label,
      "relevancia": res.result.entities[i].relevance,
      "emocion": getMaxEmotion(res.result.entities[i].emotion),
      "repeticiones": res.result.entities[i].count,
      "porcentaje_confianza": res.result.entities[i].confidence
    }
    // Se crea la nueva entidad
    entidadesDesc[res.result.keywords[i].text] = nuevaEntidad
  }

  // Resultado que se necesira sacar en JSON
  FinalResult = {
    "lenguage_texto": res.result.language,
    "palabras_clave": palabrasClave,
    "entidades": entidadesGroup,
    "palabras_clave_desc": palabrasClaveDesc,
    "entidades_desc": entidadesDesc
  }


  return FinalResult;


};


