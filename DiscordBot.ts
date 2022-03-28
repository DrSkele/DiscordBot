import DiscordJS, { Intents, Message } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const BotCommands = {
    Random : '!random',
    Info : '!info'
} as const

const CommandsDescription = {
    Random : '!random <elements> / <elements> : even number of elements'
} as const

const botClient = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

botClient.on('ready', () => {
    console.log('The bot is ready')
})

botClient.on('messageCreate', (message) => {

    console.log(message.content)

    //prevent self-answering
    if(message.author?.id === botClient.user?.id)
    {
        return
    }
    
    let messageList = message.content.split(' ').filter(x => x != '')
    
    const firstElement = messageList.shift()

    //check user message contains botcommands or botcommands-like string.
    //the botcommands-like string will be used to inform the correct form of the command to user.
    let matchNumber = Object.values(BotCommands).findIndex(command => firstElement?.includes(command))

    console.log(matchNumber)
    //if there is match
    if(matchNumber >= 0)
    {
        //a command that the user has input
        const userCommand = Object.values(BotCommands)[matchNumber]
        //name of the command
        const commandName = Object.keys(BotCommands)[matchNumber]

        //if the user command exactly matches with the command
        if(userCommand === firstElement)
        {
            let replyMessage

            switch(userCommand)
            {
                case BotCommands.Random :{
                    if(messageList.length % 2 == 0)
                    {
                        shuffle(messageList)
                        console.log(messageList)
            
                        const firstTeam = messageList.slice(0, messageList.length/2).join(' ')
                        const secondTeam = messageList.slice(messageList.length/2, messageList.length).join(' ')

                        replyMessage = '1 : ' + firstTeam + '\n2 : ' + secondTeam
                    }
                    else
                    {
                        replyMessage = 'The elements must be multiple of two to be distributed evenly among two teams'
                    }
                }
            }

            message.reply({
                content : replyMessage
            })
        }
        else
        {
            message.reply({
                content: getCommandDescription(commandName)
            })
        }
    }
})

botClient.login(process.env.TOKEN)

function shuffle(array: any[]) 
{
    for(let i = array.length - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

function getCommandDescription(botCommand : string) : string
{
    const descripton = Object.keys(CommandsDescription).find(command => botCommand === command)

    if(descripton != undefined)
    {
        return descripton
    }
    else
    {
        return Object.values(CommandsDescription).join('\n')
    }
}