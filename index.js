const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const LUARMOR_BOT_ID = "1429900417872957522";
const WHITELIST_ROLE_ID = "1284904586259202119";

client.once("ready", () => {
  console.log(`listener online: ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (!msg.guild) return;
  if (
    msg.author.id === LUARMOR_BOT_ID &&
    msg.channel.name.startsWith("ticket-") &&
    msg.content.includes("You have been whitelisted")
  ) {
    const user = msg.mentions.users.first();
    if (!user) return;

    const member = await msg.guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    if (!member.roles.cache.has(WHITELIST_ROLE_ID)) {
      await member.roles.add(WHITELIST_ROLE_ID);
      console.log(`whitelisted ${user.tag}`);
    }
  }
});

// keep alive for render/railway
const http = require("http");
http.createServer((_, res) => res.end("ok")).listen(process.env.PORT || 3000);

client.login(process.env.LISTENER_TOKEN);
