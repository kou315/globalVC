/**
DiscordID:696600519283572766
©X / KOU00000
*/
//グローバルボイスチャットの名前
const gvcName = "グローバルボイスチャット";
const token = "あなたのbotのtoken"

const discord = require("discord.js");
const client = new discord.Client();
client.login(token);

//音データ作成用
const {Readable}=require('stream');

//音の流れない音データを作る。
class Silence extends Readable{
  _read(){this.push(Buffer.from([0xF8,0xFF,0xFE]))}
};
/**
 * discord の client が ready 状態になってないと、
 * client.channels..... を行えない。
*/
client.on("ready",()=>{
console.info("ready...")
client.channels.cache.filter
//グローバルボイスチャットが変数gvcNameと同じチャンネルを抽出
(ch=>ch.type === "voice" && ch.name === gvcName)
.forEach(ch=>
{
ch.join()//vcに参加
.then(conn => {//connに参加したvcのデータが含まれる。

      //音の流れない音データを配信 
      //(最初にbotがVCで音データを流さないと音の取得ができないため。)
      conn.play(new Silence,{ type: 'opus' });
      let receiver = conn.receiver;
      //だれかがVCで発言したら。
      conn.on('speaking', (user, speaking) => {
        //botだったら放送しない。
        if(user.bot)return; 
        //音を取得
        const UserVoice = receiver.createStream(user);
        const broadcast = client.voice.createBroadcast();
        //流す音
        broadcast.play(UserVoice,{ type: 'opus' });
    //一斉にbotが接続中のVCに取得した音声を配信。
    for (const connection of client.voice.connections.values()) {
         connection.play(broadcast);
    };
        });
    });
});
});
