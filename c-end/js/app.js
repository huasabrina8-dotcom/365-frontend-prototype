(function () {
  'use strict';
  var AUTH = {
    '/account': 1, '/account/messages': 1, '/account/transactions': 1, '/account/limit': 1,
    '/account/changePhone': 1, '/account/changeEmail': 1, '/account/changeLoginPassword': 1,
    '/account/changeTransactionPin': 1, '/deposit': 1, '/withdraw': 1, '/add-gcash': 1,
    '/add-maya': 1, '/add-bank': 1, '/kyc': 1, '/phone-verification': 1, '/pin-verification': 1,
    '/daily-task': 1, '/my-earnings': 1, '/prize-draw': 1, '/slot-cashback': 1
  };
  var NAV = {
    '/home': 'home', '/bonus': 'bonus', '/promotions': 'promo', '/vipClub': 'vip',
    '/category/Slot': 'slot', '/category/Bingo': 'bingo', '/category/Perya': 'perya',
    '/category/Casino': 'casino', '/category/Sports': 'sports', '/category/Card': 'card',
    '/category/Arcade': 'arcade', '/category/Fishing': 'fishing', '/category/Numeric': 'numeric'
  };

  function path() {
    var h = (location.hash || '#/home').replace(/^#/, '');
    if (h === '/' || h === '') h = '/home';
    return h;
  }

  function navKey(p) {
    if (NAV[p]) return NAV[p];
    if (p.indexOf('/category/') === 0) return p.split('/')[2].toLowerCase();
    if (p.indexOf('/vip') === 0) return 'vip';
    if (p.indexOf('/promo') === 0 || p.indexOf('/activity') === 0) return 'promo';
    if (p === '/bonus') return 'bonus';
    return 'home';
  }

  function render() {
    var p = path();
    if (AUTH[p] && !J365.state.loggedIn) {
      J365Shell.requireAuth(p);
    }
    var page = document.getElementById('page');
    if (!page) return;
    page.innerHTML = '';
    var key = navKey(p);
    document.querySelectorAll('.nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').replace('#', '');
      var on = href === p || (key !== 'home' && href.toLowerCase().indexOf(key) >= 0);
      if (key === 'home') on = href === '/home';
      a.classList.toggle('on', on);
    });
    if (p === '/home') return J365Pages.home(page);
    if (p === '/bonus') return J365Pages.bonus(page);
    if (p.indexOf('/category/') === 0) return J365Pages.category(page, decodeURIComponent(p.split('/')[2] || 'Slot'));
    if (p === '/promotions') return J365Pages.promotions(page);
    if (p.indexOf('/activity-detail/') === 0) return J365Pages.activity(page, p.split('/')[2]);
    if (p === '/vipClub') return J365Pages.vip(page);
    if (p === '/agent') return J365Pages.agent(page);
    if (p === '/share-friends') return J365Pages.share(page);
    if (p === '/daily-task') return J365Pages.daily(page);
    if (p === '/my-earnings') return J365Pages.earnings(page);
    if (p === '/rebate') return J365Pages.rebate(page);
    if (p === '/spin') return J365Pages.spin(page);
    if (p === '/rain') return J365Pages.rain(page);
    if (p === '/prize-draw') return J365Pages.draw(page);
    if (p === '/slot-cashback') return J365Pages.slotCb(page);
    if (p === '/account') return J365Pages.account(page);
    if (p === '/account/messages') return J365Pages.messages(page);
    if (p === '/account/transactions') return J365Pages.txns(page);
    if (p === '/account/limit') return J365Pages.limit(page);
    if (p === '/account/changePhone') return J365Pages.change(page, 'phone');
    if (p === '/account/changeEmail') return J365Pages.change(page, 'email');
    if (p === '/account/changeLoginPassword') return J365Pages.change(page, 'pwd');
    if (p === '/account/changeTransactionPin') return J365Pages.change(page, 'pin');
    if (p === '/deposit') return J365Pages.deposit(page);
    if (p === '/withdraw') return J365Pages.withdraw(page);
    if (p === '/add-gcash') return J365Pages.addWallet(page, 'GCash');
    if (p === '/add-maya') return J365Pages.addWallet(page, 'Maya');
    if (p === '/add-bank') return J365Pages.addWallet(page, 'Bank');
    if (p === '/kyc') return J365Pages.kyc(page);
    if (p === '/phone-verification') return J365Pages.verify(page, 'Phone');
    if (p === '/pin-verification') return J365Pages.verify(page, 'PIN');
    if (p === '/about') return J365Pages.info(page, 'About Us', '<p>Juan365 is an all-in-one PAGCOR-licensed platform offering live casino, e-bingo, slots, sports and more.</p><p>Demo prototype. Not a live cashier.</p>');
    if (p === '/contact') return J365Pages.info(page, 'Contact Us', '<p>Live Chat 24/7 · Email support@juan365.com · VIP Vip@Bingo365.Vip</p>');
    if (p === '/privacy') return J365Pages.info(page, 'Privacy Policy', '<p>We collect account, device and transaction data to operate the platform and meet PAGCOR rules. Demo page only.</p>');
    if (p === '/terms') return J365Pages.info(page, 'Terms & Conditions', '<p>21+ only. Restricted persons must not register. Bonus credit follows turnover rules. Demo page only.</p>');
    if (p === '/responsible') return J365Pages.info(page, 'Responsible Gaming', '<p>Set a budget. Take breaks. Use Limits & Self-exclusion. Help: PAGCOR responsible gaming channels.</p><p><a href="#/account/limit">Open limits ›</a></p>');
    if (p === '/recently') return J365Pages.recent(page);
    if (p === '/game-platform') return J365Pages.platform(page);
    if (p === '/promo-code') return J365Pages.promoCode(page);
    if (p === '/maintenance') return J365Pages.stand(page, 'maint');
    if (p === '/ip-block') return J365Pages.stand(page, 'ip');
    J365Pages.home(page);
  }

  J365Shell.mount({ nav: 'home', rg: true });
  window.addEventListener('hashchange', render);
  render();
})();
