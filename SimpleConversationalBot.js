const config = require('./config.json');
const botId = Object.keys(config.credentials);
const botName = botId.map(id => config.credentials[id].botName);
var sdk = require("./lib/sdk");
//const esDIDs = ['8776', '8772'] 

module.exports = {
    botId: botId,
    botName: botName,

    on_user_message: function (requestId, data, callback) {
        let bus = data.context.session.BotUserSession;
        var userSession = data.context.session.UserSession;
        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4");
        // console.log(JSON.stringify(data));
        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4");
        // console.log("------------------------------------------");
        // console.log(data.context.session.UserSession.dialedNumber);
        // console.log(data.context.session.UserSession);
        // console.log(data.channel.botEvent);
        // console.log(data.context.session.BotUserSession.setLanguageOverrideFlag);
        // console.log("**************",bus.channels[0].type, bus.channels[0].preferredChannelForResponse , bus.setLanguageOverrideFlag);
        // console.log("------------------------------------------");


        if (data.context.session.BotUserSession.setLanguageOverrideFlag === true || data.channel.botEvent === 'ON_CONNECT_EVENT') {
            console.log("19");
            data.metaInfo = { setBotLanguage: 'en' };
        }

        //------------------SAT VOICE START------------------------------------------------------------------ 
        if (data.context.session.BotUserSession.channels[0].type == 'smartassist' &&
            (data.context.session.UserSession.dialedNumber == '5670' || data.context.session.UserSession.dialedNumber == '5672')) {
            data.metaInfo = { setBotLanguage: 'en' };
            data.context.session.BotUserSession.selectedLanguage = 'en';
            data.context.session.BotUserSession.setLanguageOverrideFlag = false;
            data.context.session.BotUserSession.isSpeciality = false

        } else if (data.context.session.BotUserSession.channels[0].type == 'smartassist' &&
            (data.context.session.UserSession.dialedNumber == '5671' || data.context.session.UserSession.dialedNumber === '5673')) {
            data.metaInfo = { setBotLanguage: 'es' };
            data.context.session.BotUserSession.selectedLanguage = 'es';
            data.context.session.BotUserSession.setLanguageOverrideFlag = false;
            data.context.session.BotUserSession.isSpeciality = false

        } else if ((data.context.session.BotUserSession.channels[0].type === 'smartassist' &&
            (data.context.session.UserSession.dialedNumber == '5674'))) {
            data.metaInfo = { setBotLanguage: 'en' };
            data.context.session.BotUserSession.isSpeciality = true
            data.context.session.BotUserSession.selectedLanguage = 'en';
            data.context.session.BotUserSession.setLanguageOverrideFlag = false;
        } else if ((data.context.session.BotUserSession.channels[0].type === 'smartassist') &&
            (data.context.session.UserSession.dialedNumber == '5675')) {
            data.metaInfo = { setBotLanguage: 'es' };
            data.context.session.BotUserSession.isSpeciality = true
            data.context.session.BotUserSession.selectedLanguage = 'es';
            data.context.session.BotUserSession.setLanguageOverrideFlag = false;
        }
        //------------------SAT VOICE END------------------------------------------------------------------

        //------------------WEB START------------------------------------------------------------------ 
        if ((bus.channels[0].type == 'rtm' || bus.channels[0].preferredChannelForResponse == 'rtm') && bus.setLanguageOverrideFlag === true) {

            console.log("57");

            if (data.message !== undefined) {
                console.log("60");
                if (data.message.toLowerCase().includes("english") || data.message.toLowerCase().includes("spanish")) {
                    console.log("62");

                    var lang = {
                        "english": "en",
                        "spanish": "es",
                        "english.": "en",
                        "spanish.": "es",
                    }
                    data.metaInfo = {
                        setBotLanguage: lang[data.message.toLowerCase()],
                        'nlMeta': {
                            'intent': 'SATWelcomeDialog',
                            'isRefresh': true
                        }
                    };
                    data.context.session.BotUserSession.selectedLanguage = lang[data.message.toLowerCase()]

                }else{
                    console.log("============================ 80 I AM HTTMAN =======================",);
                }
            }
        }
        //------------------WEB END------------------------------------------------------------------ 

        //------------------Agent Mode Exit START------------------------------------------------------------------
        if (data && data.agent_transfer && (data.message === "####" || data.message === "abandonar" || data.message === "quit" || data.message === "stop chat")) {
            data.message = "Ok, exiting the agent mode.";
            sdk.clearAgentSession(data);
            return sdk.sendUserMessage(data);

        }

        if (data.agent_transfer) {
            return sdk.sendBotMessage(data, callback)
        }
        //------------------Agent Mode Exit END------------------------------------------------------------------
        return sdk.sendBotMessage(data, callback);

    },
    on_bot_message: function (requestId, data, callback) {
        console.log(new Date(), "ON_BOT_MESSAGE : ", data.message);
        console.log("Language override Flag value on BOT EVENT::", data.context.session.BotUserSession.setLanguageOverrideFlag)
        console.log("caller number on BOT EVENT:", data.context.session.UserSession.Caller)
        console.log("dialed number on BOT EVENT:", data.context.session.UserSession.dialedNumber)

        return sdk.sendUserMessage(data, callback);
    },
    on_agent_transfer: function (requestId, data, callback) {
        return callback(null, data);
    },
    on_event: function (requestId, data, callback) {
        return callback(null, data);
    },
    on_alert: function (requestId, data, callback) {
        return sdk.sendAlertMessage(data, callback);
    }

};


