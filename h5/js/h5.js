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
      return '<a class="promo" style="display:block;background:linear-gradient(180deg,#FFB325,#FF7344)" href="#/activity-detail/' + p.id + '"><b>' + p.title + '</b><p>' + p.desc + '</p></a>';
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
  function viewMore(p) {
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
    if (p.indexOf('/promo') === 0 || p.indexOf('/activity') === 0) return 'promo';
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
