/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const axios = require('axios');
const EMAIL_PERMISSION = "alexa::profile:email:read";  

//const alexalayouts=require('alexa-layouts');
//const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');
//const AWS = require('aws-sdk');
const languageStrings = {
    en : {
        translation:{
            WELCOME_MSG: 'Welcome, it is home cook, here you will find your assistant in the kitchen! Say Hello to start, or Help for more information',
            HELLO_MSG: 'Hello! How can I help you',
            HELLO_RE:'lets start',
            HELP_QU:'How I will be helping you!',
            HELP_WORD:'HELP',
            THANKS_MSG:'Great! wish you a good day',
            HELP_MSG: 'if you need any more info say, help',
            HELP_MSG_homecook:'I am home cook! I will help you by recommending random dishes, or dishes based on a specific weather,diet,or time of the day from your choice'+
            '!Also, I have a virtual fridge where you can track your real one! by adding, deleting, or checking the availability of an ingredient! Moreover, you can check what ingredients are'+
            ' missing from your fridge to cook a specific dish! finally! dont forget to save your shopping list here by'+
            ' adding and removing ingredients! and whenever you want! you can get your shopping list! Now, what do you want to try?',
            GOODBYE_MSG: 'Goodbye!',
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again',
            ERROR_MSG: 'Sorry, there was an error. Please try again',
            RECOM: "Recomendations // "+
                   "Virtaul Fridge // "+
                   "Shopping List ",
            PERMISSION:"In order to save your own fridge and shopping list, home cook will need access to your email address. Go to the home screen in your Alexa app and grant me permissions."
        }
        
    },
    ar : {
        translation:{
            WELCOME_MSG:'أهلا و سهلا بك,يمكنك قول مرحبا للبدء أو ساعديني لمزيد من المعلومات' ,
            HELLO_MSG: 'مرحبا! كيف يمكنني مساعدتك',
            HELLO_RE:'هيا فلنبدأ',
            HELP_QU:'كيف سأساعدك',
            HELP_WORD:'مساعدة',
            HELP_MSG: 'يمكنك أن لمزيد من المعلومات و المساعدة قل,ساعديني',
            HELP_MSG_homecook:'أهلا بك,هنا يمكنك ان تجد ما تحتاجه في المطبخ.سوف اساعدك في اعطائك أطباق من خياري,أو أطباق حسب طقس,أو نظام غذائي,او وقت معين من النهار.أيضا, يمكنك أن تستعمل الثلاجة الافتراضية,و ذلك من خلال اضافة ,أو حذف,أو التأكد من وجود أي مكون في الثلاجة. بالاضافة الى ذلك يمكنك سؤالي عن ماذا ينقسك لإعداد وجبة معينة. و لا تنسى استعمال قائمة التسوق من خلال اضافة, أو حذف المكونات, و يمكنك سؤالي عنها متى أردت!ماذا تريد أن تجرب الآن؟ ',
            GOODBYE_MSG: 'مع السلامة!',
            REFLECTOR_MSG: 'قمت بتشغيل {{intent}}',
            FALLBACK_MSG: 'آسف ، لا أعرف شيئًا عن ذلك. حاول مرة اخرى',
            ERROR_MSG: 'آسف، كان هناك خطأ. حاول مرة اخرى',
            RECOM:'توصيات, ثلاجة افتراضية,قائمة تسوق',
            PERMISSION:'ستحتاج المطبخ الافتراضي الى حفظ ثلاجتك و قائمة التسوق خاصتك عبر بريدك الالكتروني, لذالك امنحني الاذوونات من تطبيق اليكسا',
            
        }
        
    }
}

//Recommedations//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const Recommendish_enHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RecommendDishEN_intent';
    },
    async handle(handlerInput) {
        let speakOutput = '';
        var image_name ='';
        var image_link = ""
        
        await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recommenddish') 
        .then(response => {
            speakOutput = 'welcome! this is your recipe: ' + response.data.recipename;
            image_name = response.data.recipename;
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipeimages?recipeimage='+image_name) 
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
  }
    else{
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
        
    }
};


const Recommendish_arHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RecommendDishAR_intent';
    },
    
    async handle(handlerInput) {
        
        let speakOutput = '';
        var image_link = '';
        var image_name = ''
        await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipesarabic') 
        .then(response => {
               image_name = response.data.recipename_arabic
               speakOutput = 'جرب : '+response.data.recipename_arabic;
        }) .catch(error => {
            speakOutput = 'لا يوجد جواب';
        });
        
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image_url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipearabicimages?recipeimageAR='+image_name;
        var image_uri = encodeURI(image_url);
        await axios.get(image_uri) //arabic image
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
         }
             else{
                 return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
             }
         }
};

