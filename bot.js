require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  ChannelType
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
});

client.on("guildMemberAdd", async member => {
  const welcomeChannel = member.guild.channels.cache.find(
    c => c.name === "welcome"
  );

  const memberRole = member.guild.roles.cache.find(
    r => r.name === "Member"
  );

  if (memberRole) {
    await member.roles.add(memberRole).catch(() => {});
  }

  if (welcomeChannel) {
    welcomeChannel.send(
      `❄️ Welcome ${member} to Roblox Freeze Tag!`
    );
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const guild = interaction.guild;

  if (interaction.commandName === "ping") {
    return interaction.reply("🏓 Pong!");
  }

  if (interaction.commandName === "serverinfo") {
    return interaction.reply({
      content:
`📊 Server Information

Name: ${guild.name}
Members: ${guild.memberCount}
Owner: <@${guild.ownerId}>`
    });
  }

  if (interaction.commandName === "setup") {

    const existing = guild.channels.cache.find(
      c => c.name === "welcome"
    );

    if (existing) {
      return interaction.reply({
        content: "⚠️ Server already appears to be configured.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: "❄️ Creating Roblox Freeze Tag server...",
      ephemeral: true
    });

    try {

      // Roles
      const roles = [
        "Owner",
        "Developer",
        "Administrator",
        "Moderator",
        "Event Host",
        "Content Creator",
        "Verified Player",
        "Member"
      ];

      for (const role of roles) {
        if (!guild.roles.cache.find(r => r.name === role)) {
          await guild.roles.create({ name: role });
        }
      }

      // Categories
      const info = await guild.channels.create({
        name: "📢 INFORMATION",
        type: ChannelType.GuildCategory
      });

      const game = await guild.channels.create({
        name: "❄️ FREEZE TAG",
        type: ChannelType.GuildCategory
      });

      const community = await guild.channels.create({
        name: "💬 COMMUNITY",
        type: ChannelType.GuildCategory
      });

      const events = await guild.channels.create({
        name: "🏆 EVENTS",
        type: ChannelType.GuildCategory
      });

      const voice = await guild.channels.create({
        name: "🎙 VOICE",
        type: ChannelType.GuildCategory
      });

      // Information
      await guild.channels.create({
        name: "welcome",
        type: ChannelType.GuildText,
        parent: info.id
      });

      await guild.channels.create({
        name: "rules",
        type: ChannelType.GuildText,
        parent: info.id
      });

      await guild.channels.create({
        name: "announcements",
        type: ChannelType.GuildText,
        parent: info.id
      });

      await guild.channels.create({
        name: "updates",
        type: ChannelType.GuildText,
        parent: info.id
      });

      // Freeze Tag
      await guild.channels.create({
        name: "game-news",
        type: ChannelType.GuildText,
        parent: game.id
      });

      await guild.channels.create({
        name: "suggestions",
        type: ChannelType.GuildText,
        parent: game.id
      });

      await guild.channels.create({
        name: "bug-reports",
        type: ChannelType.GuildText,
        parent: game.id
      });

      await guild.channels.create({
        name: "sneak-peeks",
        type: ChannelType.GuildText,
        parent: game.id
      });

      // Community
      await guild.channels.create({
        name: "general",
        type: ChannelType.GuildText,
        parent: community.id
      });

      await guild.channels.create({
        name: "media",
        type: ChannelType.GuildText,
        parent: community.id
      });

      await guild.channels.create({
        name: "off-topic",
        type: ChannelType.GuildText,
        parent: community.id
      });

      // Events
      await guild.channels.create({
        name: "events",
        type: ChannelType.GuildText,
        parent: events.id
      });

      await guild.channels.create({
        name: "giveaways",
        type: ChannelType.GuildText,
        parent: events.id
      });

      // Voice
      await guild.channels.create({
        name: "General VC",
        type: ChannelType.GuildVoice,
        parent: voice.id
      });

      await guild.channels.create({
        name: "Matchmaking VC",
        type: ChannelType.GuildVoice,
        parent: voice.id
      });

      await guild.channels.create({
        name: "Event VC",
        type: ChannelType.GuildVoice,
        parent: voice.id
      });

      console.log("Setup complete.");

    } catch (error) {
      console.error(error);
    }
  }
});

client.login(process.env.TOKEN);