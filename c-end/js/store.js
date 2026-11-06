(function (global) {
  'use strict';
  var KEY = 'juan365_frontend_v1';

  function money(n) {
    var x = Number(n || 0);
    var sign = x < 0 ? '-' : '';
    x = Math.abs(x);
    return sign + '₱ ' + x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(ts) {
    var d = ts instanceof Date ? ts : new Date(ts);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  var GAMES = [
    { id: 'g01', name: 'Wild Bounty Showdown', cat: 'Slot', provider: 'PG SOFT', tag: 'hot', art: 'linear-gradient(160deg,#7c3a00,#f4b23a)' },
    { id: 'g02', name: 'Wild Bandito', cat: 'Slot', provider: 'PG SOFT', tag: 'new', art: 'linear-gradient(160deg,#7a1020,#e11)' },
    { id: 'g03', name: 'Jungle Delight', cat: 'Slot', provider: 'PG SOFT', tag: '', art: 'linear-gradient(160deg,#14532d,#4ade80)' },
    { id: 'g04', name: 'Fortune Rabbit', cat: 'Slot', provider: 'PG SOFT', tag: 'new', art: 'linear-gradient(160deg,#9a3412,#fdba74)', maint: true },
    { id: 'g05', name: 'Fortune Ox', cat: 'Slot', provider: 'PG SOFT', tag: 'hot', art: 'linear-gradient(160deg,#1e40af,#93c5fd)' },
    { id: 'g06', name: 'Piggy Gold', cat: 'Slot', provider: 'PG SOFT', tag: 'bonus', art: 'linear-gradient(160deg,#a16207,#fde047)' },
    { id: 'g07', name: 'Tree of Fortune', cat: 'Slot', provider: 'JILI', tag: '', art: 'linear-gradient(160deg,#365314,#a3e635)' },
    { id: 'g08', name: 'Leprechaun Riches', cat: 'Slot', provider: 'PG SOFT', tag: 'hot', art: 'linear-gradient(160deg,#166534,#86efac)' },
    { id: 'g09', name: 'Hip Hop Panda', cat: 'Slot', provider: 'PG SOFT', tag: '', art: 'linear-gradient(160deg,#831843,#f9a8d4)' },
    { id: 'g10', name: 'City Dawgs', cat: 'Slot', provider: 'JILI', tag: 'bonus', art: 'linear-gradient(160deg,#1e3a8a,#60a5fa)' },
    { id: 'g11', name: 'Mega Bingo', cat: 'Bingo', provider: 'JILI', tag: 'hot', art: 'linear-gradient(160deg,#9a3412,#fb923c)' },
    { id: 'g12', name: 'Speed Bingo 75', cat: 'Bingo', provider: 'JILI', tag: 'new', art: 'linear-gradient(160deg,#7c2d12,#fdba74)' },
    { id: 'g13', name: 'Bingo Rush', cat: 'Bingo', provider: 'YELLOW BAT', tag: '', art: 'linear-gradient(160deg,#b45309,#fde68a)' },
    { id: 'g14', name: 'Color Game', cat: 'Perya', provider: 'YELLOW BAT', tag: 'hot', art: 'linear-gradient(160deg,#be123c,#fb7185)' },
    { id: 'g15', name: 'Drop Ball', cat: 'Perya', provider: 'YELLOW BAT', tag: '', art: 'linear-gradient(160deg,#0369a1,#7dd3fc)' },
    { id: 'g16', name: 'Perya Wheel', cat: 'Perya', provider: 'JILI', tag: 'new', art: 'linear-gradient(160deg,#7e22ce,#d8b4fe)' },
    { id: 'g17', name: 'Lightning Baccarat', cat: 'Casino', provider: 'Evolution', tag: 'hot', art: 'linear-gradient(160deg,#111827,#6b7280)' },
    { id: 'g18', name: 'Crazy Time', cat: 'Casino', provider: 'Evolution', tag: 'bonus', art: 'linear-gradient(160deg,#7c2d12,#f59e0b)' },
    { id: 'g19', name: 'Sweet Bonanza CandyLand', cat: 'Casino', provider: 'PRAGMATIC PLAY', tag: 'new', art: 'linear-gradient(160deg,#9d174d,#f9a8d4)' },
    { id: 'g20', name: 'SABA Sports', cat: 'Sports', provider: 'SABA SPORTS', tag: 'hot', art: 'linear-gradient(160deg,#14532d,#22c55e)' },
    { id: 'g21', name: 'Virtual Football', cat: 'Sports', provider: 'SABA SPORTS', tag: '', art: 'linear-gradient(160deg,#1e3a8a,#60a5fa)' },
    { id: 'g22', name: 'Teen Patti', cat: 'Card', provider: 'JILI', tag: 'hot', art: 'linear-gradient(160deg,#7f1d1d,#f87171)' },
    { id: 'g23', name: 'Tongits', cat: 'Card', provider: 'JILI', tag: 'new', art: 'linear-gradient(160deg,#365314,#84cc16)' },
    { id: 'g24', name: 'Pusoy', cat: 'Card', provider: 'JILI', tag: '', art: 'linear-gradient(160deg,#1e3a8a,#93c5fd)' },
    { id: 'g25', name: 'Aviator', cat: 'Arcade', provider: 'SPRIBE', tag: 'hot', art: 'linear-gradient(160deg,#9f1239,#fb7185)' },
    { id: 'g26', name: 'Mines', cat: 'Arcade', provider: 'SPRIBE', tag: '', art: 'linear-gradient(160deg,#334155,#94a3b8)' },
    { id: 'g27', name: 'Plinko', cat: 'Arcade', provider: 'SPRIBE', tag: 'new', art: 'linear-gradient(160deg,#6d28d9,#c4b5fd)' },
    { id: 'g28', name: 'Happy Fishing', cat: 'Fishing', provider: 'JILI', tag: 'hot', art: 'linear-gradient(160deg,#0e7490,#67e8f9)' },
    { id: 'g29', name: 'Dragon Fortune', cat: 'Fishing', provider: 'JILI', tag: '', art: 'linear-gradient(160deg,#1d4ed8,#93c5fd)' },
    { id: 'g30', name: '2D Lotto', cat: 'Numeric', provider: 'JILI', tag: 'hot', art: 'linear-gradient(160deg,#b45309,#fbbf24)' },
    { id: 'g31', name: '3D Lotto', cat: 'Numeric', provider: 'JILI', tag: '', art: 'linear-gradient(160deg,#9a3412,#fdba74)' },
    { id: 'g32', name: 'Bonus Mania', cat: 'Bonus', provider: 'PG SOFT', tag: 'bonus', art: 'linear-gradient(160deg,#c2410c,#fb923c)' },
    { id: 'g33', name: 'Free Spin Hall', cat: 'Bonus', provider: 'JILI', tag: 'hot', art: 'linear-gradient(160deg,#b91c1c,#fca5a5)' }
  ];

  var PROVIDERS = ['JILI', 'Evolution', 'PRAGMATIC PLAY', 'PG SOFT', 'YELLOW BAT', 'SABA SPORTS', 'SPRIBE'];
  var CATS = ['Lobby', 'Bonus', 'Slot', 'Bingo', 'Perya', 'Casino', 'Sports', 'Card', 'Arcade', 'Fishing', 'Numeric'];

  var PROMOS = [
    { id: 'p1', type: 'Weekly Cashback', title: 'Weekly Cashback 25%', desc: 'Get up to 25% cashback every Monday 00:00 (GMT+8).', tag: 'Cashback', tone: 'orange' },
    { id: 'p2', type: 'Rebate', title: 'Betting Rebate up to 1.2%', desc: 'Realtime rebate on valid bets. Claim anytime.', tag: 'Rebate', tone: 'green' },
    { id: 'p3', type: 'Lucky Spin', title: 'Get ₱500 Free', desc: 'Spin once per cycle. Invite friends to unlock withdraw.', tag: 'Lucky Spin', tone: 'pink' },
    { id: 'p4', type: 'Money Rain', title: 'Money Like Rain', desc: 'Grab red packets during the rain window. VIP bonus extra.', tag: 'Money Rain', tone: 'blue' },
    { id: 'p5', type: 'Affiliate', title: 'Earn ₱50,000 Per Day', desc: 'Unlimited referrals. Commission settled every 24 hours.', tag: 'Affiliate', tone: 'purple' },
    { id: 'p6', type: 'First Deposit', title: '50% First Deposit Bonus', desc: 'First deposit ₱500+ unlocks 50% bonus credit.', tag: 'Bonus', tone: 'orange' },
    { id: 'p7', type: 'Daily Tasks', title: 'Daily Tasks', desc: 'Finish deposit / bet / login tasks to claim ₱36.50.', tag: 'Daily Tasks', tone: 'green' },
    { id: 'p8', type: 'Slot Cashback', title: 'Slot Daily Cashback', desc: 'Slot net loss cashback up to 8%. Auto next day 12:00.', tag: 'Cashback', tone: 'blue' },
    { id: 'p9', type: 'Leaderboard', title: 'Leaderboard', desc: 'Fixed cash by rank. Your bet decides the place. Claim within 72 hours after the round ends.', tag: 'Leaderboard', tone: 'purple' }
  ];

  var BOARDS = [
    {
      id: 'lb-slot', scope: 'type', target: 'Slot', play: '#/category/Slot',
      title: 'Slot Weekly Leaderboard', cycle: 'Weekly',
      start: '2026-11-02 00:00:00', end: '2026-11-08 23:59:59',
      phase: 'live', claim: 'manual', bonusDays: 30, minBet: 100, wager: 1, reward: 'Cash',
      botRanks: [1, 2, 3],
      myTurnover: 186420.50, myRank: 6,
      prizes: [
        { from: 1, to: 1, amount: 8000 },
        { from: 2, to: 2, amount: 5000 },
        { from: 3, to: 3, amount: 3000 },
        { from: 4, to: 10, amount: 350 },
        { from: 11, to: 20, amount: 150 }
      ],
      rows: [
        { rank: 1, account: 'maria_ph', turnover: 842600.00 },
        { rank: 2, account: 'Zipper123', turnover: 610240.50 },
        { rank: 3, account: 'vbsxun440128', turnover: 488900.00 },
        { rank: 4, account: 'ryucam661045', turnover: 266100.25 },
        { rank: 5, account: 'jlnpwa552017', turnover: 210880.00 },
        { rank: 6, account: 'wjfytn329022', turnover: 186420.50 },
        { rank: 7, account: 'hwpqer229833', turnover: 142330.00 },
        { rank: 8, account: 'ktdqio773910', turnover: 98050.75 }
      ],
      history: {
        tab: 'Last week',
        phase: 'claim',
        claimUntil: '2026-11-09 14:00:00',
        roundEnd: '2026-11-01 23:59:59',
        myTurnover: 628400.00,
        rows: [
          { rank: 1, account: 'wjfytn329022', turnover: 628400.00 },
          { rank: 2, account: 'maria_ph', turnover: 512880.00 },
          { rank: 3, account: 'Zipper123', turnover: 466210.50 },
          { rank: 4, account: 'vbsxun440128', turnover: 388900.00 },
          { rank: 5, account: 'jlnpwa552017', turnover: 255600.25 },
          { rank: 6, account: 'ryucam661045', turnover: 198440.00 },
          { rank: 7, account: 'hwpqer229833', turnover: 142330.00 },
          { rank: 8, account: 'ktdqio773910', turnover: 98050.75 }
        ]
      }
    },
    {
      id: 'lb-casino', scope: 'type', target: 'Casino', play: '#/category/Casino',
      title: 'Casino Weekly Leaderboard', cycle: 'Weekly',
      start: '2026-11-02 00:00:00', end: '2026-11-08 23:59:59',
      phase: 'live', claim: 'manual', bonusDays: 30, minBet: 100, wager: 1, reward: 'Cash',
      botRanks: [1, 2, 3],
      myTurnover: 86.50, myRank: 0,
      prizes: [
        { from: 1, to: 1, amount: 8000 },
        { from: 2, to: 2, amount: 5000 },
        { from: 3, to: 3, amount: 3000 },
        { from: 4, to: 10, amount: 350 },
        { from: 11, to: 20, amount: 150 }
      ],
      rows: [
        { rank: 1, account: 'Zipper133', turnover: 220400.00 },
        { rank: 2, account: 'juanok01', turnover: 188220.50 },
        { rank: 3, account: 'maria_ph', turnover: 166000.00 },
        { rank: 4, account: 'Zipper123', turnover: 99080.00 },
        { rank: 5, account: 'ryucam661045', turnover: 77440.25 },
        { rank: 6, account: 'jlnpwa552017', turnover: 55210.00 },
        { rank: 7, account: 'vbsxun440128', turnover: 30110.00 },
        { rank: 8, account: 'hwpqer229833', turnover: 12880.50 }
      ]
    },
    {
      id: 'lb-jili', scope: 'vendor', target: 'JILI', play: '#/category/Slot',
      title: 'JILI Daily Leaderboard', cycle: 'Daily',
      start: '2026-11-01 00:00:00', end: '2026-11-30 23:59:59',
      roundEnd: '2026-11-06 23:59:59',
      phase: 'live', claim: 'manual', bonusDays: 30, minBet: 100, wager: 1, reward: 'Cash',
      myTurnover: 42110.00, myRank: 5,
      prizes: [
        { from: 1, to: 1, amount: 3000 },
        { from: 2, to: 2, amount: 2000 },
        { from: 3, to: 3, amount: 1500 },
        { from: 4, to: 10, amount: 200 }
      ],
      rows: [
        { rank: 1, account: 'maria_ph', turnover: 188420.00 },
        { rank: 2, account: 'Zipper123', turnover: 142660.50 },
        { rank: 3, account: 'vbsxun440128', turnover: 98660.00 },
        { rank: 4, account: 'jlnpwa552017', turnover: 73440.25 },
        { rank: 5, account: 'wjfytn329022', turnover: 42110.00 },
        { rank: 6, account: 'ryucam661045', turnover: 30880.00 },
        { rank: 7, account: 'hwpqer229833', turnover: 15660.00 },
        { rank: 8, account: 'ktdqio773910', turnover: 8420.50 }
      ],
      yesterday: {
        roundEnd: '2026-11-05 23:59:59',
        phase: 'claim',
        claimUntil: '2026-11-08 23:59:59',
        myTurnover: 96440.00,
        rows: [
          { rank: 1, account: 'maria_ph', turnover: 210660.00 },
          { rank: 2, account: 'Zipper123', turnover: 154320.50 },
          { rank: 3, account: 'wjfytn329022', turnover: 96440.00 },
          { rank: 4, account: 'vbsxun440128', turnover: 80220.00 },
          { rank: 5, account: 'jlnpwa552017', turnover: 64110.25 },
          { rank: 6, account: 'ryucam661045', turnover: 42080.00 },
          { rank: 7, account: 'hwpqer229833', turnover: 18880.00 },
          { rank: 8, account: 'ktdqio773910', turnover: 9600.50 }
        ]
      }
    },
    {
      id: 'lb-bounty', scope: 'game', target: 'Wild Bounty Showdown', play: '#/category/Slot',
      title: 'Wild Bounty Showdown', cycle: 'This event',
      start: '2026-11-01 00:00:00', end: '2026-11-30 23:59:59',
      phase: 'live', claim: 'manual', bonusDays: 30, minBet: 100, wager: 1, reward: 'Cash',
      myTurnover: 512800.00, myRank: 1,
      prizes: [
        { from: 1, to: 1, amount: 8000 },
        { from: 2, to: 2, amount: 4000 },
        { from: 3, to: 3, amount: 2000 },
        { from: 4, to: 10, amount: 500 }
      ],
      rows: [
        { rank: 1, account: 'wjfytn329022', turnover: 512800.00 },
        { rank: 2, account: 'maria_ph', turnover: 466120.50 },
        { rank: 3, account: 'Zipper123', turnover: 388400.00 },
        { rank: 4, account: 'vbsxun440128', turnover: 255600.00 },
        { rank: 5, account: 'jlnpwa552017', turnover: 198440.25 },
        { rank: 6, account: 'ryucam661045', turnover: 142200.00 },
        { rank: 7, account: 'hwpqer229833', turnover: 88660.00 },
        { rank: 8, account: 'ktdqio773910', turnover: 42110.50 }
      ]
    }
  ];

  function maskAccount(a) {
    a = String(a || '');
    if (a.length <= 2) return a;
    return a.slice(0, 1) + '***' + a.slice(-1);
  }
  function rankPrize(rank, prizes) {
    var hit = (prizes || []).filter(function (p) { return rank >= Number(p.from) && rank <= Number(p.to); })[0];
    return hit ? Number(hit.amount) : 0;
  }

  var RANK_BOTS = ['luna_ph88', 'carlo9921', 'mika778120', 'juno_bet6', 'aria55201', 'nico_play', 'sami66120', 'theo_ph18'];

  function placeBoard(board, meAccount) {
    var prizes = board.prizes || [];
    var limit = 0;
    prizes.forEach(function (p) {
      var to = Number(p.to);
      if (to > limit) limit = to;
    });
    var seen = {};
    var bots = (board.botRanks || []).map(Number).filter(function (n) {
      if (n < 1 || (limit && n > limit) || seen[n]) return false;
      seen[n] = 1;
      return true;
    }).sort(function (a, b) { return a - b; });
    var botSet = {};
    bots.forEach(function (n) { botSet[n] = 1; });
    var reals = (board.rows || []).filter(function (r) { return !r.bot; }).slice().sort(function (a, b) {
      return Number(b.turnover) - Number(a.turnover);
    });
    if (!limit) limit = reals.length + bots.length;
    var rows = [];
    var ri = 0;
    var bi = 0;
    for (var rank = 1; rank <= limit; rank++) {
      if (botSet[rank]) {
        rows.push({ rank: rank, account: RANK_BOTS[bi % RANK_BOTS.length], turnover: 0, bot: true });
        bi++;
      } else if (ri < reals.length) {
        var src = reals[ri++];
        rows.push({ rank: rank, account: src.account, turnover: Number(src.turnover), bot: false });
      }
    }
    for (var i = rows.length - 1; i >= 0; i--) {
      if (!rows[i].bot) continue;
      var below = null;
      var above = null;
      for (var n = i + 1; n < rows.length; n++) {
        if (rows[n].turnover) { below = rows[n]; break; }
      }
      for (var p = i - 1; p >= 0; p--) {
        if (!rows[p].bot && rows[p].turnover) { above = rows[p]; break; }
      }
      var turn = 100000;
      if (below && above) turn = (Number(above.turnover) + Number(below.turnover)) / 2;
      else if (below) turn = Number(below.turnover) + 18650.25;
      else if (above) turn = Math.max(Number(above.turnover) - 18650.25, 1);
      rows[i].turnover = Math.round(turn * 100) / 100;
    }
    var myRank = 0;
    if (meAccount) {
      var mine = rows.filter(function (r) { return !r.bot && r.account === meAccount; })[0];
      if (mine) myRank = mine.rank;
    }
    return { rows: rows, myRank: myRank };
  }

  function rankClaimState(board, account, round, claimedMap) {
    var pack = null;
    var suffix = '';
    if (round === 'past' && board.history) {
      pack = board.history;
      suffix = ':history';
    } else if (round === 'yesterday' && board.yesterday) {
      pack = board.yesterday;
      suffix = ':yesterday';
    }
    var source = pack ? {
      prizes: board.prizes,
      botRanks: board.botRanks || [],
      rows: pack.rows || []
    } : board;
    var placed = placeBoard(source, account || '');
    var rank = placed.myRank;
    var prize = rank ? rankPrize(rank, board.prizes) : 0;
    var phase = pack ? (pack.phase || 'claim') : board.phase;
    var key = board.id + suffix;
    var claimed = !!(claimedMap && claimedMap[key]);
    return {
      placed: placed,
      rank: rank,
      prize: prize,
      phase: phase,
      key: key,
      claimed: claimed,
      open: phase !== 'live' && !!rank && prize > 0 && !claimed,
      turnover: pack ? Number(pack.myTurnover || 0) : Number(board.myTurnover || 0),
      claimUntil: pack ? pack.claimUntil : board.claimUntil,
      roundEnd: pack ? pack.roundEnd : (board.roundEnd || board.end)
    };
  }

  function seed() {
    return {
      loggedIn: false,
      seenRg: false,
      lang: 'en',
      member: {
        account: 'wjfytn329022',
        display: 'wjfytn329022',
        id: '1000888',
        phone: '0969****3098',
        phoneFull: '096930983098',
        email: '969****099@gmail.com',
        vip: 'PVIP',
        vipXp: 2180000,
        vipNeed: 6000000,
        invite: '37BRX7HM',
        kyc: 'Verified',
        phoneBound: true,
        emailBound: true,
        pinSet: true,
        pwdSet: true
      },
      cash: 110102.00,
      bonus: 1424.00,
      pendingCashback: 55.54,
      weeklyCashback: 218.00,
      rebate: 36.80,
      spinCredit: 96.78,
      spinNeed: 100.00,
      rainWindow: true,
      firstDepositDone: true,
      agreedTerms: false,
      recent: ['g01', 'g17', 'g25', 'g11', 'g20'],
      wallets: [
        { id: 'w1', type: 'GCash', name: 'GCash', no: '0969 **** 3098', status: 'Default' },
        { id: 'w2', type: 'Maya', name: 'Maya', no: '0917 **** 6621', status: 'Configured' },
        { id: 'w3', type: 'Bank', name: 'Standard Chartered', no: '**** 8821', status: 'Configured' }
      ],
      messages: [
        { id: 'm1', title: 'Welcome to Juan365', body: 'Complete KYC to unlock withdrawals. Play responsibly. 21+.', time: '2026-08-16 07:02:11', read: false, type: 'System' },
        { id: 'm2', title: 'Deposit successful', body: 'GCash deposit ₱ 5,000.00 credited. Order D202608121840003.', time: '2026-08-12 18:40:22', read: true, type: 'Wallet' },
        { id: 'm3', title: 'Weekly cashback ready', body: 'PVIP weekly cashback ₱ 218.00 is ready to claim.', time: '2026-08-11 00:00:08', read: false, type: 'Promo' },
        { id: 'm4', title: 'Withdraw processed', body: 'Withdraw ₱ 1,000.00 to GCash 0969****3098 settled.', time: '2026-08-14 21:09:33', read: true, type: 'Wallet' },
        { id: 'm5', title: 'Lucky Spin reward', body: 'You won ₱ 50.00. Still ₱ 3.22 to complete withdraw turnover.', time: '2026-08-15 14:22:01', read: false, type: 'Promo' },
        { id: 'm6', title: 'Affiliate commission', body: 'Team valid bets settled. Commission ₱ 320.00 unpaid.', time: '2026-08-15 00:05:40', read: true, type: 'Affiliate' }
      ],
      txns: [
        { id: 'T20260814210901', type: 'Withdraw', amount: -1000.00, status: '已结算', time: '2026-08-14 21:09:33', channel: 'GCash', order: 'W20260814210901' },
        { id: 'T20260813100218', type: 'Return of frozen funds', amount: 500.00, status: '已到账', time: '2026-08-13 10:02:18', channel: 'Wallet', order: 'R20260813100218' },
        { id: 'T20260812184003', type: 'Deposit', amount: 5000.00, status: '已到账', time: '2026-08-12 18:40:22', channel: 'GCash', order: 'D20260812184003' },
        { id: 'T20260811115544', type: 'Rebate', amount: 36.80, status: '已领取', time: '2026-08-11 11:55:44', channel: 'Bonus', order: 'B20260811115544' },
        { id: 'T20260810090012', type: 'Daily Cashback', amount: 55.54, status: '已领取', time: '2026-08-10 09:00:12', channel: 'Bonus', order: 'B20260810090012' },
        { id: 'T20260809183007', type: 'Deposit', amount: 2000.00, status: '已到账', time: '2026-08-09 18:30:07', channel: 'Maya', order: 'D20260809183007' },
        { id: 'T20260808121033', type: 'Lucky Spin', amount: 50.00, status: '待完成流水', time: '2026-08-08 12:10:33', channel: 'Bonus', order: 'S20260808121033' },
        { id: 'T20260807160001', type: 'Withdraw', amount: -800.00, status: '审核拒绝', time: '2026-08-07 16:00:01', channel: 'Bank', order: 'W20260807160001' }
      ],
      tasks: [
        { id: 't1', name: 'Daily login', desc: 'Login once today', progress: 1, target: 1, reward: 5.00, status: '已领取' },
        { id: 't2', name: 'First deposit of the day', desc: 'Deposit ≥ ₱ 100.00', progress: 1, target: 1, reward: 10.00, status: '待领取' },
        { id: 't3', name: 'Valid bets ₱ 1,000', desc: 'Any game valid bets', progress: 760.00, target: 1000.00, reward: 8.50, status: '进行中' },
        { id: 't4', name: 'Play 3 categories', desc: 'Slot / Bingo / Casino', progress: 2, target: 3, reward: 6.00, status: '进行中' },
        { id: 't5', name: 'Invite 1 friend', desc: 'Friend registers and deposits', progress: 0, target: 1, reward: 7.00, status: '未开始' }
      ],
      refs: [
        { account: 'mcrzha881204', phone: '0917****2201', time: '2026-08-15 19:22:08', bets: 12880.00, comm: 128.80, status: '有效会员' },
        { account: 'jlnpwa552017', phone: '0928****7743', time: '2026-08-14 11:08:41', bets: 4320.50, comm: 43.20, status: '有效会员' },
        { account: 'ktdqio773910', phone: '0905****1188', time: '2026-08-13 08:41:15', bets: 0.00, comm: 0.00, status: '仅注册' },
        { account: 'vbsxun440128', phone: '0939****6602', time: '2026-08-12 21:03:59', bets: 21500.00, comm: 215.00, status: '有效会员' },
        { account: 'hwpqer229833', phone: '0918****3344', time: '2026-08-11 16:17:22', bets: 980.00, comm: 9.80, status: '有效会员' },
        { account: 'ryucam661045', phone: '0945****8099', time: '2026-08-10 09:55:03', bets: 7600.00, comm: 76.00, status: '有效会员' }
      ],
      agent: { todayReg: 2, todayNew: 1, todayBets: 1880.00, todayComm: 18.80, totalReg: 28, totalPlayers: 19, totalBets: 47280.50, totalComm: 472.80, unpaid: 320.00, paid: 152.80, level: 1 },
      deposits: [],
      withdraws: [],
      rankClaim: {}
    };
  }

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      var base = seed();
      return Object.assign(base, raw, { member: Object.assign(base.member, raw.member || {}) });
    } catch (e) {
      return seed();
    }
  }
  function save(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  var S = load();

  function persist() { save(S); }

  function unread() {
    return S.messages.filter(function (m) { return !m.read; }).length;
  }

  function addTxn(row) {
    S.txns.unshift(row);
    persist();
  }

  function reset() {
    S = seed();
    persist();
  }

  global.J365 = {
    KEY: KEY,
    state: S,
    persist: persist,
    reset: reset,
    money: money,
    fmt: fmt,
    games: GAMES,
    providers: PROVIDERS,
    cats: CATS,
    promos: PROMOS,
    boards: BOARDS,
    maskAccount: maskAccount,
    rankPrize: rankPrize,
    placeBoard: placeBoard,
    rankClaimState: rankClaimState,
    unread: unread,
    addTxn: addTxn,
    seed: seed
  };
})(window);
