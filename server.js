// server.js

const express = require('express');
const path = require('path');
const { sequelize, Character, Defense, Offense, Battle } = require('./models');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// データベースの同期
sequelize.sync({ force: true })
  .then(() => console.log('データベースと同期しました。'))
  .catch(err => console.error('データベースとの同期に失敗しました:', err));

// 戦績データの登録エンドポイント
app.post('/api/add-battle', async (req, res) => {
  try {
    console.log('受信したリクエストボディ:', req.body);
    const { defenseTeam, offenseTeam, result } = req.body;

    // 防衛編成の取得または作成
    let defense = await Defense.findOne({ where: defenseTeam });
    if (!defense) {
      defense = await Defense.create(defenseTeam);
      console.log('新しい防衛編成を作成しました:', defense);

    }else{
        console.log('既存の防衛編成を取得しました:', defense);
    }

    // 攻撃編成の取得または作成
    let offense = await Offense.findOne({ where: offenseTeam });
    if (!offense) {
      offense = await Offense.create(offenseTeam);
      console.log('新しい攻撃編成を作成しました:', offense);
    } else {
      console.log('既存の攻撃編成を取得しました:', offense);
    }

    // 戦闘データの保存
    const battle = await Battle.create({
      result,
      DefenseId: defense.id,
      OffenseId: offense.id,
    });
    console.log('新しい戦闘データを保存しました:', battle);

    res.status(200).json({ message: '戦闘データを保存しました。' });
  } catch (err) {
    console.error(err);
    console.error('戦績データの登録中にエラーが発生しました:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
});

// 防衛編成の検索エンドポイント
app.post('/api/search-battle', async (req, res) => {
  try {
    console.log('受信したリクエストボディ:', req.body);

    const { defenseTeam } = req.body;

    // 防衛編成の取得
    const defense = await Defense.findOne({ where: defenseTeam });
    if (!defense) {
        console.log('該当する防衛編成が見つかりません。');
      return res.status(404).json({ message: '該当する防衛編成が見つかりません。' });
    }else {
        console.log('防衛編成を取得しました:', defense);
      }

    // 該当する戦闘データの取得
    const battles = await Battle.findAll({
      where: { DefenseId: defense.id },
      include: [Offense],
    });
    console.log('取得した戦闘データの数:', battles.length);

    if (battles.length === 0) {
        console.log('該当する戦闘データがありません。');
      return res.status(200).json({ offenses: [] });
    }

    // 攻撃編成ごとの戦績を集計
    const offenseStats = {};

    battles.forEach(battle => {
      const offenseKey = `${battle.Offense.character1},${battle.Offense.character2},${battle.Offense.character3}`;
      if (!offenseStats[offenseKey]) {
        offenseStats[offenseKey] = {
          offenseTeam: {
            character1: battle.Offense.character1,
            character2: battle.Offense.character2,
            character3: battle.Offense.character3,
          },
          wins: 0,
          losses: 0,
        };
      }
      if (battle.result === 'win') {
        offenseStats[offenseKey].wins += 1;
      } else {
        offenseStats[offenseKey].losses += 1;
      }
    });
    console.log('攻撃編成ごとの戦績:', offenseStats);

    // 勝率の計算とデータの整形
    const offenses = Object.values(offenseStats).map(stat => {
      const total = stat.wins + stat.losses;
      const winRate = (stat.wins / total) * 100;
      return {
        ...stat.offenseTeam,
        wins: stat.wins,
        losses: stat.losses,
        winRate: winRate.toFixed(2),
      };
    });

    // 勝率でソート
    offenses.sort((a, b) => b.winRate - a.winRate);

    res.status(200).json({ offenses });
  } catch (err) {
    console.error(err);
    console.error('防衛編成の検索中にエラーが発生しました:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました。`);
});
