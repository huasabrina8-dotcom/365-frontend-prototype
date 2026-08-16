(function (global) {
  'use strict';
  var S = J365.state;
  var P = {};

  function crumb(items) {
    return '<p class="crumb">' + items.map(function (x, i) {
      return i === items.length - 1 ? x[0] : '<a href="' + x[1] + '">' + x[0] + '</a>';
    }).join(' › ') + '</p>';
  }
  function games(list) { return '<div class="games">' + list.map(J365Shell.gameCard).join('') + '</div>'; }
  function empty(txt) { return '<div class="empty">' + (txt || 'No record') + '</div>'; }

  var BANNERS = [
    { t: '50% First Deposit Bonus', d: 'First deposit ₱500+ · bonus credit up to ₱5,000', bg: 'linear-gradient(120deg,#f26839,#fa9d1a)' },
    { t: 'Weekly Cashback 25%', d: 'PVIP / GVIP Monday 00:00 GMT+8', bg: 'linear-gradient(120deg,#007AFF,#19C8FF)' },
    { t: 'Money Like Rain', d: 'Grab packets in the rain window · VIP extra', bg: 'linear-gradient(120deg,#12a35a,#3dd68c)' },
    { t: 'Earn ₱50,000 / day', d: 'Affiliate commission on team valid bets', bg: 'linear-gradient(120deg,#6D35FF,#B14CFF)' }
  ];

  P.home = function (page) {
    var bi = 0;
    page.innerHTML =
      '<div class="hero" id="hero">' +
      '<div class="slide" id="heroSlide" style="background:' + BANNERS[0].bg + '"><b>' + BANNERS[0].t + '</b><p>' + BANNERS[0].d + '</p></div>' +
      '<div class="dots" id="heroDots"><i class="on"></i><i></i><i></i><i></i></div></div>' +
      '<div class="ticker">📢 <span class="run">Bingo365 encourages players to set a budget, take regular breaks, and game responsibly. 21+ · PAGCOR licensed · Self-exclusion available in Account › Limits</span></div>' +
      '<div class="htabs" id="cats">' + J365.cats.map(function (c, i) {
        return '<button class="htab' + (i === 0 ? ' on' : '') + '" type="button" data-cat="' + c + '">' + c + '</button>';
      }).join('') + '</div>' +
      '<div id="homeBody"></div>';
    function renderCat(name) {
      var body = document.getElementById('homeBody');
      if (name === 'Lobby') {
        body.innerHTML =
          '<div class="sec-h"><h2>Popular Games</h2><a class="more" href="#/category/Slot">All ›</a></div>' +
          games(J365.games.slice(0, 8)) +
          '<div class="sec-h"><h2>Featured Games</h2><a class="more" href="#/category/Casino">All ›</a></div>' +
          games(J365.games.slice(8, 24)) +
          '<div class="sec-h"><h2>Providers</h2></div>' +
          '<div class="providers" id="providers">' + J365.providers.map(function (p) { return '<span data-prov="' + p + '">' + p + '</span>'; }).join('') + '</div>';
        return;
      }
      var list = J365.games.filter(function (g) { return g.cat === name; });
      body.innerHTML = '<div class="sec-h"><h2>' + name + '</h2><span class="more">' + list.length + ' games</span></div>' +
        (list.length ? games(list) : empty('No games in this category'));
    }
    renderCat('Lobby');
    document.getElementById('cats').onclick = function (e) {
      var b = e.target.closest('.htab'); if (!b) return;
      [].forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
      renderCat(b.getAttribute('data-cat'));
    };
    document.getElementById('hero').onclick = function () {
      bi = (bi + 1) % BANNERS.length;
      var s = document.getElementById('heroSlide');
      s.style.background = BANNERS[bi].bg;
      s.innerHTML = '<b>' + BANNERS[bi].t + '</b><p>' + BANNERS[bi].d + '</p>';
      [].forEach.call(document.querySelectorAll('#heroDots i'), function (d, i) { d.classList.toggle('on', i === bi); });
    };
    page.onclick = function (e) {
      var p = e.target.closest('[data-prov]');
      if (!p) return;
      var name = p.getAttribute('data-prov');
      [].forEach.call(document.querySelectorAll('[data-prov]'), function (x) { x.classList.toggle('on', x === p); });
      var list = J365.games.filter(function (g) { return g.provider === name; });
      document.getElementById('homeBody').innerHTML =
        '<div class="sec-h"><h2>' + name + '</h2><a class="more" href="#/home">Back ›</a></div>' + games(list);
    };
  };

  P.category = function (page, name) {
    var list = J365.games.filter(function (g) { return g.cat === name; });
    page.innerHTML = crumb([['Home', '#/home'], [name]]) +
      '<div class="sec-h"><h2>' + name + '</h2><span class="more">' + list.length + ' games</span></div>' +
      (list.length ? games(list) : empty());
  };

  P.bonus = function (page) {
    var list = J365.games.filter(function (g) { return g.cat === 'Bonus' || g.tag === 'bonus'; });
    page.innerHTML = crumb([['Home', '#/home'], ['Bonus']]) +
      '<div class="grid-2" style="margin-bottom:14px">' +
      '<a class="promo-card tone-orange" href="#/promotions"><b>50% First Deposit</b><p>Unlock bonus credit on first cash-in</p></a>' +
      '<a class="promo-card tone-green" href="#/daily-task"><b>Daily Tasks</b><p>Claim up to ₱ 36.50 today</p></a></div>' +
      '<div class="sec-h"><h2>Bonus Games</h2></div>' + games(list);
  };

  P.promotions = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Promotions']]) +
      '<div class="tabs" id="promoTabs">' +
      ['All', 'Cashback', 'Rebate', 'Lucky Spin', 'Money Rain', 'Affiliate', 'Bonus', 'Daily Tasks'].map(function (t, i) {
        return '<button class="tab' + (i === 0 ? ' on' : '') + '" type="button" data-pt="' + t + '">' + t + '</button>';
      }).join('') + '</div><div class="grid-3" id="promoGrid"></div>';
    function draw(type) {
      var list = J365.promos.filter(function (p) { return type === 'All' || p.tag === type; });
      document.getElementById('promoGrid').innerHTML = list.map(function (p) {
        return '<a class="promo-card tone-' + p.tone + '" href="#/activity-detail/' + p.id + '"><span class="tag">' + p.tag + '</span><b>' + p.title + '</b><p>' + p.desc + '</p></a>';
      }).join('') || empty();
    }
    draw('All');
    document.getElementById('promoTabs').onclick = function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      [].forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
      draw(b.getAttribute('data-pt'));
    };
  };

  P.activity = function (page, id) {
    var p = J365.promos.filter(function (x) { return x.id === id; })[0] || J365.promos[0];
    var go = {
      p1: '#/rebate', p2: '#/rebate', p3: '#/spin', p4: '#/rain', p5: '#/agent', p6: '#/deposit', p7: '#/daily-task', p8: '#/slot-cashback'
    }[p.id] || '#/home';
    page.innerHTML = crumb([['Home', '#/home'], ['Promotions', '#/promotions'], [p.title]]) +
      '<section class="promo-card tone-' + p.tone + '" style="min-height:160px"><b style="font-size:22px">' + p.title + '</b><p>' + p.desc + '</p></section>' +
      '<section class="card" style="margin-top:12px"><h3>Rules</h3>' +
      '<p>1. Activity time follows GMT+8. Claim window closes at next cycle reset.</p>' +
      '<p>2. Bonus credit cannot be withdrawn until turnover is completed.</p>' +
      '<p>3. Juan365 may cancel rewards if risk control is triggered.</p>' +
      '<p>4. This page is a demo prototype and does not move live funds.</p>' +
      '<div class="row"><a class="btn pri" href="' + go + '">Join now</a><a class="btn ghost" href="#/promotions">Back</a></div></section>';
  };

  P.vip = function (page) {
    var lv = ['AVIP', 'PVIP', 'GVIP', 'SVIP'];
    var need = { AVIP: 0, PVIP: 600000, GVIP: 6000000, SVIP: 20000000 };
    var pct = Math.min(100, Math.round(S.member.vipXp / S.member.vipNeed * 100));
    page.innerHTML = crumb([['Home', '#/home'], ['VIP CLUB']]) +
      '<div class="vip-hero"><section class="vip-cta"><h2>Unrivaled VIP Experience</h2>' +
      '<p>Join VIP Club for cashback, dedicated manager and exclusive events.</p>' +
      '<a class="btn" href="#/home">Play Now</a></section>' +
      '<section class="card"><div class="sec-h"><h2>Bingo365 VIP Level</h2><span class="st ok">' + S.member.vip + ' Cashback 5%</span></div>' +
      '<div class="vip-badges">' + lv.map(function (x) {
        var bg = { AVIP: '#94a3b8', PVIP: '#f59e0b', GVIP: '#eab308', SVIP: '#7c3aed' }[x];
        return '<div class="vip-lv' + (x === S.member.vip ? ' on' : '') + '" style="background:' + bg + '">' + x + '</div>';
      }).join('') + '</div>' +
      '<p style="font-size:12px;color:#666;margin:10px 0 6px">XP ' + S.member.vipXp.toLocaleString() + ' / ' + S.member.vipNeed.toLocaleString() + ' · Grand VIP Need 6,000,000 XP</p>' +
      '<div class="bar" style="background:#eee"><i style="width:' + pct + '%"></i></div></section></div>' +
      '<div class="tabs" id="vipTabs"><button class="tab on" type="button" data-vt="b">VIP Benefits</button>' +
      '<button class="tab" type="button" data-vt="g">VIP Guide</button><button class="tab" type="button" data-vt="r">Rewards</button></div>' +
      '<div id="vipPane"></div>' +
      '<section class="card" style="margin:14px 0;background:linear-gradient(90deg,#fff3e0,#ffe0c2)">Bingo365 VIP Email &nbsp; <b>Vip@Bingo365.Vip</b> ' +
      '<button class="btn ghost" type="button" data-act="copy" data-copy="Vip@Bingo365.Vip" style="height:28px;margin-left:8px">Copy</button></section>' +
      '<h2>Bingo365 Promotions</h2><div class="grid-3">' +
      J365.promos.slice(0, 5).map(function (p) {
        return '<a class="card" href="#/activity-detail/' + p.id + '"><b>' + p.title + '</b><p class="sub">' + p.tag + '</p></a>';
      }).join('') + '</div>';
    var panes = {
      b: '<div class="grid-3">' +
        [['✓ Exclusive Brand-Themed Events', 'Unlocked'], ['✓ Dedicated VIP Account Manager', 'Unlocked'],
          ['🔒 Luxury Travel Privileges', 'Locked'], ['🔒 Exclusive Mystery Gifts', 'Locked'],
          ['🔒 Birthday Celebration Events', 'Locked'], ['🔒 Fly Anywhere With Your VIP Bonus', 'Locked']].map(function (x) {
          return '<article class="benefit"><b>' + x[0] + '</b><p>' + x[1] + '</p></article>';
        }).join('') + '</div>',
      g: '<section class="card"><p>AVIP → PVIP need ' + need.PVIP.toLocaleString() + ' XP. GVIP need ' + need.GVIP.toLocaleString() + ' XP.</p>' +
        '<p>XP comes from valid bets. Level never drops in this demo.</p><p>Cashback rate: AVIP 3% · PVIP 5% · GVIP 8% · SVIP 10%.</p></section>',
      r: '<section class="card"><p>Weekly cashback max prize ₱ 5,000.00 · Daily loss reversal by VIP band.</p>' +
        '<p>Current pending weekly cashback: <b>' + J365.money(S.weeklyCashback) + '</b></p>' +
        '<button class="btn pri" type="button" id="claimWeekly">Claim weekly</button></section>'
    };
    document.getElementById('vipPane').innerHTML = panes.b;
    document.getElementById('vipTabs').onclick = function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      [].forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
      document.getElementById('vipPane').innerHTML = panes[b.getAttribute('data-vt')];
      var c = document.getElementById('claimWeekly');
      if (c) c.onclick = function () {
        if (!S.loggedIn) return J365Shell.requireAuth('#/vipClub');
        if (!S.weeklyCashback) return J365Shell.toast('Already claimed');
        S.cash += S.weeklyCashback;
        J365.addTxn({ id: 'T' + Date.now(), type: 'Weekly Cashback', amount: S.weeklyCashback, status: '已领取', time: J365.fmt(new Date()), channel: 'Bonus', order: 'B' + Date.now() });
        S.weeklyCashback = 0; J365.persist(); J365Shell.toast('Claimed (demo)'); location.reload();
      };
    };
  };

  P.agent = function (page) {
    var a = S.agent;
    page.innerHTML = crumb([['Home', '#/home'], ['Affiliate']]) +
      '<section class="card" style="background:linear-gradient(90deg,#dbeafe,#fff);display:flex;justify-content:space-between;align-items:center">' +
      '<div><h2>Earn <span style="color:#f26839">₱ 50000</span> Per Day</h2><p>Join now and embark on an exhilarating journey of luck and reward.</p>' +
      (S.loggedIn ? '' : '<button class="btn pri" type="button" data-act="signup">Join Now</button>') + '</div></section>' +
      '<div class="tabs" id="affTabs">' +
      [['panel', 'Panel'], ['ref', 'References'], ['report', 'Report'], ['pay', 'Payments'], ['faq', 'FAQ'], ['tut', 'Tutorial']].map(function (x, i) {
        return '<button class="tab' + (i === 0 ? ' on' : '') + '" type="button" data-ap="' + x[0] + '">' + x[1] + '</button>';
      }).join('') + '</div><div id="affPane"></div>';
    var panes = {
      panel: '<div class="grid-2"><section class="card"><h3>Today</h3><div class="stat-grid">' +
        '<div class="stat">Registrations<b>' + a.todayReg + '</b></div><div class="stat">New Player<b>' + a.todayNew + '</b></div>' +
        '<div class="stat">Valid Team Bets<b>' + J365.money(a.todayBets) + '</b></div><div class="stat">Commission<b>' + J365.money(a.todayComm) + '</b></div></div></section>' +
        '<section class="card"><h3>Total</h3><div class="stat-grid">' +
        '<div class="stat">Registrations<b>' + a.totalReg + '</b></div><div class="stat">Total Players<b>' + a.totalPlayers + '</b></div>' +
        '<div class="stat">Total Valid Bets<b>' + J365.money(a.totalBets) + '</b></div><div class="stat">Commission<b>' + J365.money(a.totalComm) + '</b></div></div></section></div>' +
        '<div class="grid-2" style="margin-top:12px"><section class="card">Agent Level ' + a.level + '<br>Total Paid ' + J365.money(a.paid) + ' · Unpaid ' + J365.money(a.unpaid) +
        '<button class="btn pri block" type="button" id="xfer" style="margin-top:10px">Transfer To Wallet</button>' +
        '<p style="font-size:12px;color:#888">Minimum transfer amount of ₱ 1,000.00</p></section>' +
        '<section class="card"><div>Facebook · WhatsApp · Telegram · X · Email · Viber · TikTok · YouTube</div>' +
        '<div class="search" style="max-width:none;margin-top:10px">https://juan365.com/r/' + S.member.invite + '</div>' +
        '<button class="btn pri" type="button" data-act="copy" data-copy="https://juan365.com/r/' + S.member.invite + '" style="margin-top:8px">Copy</button>' +
        '<p><a href="#/share-friends">Share Friend ›</a></p></section></div>' +
        '<section class="card" style="margin-top:12px;background:#e8f4ff">Join the official affiliate TG group for professional guidance.</section>' +
        '<section class="card" style="margin-top:12px"><h3>Commission Reward Rules</h3>' +
        '<p>Unlimited referrals growth. Earn more than 80% in commission rewards.</p>' +
        '<p>Number of Referrals &gt; 100 · Commission ₱ 5,000.00 every month!</p>' +
        '<p style="font-size:12px;color:#888">Commission is based on valid bets and calculated every 24 hours.</p></section>',
      ref: '<section class="card">' + S.refs.map(function (r) {
        return '<div class="li"><div><b>' + r.account + '</b><div class="sub">' + r.phone + ' · ' + r.time + '</div></div>' +
          '<div style="text-align:right"><div>' + J365.money(r.bets) + '</div><div class="st ' + (r.status === '有效会员' ? 'ok' : 'mute') + '">' + r.status + ' · ' + J365.money(r.comm) + '</div></div></div>';
      }).join('') + '</section>',
      report: '<section class="card"><div class="stat-grid"><div class="stat">Period<b>2026-08-10 ~ 16</b></div>' +
        '<div class="stat">Valid bets<b>' + J365.money(18820) + '</b></div><div class="stat">Commission<b>' + J365.money(188.20) + '</b></div>' +
        '<div class="stat">New players<b>4</b></div></div></section>',
      pay: '<section class="card"><div class="li"><div>Transfer 2026-08-09 12:00:00</div><b>' + J365.money(152.80) + '</b><span class="st ok">已到账</span></div>' +
        '<div class="li"><div>Unpaid commission</div><b>' + J365.money(a.unpaid) + '</b><span class="st wait">待转出</span></div></section>',
      faq: '<section class="card"><p><b>How is commission calculated?</b><br>Valid bets of your team, settled every 24 hours.</p>' +
        '<p><b>When can I transfer?</b><br>When unpaid commission reaches ₱ 1,000.00.</p>' +
        '<p><b>Who is a valid player?</b><br>Registered via your code and has at least one successful deposit.</p></section>',
      tut: '<section class="card">Tutorials: Facebook · YouTube · Instagram · WhatsApp · Telegram · X · Viber · TikTok<p><a href="#/share-friends">Open share guide ›</a></p></section>'
    };
    function show(k) {
      document.getElementById('affPane').innerHTML = panes[k];
      var x = document.getElementById('xfer');
      if (x) x.onclick = function () {
        if (!S.loggedIn) return J365Shell.requireAuth('#/agent');
        if (a.unpaid < 1000) return J365Shell.toast('Minimum transfer ₱ 1,000.00');
        S.cash += a.unpaid; a.paid += a.unpaid; a.unpaid = 0; J365.persist();
        J365Shell.toast('Transferred to wallet (demo)'); location.reload();
      };
    }
    show('panel');
    document.getElementById('affTabs').onclick = function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      [].forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
      show(b.getAttribute('data-ap'));
    };
  };

  P.share = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Affiliate', '#/agent'], ['Share Friends']]) +
      '<section class="card"><h2>Share Friends</h2><p>Invite link: https://juan365.com/r/' + S.member.invite + '</p>' +
      '<button class="btn pri" type="button" data-act="copy" data-copy="https://juan365.com/r/' + S.member.invite + '">Copy link</button>' +
      '<div class="grid-3" style="margin-top:12px">' +
      ['Facebook', 'WhatsApp', 'Telegram', 'X', 'Viber', 'TikTok'].map(function (n) {
        return '<button class="btn line" type="button" data-act="copy" data-copy="Join Juan365 ' + S.member.invite + '">' + n + '</button>';
      }).join('') + '</div></section>';
  };

  P.daily = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Daily Tasks']]) +
      '<section class="card"><p>Finish tasks to claim up to ₱ 36.50 today. Reset 00:00 GMT+8.</p></section>' +
      '<div class="list" style="margin-top:10px">' + S.tasks.map(function (t) {
        var pct = Math.min(100, Math.round(t.progress / t.target * 100));
        return '<div class="li"><div><b>' + t.name + '</b><div class="sub">' + t.desc + ' · ' + t.progress + ' / ' + t.target + '</div>' +
          '<div class="bar" style="background:#eee;margin-top:6px;width:220px"><i style="width:' + pct + '%"></i></div></div>' +
          '<div><div>' + J365.money(t.reward) + '</div><button class="btn pri" type="button" data-task="' + t.id + '"' +
          (t.status !== '待领取' ? ' disabled' : '') + '>' + t.status + '</button></div></div>';
      }).join('') + '</div>';
    page.onclick = function (e) {
      var b = e.target.closest('[data-task]'); if (!b || b.disabled) return;
      if (!S.loggedIn) return J365Shell.requireAuth('#/daily-task');
      var t = S.tasks.filter(function (x) { return x.id === b.getAttribute('data-task'); })[0];
      t.status = '已领取'; S.cash += t.reward; J365.persist();
      J365.addTxn({ id: 'T' + Date.now(), type: 'Daily Tasks', amount: t.reward, status: '已领取', time: J365.fmt(new Date()), channel: 'Bonus', order: 'B' + Date.now() });
      J365Shell.toast('Claimed ' + J365.money(t.reward)); location.reload();
    };
  };

  P.earnings = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['My Earnings']]) +
      '<div class="stat-grid"><div class="stat">Today<b>' + J365.money(18.80) + '</b></div>' +
      '<div class="stat">This week<b>' + J365.money(218.00) + '</b></div>' +
      '<div class="stat">This month<b>' + J365.money(860.40) + '</b></div>' +
      '<div class="stat">Total<b>' + J365.money(472.80) + '</b></div></div>' +
      '<section class="card" style="margin-top:12px">' + S.txns.filter(function (t) { return t.amount > 0; }).slice(0, 6).map(function (t) {
        return '<div class="li"><div><b>' + t.type + '</b><div class="sub">' + t.time + '</div></div><b>' + J365.money(t.amount) + '</b></div>';
      }).join('') + '</section>';
  };

  P.rebate = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Betting rebate up to']]) +
      '<div class="grid-2"><section class="card"><h3>Daily Cashback</h3><p>Pending <b>' + J365.money(S.pendingCashback) + '</b></p>' +
      '<button class="btn pri" type="button" id="claimCb">Claim</button></section>' +
      '<section class="card"><h3>Realtime Rebate</h3><p>Unclaimed <b>' + J365.money(S.rebate) + '</b></p>' +
      '<button class="btn pri" type="button" id="claimRb">Claim</button></section></div>' +
      '<section class="card" style="margin-top:12px"><h3>Rules</h3><p>Cashback on net loss. Rebate on valid bets. Both credit to cash wallet. Demo only.</p></section>';
    function claim(key, type) {
      if (!S.loggedIn) return J365Shell.requireAuth('#/rebate');
      if (!S[key]) return J365Shell.toast('Nothing to claim');
      var amt = S[key]; S.cash += amt; S[key] = 0; J365.persist();
      J365.addTxn({ id: 'T' + Date.now(), type: type, amount: amt, status: '已领取', time: J365.fmt(new Date()), channel: 'Bonus', order: 'B' + Date.now() });
      J365Shell.toast('Claimed ' + J365.money(amt)); location.reload();
    }
    document.getElementById('claimCb').onclick = function () { claim('pendingCashback', 'Daily Cashback'); };
    document.getElementById('claimRb').onclick = function () { claim('rebate', 'Rebate'); };
  };

  P.spin = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Lucky Spin']]) +
      '<div class="peach"><div style="flex:1"><b>' + J365.money(S.spinCredit) + '</b>' +
      '<div class="bar" style="margin:6px 0"><i style="width:' + Math.min(100, S.spinCredit / S.spinNeed * 100) + '%"></i></div>' +
      '<small>Still required ' + (S.spinNeed - S.spinCredit).toFixed(2) + ' to complete the withdrawal</small></div>' +
      '<a class="btn pri" href="#/withdraw">Withdraw</a></div>' +
      '<div class="wheel-wrap"><div class="wheel" id="wheel"></div><p style="color:#6d28d9;font-weight:800">Get ₱500 for free</p>' +
      '<button class="btn pri" type="button" id="spinBtn">Spin</button></div>' +
      '<section class="card">Invite friends to help with withdrawals <a class="btn ghost" href="#/share-friends" style="margin-left:8px">Share</a></section>' +
      '<div class="tabs" style="margin-top:12px"><button class="tab on" type="button">Report</button><button class="tab" type="button">My Reference</button><button class="tab" type="button">Rules</button></div>' +
      '<section class="card"><p>5599******123 · Just withdrew · +100 ₱</p><p>0917******882 · Just withdrew · +50 ₱</p></section>';
    var deg = 0;
    document.getElementById('spinBtn').onclick = function () {
      if (!S.loggedIn) return J365Shell.requireAuth('#/spin');
      deg += 360 * 4 + 45; document.getElementById('wheel').style.transform = 'rotate(' + deg + 'deg)';
      setTimeout(function () {
        S.spinCredit = Math.min(S.spinNeed, S.spinCredit + 50);
        S.bonus += 50; J365.persist();
        J365Shell.toast('You won ₱ 50.00 (demo)');
      }, 1600);
    };
  };

  P.rain = function (page) {
    var grabbed = 0;
    page.innerHTML = crumb([['Home', '#/home'], ['Money Rain']]) +
      '<section class="card"><p>Rain window is ' + (S.rainWindow ? '<b class="st ok">OPEN</b>' : 'closed') + '. Tap red packets. VIP extra after rain.</p></section>' +
      '<div class="rain-stage" id="stage"></div>' +
      '<p style="text-align:center">Grabbed <b id="grabN">₱ 0.00</b></p>';
    var stage = document.getElementById('stage');
    for (var i = 0; i < 8; i++) {
      var h = document.createElement('div');
      h.className = 'hb';
      h.style.left = (8 + i * 12) + '%';
      h.style.animationDelay = (i * 0.28) + 's';
      h.onclick = function () {
        if (!S.loggedIn) return J365Shell.requireAuth('#/rain');
        grabbed += 8.88; S.bonus += 8.88; J365.persist();
        document.getElementById('grabN').textContent = J365.money(grabbed);
        this.remove();
      };
      stage.appendChild(h);
    }
  };

  P.draw = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Lucky Draw']]) +
      '<section class="card"><p>Complete share or optional task to get a draw chance. Ranking uses this cycle valid bets.</p>' +
      '<p>Your valid bets this cycle: <b>₱ 7,620.00</b> · Rank band ₱ 5,000 – ₱ 9,999</p>' +
      '<button class="btn pri" type="button" id="drawBtn">Draw</button></section>';
    document.getElementById('drawBtn').onclick = function () {
      if (!S.loggedIn) return J365Shell.requireAuth('#/prize-draw');
      S.cash += 20; J365.persist();
      J365Shell.toast('Consolation ₱ 20.00 (demo)');
    };
  };

  P.slotCb = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Slot Daily Cashback']]) +
      '<section class="card"><p>Yesterday slot net loss <b>₱ 880.00</b> · Rate 8% · Payable <b>₱ 70.40</b></p>' +
      '<p class="sub">Auto credit next day 12:00 GMT+8 if not claimed.</p>' +
      '<button class="btn pri" type="button" id="claimSlot">Claim</button></section>';
    document.getElementById('claimSlot').onclick = function () {
      if (!S.loggedIn) return J365Shell.requireAuth('#/slot-cashback');
      S.cash += 70.40; J365.persist(); J365Shell.toast('Claimed ₱ 70.40');
    };
  };

  P.account = function (page) {
    var m = S.member;
    page.innerHTML = crumb([['Home', '#/home'], ['Account']]) +
      '<div class="grid-2"><section class="card"><div style="display:flex;gap:12px;align-items:center">' +
      '<span class="av" style="width:48px;height:48px;display:grid;place-items:center">' + m.account.slice(0, 1).toUpperCase() + '</span>' +
      '<div><b>' + m.account + '</b><div style="font-size:12px;color:#888">ID ' + m.id + ' <button class="btn ghost" type="button" data-act="copy" data-copy="' + m.id + '" style="height:22px;padding:0 8px;font-size:11px">Copy</button></div></div></div>' +
      '<div class="orange-box" style="margin-top:12px"><div>My Balance</div><div>Cash Balance: ' + J365.money(S.cash) + '</div>' +
      '<div>Bonus Credit: ' + J365.money(S.bonus) + '</div></div>' +
      '<div class="row"><a class="btn ghost" href="#/withdraw">Withdraw</a><a class="btn pri" href="#/deposit">Deposit</a></div></section>' +
      '<section class="card"><div class="sec-h"><h2>Messages</h2><a class="more" href="#/account/messages">More ›</a></div>' +
      '<p style="font-size:13px">' + S.messages[0].title + ' — ' + S.messages[0].body + '</p></section>' +
      '<section class="card"><h2>Security & KYC</h2>' +
      '<p>KYC Verification <b class="st ok">' + m.kyc + '</b> <a href="#/kyc">›</a></p>' +
      '<p style="font-size:13px;color:#666">Phone ' + m.phone + ' · Email ' + m.email + '</p>' +
      '<p style="font-size:13px"><a href="#/account/changeLoginPassword">Login Password Modify ›</a> · <a href="#/account/changeTransactionPin">Transaction PIN Modify ›</a></p>' +
      '<p style="font-size:13px"><a href="#/account/limit">Limits & Self-Exclusion ›</a></p></section>' +
      '<section class="card"><h2>Transactions</h2>' + S.txns.slice(0, 3).map(function (t) {
        return '<p style="font-size:13px"><span class="' + (t.amount < 0 ? 'st fail' : 'st ok') + '">' + t.type + '</span> · ' + t.time + ' · ' + J365.money(t.amount) + '</p>';
      }).join('') + '<a class="btn ghost block" href="#/account/transactions">View All Transactions</a></section></div>' +
      '<section class="card" style="margin-top:12px"><div class="sec-h"><h2>Banking & Wallets</h2></div><div style="display:flex;gap:12px;flex-wrap:wrap">' +
      S.wallets.map(function (w) {
        return '<div style="flex:1;min-width:180px;background:linear-gradient(90deg,#1e6bff,#60a5fa);color:#fff;border-radius:12px;padding:16px">' + w.name + '<br>' + w.no + '<div class="sub" style="color:#e0f2fe">' + w.status + '</div></div>';
      }).join('') + '</div>' +
      '<div class="row"><a class="btn pri" href="#/add-gcash">Link GCash</a><a class="btn ghost" href="#/add-maya">Link Maya</a><a class="btn line" href="#/add-bank">Link Bank</a></div></section>';
  };

  P.messages = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Account', '#/account'], ['Messages']]) +
      '<div class="tabs" id="msgTabs"><button class="tab on" type="button" data-mt="All">All</button>' +
      '<button class="tab" type="button" data-mt="unread">Unread</button></div><div id="msgList"></div>';
    function draw(f) {
      var list = S.messages.filter(function (m) { return f === 'All' || !m.read; });
      document.getElementById('msgList').innerHTML = list.map(function (m) {
        return '<div class="li" data-mid="' + m.id + '"><div><b>' + m.title + '</b><div class="sub">' + m.type + ' · ' + m.time + '</div><p>' + m.body + '</p></div>' +
          '<span class="st ' + (m.read ? 'mute' : 'wait') + '">' + (m.read ? '已读' : '未读') + '</span></div>';
      }).join('') || empty();
    }
    draw('All');
    document.getElementById('msgTabs').onclick = function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      [].forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
      draw(b.getAttribute('data-mt'));
    };
    page.onclick = function (e) {
      var row = e.target.closest('[data-mid]'); if (!row) return;
      var m = S.messages.filter(function (x) { return x.id === row.getAttribute('data-mid'); })[0];
      m.read = true; J365.persist(); J365Shell.toast(m.title); draw(document.querySelector('#msgTabs .on').getAttribute('data-mt'));
    };
  };

  P.txns = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Account', '#/account'], ['Transactions']]) +
      '<div class="tabs" id="txTabs">' + ['All', 'Deposit', 'Withdraw', 'Rebate', 'Daily Cashback'].map(function (t, i) {
        return '<button class="tab' + (i === 0 ? ' on' : '') + '" type="button" data-tt="' + t + '">' + t + '</button>';
      }).join('') + '</div><div id="txList"></div>';
    function draw(t) {
      var list = S.txns.filter(function (x) { return t === 'All' || x.type === t; });
      document.getElementById('txList').innerHTML = list.map(function (x) {
        return '<div class="li"><div><b>' + x.type + '</b><div class="sub">' + x.order + ' · ' + x.channel + ' · ' + x.time + '</div></div>' +
          '<div style="text-align:right"><b>' + J365.money(x.amount) + '</b><div class="st ' + (x.status.indexOf('拒绝') >= 0 ? 'fail' : 'ok') + '">' + x.status + '</div></div></div>';
      }).join('') || empty();
    }
    draw('All');
    document.getElementById('txTabs').onclick = function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      [].forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
      draw(b.getAttribute('data-tt'));
    };
  };

  P.limit = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Account', '#/account'], ['Limits and Self-exclusion']]) +
      '<section class="card"><h3>Deposit limit</h3><div class="field"><label>Daily max (₱)</label><input id="limD" value="50000.00"></div>' +
      '<div class="field"><label>Self-exclusion</label><select id="limE"><option>Off</option><option>24 hours</option><option>7 days</option><option>30 days</option></select></div>' +
      '<button class="btn pri" type="button" id="saveLim">Save</button></section>';
    document.getElementById('saveLim').onclick = function () {
      J365Shell._afterPin = function () { J365Shell.toast('Limit saved (demo)'); };
      J365Shell.open('mPin');
    };
  };

  P.change = function (page, kind) {
    var map = {
      phone: ['Set Phone Number', 'New phone', '0917 xxx xxxx'],
      email: ['Set Email', 'New email', 'name@gmail.com'],
      pwd: ['Set Login Password', 'New password', '8+ letters & numbers'],
      pin: ['Set Transaction PIN', 'New 6-digit PIN', '258369']
    }[kind];
    page.innerHTML = crumb([['Home', '#/home'], ['Account', '#/account'], [map[0]]]) +
      '<section class="card"><div class="field"><label>' + map[1] + '</label><input id="chgV" placeholder="' + map[2] + '"></div>' +
      '<div class="field"><label>OTP</label><input id="chgO" placeholder="6-digit code"><button class="btn line" type="button" id="sendO" style="margin-top:8px">Send code</button></div>' +
      '<button class="btn pri" type="button" id="saveChg">Confirm</button></section>';
    document.getElementById('sendO').onclick = function () { J365Shell.toast('OTP 123456 sent (demo)'); };
    document.getElementById('saveChg').onclick = function () {
      if ((document.getElementById('chgO').value || '123456') !== '123456' && document.getElementById('chgO').value) {
        return J365Shell.toast('Invalid OTP');
      }
      J365Shell.toast(map[0] + ' updated (demo)');
      location.hash = '#/account';
    };
  };

  P.deposit = function (page) {
    var ch = 'GCash'; var amt = 1000;
    page.innerHTML = crumb([['Home', '#/home'], ['Deposit']]) +
      '<div class="grid-2"><section class="card"><h3>Payment</h3>' +
      [['GCash', '#1071f3'], ['Maya', '#16a34a'], ['Bank', '#111827']].map(function (x, i) {
        return '<div class="pay-item' + (i === 0 ? ' on' : '') + '" data-ch="' + x[0] + '"><span class="pay-ico" style="background:' + x[1] + '">' + x[0].slice(0, 2) + '</span>' + x[0] + '</div>';
      }).join('') + '</section>' +
      '<section class="card"><h3>Deposit Amount</h3><div class="amt-grid" id="amts">' +
      [500, 1000, 2000, 5000, 10000, 20000].map(function (n, i) {
        return '<button class="amt' + (n === 1000 ? ' on' : '') + '" type="button" data-amt="' + n + '">' + J365.money(n) + '</button>';
      }).join('') + '</div>' +
      '<div class="field"><label>Custom amount</label><input id="depC" placeholder="Min ₱ 100.00"></div>' +
      '<p class="sub">First deposit 50% bonus still available if first cash-in ≥ ₱ 500.00. Current first-deposit: ' + (S.firstDepositDone ? 'already used' : 'available') + '.</p>' +
      '<button class="btn pri block" type="button" id="doDep">Deposit</button></section></div>';
    page.onclick = function (e) {
      var c = e.target.closest('[data-ch]');
      if (c) { ch = c.getAttribute('data-ch'); [].forEach.call(page.querySelectorAll('[data-ch]'), function (x) { x.classList.toggle('on', x === c); }); }
      var a = e.target.closest('[data-amt]');
      if (a) { amt = Number(a.getAttribute('data-amt')); [].forEach.call(page.querySelectorAll('[data-amt]'), function (x) { x.classList.toggle('on', x === a); }); }
    };
    document.getElementById('doDep').onclick = function () {
      if (!S.loggedIn) return J365Shell.requireAuth('#/deposit');
      var n = Number(document.getElementById('depC').value || amt);
      if (n < 100) return J365Shell.toast('Min deposit ₱ 100.00');
      S.cash += n;
      J365.addTxn({ id: 'T' + Date.now(), type: 'Deposit', amount: n, status: '已到账', time: J365.fmt(new Date()), channel: ch, order: 'D' + Date.now() });
      J365.persist();
      J365Shell.toast('Scan to pay completed · ' + J365.money(n) + ' (demo)');
      location.hash = '#/account';
    };
  };

  P.withdraw = function (page) {
    var w = S.wallets[0];
    page.innerHTML = crumb([['Home', '#/home'], ['Withdraw']]) +
      '<div class="steps"><div class="step done"><b>1 Phone</b>Configured</div><div class="step done"><b>2 PIN</b>Configured</div>' +
      '<div class="step done"><b>3 KYC</b>' + S.member.kyc + '</div></div>' +
      '<section class="card"><h3>To</h3>' + S.wallets.map(function (x, i) {
        return '<div class="pay-item' + (i === 0 ? ' on' : '') + '" data-w="' + x.id + '">' + x.name + ' · ' + x.no + '</div>';
      }).join('') +
      '<div class="field"><label>Amount</label><input id="wdA" placeholder="Min ₱ 200.00 · Cash ' + J365.money(S.cash) + '"></div>' +
      '<p class="sub">Turnover remaining ₱ 0.00 · Fee ₱ 0.00</p>' +
      '<button class="btn pri block" type="button" id="doWd">Withdraw</button></section>';
    page.onclick = function (e) {
      var c = e.target.closest('[data-w]'); if (!c) return;
      w = S.wallets.filter(function (x) { return x.id === c.getAttribute('data-w'); })[0];
      [].forEach.call(page.querySelectorAll('[data-w]'), function (x) { x.classList.toggle('on', x === c); });
    };
    document.getElementById('doWd').onclick = function () {
      if (!S.loggedIn) return J365Shell.requireAuth('#/withdraw');
      var n = Number(document.getElementById('wdA').value || 0);
      if (n < 200) return J365Shell.toast('Min withdraw ₱ 200.00');
      if (n > S.cash) return J365Shell.toast('Insufficient cash balance');
      J365Shell._afterPin = function () {
        S.cash -= n;
        J365.addTxn({ id: 'T' + Date.now(), type: 'Withdraw', amount: -n, status: '待审核', time: J365.fmt(new Date()), channel: w.type, order: 'W' + Date.now() });
        J365.persist();
        J365Shell.toast('Withdraw request submitted');
        location.hash = '#/account/transactions';
      };
      J365Shell.open('mPin');
    };
  };

  P.addWallet = function (page, type) {
    page.innerHTML = crumb([['Home', '#/home'], ['Wallet', '#/deposit'], [type]]) +
      '<section class="card"><div class="field"><label>Account name</label><input id="wn" placeholder="JUAN DELA CRUZ"></div>' +
      '<div class="field"><label>Account number</label><input id="wnn" placeholder="' + (type === 'Bank' ? 'Bank account' : '09xx xxx xxxx') + '"></div>' +
      (type === 'Bank' ? '<div class="field"><label>Bank</label><select><option>BPI</option><option>UnionBank</option><option>Standard Chartered</option></select></div>' : '') +
      '<button class="btn pri" type="button" id="saveW">Save</button></section>';
    document.getElementById('saveW').onclick = function () {
      J365Shell._afterPin = function () {
        S.wallets.push({ id: 'w' + Date.now(), type: type, name: type, no: (document.getElementById('wnn').value || '09xx **** xxxx'), status: 'Pending' });
        J365.persist(); J365Shell.toast(type + ' submitted'); location.hash = '#/account';
      };
      J365Shell.open('mPin');
    };
  };

  P.kyc = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Account', '#/account'], ['KYC Verification']]) +
      '<section class="card"><p>Status: <b class="st ok">' + S.member.kyc + '</b></p>' +
      '<div class="field"><label>Full name</label><input value="JUAN DELA CRUZ"></div>' +
      '<div class="field"><label>ID type</label><select><option>UMID</option><option>Passport</option><option>Driver License</option></select></div>' +
      '<div class="field"><label>ID number</label><input value="CRN-0111-2222333"></div>' +
      '<button class="btn pri" type="button" id="kycBtn">Submit</button></section>';
    document.getElementById('kycBtn').onclick = function () { J365Shell.toast('KYC already Verified'); };
  };

  P.verify = function (page, kind) {
    page.innerHTML = crumb([['Home', '#/home'], ['Complete account'], [kind]]) +
      '<section class="card"><p>Verify your ' + kind + ' to unlock withdraw.</p>' +
      '<div class="field"><input placeholder="' + kind + '"></div>' +
      '<button class="btn pri" type="button" id="vok">Complete now</button></section>';
    document.getElementById('vok').onclick = function () { J365Shell.toast(kind + ' verified (demo)'); location.hash = '#/account'; };
  };

  P.info = function (page, title, body) {
    page.innerHTML = crumb([['Home', '#/home'], [title]]) + '<section class="card">' + body + '</section>';
  };

  P.recent = function (page) {
    var list = S.recent.map(function (id) { return J365.games.filter(function (g) { return g.id === id; })[0]; }).filter(Boolean);
    page.innerHTML = crumb([['Home', '#/home'], ['Recently']]) + (list.length ? games(list) : empty('No recently played'));
  };

  P.platform = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Providers']]) +
      '<div class="providers">' + J365.providers.map(function (p) { return '<span data-go="' + p + '">' + p + '</span>'; }).join('') + '</div>' +
      '<div id="platGames" style="margin-top:14px">' + games(J365.games) + '</div>';
    page.onclick = function (e) {
      var s = e.target.closest('[data-go]'); if (!s) return;
      var list = J365.games.filter(function (g) { return g.provider === s.getAttribute('data-go'); });
      document.getElementById('platGames').innerHTML = games(list);
    };
  };

  P.promoCode = function (page) {
    page.innerHTML = crumb([['Home', '#/home'], ['Promo Code']]) +
      '<section class="card"><div class="field"><label>Code</label><input id="pc" placeholder="JUAN365"></div>' +
      '<button class="btn pri" type="button" id="pcGo">Redeem</button></section>';
    document.getElementById('pcGo').onclick = function () {
      if (!S.loggedIn) return J365Shell.requireAuth('#/promo-code');
      if ((document.getElementById('pc').value || '').toUpperCase() === 'JUAN365') {
        S.bonus += 36.5; J365.persist(); J365Shell.toast('Redeemed ₱ 36.50');
      } else J365Shell.toast('Invalid code');
    };
  };

  P.stand = function (page, kind) {
    if (kind === 'maint') {
      page.innerHTML = '<div class="stand-box"><div class="gear">⚙</div><div><h1>Under Maintenance</h1><p>We will be back shortly. Live chat stays on.</p><button class="btn pri" type="button" data-act="chat">Live Chat</button></div></div>';
    } else {
      page.innerHTML = '<div class="stand-box"><div class="gear">⛔</div><div><h1>Access Restricted</h1><p>Your IP / region is not allowed. Contact support if this is a mistake.</p><button class="btn pri" type="button" data-act="chat">Live Chat</button></div></div>';
    }
  };

  global.J365Pages = P;
})(window);
