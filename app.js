const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");

client.on("message", function(message)
{
    if (message.channel.type === "text")
    {
        let command = message.content.split(" ");
        let prefix = command[0];
        let suffix = command[1];

        switch (prefix)
        {
            case "%music.help":
            
                let output = "Commands:\n\n%music.help - to receive this message\n%music.play \"YouTube video link\" - to start playing a video (don't include the double quotes!)\n%music.stop - to completely stop playing the video\n" +
                             "%music.pause - to pause the video that's currently playing\n%music.resume - to resume the video you paused\n\n" + message.member + " here are the commands " +
                             "for the bot.";
                message.member.send(output);
                message.delete(1);
                break;

            case "%music.play":

                if (message.member.voiceChannel && suffix !== undefined)
                {
                    if (ytdl.validateURL(suffix))
                    {
                        if (message.guild.me.voiceChannel)
                        {
                            message.guild.me.voiceChannel.leave();
                        }

                        ytdl.getInfo(suffix, function(error, info)
                        {
                            if (!error)
                            {
                                if (info.pltype !== "contentlive")
                                {
                                    if (info.status === "ok")
                                    {
                                        message.member.voiceChannel.join();
                                        let song = ytdl(suffix, {filter: "audioonly"});

                                        setTimeout(function()
                                        {
                                            message.member.voiceChannel.connection.playStream(song, {passes: 5, bitrate: "auto"});
                                            message.delete(1);

                                            message.member.voiceChannel.connection.dispatcher.on("end", function()
                                            {
                                                message.member.voiceChannel.leave();
                                            });
                                        },
                                        2500);
                                    }
                                    else
                                    {
                                        message.channel.send("Something went wrong " + message.member);
                                    }
                                }
                                else
                                {
                                    message.channel.send("Cannot play livestreams " + message.member);
                                    message.delete(1);
                                }
                            }
                        });
                    }
                }

                break;

            case "%music.stop":

                if (message.member.voiceChannel.connection.dispatcher && suffix === undefined)
                {
                    message.member.voiceChannel.connection.dispatcher.end();
                    message.member.voiceChannel.leave();
                    message.delete(1);
                }

                break;

            case "%music.pause":

                if (message.member.voiceChannel.connection.dispatcher && suffix === undefined)
                {
                    message.guild.me.voiceChannel.connection.dispatcher.pause();
                    message.delete(1);
                }

                break;

            case "%music.resume":

                if (message.member.voiceChannel.connection.dispatcher && suffix === undefined)
                {
                    message.member.voiceChannel.connection.dispatcher.resume();
                    message.delete(1);
                }

                break;
        }
    }
});

client.login("memesxd");