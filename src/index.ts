import { Contract, BigNumber, providers, Wallet } from 'ethers'
import { ethers } from 'ethers'
require('dotenv').config()
const Discord = require('discord.js')

const CHAIN_ID = 1 // Mainnet
// const CHAIN_ID = 5 // Goerli
const provider = new providers.InfuraProvider(CHAIN_ID, process.env.INFURA_API_KEY)
// const provider = providers.getDefaultProvider(providers.getNetwork(CHAIN_ID))

const PUBLIC_KEY = '0xB633FEb30D5D86C5E72432Fa3cFB6BEa1e05F8A7' // own Wallet
const genericErc20Abi = require('../abi/erc20.abi.json')

// 1. Get from Metamask
const ETHEREUM_SMART_CONTRACT = '0xf34b1db61aca1a371fe97bad2606c9f534fb9d7d' // ARBISMART TOKEN
// 2. Get from Metamask

main()

async function main() {
  await checkBalance()
}

async function checkBalance() {
  console.log('Start')
  // run every block
  provider.on('block', async (blockNumber: number) => {
    console.log('blockNumber: ' + blockNumber)

    // every second block
    if (blockNumber % 2) {
      let balance = await getBalance()
      console.log('RBIS: ' + balance)

      if (balance > 0) {
        // Send to Discord
        await sendDiscord('LETS GO! RBIS:' + balance.toString())
        process.exit(0)
      }
    }
  })
}

async function getBalance() {
  const contract = new Contract(ETHEREUM_SMART_CONTRACT, genericErc20Abi, provider)
  const balance = await contract.balanceOf(PUBLIC_KEY)

  // get in correct decimal
  let denom = BigNumber.from(10).pow(18)
  let balanceFormatted: number = balance.div(denom).toNumber()
  return balanceFormatted
}

// Setup Discord
const webhookClient = new Discord.WebhookClient(process.env.DISCORD_CHANNELID, process.env.DISCORD_TOKEN)
const embed = new Discord.MessageEmbed().setTitle('Arbismart Bot').setColor('#0099ff')

async function sendDiscord(text: string) {
  await webhookClient.send(text, {
    username: 'Arbismart',
    avatarURL: 'https://i.imgur.com/wSTFkRM.png',
    embeds: [embed]
  })
}