const Ingredient_enhandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Ingredient_RecommendationEN_intent';
    },
    async handle(handlerInput) {
        let speakOutput = '';
        var image_name =''
        let s ="";
        var image_link ='';
        var text = "";
        const recipename = handlerInput.requestEnvelope.request.intent.slots.Dish.value;
        
        await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/ingredientsdish?recipeName=' + recipename) 
        .then(response => {
                for (let i = 0, len = response.data.length; i < len; i++) {
                    text += response.data[i].ingredientname ;
                    if (i !== len -1)
                        text += ",";
                }
               image_name = recipename;
               speakOutput = 'Hello! for,'+recipename+', you need these ingredients: '+text;
        }) .catch(error => {
            speakOutput = 'No ingredients found';
        });
        
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){

         await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipeimages?recipeimage='+image_name) 
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailType": "location",
                "headerTitle": "Recipe",
                "headerBackButton": true,
                "headerAttributionImage": null,
                "imageScale": "best-fit",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": image_link,
                "primaryText": recipename,
                "ratingSlotMode": "multiple",
                "locationText": "Ingredients",
                "secondaryText": text,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "detailImageAlignment": "end",
                "backgroundScale": "best-fill",
                "id": "plantDetail"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
   }
        else{
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
            
        }
        
    }
};

const Ingredient_arhandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Ingredient_RecommendationAR_Intent';
    },
    async handle(handlerInput) {
        let speakOutput = '';
        var image_link='';
        const recipename = handlerInput.requestEnvelope.request.intent.slots.Dish.value;
        const uri = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/ingredientsdisharabic?recipeName='+ recipename;
        const url = encodeURI(uri);
        var text ="";
        
        await axios.get(url)
        .then(response => {
                for (let i = 0, len = response.data.length; i < len; i++) {
                    text += response.data[i].ingredientname_arabic ;
                    if (i !== len -1)
                        text += ",";
                }
               speakOutput = '   , هذه هي,المكونات التي طلبتها,لوجبتك  '+text+"   ";
        }) .catch(error => {
            speakOutput = 'حدث خطأ';
        });
       
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){

        var image_url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipearabicimages?recipeimageAR='+recipename
        var image_uri = encodeURI(image_url);
        await axios.get(image_uri) //arabic image
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailType": "location",
                "headerTitle": "Recipe",
                "headerBackButton": true,
                "headerAttributionImage": null,
                "imageScale": "best-fit",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": image_link,
                "primaryText": recipename,
                "ratingSlotMode": "multiple",
                "locationText": "المكونات",
                "secondaryText": text,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "detailImageAlignment": "end",
                "backgroundScale": "best-fill",
                "id": "plantDetail"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
   }
        else{
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
            
        }
        
    }
};


