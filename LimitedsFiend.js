// Web scraper for Roblox accounts holding limiteds // 

/*
MIT License

Copyright (c) 2024 Mizosu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



// CONFIGURATION //

// your discord webhook here
    const DISCORD_WEBHOOK = ""
// the name the webhook will use
    const WEBHOOK_NAME = "LimitedsFiend"
// url here for the profile pic of your webhook
    const WEBHOOK_PFP = "https://tr.rbxcdn.com/52ced757b04ddd3c0bab8b6ef7343175/420/420/Hat/Png"
// hex code (including pound symbol) for the color of success
    const SUCCESS_COLOR = "#a6e3a1"
// hex code (includnig pound sybmol) for the color of banned
    const BANNED_COLOR  = "#f38ba8"

// END OF CONFIGURATION // 



const args = process.argv
const readline = require('readline')
const { WebhookClient, EmbedBuilder } = require('discord.js')
const webhookClient = new WebhookClient({ url: DISCORD_WEBHOOK })

let accountIdRange


function getRandomBetween(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.question('Input an account ID range:\n(Example: 10000000-20000000)\n\n> ', (input) => {
    accountIdRange = input.split("-").map(part => parseInt(part))
    rl.close()

    if (args[2] === "x") {
        searchInventoryForLimiteds()
    } else {
        const itemIDs = args.slice(2).map(arg => parseInt(arg))
        searchInventoryForItem(itemIDs)
    }
})



async function searchInventoryForItem(itemIDs) {
setInterval(async () => {
    let accountID = getRandomBetween(accountIdRange[0], accountIdRange[1])

    itemIDs.forEach(async itemID => {
        let response = await fetch(`https://inventory.roblox.com/v1/users/${accountID}/items/0/${itemID}/is-owned`)
        let result = await response.json()
        if (result === true) {
            console.log(`User ${accountID}\n    ITEM FOUND FOR ${itemID}`)
            let userInfoResponse = await fetch(`https://users.roblox.com/v1/users/${accountID}`)
            let userInfo = await userInfoResponse.json()
            let userName = userInfo.name
            let itemInfoResponse = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${itemID}&returnPolicy=PlaceHolder&size=110x110&format=Png&isCircular=false`)
            let itemInfo = await itemInfoResponse.json()
            let itemImage = itemInfo.data[0].imageUrl
            const embed = new EmbedBuilder()
                .setTitle(userName)
                .setDescription(`User ${userName} was found with item ${itemID}\n\n[Profile link](https://www.roblox.com/users/${accountID}/profile)\n[Item Link](https://www.roblox.com/catalog/${itemID}/)`)
                .setColor('#f5c2e7')
                .setImage(itemImage)
                .setTimestamp()
            let message = `@here`
            webhookClient.send({
                content: message,
                username: WEBHOOK_NAME,
                avatarURL: WEBHOOK_PFP,
                embeds: [embed]
            })
        } else {
            console.log(`User ${accountID} Item ${itemID}\n    No item :(`)
        }
    })
}, 1000);
}

async function searchInventoryForLimiteds() {
setInterval(async () => {
    let accountID = getRandomBetween(accountIdRange[0], accountIdRange[1])
    let userInvInfoResponse = await fetch(`https://rblx.trade/api/v3/users/${accountID}/inventory/collectibles?doRefresh=false`)
    let userInvInfo = await userInvInfoResponse.json()
    if (userInvInfo.status === "Public") {
        let userInfoResponse = await fetch(`https://rblx.trade/api/v2/users/${accountID}/info`)
        let userInfo = await userInfoResponse.json()
        let userName = userInfo.username
        let isDeleted = userInfo.isDeleted
        let accountRap = userInfo.accountRAP
        let accountValue = userInfo.accountValue
        let userPFPResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${accountID}&size=100x100&format=Png&isCircular=false`)
        let userPFPJson = await userPFPResponse.json()
        let userPFP = userPFPJson.data[0].imageUrl
        let msgcolor
        let embedMessage = ""
        if (isDeleted === true) {
            msgcolor = BANNED_COLOR
            embedMessage = embedMessage + "**! DELETED USER !**\n\n"
        } else {
            msgcolor = SUCCESS_COLOR
        }
        let limitedCount = 0
        let limitedsString = ""
        for (let limited of userInvInfo.assets) {
            let itemID = limited.assetId
            limitedCount += 1
            let itemInfoResponse = await fetch(`https://rblx.trade/api/v2/catalog/${itemID}/info`)
            let itemInfo = await itemInfoResponse.json()
            let itemName = itemInfo.name
            let itemRap = itemInfo.rap
            let itemValue = itemInfo.value
            limitedsString += `[${itemName}](https://www.roblox.com/catalog/${itemID})\nRAP: ${itemRap}\nValue: ${itemValue}\n\n`
        }
        if (limitedCount > 0) {
            console.log(`User ${accountID} has value:\n    Account RAP: ${accountRap}\n    Account Value: ${accountValue}`)
            embedMessage += `Account RAP: ${accountRap}\nAccount Value: ${accountValue}\n\n`
            embedMessage += `**Links:**\n[    Roblox](https://www.roblox.com/users/${accountID}/profile)\n[    Rolimons](https://www.rolimons.com/player/${accountID})\n[    RblxTrade](https://rblx.trade/u/${userName})\n\n`
            embedMessage += `**Limiteds** ***(${limitedCount})*** **:**\n${limitedsString}`
            console.log(userPFP)
            const embed = new EmbedBuilder()
                .setTitle(userName)
                .setDescription(embedMessage)
                .setColor(msgcolor)
                .setImage(userPFP)
                .setTimestamp()
            let message = `@here`
            webhookClient.send({
                content: message,
                username: WEBHOOK_NAME,
                avatarURL: WEBHOOK_PFP,
                embeds: [embed]
            })
        } else {
            console.log(`User ${accountID} has no value. :(`)
        }
        
    } else {
        console.log(`Account ${accountID} is not public.`)
    }
}, 1000);
}

