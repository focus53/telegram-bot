/* eslint-disable no-console */
require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    `Wellcome ${ctx.message.from.first_name}! \n This BOT will show you the situation about COVID19. \n Please type /help to see available country.`,
    Markup.keyboard([
      ['Ukraine', 'US', 'Canada', 'Poland'],
      ['Russia', 'Germany', 'Italy', 'UK'],
    ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const flag = await ctx.replyWithPhoto(data[0][0].flag);
    const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Выздоровело: ${data[0][0].recovered}`;
    ctx.reply(`${(flag, formatData)}`);
  } catch (err) {
    console.log('Error');
    ctx.reply(`Incorect input! Counry '${ctx.message.text}' is not avalible! Try once more!`);
  }
});

bot.launch();
console.log('BOT started');
