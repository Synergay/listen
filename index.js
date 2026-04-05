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
const TICKET_BOT_ID = "710034409214181396";
const RESELLER_ROLE_ID = "1489067802047418669";

client.once("ready", () => {
  console.log(`listener online: ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (!msg.guild) return;

  // luarmor whitelist
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
      await msg.channel.send(`${user} You've been given <@&${WHITELIST_ROLE_ID}>`);
      console.log(`whitelisted ${user.tag}`);
    }
  }

  // ticket bot - purchase robux perms
  if (msg.channel.name.startsWith("ticket-") && msg.author.id === TICKET_BOT_ID) {
    const embed = msg.embeds[0];
    if (!embed) return;
    const desc = embed.description || "";

    if (desc.includes("Purchase Robux")) {
      try {
        await msg.channel.permissionOverwrites.edit(RESELLER_ROLE_ID, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
        });
        await msg.channel.send(`<@&${RESELLER_ROLE_ID}> New Robux ticket!`);
      } catch (err) {
        console.error("perm overwrite failed:", err);
      }
    }

    if (desc.includes("jay745934@gmail.com") && desc.includes("revolut.me/jay0lypl")) {
      try {
        await msg.channel.send("jay745934@gmail.com");
        await msg.channel.send("copy above message if paypal");
      } catch (err) {
        console.error("paypal msg failed:", err);
      }
    }
  }
});

const http = require("http");
http.createServer((_, res) => res.end("ok")).listen(process.env.PORT || 3000);

client.login(process.env.LISTENER_TOKEN);
