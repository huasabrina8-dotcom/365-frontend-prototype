(function (global) {
  'use strict';
  var S = J365.state;

  var SIDE_NAV = [
    ['home', 'Home', '#/home'],
    ['bonus', 'Bonus', '#/bonus'],
    ['slot', 'Slot', '#/category/Slot'],
    ['bingo', 'Bingo', '#/category/Bingo'],
    ['perya', 'Perya', '#/category/Perya'],
    ['casino', 'Casino', '#/category/Casino'],
    ['sports', 'Sports', '#/category/Sports'],
    ['card', 'Card', '#/category/Card'],
    ['arcade', 'Arcade', '#/category/Arcade'],
    ['fishing', 'Fishing', '#/category/Fishing'],
    ['numeric', 'Numeric', '#/category/Numeric'],
    ['promo', 'Promotions', '#/promotions'],
    ['vip', 'VIP Club', '#/vipClub']
  ];

  function $(id) { return document.getElementById(id); }
  function toast(msg) {
    var el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.hidden = true; }, 2200);
  }

  function header() {
    var right = S.loggedIn
      ? '<div class="bal"><span><i class="coin g"></i>' + J365.money(S.cash).replace('₱ ', '') + '</span>' +
        '<span><i class="coin b"></i>' + J365.money(S.bonus).replace('₱ ', '') + '</span></div>' +
        '<button class="ico" type="button" data-act="refresh" title="Refresh">↻</button>' +
        '<a class="btn pri" href="#/deposit">Deposit</a>' +
        '<a class="av" href="#/account" title="Account">' + S.member.account.slice(0, 1).toUpperCase() + '</a>'
      : '<button class="btn ghost" type="button" data-act="login">Login</button>' +
        '<button class="btn pri" type="button" data-act="signup">Sign Up</button>';
    var unread = J365.unread();
    return (
      '<header class="hd">' +
      '<a class="logo" href="#/home"><div><b>JUAN</b><i>365</i><small>JUAN365.COM</small></div></a>' +
      '<button class="search" type="button" data-act="search">⌕ &nbsp; Search</button>' +
      '<div class="hd-r">' + right +
      '<button class="ico" type="button" data-act="msg" title="Messages">✉' + (unread ? '<i class="dot"></i>' : '') + '</button>' +
      '<button class="ico" type="button" data-act="chat" title="Support">🎧</button></div></header>'
    );
  }

  function sidebar(active) {
    var tiles = S.loggedIn
      ? '<a class="tile cb" href="#/rebate">Daily Cashback<br><small>' + J365.money(S.pendingCashback) + '</small></a>' +
        '<a class="tile rain" href="#/rain">Money Rain</a>' +
        '<a class="tile aff" href="#/agent">Affiliate</a>' +
        '<a class="tile spin" href="#/spin">Lucky Spin</a>' +
        '<a class="tile task" href="#/daily-task">Daily Tasks</a>'
      : '<a class="tile cb" href="#/rebate">8% Cashback</a>' +
        '<a class="tile rain" href="#/rain">Money Rain</a>' +
        '<a class="tile aff" href="#/agent">Affiliate</a>' +
        '<a class="tile spin" href="#/spin">Lucky Spin</a>' +
        '<a class="tile task" href="#/rebate">Rebate</a>';
    var links = SIDE_NAV.map(function (n) {
      return '<li><a class="' + (n[0] === active ? 'on' : '') + '" href="' + n[2] + '">' + n[1] + '</a></li>';
    }).join('');
    return (
      '<aside class="side"><div class="tiles">' + tiles + '</div>' +
      '<ul class="nav">' + links + '</ul>' +
      '<select class="lang" id="langSel"><option value="en"' + (S.lang === 'en' ? ' selected' : '') + '>English</option>' +
      '<option value="tl"' + (S.lang === 'tl' ? ' selected' : '') + '>Tagalog</option></select>' +
      '<div class="qr"><div></div><div></div></div>' +
      '<div class="qr"><span>iOS</span><span>Android</span></div></aside>'
    );
  }

  function footer() {
    return (
      '<footer class="ft"><div class="fcols">' +
      '<div><h4>Games</h4><a href="#/home">Home</a><a href="#/category/Slot">Slot</a><a href="#/category/Bingo">Bingo</a>' +
      '<a href="#/category/Perya">Perya</a><a href="#/category/Casino">Casino</a><a href="#/category/Sports">Sports</a></div>' +
      '<div><h4>About</h4><a href="#" data-act="chat">Live Chat</a><a href="#/agent">Affiliate</a>' +
      '<a href="#/promotions">Promotions</a><a href="#/vipClub">VIP Club</a><a href="#/about">About Us</a></div>' +
      '<div><h4>Info</h4><a href="#/terms">Terms & Conditions</a><a href="#/responsible">Responsible Gaming</a>' +
      '<a href="#/privacy">Privacy Policy</a><a href="#/contact">Contact Us</a></div>' +
      '<div><h4>Responsible Gaming</h4><p>PAGCOR · 21+ Game Responsibly</p><p style="color:#888;font-size:12px">www.pagcor.ph/regulatory</p></div>' +
      '</div><div class="pay">GCash · Maya · UnionBank · PayLoro · FortunePay · BPI · dragonpay</div>' +
      '<div class="copy">Copyright ©2021-2071 Bingo365. All rights reserved. Demo prototype — not live funds.</div></footer>'
    );
  }

  function floats() {
    return (
      '<div class="float">' +
      '<a class="bonus" href="#/promotions" data-act="signup-float">₱36.5<br>Sign-up</a>' +
      '<a class="rain" href="#/rain">Money<br>Like Rain</a>' +
      '</div>'
    );
  }

  function gameCard(g) {
    return (
      '<article class="g-card" data-game="' + g.id + '">' +
      (g.tag ? '<span class="g-tag ' + g.tag + '">' + g.tag.toUpperCase() + '</span>' : '') +
      '<div class="g-art" style="background:' + g.art + '"></div>' +
      (g.maint ? '<div class="g-maint">UNDER<br>MAINTENANCE</div>' : '') +
      '<p><b>' + g.name + '</b><small>' + g.provider + '</small></p></article>'
    );
  }

  function modals() {
    return (
      '<div class="mask" id="mLogin" hidden>' +
      '<div class="modal wide"><div class="login-art"><b>50% First Deposit</b><p>Welcome bonus up to ₱ 5,000. Play responsibly. 21+.</p></div>' +
      '<div class="login-form"><button class="x" type="button" data-close="mLogin">×</button>' +
      '<h3>Welcome to Bingo365</h3>' +
      '<div class="field"><label>Phone</label><input id="phoneIn" placeholder="09xx xxx xxxx" value="096930983098"></div>' +
      '<div class="field" id="pwdWrap" hidden><label>Password</label><input id="pwdIn" type="password" placeholder="Login password"></div>' +
      '<label style="font-size:12px"><input type="checkbox" id="agreeBox"> I agree to the Terms & Conditions and Privacy Policy</label>' +
      '<button class="btn pri block" type="button" data-act="doLogin" style="margin-top:12px">Login</button>' +
      '<p style="text-align:center;font-size:12px;color:#888"><a href="#" data-act="pwdMode">Login With Password</a> · Facebook · Google</p>' +
      '<div class="legal">Persons below 21, government officials, AFP/PNP members and PAGCOR restricted persons are prohibited.</div>' +
      '</div></div></div>' +

      '<div class="mask" id="mRemind" hidden>' +
      '<div class="modal"><button class="x" type="button" data-close="mRemind">×</button>' +
      '<h3>Reminder</h3><p style="text-align:center">You need agree to the <b style="color:#c4161c">Terms & Conditions</b> and <b style="color:#c4161c">Privacy Policy</b>.</p>' +
      '<div class="row"><button class="btn ghost" type="button" data-close="mRemind">Cancel</button>' +
      '<button class="btn pri" type="button" data-act="acceptTerms">Accept</button></div></div></div>' +

      '<div class="mask" id="mSearch" hidden>' +
      '<div class="modal lg" style="padding:16px"><button class="x" type="button" data-close="mSearch">×</button>' +
      '<h3 style="text-align:left">Search</h3>' +
      '<div class="field"><input id="searchIn" placeholder="Search: game name (min 3 letters)"></div>' +
      '<p id="searchHint" style="font-size:12px;color:#888">Enter at least 3 symbols to start searching.</p>' +
      '<div class="sec-h"><h2>Respected</h2></div>' +
      '<div class="games" id="searchGames">' + J365.games.slice(0, 8).map(gameCard).join('') + '</div></div></div>' +

      '<div class="mask" id="mRg" hidden>' +
      '<div class="modal"><button class="x" type="button" data-close="mRg">×</button>' +
      '<p style="text-align:center;font-weight:800">PAGCOR &nbsp; 21+</p>' +
      '<p style="font-size:12px">The following individuals are prohibited from registering or participating in this online gaming platform:</p>' +
      '<ul class="rg-box"><li>Persons below the legal gambling age of 21.</li>' +
      '<li>Government officials or employees involved in government operations.</li>' +
      '<li>Members of the AFP and PNP.</li>' +
      '<li>Persons listed in PAGCOR’s NDRP.</li>' +
      '<li>Holders of a valid Gaming Employment License (GEL).</li></ul>' +
      '<p style="font-size:12px;text-align:center">Funds of ineligible persons will be forfeited as required by law.</p>' +
      '<div class="row"><button class="btn ghost" type="button" data-act="exit">Exit</button>' +
      '<button class="btn pri" type="button" data-act="acceptRg">Accept</button></div></div></div>' +

      '<div class="mask" id="mAlert" hidden>' +
      '<div class="modal"><button class="x" type="button" data-close="mAlert">×</button>' +
      '<h3>Alert</h3><p style="text-align:center">Your session has ended due to login on another device or inactivity.</p>' +
      '<button class="btn pri block" type="button" data-act="login">Relogin</button></div></div>' +

      '<div class="mask" id="mGame" hidden>' +
      '<div class="modal lg" style="padding:16px"><button class="x" type="button" data-close="mGame">×</button>' +
      '<div id="gameBox"></div></div></div>' +

      '<div class="mask" id="mPin" hidden>' +
      '<div class="modal"><button class="x" type="button" data-close="mPin">×</button>' +
      '<h3>Transaction PIN</h3>' +
      '<div class="field"><label>PIN</label><input id="pinIn" type="password" maxlength="6" placeholder="6-digit PIN"></div>' +
      '<p style="text-align:right;font-size:13px;color:#1071f3"><a href="#/account/changeTransactionPin">Forget PIN</a></p>' +
      '<button class="btn pri block" type="button" data-act="confirmPin">Confirm</button></div></div>' +

      '<div class="chat-dock" id="chatDock" hidden><header>Live Chat <button type="button" data-close="chatDock">×</button></header>' +
      '<div class="msgs" id="chatMsgs">Hi, this is Juan365 support (demo). How can we help?</div>' +
      '<footer><input id="chatIn" placeholder="Type a message"><button type="button" data-act="sendChat">Send</button></footer></div>' +

      '<div class="toast" id="toast" hidden></div>'
    );
  }

  function demoBar() {
    return (
      '<div class="demo-bar">预览 ' +
      '<button type="button" data-demo="guest">未登录</button>' +
      '<button type="button" data-demo="in">已登录</button>' +
      '<button type="button" data-demo="rg">合规弹窗</button>' +
      '<button type="button" data-demo="alert">掉线 Alert</button>' +
      '<button type="button" data-demo="skel">骨架屏</button>' +
      '<a href="#/maintenance">维护</a> <a href="#/ip-block">IP限制</a>' +
      '<a href="../h5/">H5</a></div>'
    );
  }

  function openMask(id) { var el = $(id); if (el) el.hidden = false; }
  function closeMask(id) { var el = $(id); if (el) el.hidden = true; }

  function requireAuth(next) {
    if (S.loggedIn) { location.hash = next; return true; }
    openMask('mLogin');
    toast('Please login first');
    return false;
  }

  function launchGame(id) {
    var g = J365.games.filter(function (x) { return x.id === id; })[0];
    if (!g) return;
    if (g.maint) { toast('This game is under maintenance'); return; }
    if (!S.loggedIn) { openMask('mLogin'); return; }
    if (S.recent.indexOf(id) === -1) S.recent.unshift(id);
    S.recent = S.recent.slice(0, 8);
    J365.persist();
    $('gameBox').innerHTML =
      '<p class="crumb">Home › ' + g.cat + ' › ' + g.name + '</p>' +
      '<div class="game-frame"><div><b style="font-size:22px">' + g.name + '</b>' +
      '<p>' + g.provider + ' · demo table</p>' +
      '<p style="color:#9aa0a6;font-size:12px">No real bets. Balance stays ' + J365.money(S.cash) + '</p>' +
      '<button class="btn pri" type="button" data-close="mGame">Back to lobby</button></div></div>';
    openMask('mGame');
  }

  function bind(root) {
    root.addEventListener('click', function (e) {
      var card = e.target.closest('[data-game]');
      if (card && !e.target.closest('[data-act],[data-close]')) {
        launchGame(card.getAttribute('data-game'));
        return;
      }
      var t = e.target.closest('[data-act],[data-close],[data-demo]');
      if (!t) return;
      if (t.getAttribute('href') === '#') e.preventDefault();
      var close = t.getAttribute('data-close');
      if (close) { closeMask(close); if (close === 'chatDock') $('chatDock').hidden = true; return; }
      var demo = t.getAttribute('data-demo');
      if (demo === 'guest') { S.loggedIn = false; J365.persist(); location.reload(); }
      if (demo === 'in') { S.loggedIn = true; S.seenRg = true; J365.persist(); location.reload(); }
      if (demo === 'rg') openMask('mRg');
      if (demo === 'alert') { S.loggedIn = false; J365.persist(); openMask('mAlert'); }
      if (demo === 'skel') document.body.classList.toggle('skel');
      var act = t.getAttribute('data-act');
      if (act === 'login' || act === 'signup' || act === 'signup-float') { closeMask('mAlert'); openMask('mLogin'); }
      if (act === 'search') openMask('mSearch');
      if (act === 'chat') $('chatDock').hidden = false;
      if (act === 'msg') { if (!requireAuth('#/account/messages')) return; location.hash = '#/account/messages'; }
      if (act === 'rg') openMask('mRg');
      if (act === 'exit') location.hash = '#/ip-block';
      if (act === 'acceptRg') { S.seenRg = true; J365.persist(); closeMask('mRg'); }
      if (act === 'acceptTerms') { var box = $('agreeBox'); if (box) box.checked = true; S.agreedTerms = true; J365.persist(); closeMask('mRemind'); }
      if (act === 'pwdMode') { $('pwdWrap').hidden = !$('pwdWrap').hidden; }
      if (act === 'refresh') { toast('Balance refreshed (demo)'); }
      if (act === 'doLogin') {
        if ($('agreeBox') && !$('agreeBox').checked) { openMask('mRemind'); return; }
        S.loggedIn = true; S.seenRg = true; S.agreedTerms = true; J365.persist();
        closeMask('mLogin');
        toast('Welcome ' + S.member.account);
        location.hash = '#/home';
        location.reload();
      }
      if (act === 'sendChat') {
        var inp = $('chatIn');
        if (!inp || !inp.value.trim()) return;
        $('chatMsgs').innerHTML += '<p><b>You</b> · ' + inp.value + '</p><p>Support · Noted. This is a demo chat.</p>';
        inp.value = '';
      }
      if (act === 'confirmPin') {
        if (($('pinIn') || {}).value === '258369' || ($('pinIn') || {}).value.length === 6) {
          closeMask('mPin');
          toast('PIN verified');
          if (shell._afterPin) shell._afterPin();
        } else toast('Incorrect PIN (demo: any 6 digits)');
      }
      if (act === 'copy') {
        var v = t.getAttribute('data-copy') || '';
        if (navigator.clipboard) navigator.clipboard.writeText(v);
        toast('Copied');
      }
    });
    root.addEventListener('input', function (e) {
      if (e.target.id !== 'searchIn') return;
      var q = e.target.value.trim().toLowerCase();
      var hint = $('searchHint');
      var box = $('searchGames');
      if (q.length < 3) {
        hint.textContent = 'Enter at least 3 symbols to start searching.';
        box.innerHTML = J365.games.slice(0, 8).map(gameCard).join('');
        return;
      }
      var hits = J365.games.filter(function (g) { return g.name.toLowerCase().indexOf(q) >= 0 || g.provider.toLowerCase().indexOf(q) >= 0; });
      hint.textContent = hits.length ? hits.length + ' games found' : 'No record';
      box.innerHTML = hits.length ? hits.map(gameCard).join('') : '<div class="empty">No record</div>';
    });
  }

  function mount(opts) {
    opts = opts || {};
    var page = document.getElementById('page');
    if (!page) return;
    var wrap = document.createElement('div');
    wrap.className = 'app';
    wrap.innerHTML = header() + '<div class="body">' + sidebar(opts.nav || 'home') + '<div class="main" id="main"></div></div>' +
      footer() + floats() + modals() + demoBar();
    document.body.insertBefore(wrap, document.body.firstChild);
    wrap.querySelector('#main').appendChild(page);
    bind(document.body);
    var lang = $('langSel');
    if (lang) lang.onchange = function () { S.lang = this.value; J365.persist(); toast(this.value === 'tl' ? 'Wika: Tagalog (demo UI stays EN)' : 'Language: English'); };
    if (!S.seenRg && opts.rg !== false) openMask('mRg');
  }

  var shell = {
    mount: mount,
    toast: toast,
    open: openMask,
    close: closeMask,
    requireAuth: requireAuth,
    gameCard: gameCard,
    launchGame: launchGame,
    header: header,
    nav: SIDE_NAV,
    _afterPin: null
  };
  global.J365Shell = shell;
})(window);
