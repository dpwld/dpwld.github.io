#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""포트폴리오 보호 빌드: index.src.html + cv_source.pdf를 AES-GCM으로 암호화.
기업명(정규화) → PBKDF2 → KEK → 마스터키 언래핑 → 콘텐츠 복호화.
사용: python3 tools/protect.py "기업명1" "기업명2" ...
"""
import base64, hashlib, json, os, secrets, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEYFILE = os.path.join(ROOT, 'tools', 'master.key')
SALT = b'yeji-portfolio-v1'
ITER = 200_000

def master_key():
    if os.path.exists(KEYFILE):
        return bytes.fromhex(open(KEYFILE).read().strip())
    k = secrets.token_bytes(32)
    open(KEYFILE, 'w').write(k.hex())
    return k

def kek(name):
    norm = name.replace(' ', '')
    return hashlib.pbkdf2_hmac('sha256', norm.encode('utf-8'), SALT, ITER, 32)

def enc(key, data):
    iv = secrets.token_bytes(12)
    return iv + AESGCM(key).encrypt(iv, data, None)

def main():
    companies = sys.argv[1:]
    if not companies:
        print('사용법: python3 tools/protect.py "기업명" ...'); sys.exit(1)
    mk = master_key()

    wrapped = [base64.b64encode(enc(kek(c), mk)).decode() for c in companies]

    html = open(os.path.join(ROOT, 'index.src.html'), 'rb').read()
    payload = base64.b64encode(enc(mk, html)).decode()

    pdf = open(os.path.join(ROOT, 'tools', 'cv_source.pdf'), 'rb').read()
    open(os.path.join(ROOT, 'docs', 'cv.enc'), 'wb').write(enc(mk, pdf))
    old_pdf = os.path.join(ROOT, 'docs', 'cv.pdf')
    if os.path.exists(old_pdf): os.remove(old_pdf)

    loader = LOADER.replace('__WRAPPED__', json.dumps(wrapped)) \
                   .replace('__PAYLOAD__', payload) \
                   .replace('__ITER__', str(ITER))
    open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(loader)
    print('빌드 완료 · 기업 %d곳 · payload %.0fKB · cv.enc %.0fKB'
          % (len(companies), len(payload)/1024, os.path.getsize(os.path.join(ROOT,'docs','cv.enc'))/1024))

LOADER = r'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Yeji Jeong — Portfolio</title>
<link rel="icon" type="image/png" href="assets/profile.png">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #000; color: #fff; font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
  min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
.box { max-width: 420px; width: 100%; }
.box.shake { animation: sh 0.4s; }
@keyframes sh { 25% { transform: translateX(-8px); } 50% { transform: translateX(7px); } 75% { transform: translateX(-4px); } }
.tag { font: 700 12px/1 'Helvetica Neue', sans-serif; letter-spacing: 0.22em; color: #6a6a6a; margin-bottom: 28px; }
h1 { font: 800 clamp(22px, 3vw, 28px)/1.35 sans-serif; letter-spacing: -0.01em; word-break: keep-all; margin-bottom: 10px; }
p { font: 500 14px/1.6 sans-serif; color: #9a9a9a; margin-bottom: 28px; }
form { display: flex; gap: 10px; }
input { flex: 1; min-width: 0; background: none; border: 1px solid #4a4a4a; color: #fff;
  padding: 14px 16px; font: 600 15px/1 sans-serif; outline: none; border-radius: 0; }
input:focus { border-color: #fff; }
input::placeholder { color: #5c5c5c; }
button { background: #fff; color: #000; border: 0; padding: 0 26px; font: 700 14px/1 sans-serif;
  letter-spacing: 0.06em; cursor: pointer; }
button:hover { opacity: 0.85; }
.err { margin-top: 14px; font: 600 13px/1.5 sans-serif; color: #ff6b6b; min-height: 20px; }
.busy { opacity: 0.5; pointer-events: none; }
</style>
</head>
<body>
<div class="box" id="box">
  <div class="tag">YEJI JEONG</div>
  <h1>초대받은 기업명을 입력해 주세요</h1>
  <p>이 포트폴리오는 지원 기업에만 공개하고 있습니다.</p>
  <form id="f"><input type="text" id="q" placeholder="기업명" autocomplete="off" aria-label="기업명"><button type="submit">입장</button></form>
  <div class="err" id="e"></div>
</div>
<script>
var WRAPPED = __WRAPPED__;
var PAYLOAD = "__PAYLOAD__";
var ITER = __ITER__;
var SALT = new TextEncoder().encode('yeji-portfolio-v1');

function b64(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
function dec(keyBytes, blob) {
  return crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']).then(function (k) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: blob.slice(0, 12) }, k, blob.slice(12));
  });
}
function kek(name) {
  var norm = name.replace(/\s+/g, '');
  return crypto.subtle.importKey('raw', new TextEncoder().encode(norm), 'PBKDF2', false, ['deriveBits']).then(function (km) {
    return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: SALT, iterations: ITER }, km, 256);
  }).then(function (bits) { return new Uint8Array(bits); });
}
function boot(mkBytes) {
  return dec(mkBytes, b64(PAYLOAD)).then(function (buf) {
    localStorage.setItem('pMK', Array.from(mkBytes).map(function (b) { return b.toString(16).padStart(2, '0'); }).join(''));
    var html = new TextDecoder().decode(buf);
    document.open(); document.write(html); document.close();
  });
}
function tryName(name) {
  return kek(name).then(function (kb) {
    var chain = Promise.reject();
    WRAPPED.forEach(function (w) {
      chain = chain.catch(function () { return dec(kb, b64(w)); });
    });
    return chain;
  }).then(function (mk) { return boot(new Uint8Array(mk)); });
}
// 재방문: 저장된 마스터키로 자동 입장
var saved = localStorage.getItem('pMK');
if (saved && /^[0-9a-f]{64}$/.test(saved)) {
  var kb = new Uint8Array(saved.match(/.{2}/g).map(function (h) { return parseInt(h, 16); }));
  boot(kb).catch(function () { localStorage.removeItem('pMK'); });
}
document.getElementById('f').addEventListener('submit', function (ev) {
  ev.preventDefault();
  var v = document.getElementById('q').value.trim();
  if (!v) return;
  var box = document.getElementById('box');
  box.classList.add('busy');
  tryName(v).catch(function () {
    box.classList.remove('busy');
    document.getElementById('e').textContent = '등록되지 않은 기업입니다. 철자를 확인해 주세요.';
    box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
  });
});
setTimeout(function () { document.getElementById('q').focus(); }, 300);
</script>
</body>
</html>
'''

if __name__ == '__main__':
    main()
