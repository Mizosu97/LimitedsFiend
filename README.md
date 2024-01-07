# LimitedsFiend
JavaScript web scraper to find Roblox accounts with Limiteds or specific items

LimitedsFiend can easily find Roblox accounts with Limiteds or desired items. LimitedsFiend will send the results directly to you via a Discord webhook.

## Setup
(If you don't know anything about Git or JS, you may have to research some stuff on your own. I will not hold your hand through the installation process.)
1. Install [NodeJS](https://nodejs.org/en) onto your system.
2. Install [Git](https://git-scm.com/) onto your system.
3. Download this Github repository with `git clone https://github.com/Mizosu97/LimitedsFiend`.
4. Change directory into the newly downloaded repository.
5. Install discord.js with `npm install --save discord.js`
6. Open the `LimitedsFiend.js` file, and enter your Discord webhook inside the quotes at line 32.

## Usage
Make sure your working directory is where the `LimitedsFiend.js` file is located.

To search for accounts with Limiteds:
1. `node LimitedsFiend.js x`
2. Input the account ID range in the given prompt. For example, if you want to search for accounts whos userID is between 1000 and 2000, you would enter `1000-2000`

To search for accounts with a specific item:
1. `node LimitedsFiend.js <itemID1> <itemID2> <etc>` - You can input as many item IDs as you want as arguments.
   EXAMPLE: `node LimitedsFiend.js 1365767 250395631 42211680 1285307`  
2. Input the account ID range in the given prompt. For example, if you want to search for accounts whos userID is between 1000 and 2000, you would enter `1000-2000`
