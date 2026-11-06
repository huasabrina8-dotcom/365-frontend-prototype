(function () {
  'use strict';
  var S = J365.state;
  function $(id) { return document.getElementById(id); }
  function toast(m) {
    var el = $('toast'); el.textContent = m; el.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { el.hidden = true; }, 1800);
  }
  function money(n) { return J365.money(n); }
  function card(g) {
    return '<article class="g-card" data-game="' + g.id + '">' +
      (g.tag ? '<span class="g-tag">' + g.tag.toUpperCase() + '</span>' : '') +
      '<div class="g-art" style="background:' + g.art + '"></div><p><b>' + g.name + '</b><small>' + g.provider + '</small></p></article>';
  }
  function path() { return (location.hash || '#/home').replace(/^#/, '') || '/home'; }
  function go(h) { location.hash = h; }

  function topbar() {
    var right = S.loggedIn
      ? '<span class="bal">' + money(S.cash) + '</span><a class="btn pri" href="#/deposit">Deposit</a>'
      : '<button class="btn ghost" type="button" data-act="login">Login</button><button class="btn pri" type="button" data-act="login">Sign Up</button>';
    return '<div class="top"><a class="logo" href="#/home"><b>JUAN</b><i>365</i></a><div class="sp"></div>' + right + '</div>';
  }
  function tabbar(on) {
    return '<nav class="tabbar">' +
      '<a class="' + (on === 'home' ? 'on' : '') + '" href="#/home">Home</a>' +
      '<a class="' + (on === 'promo' ? 'on' : '') + '" href="#/promotions">Promos</a>' +
      '<a class="dep" href="#/deposit">₱</a>' +
      '<a class="' + (on === 'vip' ? 'on' : '') + '" href="#/vipClub">VIP</a>' +
      '<a class="' + (on === 'me' ? 'on' : '') + '" href="#/account">Account</a></nav>';
  }

  function viewHome() {
    return '<div class="hero"><b>50% First Deposit</b><p>Bonus up to ₱ 5,000 · 21+</p></div>' +
      '<div class="ticker">Bingo365 · play responsibly · PAGCOR 21+</div>' +
      '<div class="htabs">' + J365.cats.map(function (c, i) {
        return '<button class="htab' + (i === 0 ? ' on' : '') + '" data-cat="' + c + '">' + c + '</button>';
      }).join('') + '</div><div class="games" id="gbox">' + J365.games.slice(0, 9).map(card).join('') + '</div>';
  }
  function viewPromo() {
    return J365.promos.map(function (p) {
      var href = p.id === 'p9' ? '#/leaderboard' : '#/activity-detail/' + p.id;
      return '<a class="promo" style="display:block;background:linear-gradient(180deg,#FFB325,#FF7344)" href="' + href + '"><b>' + p.title + '</b><p>' + p.desc + '</p></a>';
    }).join('');
  }
  function viewVip() {
    return '<div class="card"><h3>VIP ' + S.member.vip + '</h3><p>XP ' + S.member.vipXp.toLocaleString() + ' / ' + S.member.vipNeed.toLocaleString() + '</p>' +
      '<p>Weekly cashback ' + money(S.weeklyCashback) + '</p><a class="btn pri" href="#/rebate">Claim cashback</a></div>' +
      '<div class="card"><b>Benefits</b><p>✓ Events · ✓ Manager · 🔒 Travel · 🔒 Mystery gifts</p></div>';
  }
  function viewAccount() {
    if (!S.loggedIn) return '<div class="card"><p>Login to view account</p><button class="btn pri block" data-act="login">Login</button></div>';
    return '<div class="card"><b>' + S.member.account + '</b><p>ID ' + S.member.id + ' · ' + S.member.vip + '</p>' +
      '<p>Cash ' + money(S.cash) + '<br>Bonus ' + money(S.bonus) + '</p>' +
      '<a class="btn pri" href="#/deposit">Deposit</a> <a class="btn ghost" href="#/withdraw">Withdraw</a></div>' +
      '<div class="card"><a href="#/account/messages">Messages (' + J365.unread() + ')</a></div>' +
      '<div class="card"><a href="#/account/transactions">Transactions</a></div>' +
      '<div class="card"><a href="#/agent">Affiliate</a> · <a href="#/daily-task">Daily Tasks</a></div>';
  }
  function viewDeposit() {
    return '<div class="card"><h3>Deposit</h3><div class="amt" id="amts">' +
      [500, 1000, 2000, 5000].map(function (n) { return '<button data-amt="' + n + '"' + (n === 1000 ? ' class="on"' : '') + '>' + money(n) + '</button>'; }).join('') +
      '</div><div class="field"><input id="depC" placeholder="Custom min 100"></div>' +
      '<button class="btn pri block" id="doDep">Pay with GCash</button></div>';
  }
  function viewWithdraw() {
    return '<div class="card"><h3>Withdraw</h3><p>To GCash ' + S.member.phone + '</p>' +
      '<div class="field"><input id="wdA" placeholder="Min 200 · Cash ' + money(S.cash) + '"></div>' +
      '<button class="btn pri block" id="doWd">Submit</button></div>';
  }
  function viewLeaderboard() {
    var group = viewLeaderboard.group || 'type';
    var boardId = viewLeaderboard.boardId || 'lb-slot';
    var day = viewLeaderboard.day || 'today';
    var groups = [{ id: 'type', label: 'Game type' }, { id: 'vendor', label: 'Provider' }, { id: 'game', label: 'Game' }];
    var list = J365.boards.filter(function (b) { return b.scope === group; });
    var board = list.filter(function (b) { return b.id === boardId; })[0] || list[0];
    viewLeaderboard.boardId = board.id;
    var claimState = J365.rankClaimState(board, S.loggedIn ? S.member.account : '', day, S.rankClaim);
    var placed = claimState.placed;
    var myRank = claimState.rank;
    var prize = claimState.prize;
    var betNow = claimState.turnover;
    var phase = claimState.phase;
    var top = board.prizes && board.prizes.length ? Number(board.prizes[0].amount) : 0;
    var endAt = new Date(String(claimState.roundEnd || '').replace(/-/g, '/')).getTime() - Date.now();
    var clock = 'Round ended';
    if (claimState.open) clock = 'Claim before ' + claimState.claimUntil;
    else if (!isNaN(endAt) && endAt > 0) {
      var days = Math.floor(endAt / 86400000);
      var hours = Math.floor((endAt % 86400000) / 3600000);
      var mins = Math.floor((endAt % 3600000) / 60000);
      clock = (days > 0 ? days + 'd ' : '') + hours + 'h ' + mins + 'm left';
    }
    var me;
    var btn;
    if (!S.loggedIn) {
      me = '<p>Login to see your rank and cash prize.</p>';
      btn = '<button class="btn pri block" data-act="login">Login</button>';
    } else if (phase === 'live' && myRank) {
      me = '<p>Rank <b>' + myRank + '</b> · Bet ' + money(betNow) + '</p><p>Estimated cash <b>' + money(prize) + '</b>. Fixed for this rank.</p>';
      btn = '<button class="btn pri block" disabled>Claim opens at round end</button>';
    } else if (phase === 'live' && betNow < Number(board.minBet)) {
      me = '<p>Not qualified yet.</p>';
      btn = '<a class="btn pri block" href="' + board.play + '">Bet ' + money(board.minBet) + ' to Qualify</a>';
    } else if (phase === 'live') {
      me = '<p>Bet ' + money(betNow) + '. Outside the paid ranks.</p>';
      btn = '<button class="btn pri block" disabled>Not qualified</button>';
    } else if (claimState.open) {
      me = '<p>Rank <b>' + myRank + '</b> · Bet ' + money(betNow) + '</p><p>Cash <b>' + money(prize) + '</b>. Claim before ' + claimState.claimUntil + '.</p>';
      btn = '<button class="btn pri block" id="lbClaim">Claim ' + money(prize) + '</button>';
    } else if (myRank && prize && claimState.claimed) {
      me = '<p>Rank <b>' + myRank + '</b> · Cash <b>' + money(prize) + '</b></p><p>Claimed to your cash balance.</p>';
      btn = '<button class="btn pri block" disabled>Claimed</button>';
    } else {
      me = '<p>Not qualified on this round.</p>';
      btn = '<button class="btn pri block" disabled>Not qualified</button>';
    }
    function medal(rank) {
      if (rank <= 3) return '<span class="medal m' + rank + '">' + rank + '</span>';
      return String(rank);
    }
    var rows = placed.rows.slice(0, 10).map(function (r) {
      var mine = S.loggedIn && r.account === S.member.account;
      var initial = String(r.account || '?').slice(0, 1).toUpperCase();
      return '<div class="lbr' + (mine ? ' me' : '') + '"><span>' + medal(r.rank) + '</span><div><span class="ava">' + initial +
        '</span>' + J365.maskAccount(r.account) + '<br><small>Bet ' + money(r.turnover) + '</small></div><b>' +
        money(J365.rankPrize(r.rank, board.prizes)) + '</b></div>';
    }).join('');
    var youPay = myRank && prize ? money(prize) : 'Not qualified';
    var youBar = '<div class="lb-you"><span>' + (myRank ? medal(myRank) : '--') + '</span><div><b>You</b><br><small>' +
      (S.loggedIn ? ('Bet ' + money(betNow)) : '--') + '</small></div><b>' + youPay + '</b></div>';
    var podium = '<div class="lbp">' + [2, 1, 3].map(function (rank) {
      var amt = J365.rankPrize(rank, board.prizes);
      if (!amt) return '';
      return '<i class="p' + rank + '"><span>' + rank + '</span><b>' + money(amt) + '</b></i>';
    }).join('') + '</div>';
    var ladder = board.prizes.map(function (p) {
      var winners = Number(p.to) - Number(p.from) + 1;
      var label = p.from === p.to ? 'Rank ' + p.from : 'Rank ' + p.from + '–' + p.to;
      return '<div class="li"><div>' + label + '<br><small>' + winners + (winners === 1 ? ' winner' : ' winners') + '</small></div><b>' + money(p.amount) + '</b></div>';
    }).join('');
    var dayTabs = '';
    if (board.history) {
      dayTabs = '<div class="htabs" id="lbDays">' +
        '<button class="htab' + (day !== 'past' ? ' on' : '') + '" data-day="today">This week</button>' +
        '<button class="htab' + (day === 'past' ? ' on' : '') + '" data-day="past">' + board.history.tab + '</button></div>';
    } else if (board.yesterday) {
      dayTabs = '<div class="htabs" id="lbDays">' +
        '<button class="htab' + (day === 'today' ? ' on' : '') + '" data-day="today">Today</button>' +
        '<button class="htab' + (day === 'yesterday' ? ' on' : '') + '" data-day="yesterday">Yesterday</button></div>';
    }
    return '<div class="lbh"><div class="k">' + board.cycle + ' · ' + board.start.slice(0, 10) + ' – ' + board.end.slice(0, 10) + '</div>' +
      '<b>' + board.title + ', up to ' + money(top) + '</b>' +
      '<p>' + clock + ' · Updates every 10 minutes · GMT+8</p></div>' +
      '<div class="lbq">Bet <b>' + money(betNow) + '</b> / <b>' + money(board.minBet) + '</b> to qualify</div>' +
      '<div class="htabs" id="lbScopes">' + groups.map(function (g) {
        return '<button class="htab' + (g.id === group ? ' on' : '') + '" data-scope="' + g.id + '">' + g.label + '</button>';
      }).join('') + '</div>' +
      '<div class="htabs" id="lbBoards">' + list.map(function (b) {
        return '<button class="htab' + (b.id === board.id ? ' on' : '') + '" data-board="' + b.id + '">' + b.target + '</button>';
      }).join('') + '</div>' + dayTabs +
      '<div class="card"><b>Your place</b>' + me + btn +
      '<p class="sub">Claim the cash for your displayed rank within 72 hours after the round ends. Turnover ×' + board.wager + ' before withdrawal. Valid for ' + (board.bonusDays || 30) + ' days.</p></div>' +
      '<div class="card"><b>Cash prizes</b>' + podium +
      '<p class="sub">Each rank pays this cash amount. Your bet does not split a pool.</p>' + ladder + '</div>' +
      '<div class="card"><b>Ranking</b><div class="lbr head"><span>Rank</span><span>Player / Bet</span><span>Cash</span></div>' + rows + youBar +
      '<p class="sub">Last refresh 2026-11-06 21:30:00. Same bet: whoever reached it first ranks higher.</p></div>' +
      '<div class="card how"><b>How it works</b>' +
      '<p>1. Only valid bets on this board count.</p>' +
      '<p>2. Reach ' + money(board.minBet) + ' to qualify. Bet decides the rank. Cash is fixed for that rank.</p>' +
      '<p>3. Refreshes every 10 minutes. Official bet records decide the final rank.</p>' +
      '<p>4. Claim within 72 hours. Turnover ×' + board.wager + '. Valid ' + (board.bonusDays || 30) + ' days.</p>' +
      '<p>5. One rank per board. Cash from different boards is paid separately.</p></div>';
  }

  function viewMore(p) {
    if (p === '/leaderboard') return viewLeaderboard();
    if (p.indexOf('/activity-detail/') === 0) {
      var item = J365.promos.filter(function (x) { return x.id === p.split('/')[2]; })[0] || J365.promos[0];
      return '<div class="card"><h3>' + item.title + '</h3><p>' + item.desc + '</p><a class="btn pri" href="#/deposit">Join</a></div>';
    }
    if (p === '/account/messages') {
      return S.messages.map(function (m) { return '<div class="card"><b>' + m.title + '</b><p>' + m.body + '</p><small>' + m.time + '</small></div>'; }).join('');
    }
    if (p === '/account/transactions') {
      return S.txns.map(function (t) { return '<div class="li"><div>' + t.type + '<br><small>' + t.time + '</small></div><b>' + money(t.amount) + '</b></div>'; }).join('');
    }
    if (p === '/agent') {
      return '<div class="card"><h3>Affiliate</h3><p>Invite ' + S.member.invite + '</p><p>Unpaid ' + money(S.agent.unpaid) + '</p></div>' +
        S.refs.map(function (r) { return '<div class="li"><div>' + r.account + '<br><small>' + r.phone + '</small></div><span>' + r.status + '</span></div>'; }).join('');
    }
    if (p === '/daily-task') {
      return S.tasks.map(function (t) { return '<div class="li"><div>' + t.name + '<br><small>' + t.status + '</small></div>' + money(t.reward) + '</div>'; }).join('');
    }
    if (p === '/rebate') {
      return '<div class="card"><p>Daily cashback ' + money(S.pendingCashback) + '</p><button class="btn pri block" id="claimCb">Claim</button></div>';
    }
    if (p === '/rain') return '<div class="card"><h3>Money Rain</h3><p>Open on PC for full grab interaction, or tap below.</p><button class="btn pri block" id="grab">Grab ₱8.88</button></div>';
    if (p === '/spin') return '<div class="card"><h3>Lucky Spin</h3><p>Credit ' + money(S.spinCredit) + '</p><button class="btn pri block" id="spin">Spin</button></div>';
    return '<div class="empty">Open PC lobby for full page · <a href="../c-end/#' + p + '">PC</a></div>';
  }

  function tabOf(p) {
    if (p === '/leaderboard' || p.indexOf('/promo') === 0 || p.indexOf('/activity') === 0) return 'promo';
    if (p.indexOf('/vip') === 0) return 'vip';
    if (p.indexOf('/account') === 0 || p === '/agent' || p === '/daily-task') return 'me';
    if (p === '/deposit' || p === '/withdraw') return 'home';
    return 'home';
  }

  function render() {
    var p = path();
    var root = $('app');
    var inner = viewHome();
    if (p === '/promotions') inner = viewPromo();
    else if (p === '/vipClub') inner = viewVip();
    else if (p === '/account') inner = viewAccount();
    else if (p === '/deposit') inner = viewDeposit();
    else if (p === '/withdraw') inner = viewWithdraw();
    else if (p !== '/home') inner = viewMore(p);
    root.innerHTML = topbar() + '<div class="view" id="view">' + inner + '</div>' + tabbar(tabOf(p));
    bind();
  }

  function bind() {
    document.querySelectorAll('[data-cat]').forEach(function (b) {
      b.onclick = function () {
        document.querySelectorAll('[data-cat]').forEach(function (x) { x.classList.toggle('on', x === b); });
        var n = b.getAttribute('data-cat');
        var list = n === 'Lobby' ? J365.games.slice(0, 9) : J365.games.filter(function (g) { return g.cat === n; });
        $('gbox').innerHTML = list.map(card).join('') || '<div class="empty">No record</div>';
      };
    });
    document.querySelectorAll('[data-game]').forEach(function (g) {
      g.onclick = function () {
        if (!S.loggedIn) return openLogin();
        toast('Launched ' + g.querySelector('b').textContent + ' (demo)');
      };
    });
    document.querySelectorAll('[data-act="login"]').forEach(function (b) { b.onclick = openLogin; });
    var dep = $('doDep');
    if (dep) dep.onclick = function () {
      if (!S.loggedIn) return openLogin();
      var on = document.querySelector('[data-amt].on');
      var n = Number(($('depC').value) || (on && on.getAttribute('data-amt')) || 1000);
      if (n < 100) return toast('Min ₱ 100.00');
      S.cash += n; J365.persist(); toast('Deposited ' + money(n)); go('#/account');
    };
    document.querySelectorAll('[data-amt]').forEach(function (b) {
      b.onclick = function () { document.querySelectorAll('[data-amt]').forEach(function (x) { x.classList.toggle('on', x === b); }); };
    });
    var wd = $('doWd');
    if (wd) wd.onclick = function () {
      if (!S.loggedIn) return openLogin();
      var n = Number($('wdA').value || 0);
      if (n < 200) return toast('Min ₱ 200.00');
      if (n > S.cash) return toast('Insufficient cash');
      S.cash -= n; J365.persist(); toast('Withdraw submitted'); go('#/account/transactions');
    };
    var cb = $('claimCb');
    if (cb) cb.onclick = function () {
      if (!S.loggedIn) return openLogin();
      S.cash += S.pendingCashback; S.pendingCashback = 0; J365.persist(); toast('Claimed'); render();
    };
    document.querySelectorAll('[data-scope]').forEach(function (b) {
      b.onclick = function () {
        viewLeaderboard.group = b.getAttribute('data-scope');
        var first = J365.boards.filter(function (x) { return x.scope === viewLeaderboard.group; })[0];
        viewLeaderboard.boardId = first ? first.id : '';
        viewLeaderboard.day = 'today';
        render();
      };
    });
    document.querySelectorAll('#lbBoards [data-board]').forEach(function (b) {
      b.onclick = function () {
        viewLeaderboard.boardId = b.getAttribute('data-board');
        viewLeaderboard.day = 'today';
        render();
      };
    });
    document.querySelectorAll('#lbDays [data-day]').forEach(function (b) {
      b.onclick = function () {
        viewLeaderboard.day = b.getAttribute('data-day');
        render();
      };
    });
    var lb = $('lbClaim');
    if (lb) lb.onclick = function () {
      if (!S.loggedIn) return openLogin();
      var board = J365.boards.filter(function (x) { return x.id === viewLeaderboard.boardId; })[0];
      if (!board) return;
      var again = J365.rankClaimState(board, S.member.account, viewLeaderboard.day, S.rankClaim);
      if (!again.open) return;
      var pay = again.prize;
      S.rankClaim = S.rankClaim || {};
      S.rankClaim[again.key] = 1;
      S.cash += pay;
      J365.addTxn({
        id: 'T' + Date.now(),
        type: 'Leaderboard',
        amount: pay,
        status: '已领取',
        time: J365.fmt(new Date()),
        channel: 'Cash',
        order: 'L' + Date.now()
      });
      J365.persist();
      toast('Claimed ' + money(pay));
      render();
    };
    var grab = $('grab');
    if (grab) grab.onclick = function () { if (!S.loggedIn) return openLogin(); S.bonus += 8.88; J365.persist(); toast('₱ 8.88'); };
    var spin = $('spin');
    if (spin) spin.onclick = function () { if (!S.loggedIn) return openLogin(); S.bonus += 50; J365.persist(); toast('Won ₱ 50.00'); };
  }

  function openLogin() {
    $('mLogin').hidden = false;
  }

  $('app').parentNode.insertAdjacentHTML('beforeend',
    '<div class="mask" id="mLogin" hidden><div class="sheet"><h3>Welcome to Bingo365</h3>' +
    '<div class="field"><input id="phoneIn" value="096930983098"></div>' +
    '<label style="font-size:12px"><input type="checkbox" id="agreeBox"> I agree to Terms</label>' +
    '<button class="btn pri block" id="doLogin" style="margin-top:10px">Login</button>' +
    '<button class="btn block" id="closeL" style="margin-top:8px;background:#eee">Cancel</button></div></div>' +
    '<div class="toast" id="toast" hidden></div>' +
    '<div class="demo">预览 <button id="dIn">已登录</button> <button id="dOut">未登录</button> <a href="../c-end/" style="color:#fff">PC</a></div>'
  );
  document.addEventListener('click', function (e) {
    if (e.target.id === 'doLogin') {
      if (!$('agreeBox').checked) return toast('Agree to Terms first');
      S.loggedIn = true; S.seenRg = true; J365.persist(); $('mLogin').hidden = true; toast('Welcome'); render();
    }
    if (e.target.id === 'closeL') $('mLogin').hidden = true;
    if (e.target.id === 'dIn') { S.loggedIn = true; J365.persist(); location.reload(); }
    if (e.target.id === 'dOut') { S.loggedIn = false; J365.persist(); location.reload(); }
  });
  window.addEventListener('hashchange', render);
  render();
})();
