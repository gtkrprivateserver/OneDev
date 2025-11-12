import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("DISCORD_BOT_TOKEN")

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ Bot aktif sebagai {bot.user}")

@bot.event
async def on_interaction(interaction: discord.Interaction):
    if not interaction.data:
        return

    custom_id = interaction.data.get("custom_id")

    if custom_id == "approve_order":
        await interaction.response.send_message("✅ Congratulations, your process was successful!", ephemeral=True)
    elif custom_id == "reject_order":
        await interaction.response.send_message("❌ Your process failed.", ephemeral=True)

bot.run(TOKEN)