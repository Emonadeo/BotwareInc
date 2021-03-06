const discord = require('discord.js');

const feed = require('../../bot/feed');

const color = 0x000000; // Black

exports.convert = function(data, feed) {
    const item = new discord.RichEmbed()
        .setTitle(data['EntryTitle'])
        .setURL(data['EntryUrl']);

    if(feed) {
        item.setColor(color);
        item.setFooter("Steam Announcement", 'https://i.imgur.com/hw7MOpR.png');
    } else {
        item.setFooter("Changelog")
    }


    // First Paragraph
    const desc = data['EntryContent'];
    const descIndex = desc.match(/<br>/).index;
    if(descIndex !== 0) {
        item.setDescription(desc.substring(0, descIndex));
    }

    // Extract Image
    const img = data['EntryContent'].match(/https?:\/\/steamcdn-a\.akamaihd\.net\/steamcommunity\/public\/images\/clans\/8600182\/.*\.(jpg|png)/);
    if(img != null) {
        item.setImage(img[0]);
    }

    // Timestamp
    let date_str = data['EntryPublished'];
    date_str = date_str.substring(0, date_str.length - 2) + ' ' + date_str.substring(date_str.length - 2);
    date_str = date_str.split('at').join();
    item.setTimestamp(new Date(date_str));

    return item;
};

exports.serve = function(req, res) {
    // Post Item
    feed.post(feed.channels.steam, this.convert(req.data, true));

    res.end();
};