const Recommendweather_enHandler = {
    
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Weather_RecommendationEN_intent';
    },  
    async handle(handlerInput) {  
        const weather = handlerInput.requestEnvelope.request.intent.slots.weather.value; // taking slot from user
        let speakOutput = '';
        var image_name='';
        var image_link='';
        await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/basedonweather?weatherName=' + weather) 
        .then(response => {
               image_name = response.data.recipename;
               speakOutput = 'Nice! I think: '+response.data.recipename+', is a good recipe for you';
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
      
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
         
         await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipeimages?recipeimage='+image_name) 
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
        else{
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();}
    }
};

const Recommenddiet_enHandler = {
    
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Diet_RecommendationEN_intent';
    },  
    async handle(handlerInput) {  
        const diet = handlerInput.requestEnvelope.request.intent.slots.Diet.value; // taking slot from user
        let speakOutput = '';
        var image_name ='';
        var image_link ='';
        await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/basedondiet?dietName='+diet) 
        .then(response => {
               image_name = response.data.recipename;
               speakOutput = 'Oh! great! this is a good recipe for your diet: ' + response.data.recipename;
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
    
     if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){

      await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipeimages?recipeimage='+image_name) 
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
        else{
         return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();  
        }
    }
};


const Recommendweather_arHandler = {
    
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Weather_RecommendationAR_intent';
    },  
    async handle(handlerInput) {  
        var speakOutput=" ";
        var image_link='';
        var image_name = '';
        const weather = handlerInput.requestEnvelope.request.intent.slots.Weather.value; // taking slot from user
        const uri = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/basedonweatherarabic?weatherNameArabic=ال'+ weather;
        const url = encodeURI(uri);
        
        await axios.get(url) 
        .then(response => {
               image_name = response.data.recipename_arabic
               speakOutput = ' اعتقد ان الخيار الأنسب لك هو :'+response.data.recipename_arabic
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
      
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image_url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipearabicimages?recipeimageAR='+image_name
        var image_uri = encodeURI(image_url);
        await axios.get(image_uri) //arabic image
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
        else{
         
         return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();   
        }
    }
};

const Recommenddiet_arHandler = {
    
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Diet_RecommendationAR_intent';
    },  
    async handle(handlerInput) {  
        let speakOutput=" ";
        var image_link ='';
        var image_name = '';
        const diet = handlerInput.requestEnvelope.request.intent.slots.Diet.value; // taking slot from user
        const uri = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/basedondietarabic?dietNameArabic='+ diet;
        const url = encodeURI(uri);
        
        await axios.get(url) 
        .then(response => {
               image_name = response.data.recipename_arabic
               speakOutput = 'لهذا الدايت عليك أن تجرب: '+response.data.recipename_arabic;
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
      
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){

        var image_url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipearabicimages?recipeimageAR='+image_name
        var image_uri = encodeURI(image_url);
        await axios.get(image_uri) //arabic image
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
        else{
         
         return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();   
        }
    }
};

const Recommendtimeofday_enHandler = {
    
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Recommend_time_of_thedayEN_Intent';
    },  
    async handle(handlerInput) {  
        const time = handlerInput.requestEnvelope.request.intent.slots.time.value; // taking slot from user
        let speakOutput = '';
        var image_name ='';
        var image_link='';
        await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/basedontimeofday?timeofdayName='+time) 
        .then(response => {
               image_name = response.data.recipename;
               speakOutput = 'Ummm!! lets see!! I think: '+response.data.recipename+', is good for your '+time;
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
    
    
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
      
      await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipeimages?recipeimage='+image_name) 
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const Recommendtimeofday_arHandler = {
    
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Recommendtime_of_thedayAR_Intent';
    },  
    
     async handle(handlerInput) {
        let speakOutput = '';
        var image_link='';
        var image_name = '';
        const time = handlerInput.requestEnvelope.request.intent.slots.time.value;
        const uri = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/basedontimeofdayarabic?timeofdayNameArabic='+time;
        const url = encodeURI(uri);
        
        await axios.get(url)
        .then(response => {
            image_name = response.data.recipename_arabic
            speakOutput = response.data.recipename_arabic+',هي وجبة مثالية لك ';
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
         
        
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        
        var image_url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipearabicimages?recipeimageAR='+image_name
        var image_uri = encodeURI(image_url);
        await axios.get(image_uri) //arabic image
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link= '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
};

// Fridge///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Insert_ing_ENhandler ={
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Add_itemEN_intent';
    }, 
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.Ingredient.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertingredientfridge?ingredientName='+ing+'&fridgeName='+profileEmail;
        
        
        await axios.post(url)
        .then(response => {
               speakOutput = 'I added '+ ing + ' to your fridge';
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
             
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": "https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/amana/v2/article-listing/refrigerator-not-cooling-5-reasons-why/oc-refrigerators-open-side-desktop.jpg?fit=constrain&fmt=jpg&wid=1440",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg"
            }
        ]
    }
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
     catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};
     
const Insert_ing_ARhandler ={
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Add_ItemAR_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.Ingredient.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        const uri = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertingfridgear?ingredientNameAR=${ing}&fridgeName=${profileEmail}`;
        const url = encodeURI(uri);
       
        await axios.post(url)
        .then(response => {
               speakOutput = 'تمت اضافته الى ثلاجتك';
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": "https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/amana/v2/article-listing/refrigerator-not-cooling-5-reasons-why/oc-refrigerators-open-side-desktop.jpg?fit=constrain&fmt=jpg&wid=1440",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg"
            }
        ]
    }
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
     catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
     
};

const delete_ing_ENhandler ={   
        canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Delete_itemEN_intent';
    },  
     async handle(handlerInput) {
       let speakOutput = '';
       const per = handlerInput.t('PERMISSION');
       const ing = handlerInput.requestEnvelope.request.intent.slots.Ingredient.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const url = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/deleteingredientfridge?fridgeName=${profileEmail}&ingredientName=${ing}`;
        await axios.delete(url)
        .then(response => {
               speakOutput = 'I removed '+ing+' from your fridge, if you want add it to your shopping list'
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
         
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": "https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/amana/v2/article-listing/refrigerator-not-cooling-5-reasons-why/oc-refrigerators-open-side-desktop.jpg?fit=constrain&fmt=jpg&wid=1440",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg"
            }
        ]
    }
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
      catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
     
};


const delete_ing_ARhandler={
        canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Delete_itemAR_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.Ingredient.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
         try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const uri = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/deleteingfridgear?fridgeName=${profileEmail}&ingNameAR=${ing}`;
        const url = encodeURI(uri);
        await axios.delete(url)
        .then(response => {
               speakOutput = 'تمت ازالته من ثلاجتك'
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": "https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/amana/v2/article-listing/refrigerator-not-cooling-5-reasons-why/oc-refrigerators-open-side-desktop.jpg?fit=constrain&fmt=jpg&wid=1440",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg"
            }
        ]
    }
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
     catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
     
};
     

const check_missingENhandler={
    
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Check_Missing_EN_intent';
    },
    async handle(handlerInput) {
        let speakOutput = '';
        var image_name='';
        var image_link ='';
        var text = "";
        const per = handlerInput.t('PERMISSION');
        const recipename = handlerInput.requestEnvelope.request.intent.slots.Recipe.value;
          const { serviceClientFactory, responseBuilder } = handlerInput;  
         try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const url = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/checkmissingingredients?fridgeName=${profileEmail}&recipeName=${recipename}`;
        await axios.get(url)
        .then(response => {

                for (let i = 0, len = response.data.length; i < len; i++) {
                    text += response.data[i] ;
                    if (i !== len -1)
                        text += ",";
                }
               image_name = recipename;
               speakOutput = 'to cook: '+recipename+'!you need to buy, ' +text;
        }) .catch(error => {
            speakOutput = 'Error';
        });
        
      if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){

         await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipeimages?recipeimage='+image_name) 
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailType": "location",
                "headerTitle": "Recipe",
                "headerBackButton": true,
                "headerAttributionImage": null,
                "imageScale": "best-fit",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": image_link,
                "primaryText": recipename,
                "ratingSlotMode": "multiple",
                "locationText": "The Missing Ingredients",
                "secondaryText": text,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "detailImageAlignment": "end",
                "backgroundScale": "best-fill",
                "id": "plantDetail"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
   }
        else{
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
            
        }
        
    }
    catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
     
};

const check_missingARhandler={
     canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Check_Missing_AR_intent';
    },
    async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        var image_link ='';
        var text = "";
        const recipename = handlerInput.requestEnvelope.request.intent.slots.Dish.value;
         const { serviceClientFactory, responseBuilder } = handlerInput;  
         try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const uri = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/checkmissingingar?recipeNameAR=${recipename}&fridgeName=${profileEmail}`;
        const url = encodeURI(uri);
        await axios.get(url)
        .then(response => {
                for (let i = 0, len = response.data.length; i < len; i++) {
                    text += response.data[i] ;
                    if (i !== len -1)
                        text += ",";
                }
               speakOutput = ': هذه هي المكونات التي تنقصك'+text;
        }) .catch(error => {
            speakOutput = 'Error';
        });
        
     if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){

         await axios.get('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/recipeimages?recipeimage='+recipename) 
        .then(response => {
            image_link = response.data.url;
        }) .catch(error => {
            image_link = '';
        });
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailType": "location",
                "headerTitle": "Recipe",
                "headerBackButton": true,
                "headerAttributionImage": null,
                "imageScale": "best-fit",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": image_link,
                "primaryText": recipename,
                "ratingSlotMode": "multiple",
                "locationText": "المكونات التي تنقصك",
                "secondaryText": text,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "detailImageAlignment": "end",
                "backgroundScale": "best-fill",
                "id": "plantDetail"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
   }
        else{
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
            
        }
        
    }
        catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};


const check_available_ingEN_handler={
    
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Check_ingredient_EN_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.ing.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
         try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const url = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/checkavailableingredient?fridgeName=${profileEmail}&ingredientName=${ing}`;
        await axios.get(url)
        .then(response => {
               if(response.data  === true ){
                   speakOutput = ing+' is  available in your fridge'
               }
               else if(response.data === false) {
                    speakOutput = ing+' is not available, if you want add it to your shopping list'
               }
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
         
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": "https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/amana/v2/article-listing/refrigerator-not-cooling-5-reasons-why/oc-refrigerators-open-side-desktop.jpg?fit=constrain&fmt=jpg&wid=1440",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg"
            }
        ]
    }
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
             catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

const check_available_ingAR_handler={
    
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Check_ingredeint_AR_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.ing.value;
         const { serviceClientFactory, responseBuilder } = handlerInput;  
         try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const uri = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/checkavailableingar?fridgeName=${profileEmail}&ingNameAR=${ing}`;
        const url = encodeURI(uri);
        await axios.get(url)
        .then(response => {
               if(response.data === true){
                   speakOutput = ing+' '+'موجود في الثلاجة'
               }
               else if (response.data === false){
                    speakOutput = ing+' غير موجود في الثلاجة'
               }
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
         
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": "https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/amana/v2/article-listing/refrigerator-not-cooling-5-reasons-why/oc-refrigerators-open-side-desktop.jpg?fit=constrain&fmt=jpg&wid=1440",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg"
            }
        ]
    }
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
                  catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

const Get_FridgeEN_handler={
   
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Get_fridgeEN_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
         const { serviceClientFactory, responseBuilder } = handlerInput;  
         try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const url = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/getallfridgeitems?fridgeName=${profileEmail}`;
        await axios.get(url)
        .then(response => {
                var text = "";
                for (let i = 0, len = response.data.length; i < len; i++) {
                    text += response.data[i] ;
                    if (i !== len -1)
                        text += ",";
                }
           if(text===""){speakOutput ='there are no ingredients in your fridge'}
            else{
               speakOutput = 'you have these ingredients: '+text;}
        }) .catch(error => {
            speakOutput = 'Error';
        });
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": "https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/amana/v2/article-listing/refrigerator-not-cooling-5-reasons-why/oc-refrigerators-open-side-desktop.jpg?fit=constrain&fmt=jpg&wid=1440",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg"
            }
        ]
    }
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
                       catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }

}; 

const Get_FridgeAR_handler={
   
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Get_fridgeAR_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const { serviceClientFactory, responseBuilder } = handlerInput;  
         try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
        await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertfridgemail?mail='+profileEmail)
        
        const url = `https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/getallfridgeitemsar?fridgeName=${profileEmail}`;
        await axios.get(url)
        .then(response => {
                var text = "";
                for (let i = 0, len = response.data.length; i < len; i++) {
                    text += response.data[i] ;
                    if (i !== len -1)
                        text += ",";
                }
               if(text===""){speakOutput = 'لا يوجد شيء في الثلاجة'}
               else{
               speakOutput = 'هذه المكونات الموجودة في ثلاجتك: '+text;}
        }) .catch(error => {
            speakOutput = 'Error';
        });
        
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": "https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/amana/v2/article-listing/refrigerator-not-cooling-5-reasons-why/oc-refrigerators-open-side-desktop.jpg?fit=constrain&fmt=jpg&wid=1440",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg"
            }
        ]
    }
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
                       catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

// SHOPPING LIST /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Addshoppig_ing_ENhandler ={
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Add_ShoppingItemEN_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.ing.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
       await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertshoplistmail?mail='+profileEmail)
        
        const url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertingredientshoppinglist?shoppingListName='+profileEmail+'&ingredientName='+ing;
        
        
        await axios.post(url)
        .then(response => {
               speakOutput = 'I added '+ ing + ' to your shopping list. when you buy it dont forget to add it to your fridge';
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
         
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailImageAlignment": "right",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "imageSource": "https://fantabulosity.com/wp-content/uploads/2020/10/Grocery-List-1.png"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
 catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

const Addshoppig_ing_ARhandler ={
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Add_ShoppingItemAR_intent';
    },  
     async handle(handlerInput) {
          let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.ing.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
       await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertshoplistmail?mail='+profileEmail)
        const uri = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertingshoplistar?shListName='+profileEmail+'&ingNameAR='+ing;
        const url = encodeURI(uri);
        
        await axios.post(url)
        .then(response => {
               speakOutput = 'تمت اضافته الى قائمة التسوق';
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
         
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailImageAlignment": "right",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "imageSource": "https://fantabulosity.com/wp-content/uploads/2020/10/Grocery-List-1.png"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
 catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

const deleteshopping_ing_ENhandler ={   
        canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Delete_ShoppingItemEN_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.ing.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
       await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertshoplistmail?mail='+profileEmail)
        const url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/deleteingshoppinglist?ingredientName='+ing+'&shoppingListName='+profileEmail;
        
        await axios.delete(url)
        .then(response => {
               speakOutput = 'I removed '+ing+'from your shopping list';
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
         
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailImageAlignment": "right",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "imageSource": "https://fantabulosity.com/wp-content/uploads/2020/10/Grocery-List-1.png"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
 catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

const deleteshopping_ing_ARhandler ={   
        canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Delete_ShoppingItemAR_intent';
    },  
     async handle(handlerInput) {
          let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const ing = handlerInput.requestEnvelope.request.intent.slots.ing.value;
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
       await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertshoplistmail?mail='+profileEmail)
        const uri = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/deleteingshoplistar?shoppingListName='+profileEmail+'&ingNameAR='+ing;
        const url = encodeURI(uri); 
        
        await axios.delete(url)
        .then(response => {
               speakOutput = 'تمت ازالته من قائمة التسوق'
        }) .catch(error => {
            speakOutput = 'No Recommendation';
        });
         
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailImageAlignment": "right",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "imageSource": "https://fantabulosity.com/wp-content/uploads/2020/10/Grocery-List-1.png"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
 catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

const Get_Shopping_listEN_handler={
   
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Get_shoppinglistEN_intent';
    },  
     async handle(handlerInput) {
        let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
       await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertshoplistmail?mail='+profileEmail)
        const url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/getallshoplist?shoppingListName='+profileEmail;
        
        await axios.get(url)
        .then(response => {
                var text = "";
                for (let i = 0, len = response.data.length; i < len; i++) {
                    text += response.data[i] ;
                    if (i !== len -1)
                        text += ",";
                }
                if(text===""){speakOutput='there is no ingredients in your shopping list'}
                else{
               speakOutput = 'you have to buy: '+text+' ,when you  buy them add them to your fridge';}
        }) .catch(error => {
            speakOutput = 'Error';
        });
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailImageAlignment": "right",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "imageSource": "https://fantabulosity.com/wp-content/uploads/2020/10/Grocery-List-1.png"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
      catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

const Get_Shopping_listAR_handler={
   
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest'
            && request.intent.name === 'Get_shoppinglistAR_intent';
    },  
     async handle(handlerInput) {
          let speakOutput = '';
        const per = handlerInput.t('PERMISSION');
        const { serviceClientFactory, responseBuilder } = handlerInput;  
    try {  
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
        const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
       await axios.post('https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/insertshoplistmail?mail='+profileEmail)
        const url = 'https://4vffkmqvkb.execute-api.us-west-2.amazonaws.com/dev/getallshoplistar?shoppingListName='+profileEmail;
        await axios.get(url)
        .then(response => {
                var text = "";
                for (let i = 0, len = response.data.length; i < len; i++) {
                    text += response.data[i] ;
                    if (i !== len -1)
                        text += ",";
                }
                if(text===""){speakOutput='لا يوجد مكونات في لائحة التسوق'}
              
               else{speakOutput = ' تفضل! هذه لائحة التسوق الخاصة بك. '+text;}
        }) .catch(error => {
            speakOutput = 'Error';
        });
        
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailImageAlignment": "right",
                "imageScale": "best-fill",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "primaryText": speakOutput,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "imageSource": "https://fantabulosity.com/wp-content/uploads/2020/10/Grocery-List-1.png"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
    }
         else{
             return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
     }
catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
};

//Alexa built-in handlers////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const speakOutput = handlerInput.t('WELCOME_MSG');
        const { serviceClientFactory, responseBuilder } = handlerInput;
        const per = handlerInput.t('PERMISSION')
    try {  
     const upsServiceClient = serviceClientFactory.getUpsServiceClient();  
     const profileEmail = await upsServiceClient.getProfileEmail(); 
      if (!profileEmail) {  
      const noEmailResponse = `It looks like you are not having an email set. You can set your email from the companion app.`  
                         return responseBuilder  
                      .speak(noEmailResponse)  
                      .getResponse();  }
    return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
     catch (error) {  
      console.log(JSON.stringify(error));  
      if (error.statusCode === 403) {  
        return responseBuilder  
        .speak(per)  
        .withAskForPermissionsConsentCard([EMAIL_PERMISSION])  
        .getResponse();  
      }  
      console.log(JSON.stringify(error));  
      const response = responseBuilder.speak(per).getResponse();  
      return response;  
    }  }
     
}; 
    


const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELLO_MSG');
        const rep = handlerInput.t('HELLO_RE')
        
        const image_link = 'https://foodtech-files.s3-eu-west-2.amazonaws.com/7859f23d556bd79946d0c546d497e3122b6589d9950737d639f549d58b82359e'
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "settings": {},
    "theme": "dark",
    "import": [],
    "resources": [],
    "styles": {},
    "onMount": [],
    "graphics": {},
    "commands": {},
    "layouts": {},
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "Image",
                "source": image_link,
                "scale": "fill",
                "width": 1000,
                "height": 800  
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(rep)
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
  }
    else{
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(rep)
            .getResponse();
    }
        
    }
};

const THANKSIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ThanksIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('THANKS_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG_homecook');
        const rep = handlerInput.t('HELLO_RE')
        const header = handlerInput.t('HELP_QU')
        const word = handlerInput.t('HELP_WORD')
        const recom = handlerInput.t('RECOM')
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        var image = {
    "type": "APL",
    "version": "1.8",
    "license": "Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.\nSPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0\nLicensed under the Amazon Software License  http://aws.amazon.com/asl/",
    "import": [
        {
            "name": "alexa-layouts",
            "version": "1.5.0"
        }
    ],
    "mainTemplate": {
        "parameters": [
            "payload"
        ],
        "items": [
            {
                "type": "AlexaDetail",
                "detailType": "location",
                "headerTitle": "Recipe",
                "headerBackButton": true,
                "headerAttributionImage": null,
                "imageScale": "best-fit",
                "imageAspectRatio": "square",
                "imageAlignment": "right",
                "imageSource": '',
                "primaryText": header,
                "ratingSlotMode": "multiple",
                "locationText": word,
                "secondaryText":recom,
                "backgroundImageSource": "https://mcdn.wallpapersafari.com/medium/32/54/hn3Wf6.jpeg",
                "theme": "dark",
                "detailImageAlignment": "end",
                "backgroundScale": "best-fill",
                "id": "plantDetail"
            }
        ]
    }
};
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(rep)
            .addDirective({
             type: 'Alexa.Presentation.APL.RenderDocument',
             document: image,
             dataSources:{}
            })
            .getResponse();
  }
    else{
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(rep)
            .getResponse();
    }
        
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
// this request interceptor will bind a transaltion function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput){
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t)=> {
            handlerInput.t = (...args)=> t(...args);
        });
    }
};


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        Recommendish_enHandler,
        Recommendish_arHandler,
        Ingredient_enhandler,
         Ingredient_arhandler,
      Recommendweather_enHandler,
      Recommenddiet_enHandler,
      Recommendweather_arHandler,
      Recommenddiet_arHandler,
      Recommendtimeofday_enHandler,
      Recommendtimeofday_arHandler,
      Insert_ing_ENhandler,
      Insert_ing_ARhandler,
      delete_ing_ENhandler,
      delete_ing_ARhandler,
      check_missingENhandler,
      check_missingARhandler,
      check_available_ingEN_handler,
      check_available_ingAR_handler,
      Get_FridgeEN_handler,
      Get_FridgeAR_handler,
      Addshoppig_ing_ENhandler,
      Addshoppig_ing_ARhandler,
      deleteshopping_ing_ENhandler,
      deleteshopping_ing_ARhandler,
       Get_Shopping_listEN_handler,
       Get_Shopping_listAR_handler,
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,)
        .addRequestInterceptors(LocalisationRequestInterceptor)
    .addErrorHandlers(ErrorHandler)  
  .withApiClient(new Alexa.DefaultApiClient())  
  .lambda();
