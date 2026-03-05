import { useState, useEffect, useRef } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0D0D0D;
  --bg2: #141414;
  --bg3: #1C1C1C;
  --gold: #C9A84C;
  --gold-light: #E8C96A;
  --cream: #F0EBE0;
  --white: #FFFFFF;
  --serif: 'Cormorant Garamond', serif;
  --sans: 'DM Sans', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--cream);
  font-family: var(--sans);
  font-weight: 400;
  overflow-x: hidden;
}

/* Grain overlay */
body::before {
  content:'';
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:9999;
  opacity:0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}

/* Scroll reveal */
.reveal { opacity:0; transform:translateY(32px); transition: opacity 0.75s ease, transform 0.75s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }

/* Gold rule */
.gold-rule { width:60px; height:1px; background:var(--gold); margin:18px auto; }
.gold-rule-left { width:60px; height:1px; background:var(--gold); margin:18px 0; }

/* Section label */
.section-label {
  font-family:var(--sans);
  font-size:11px;
  letter-spacing:3px;
  text-transform:uppercase;
  color:var(--gold);
  font-weight:500;
}

/* ── NAVBAR ── */
.navbar {
  position:fixed;
  top:0; left:0; right:0;
  z-index:1000;
  height:100px;
  padding:0 60px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  transition: background 0.4s, backdrop-filter 0.4s, box-shadow 0.4s;
}
.navbar.scrolled {
  background:rgba(13,13,13,0.85);
  backdrop-filter:blur(18px);
  box-shadow:0 1px 0 rgba(201,168,76,0.2);
}
.nav-logo { display:flex; align-items:center; gap:12px; text-decoration:none; }
.nav-monogram {
  width:42px; height:42px;
  border:1px solid var(--gold);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--serif);
  font-size:18px;
  color:var(--gold);
  font-weight:700;
  letter-spacing:1px;
}
.nav-name {
  font-family:var(--serif);
  font-size:17px;
  color:var(--white);
  font-weight:600;
  line-height:1.2;
}
.nav-name span { display:block; font-size:10px; letter-spacing:2px; color:var(--gold); font-family:var(--sans); font-weight:400; text-transform:uppercase; }
.nav-links { display:flex; align-items:center; gap:36px; list-style:none; }
.nav-links a {
  font-family:var(--sans);
  font-size:12px;
  letter-spacing:2px;
  text-transform:uppercase;
  color:var(--cream);
  text-decoration:none;
  font-weight:500;
  position:relative;
  transition:color 0.3s;
}
.nav-links a::after {
  content:'';
  position:absolute;
  left:0; bottom:-4px;
  height:1px; width:0;
  background:var(--gold);
  transition:width 0.3s;
}
.nav-links a:hover { color:var(--gold-light); }
.nav-links a:hover::after { width:100%; }
.nav-cta {
  font-family:var(--sans);
  font-size:11px;
  letter-spacing:2px;
  text-transform:uppercase;
  border:1px solid var(--gold);
  color:var(--gold);
  padding:10px 22px;
  background:transparent;
  cursor:pointer;
  transition:background 0.3s, color 0.3s;
  text-decoration:none;
}
.nav-cta:hover { background:var(--gold); color:var(--bg); }
.hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:4px; }
.hamburger span { display:block; width:26px; height:1px; background:var(--cream); transition:0.3s; }
.mobile-menu {
  position:fixed; inset:0; z-index:999;
  background:rgba(13,13,13,0.97);
  display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:40px;
  transform:translateX(100%);
  transition:transform 0.4s cubic-bezier(0.77,0,0.18,1);
}
.mobile-menu.open { transform:translateX(0); }
.mobile-menu a {
  font-family:var(--serif);
  font-size:36px;
  color:var(--cream);
  text-decoration:none;
  transition:color 0.3s;
}
.mobile-menu a:hover { color:var(--gold-light); }
.mobile-close {
  position:absolute; top:24px; right:30px;
  font-size:28px; color:var(--cream); background:none; border:none; cursor:pointer;
}

/* ── HERO ── */
.hero {
  min-height:100vh;
  display:flex; align-items:center; justify-content:center;
  flex-direction:column;
  text-align:center;
  position:relative;
  overflow:hidden;
  background:var(--bg);
  padding:130px 24px 80px;
}
.hero-glow {
  position:absolute;
  top:50%; left:50%;
  transform:translate(-50%,-50%);
  width:700px; height:700px;
  background:radial-gradient(ellipse at center, rgba(201,168,76,0.10) 0%, transparent 70%);
  pointer-events:none;
}
.hero-lines {
  position:absolute; inset:0; overflow:hidden; pointer-events:none;
}
.hero-lines::before, .hero-lines::after {
  content:'';
  position:absolute;
  width:1px; height:200%;
  background:linear-gradient(to bottom, transparent, rgba(201,168,76,0.08), transparent);
  top:-50%;
}
.hero-lines::before { left:30%; transform:rotate(15deg); }
.hero-lines::after  { right:30%; transform:rotate(-15deg); }
.hero-inner { position:relative; z-index:2; max-width:900px; }
.hero-heading {
  font-family:var(--serif);
  font-size:clamp(52px, 8vw, 90px);
  font-weight:300;
  color:var(--white);
  line-height:1.08;
  letter-spacing:1px;
  margin-bottom:20px;
}
.hero-heading .char {
  display:inline-block;
  opacity:0;
  transform:translateY(24px);
  transition:opacity 0.5s ease, transform 0.5s ease;
}
.hero-heading .char.visible {
  opacity:1;
  transform:translateY(0);
}
.hero-heading .word-break { display:block; }
.hero-sub {
  font-family:var(--serif);
  font-style:italic;
  font-size:20px;
  color:var(--gold-light);
  letter-spacing:2px;
  margin-bottom:40px;
}
.hero-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
.btn-solid {
  background:var(--gold);
  color:var(--bg);
  font-family:var(--sans);
  font-size:11px;
  letter-spacing:2px;
  text-transform:uppercase;
  font-weight:600;
  padding:14px 36px;
  border:none;
  cursor:pointer;
  text-decoration:none;
  transition:background 0.3s, transform 0.2s;
  display:inline-block;
}
.btn-solid:hover { background:var(--gold-light); transform:translateY(-2px); }
.btn-outline {
  background:transparent;
  color:var(--gold);
  font-family:var(--sans);
  font-size:11px;
  letter-spacing:2px;
  text-transform:uppercase;
  font-weight:600;
  padding:14px 36px;
  border:1px solid var(--gold);
  cursor:pointer;
  text-decoration:none;
  transition:background 0.3s, color 0.3s, transform 0.2s;
  display:inline-block;
}
.btn-outline:hover { background:var(--gold); color:var(--bg); transform:translateY(-2px); }
.scroll-arrow {
  position:absolute;
  bottom:36px; left:50%;
  transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:6px;
}
.scroll-arrow span {
  display:block;
  width:18px; height:18px;
  border-right:1px solid var(--gold);
  border-bottom:1px solid var(--gold);
  transform:rotate(45deg);
  animation:arrowBounce 1.6s infinite;
}
.scroll-arrow span:nth-child(2) { animation-delay:0.2s; opacity:0.6; }
@keyframes arrowBounce { 0%,100%{transform:translateY(0) rotate(45deg); opacity:1;} 50%{transform:translateY(6px) rotate(45deg); opacity:0.5;} }

/* ── ABOUT ── */
.section-about {
  background:var(--cream);
  padding:120px 60px;
  color:var(--bg);
}
.about-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:3fr 2px 2fr; gap:60px; align-items:start; }
.about-divider { background:var(--gold); align-self:stretch; }
.about-quote {
  font-family:var(--serif);
  font-style:italic;
  font-size:clamp(26px, 3vw, 38px);
  font-weight:300;
  color:#1a1a1a;
  line-height:1.4;
  margin-bottom:32px;
  border-left:3px solid var(--gold);
  padding-left:28px;
}
.about-body p { font-size:15px; line-height:1.85; color:#333; margin-bottom:16px; }
.stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.stat-card {
  background:var(--bg3);
  border:1px solid rgba(201,168,76,0.3);
  border-left:3px solid var(--gold);
  padding:28px 20px;
  text-align:center;
}
.stat-number {
  font-family:var(--serif);
  font-size:42px;
  font-weight:600;
  color:var(--gold-light);
  display:block;
}
.stat-label { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--cream); margin-top:6px; display:block; }

/* ── SERVICES ── */
.section-services { background:var(--bg); padding:120px 60px; }
.section-heading {
  text-align:center;
  font-family:var(--serif);
  font-size:clamp(34px, 4vw, 52px);
  font-weight:300;
  color:var(--white);
  margin-bottom:8px;
}
.section-heading-dark { color:var(--bg); }
.services-grid { max-width:1100px; margin:60px auto 0; display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.service-card {
  background:var(--bg3);
  border-left:3px solid var(--gold);
  padding:40px 32px;
  transition:box-shadow 0.3s, transform 0.3s, background 0.3s;
}
.service-card:hover {
  box-shadow:0 0 40px rgba(201,168,76,0.15), 0 8px 30px rgba(0,0,0,0.4);
  transform:translateY(-4px);
  background:#222;
}
.service-icon { font-size:28px; margin-bottom:18px; color:var(--gold); }
.service-title {
  font-family:var(--serif);
  font-size:24px;
  font-weight:600;
  color:var(--white);
  margin-bottom:16px;
}
.service-list { list-style:none; }
.service-list li {
  font-size:13.5px;
  color:var(--cream);
  opacity:0.85;
  padding:5px 0 5px 16px;
  position:relative;
  line-height:1.6;
}
.service-list li::before { content:'—'; position:absolute; left:0; color:var(--gold); font-size:11px; top:7px; }

/* ── WHY US ── */
.section-why { background:var(--cream); color:var(--bg); padding:120px 60px; }
.why-grid { max-width:1100px; margin:60px auto 0; display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.why-card {
  border-top:2px solid var(--gold);
  padding:32px 24px;
  background:#fff;
  transition:transform 0.3s, box-shadow 0.3s;
}
.why-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.1); }
.why-icon { font-size:24px; color:var(--gold); margin-bottom:14px; }
.why-title { font-family:var(--serif); font-size:20px; font-weight:700; color:var(--bg); margin-bottom:8px; }
.why-desc { font-size:13.5px; color:#444; line-height:1.7; }

/* ── VISION / MISSION ── */
.section-vm {
  background:var(--bg2);
  padding:120px 60px;
  position:relative;
  overflow:hidden;
}
.vm-watermark {
  position:absolute;
  top:50%; left:50%;
  transform:translate(-50%,-50%);
  font-family:var(--serif);
  font-size:clamp(200px, 25vw, 340px);
  font-weight:700;
  color:rgba(201,168,76,0.04);
  pointer-events:none;
  user-select:none;
  letter-spacing: -10px;
  white-space:nowrap;
}
.vm-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1px 1fr; gap:60px; position:relative; z-index:2; }
.vm-divider { background:var(--gold); align-self:stretch; opacity:0.5; }
.vm-panel-label {
  font-family:var(--sans);
  font-size:10px;
  letter-spacing:4px;
  text-transform:uppercase;
  color:var(--gold);
  font-weight:600;
  margin-bottom:24px;
}
.vm-panel-text {
  font-family:var(--serif);
  font-size:clamp(17px, 2vw, 22px);
  font-weight:300;
  color:var(--cream);
  line-height:1.75;
  font-style:italic;
}

/* ── FOUNDER ── */
.section-founder { background:var(--cream); padding:120px 60px; }
.founder-card {
  max-width:900px; margin:60px auto 0;
  border:1px solid rgba(201,168,76,0.5);
  display:grid;
  grid-template-columns:220px 1fr;
  overflow:hidden;
  box-shadow:inset 0 0 60px rgba(0,0,0,0.04);
}
.founder-avatar {
  background:var(--bg);
  display:flex; align-items:center; justify-content:center;
  flex-direction:column;
  gap:8px;
  padding:40px;
}
.founder-monogram {
  width:110px; height:110px;
  border-radius:50%;
  background:var(--bg3);
  border:2px solid var(--gold);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--serif);
  font-size:40px;
  font-weight:700;
  color:var(--gold);
  letter-spacing:2px;
}
.founder-info { padding:48px 40px; background:#fff; }
.founder-name { font-family:var(--serif); font-size:34px; font-weight:600; color:var(--bg); margin-bottom:6px; }
.founder-title { font-family:var(--sans); font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); margin-bottom:20px; font-weight:600; }
.founder-bio { font-size:14.5px; line-height:1.85; color:#333; margin-bottom:28px; }
.founder-badges { display:flex; gap:10px; flex-wrap:wrap; }
.badge {
  border:1px solid var(--gold);
  color:var(--gold);
  font-family:var(--sans);
  font-size:10px;
  letter-spacing:1.5px;
  text-transform:uppercase;
  padding:6px 14px;
  font-weight:600;
}

/* ── BBBEE BANNER ── */
.section-bbbee {
  background:var(--bg3);
  border-top:1px solid rgba(201,168,76,0.3);
  border-bottom:1px solid rgba(201,168,76,0.3);
  padding:70px 60px;
  text-align:center;
}
.bbbee-title {
  font-family:var(--serif);
  font-size:clamp(26px, 3.5vw, 40px);
  font-weight:600;
  color:var(--white);
  margin-bottom:14px;
  letter-spacing:1px;
}
.bbbee-title span { color:var(--gold-light); }
.bbbee-sub { font-size:14px; color:rgba(240,235,224,0.65); max-width:600px; margin:0 auto; line-height:1.75; }

/* ── CONTACT ── */
.section-contact { background:var(--bg); padding:120px 60px; }
.contact-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; }
.contact-list { list-style:none; margin-top:40px; }
.contact-list li {
  display:flex; gap:16px; align-items:flex-start;
  padding:18px 0;
  border-bottom:1px solid rgba(201,168,76,0.1);
}
.contact-list li:last-child { border-bottom:none; }
.contact-icon { font-size:18px; color:var(--gold); flex-shrink:0; margin-top:2px; }
.contact-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:4px; }
.contact-value { font-size:14px; color:var(--cream); line-height:1.6; }
.contact-value a { color:var(--cream); text-decoration:none; transition:color 0.3s; }
.contact-value a:hover { color:var(--gold-light); }
.contact-form { display:flex; flex-direction:column; gap:16px; margin-top:40px; }
.form-group { display:flex; flex-direction:column; gap:6px; }
.form-group label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); font-weight:600; }
.form-group input, .form-group textarea {
  background:var(--bg3);
  border:1px solid rgba(201,168,76,0.2);
  color:var(--cream);
  font-family:var(--sans);
  font-size:14px;
  padding:14px 16px;
  outline:none;
  transition:border-color 0.3s, box-shadow 0.3s;
  resize:vertical;
}
.form-group input:focus, .form-group textarea:focus {
  border-color:var(--gold);
  box-shadow:0 0 0 2px rgba(201,168,76,0.12);
}
.form-group textarea { min-height:130px; }
.submit-btn {
  background:var(--gold);
  color:var(--bg);
  font-family:var(--sans);
  font-size:11px;
  letter-spacing:2px;
  text-transform:uppercase;
  font-weight:700;
  padding:16px 32px;
  border:none; cursor:pointer;
  align-self:flex-start;
  position:relative; overflow:hidden;
  transition:background 0.3s, transform 0.2s;
}
.submit-btn:hover { background:var(--gold-light); transform:translateY(-2px); }
.submit-btn::after {
  content:'';
  position:absolute;
  top:0; left:-100%;
  width:200%; height:100%;
  background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%);
  transition:left 0.4s;
}
.submit-btn:hover::after { left:100%; }

/* ── FOOTER ── */
.footer { background:#080808; padding:60px 60px 32px; }
.footer-top { display:flex; align-items:center; justify-content:space-between; padding-bottom:32px; flex-wrap:wrap; gap:24px; }
.footer-nav { display:flex; gap:28px; list-style:none; flex-wrap:wrap; }
.footer-nav a { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(240,235,224,0.5); text-decoration:none; transition:color 0.3s; font-weight:500; }
.footer-nav a:hover { color:var(--gold); }
.footer-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent); margin:0 0 28px; }
.footer-bottom { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.footer-copy { font-size:12px; color:rgba(240,235,224,0.35); }
.footer-reg { font-size:11px; color:rgba(240,235,224,0.25); text-align:center; }
.footer-tagline { font-family:var(--serif); font-style:italic; font-size:13px; color:var(--gold); opacity:0.7; }

/* ── FLOATING ── */
.whatsapp-fab {
  position:fixed; bottom:32px; right:90px; z-index:500;
  width:54px; height:54px; border-radius:50%;
  background:#25D366;
  display:flex; align-items:center; justify-content:center;
  text-decoration:none;
  box-shadow:0 4px 20px rgba(37,211,102,0.4);
  animation:waPulse 2.4s infinite;
  transition:transform 0.2s;
}
.whatsapp-fab:hover { transform:scale(1.1); animation:none; }
.whatsapp-fab svg { width:26px; height:26px; fill:#fff; }
@keyframes waPulse {
  0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.4);}
  50%{box-shadow:0 4px 32px rgba(37,211,102,0.7), 0 0 0 8px rgba(37,211,102,0.1);}
}
.scroll-top {
  position:fixed; bottom:32px; right:24px; z-index:500;
  width:44px; height:44px;
  background:var(--bg3);
  border:1px solid rgba(201,168,76,0.4);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  opacity:0; transform:translateY(10px);
  transition:opacity 0.4s, transform 0.4s, background 0.3s;
  color:var(--gold); font-size:18px;
}
.scroll-top.show { opacity:1; transform:translateY(0); }
.scroll-top:hover { background:var(--gold); color:var(--bg); }

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .about-inner { grid-template-columns:1fr; gap:40px; }
  .about-divider { display:none; }
  .contact-inner { grid-template-columns:1fr; gap:40px; }
}
@media(max-width:768px){
  .navbar { padding:18px 24px; }
  .nav-links, .nav-cta-wrap { display:none; }
  .hamburger { display:flex; }
  .section-about, .section-services, .section-why, .section-vm, .section-founder, .section-contact, .section-bbbee { padding:80px 24px; }
  .services-grid { grid-template-columns:1fr; }
  .why-grid { grid-template-columns:1fr 1fr; }
  .vm-inner { grid-template-columns:1fr; }
  .vm-divider { display:none; }
  .founder-card { grid-template-columns:1fr; }
  .founder-avatar { padding:40px; }
  .footer { padding:40px 24px 24px; }
  .footer-top { flex-direction:column; align-items:flex-start; }
  .footer-bottom { flex-direction:column; align-items:center; text-align:center; }
}
@media(max-width:480px){
  .why-grid { grid-template-columns:1fr; }
  .stats-grid { grid-template-columns:1fr; }
  .hero-btns { flex-direction:column; align-items:center; }
}
@media(max-width:768px){
  .legal-sign-section { flex-direction:column; text-align:center; }
  .ceo-photo-side { width:100%; min-height:360px; }
  .ceo-photo-side img { min-height:360px; }
  .ceo-content-side { padding:48px 24px; }
  .gallery-grid { grid-template-columns:1fr 1fr; }
  .section-gallery { padding:60px 24px; }
  .service-card-img { height:120px; }
}
@media(max-width:480px){
  .gallery-grid { grid-template-columns:1fr; }
}

/* ── NAV LOGO IMG ── */
.nav-logo-img { height:220px; width:auto; object-fit:contain; }

/* ── HERO CEO BG ── */
.hero-ceo-bg {
  position:absolute; inset:0;
  background-image:url('/mahlomola.jpg');
  background-size:cover;
  background-position:center 20%;
  opacity:0.14;
  pointer-events:none;
}
.hero-ceo-fade {
  position:absolute; inset:0;
  background:
    linear-gradient(to bottom, rgba(13,13,13,0.5) 0%, rgba(13,13,13,0.4) 50%, rgba(13,13,13,1) 100%),
    linear-gradient(to right, rgba(13,13,13,0.9) 0%, transparent 35%, transparent 65%, rgba(13,13,13,0.9) 100%);
  pointer-events:none;
}

/* ── SERVICE CARD IMG ── */
.service-card-img {
  width:calc(100% + 64px); height:180px;
  object-fit:cover;
  margin:-40px -32px 28px;
  filter:grayscale(50%) brightness(0.65) sepia(20%);
  transition:filter 0.5s ease, transform 0.5s ease;
  display:block;
}
.service-card:hover .service-card-img {
  filter:grayscale(10%) brightness(0.85) sepia(5%);
  transform:scale(1.03);
}
.service-card { overflow:hidden; }

/* ── 3D LEGAL SIGN SECTION ── */
.legal-sign-section {
  background:var(--bg2);
  padding:100px 60px;
  display:flex; align-items:center; justify-content:center;
  gap:80px; flex-wrap:wrap;
  border-top:1px solid rgba(201,168,76,0.12);
  border-bottom:1px solid rgba(201,168,76,0.12);
}
.legal-sign-3d { perspective:900px; flex-shrink:0; }
.sign-inner {
  width:200px; height:200px;
  transform-style:preserve-3d;
  animation:signFloat 7s ease-in-out infinite;
  position:relative;
}
@keyframes signFloat {
  0%,100%{ transform:rotateY(-18deg) rotateX(10deg) translateY(0); }
  50%{ transform:rotateY(18deg) rotateX(-6deg) translateY(-12px); }
}
.sign-face {
  position:absolute; inset:0;
  border:1.5px solid var(--gold);
  background:radial-gradient(ellipse at 30% 30%, #2d2300, #0f0f0f);
  display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14px;
  box-shadow:0 0 50px rgba(201,168,76,0.18), inset 0 0 50px rgba(0,0,0,0.6),
             8px 8px 0 rgba(201,168,76,0.08);
}
.sign-text {
  font-family:var(--serif); font-size:12px; letter-spacing:3px;
  text-transform:uppercase; color:var(--gold); text-align:center; line-height:1.6;
}
.legal-sign-copy { max-width:460px; }
.legal-sign-copy h3 {
  font-family:var(--serif); font-size:clamp(28px,3.5vw,44px);
  font-weight:300; color:var(--white); margin-bottom:18px; line-height:1.25;
}
.legal-sign-copy p { font-size:14.5px; color:rgba(240,235,224,0.6); line-height:1.85; margin-bottom:12px; }

/* ── CEO SECTION ── */
.section-ceo {
  background:var(--bg); min-height:580px;
  display:flex; overflow:hidden; position:relative;
}
.ceo-photo-side {
  width:42%; position:relative; flex-shrink:0;
}
.ceo-photo-side img {
  width:100%; height:100%; object-fit:cover;
  object-position:center top; display:block; min-height:580px;
}
.ceo-photo-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to right, transparent 50%, var(--bg) 100%);
}
.ceo-content-side {
  flex:1; display:flex; flex-direction:column;
  justify-content:center; padding:80px 60px;
}
.ceo-quote {
  font-family:var(--serif); font-style:italic;
  font-size:clamp(20px,2.5vw,30px); font-weight:300;
  color:var(--cream); line-height:1.6;
  border-left:2px solid var(--gold); padding-left:24px;
  margin-bottom:32px;
}
.ceo-name { font-family:var(--serif); font-size:32px; font-weight:600; color:var(--white); margin-bottom:6px; }
.ceo-role { font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:24px; }
.ceo-bio { font-size:14px; color:rgba(240,235,224,0.65); line-height:1.85; margin-bottom:28px; }

/* ── GALLERY ── */
.section-gallery { background:var(--bg3); padding:90px 60px; }
.gallery-grid {
  max-width:1100px; margin:50px auto 0;
  display:grid; grid-template-columns:repeat(3,1fr); gap:6px;
}
.gallery-item { position:relative; overflow:hidden; aspect-ratio:4/3; cursor:pointer; }
.gallery-item img {
  width:100%; height:100%; object-fit:cover; display:block;
  filter:grayscale(30%) brightness(0.75);
  transition:filter 0.5s, transform 0.6s;
}
.gallery-item:hover img { filter:grayscale(0%) brightness(1); transform:scale(1.07); }
.gallery-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 60%);
  display:flex; align-items:flex-end; padding:20px;
  opacity:0; transition:opacity 0.4s;
}
.gallery-item:hover .gallery-overlay { opacity:1; }
.gallery-label {
  color:var(--gold-light); font-family:var(--serif);
  font-size:15px; font-style:italic;
}
.gallery-item-large { aspect-ratio:16/9; }

/* ── FOUNDER PHOTO ── */
.founder-photo {
  width:100%; height:100%; object-fit:cover;
  object-position:center top; display:block; min-height:320px;
}
`;


function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function AnimatedHeading() {
  const line1 = "Basia Batubatse";
  const line2 = "Consulting";
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 400); return () => clearTimeout(t); }, []);
  const renderChars = (text, baseDelay) =>
    text.split("").map((ch, i) => (
      <span
        key={i}
        className={`char${visible ? " visible" : ""}`}
        style={{ transitionDelay: `${baseDelay + i * 40}ms` }}
      >
        {ch === " " ? "\u00A0" : ch}
      </span>
    ));
  return (
    <h1 className="hero-heading">
      <span className="word-break">{renderChars(line1, 0)}</span>
      <span className="word-break">{renderChars(line2, line1.length * 40 + 100)}</span>
    </h1>
  );
}

function StatCounter({ target, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        obs.disconnect();
        let start = 0;
        const isNum = !isNaN(parseInt(target));
        if (!isNum) { setCount(target); return; }
        const end = parseInt(target);
        const duration = 1600;
        const step = duration / end;
        const timer = setInterval(() => {
          start++;
          setCount(start);
          if (start >= end) clearInterval(timer);
        }, step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <div className="stat-card" ref={ref}>
      <span className="stat-number">{count}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function BasiaBatubatse() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useScrollReveal();

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Us", href: "#why" },
    { label: "Founder", href: "#founder" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    {
      icon: "⚖️", img: "/accident.jpg",
      title: "Road Accident Fund (RAF) Claims",
      items: ["Client consultations & assessments", "RAF documentation preparation", "Administrative case management", "Pre-submission compliance review"],
    },
    {
      icon: "🏥", img: "/medical.webp",
      title: "Medical Negligence Claims",
      items: ["Case evaluation & document prep", "Medical documentation coordination", "Litigation support compilation"],
    },
    {
      icon: "🦺", img: "/iod.jpg",
      title: "Injury on Duty (IOD) Claims",
      items: ["Compensation Fund documentation", "Employer & employee liaison", "Claim follow-ups & compliance"],
    },
    {
      icon: "👶", img: "/guardian.png",
      title: "Guardian's Fund Claims & Tracing",
      items: ["Beneficiary tracing", "Guardian's Fund applications", "Administrative claim support"],
    },
  ];

  const whyItems = [
    { icon: "🎯", title: "Specialised Focus", desc: "Deep expertise across all four claim types." },
    { icon: "🗺️", title: "Nationwide Reach", desc: "Serving attorneys in all 9 provinces." },
    { icon: "🔒", title: "Strict Confidentiality", desc: "Secure, professional handling of sensitive data." },
    { icon: "📋", title: "Compliant Documentation", desc: "Fully statutory-aligned processes." },
    { icon: "⏱️", title: "Reliable Turnaround", desc: "Consistent, efficient delivery timelines." },
    { icon: "💬", title: "Direct Communication", desc: "Responsive at every stage of engagement." },
  ];

  const [formStatus, setFormStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="nav-logo">
          <img src="/logo.png" alt="Basia Batubatse Consulting" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          {navLinks.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
        </ul>
        <div className="nav-cta-wrap" style={{ display: "flex" }}>
          <a href="#contact" className="nav-cta">Get in Touch</a>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {navLinks.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>Get in Touch</a>
      </div>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-ceo-bg" />
        <div className="hero-ceo-fade" />
        <div className="hero-glow" />
        <div className="hero-lines" />
        <div className="hero-inner">
          <p className="section-label" style={{ marginBottom: "24px" }}>Legal Consulting · South Africa</p>
          <AnimatedHeading />
          <div className="gold-rule" />
          <p className="hero-sub">"Accuracy. Integrity. Excellence."</p>
          <div className="hero-btns">
            <a href="#services" className="btn-solid">Our Services</a>
            <a href="#contact" className="btn-outline">Contact Us</a>
          </div>
        </div>
        <div className="scroll-arrow">
          <span /><span />
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-about" id="about">
        <div className="about-inner">
          <div>
            <p className="section-label">About Us</p>
            <div className="gold-rule-left" />
            <blockquote className="about-quote reveal">
              "We don't just prepare claims — we protect outcomes."
            </blockquote>
            <div className="about-body reveal" style={{ transitionDelay: "0.1s" }}>
              <p>Basia Batubatse Consulting is a Pretoria-based legal consulting firm with nationwide reach, specialising in the preparation and administration of claims across Southern Africa's most critical legal channels — the Road Accident Fund, Medical Negligence, Injury on Duty, and Guardian's Fund.</p>
              <p>We partner exclusively with legal practitioners, providing professional, compliant, and efficient claim preparation that enhances case management outcomes. Our work is defined by precision, discretion, and an unwavering commitment to statutory alignment.</p>
            </div>
          </div>
          <div className="about-divider" />
          <div className="reveal" style={{ transitionDelay: "0.15s" }}>
            <p className="section-label" style={{ color: "#555", marginBottom: "20px" }}>Firm at a Glance</p>
            <div className="stats-grid">
              <StatCounter target={4} label="Specialisations" />
              <StatCounter target={9} label="Provinces Covered" />
              <StatCounter target="Est. 2020" label="Year Established" />
              <StatCounter target="100%" label="B-BBEE Compliant" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-services" id="services">
        <div className="reveal">
          <p className="section-label" style={{ textAlign: "center" }}>What We Do</p>
          <h2 className="section-heading" style={{ marginTop: "12px" }}>Our Core Specialisations</h2>
          <div className="gold-rule" />
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card reveal" key={s.title} style={{ transitionDelay: `${i * 0.1}s` }}>
              {s.img && <img src={s.img} alt={s.title} className="service-card-img" />}
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <ul className="service-list">
                {s.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3D LEGAL SIGN */}
      <section className="legal-sign-section">
        <div className="legal-sign-3d reveal">
          <div className="sign-inner">
            <div className="sign-face">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
                <circle cx="40" cy="28" r="18" stroke="#C9A84C" strokeWidth="1.5" />
                <line x1="40" y1="46" x2="40" y2="62" stroke="#C9A84C" strokeWidth="1.5" />
                <line x1="20" y1="62" x2="60" y2="62" stroke="#C9A84C" strokeWidth="2" />
                <line x1="14" y1="28" x2="66" y2="28" stroke="#C9A84C" strokeWidth="1" />
                <line x1="14" y1="28" x2="22" y2="44" stroke="#C9A84C" strokeWidth="1" />
                <line x1="66" y1="28" x2="58" y2="44" stroke="#C9A84C" strokeWidth="1" />
                <circle cx="14" cy="28" r="4" fill="#C9A84C" opacity="0.6" />
                <circle cx="66" cy="28" r="4" fill="#C9A84C" opacity="0.6" />
              </svg>
              <span className="sign-text">Justice<br />& Integrity</span>
            </div>
          </div>
        </div>
        <div className="legal-sign-copy reveal" style={{ transitionDelay: "0.15s" }}>
          <p className="section-label">Our Commitment</p>
          <div className="gold-rule-left" style={{ marginTop: "12px" }} />
          <h3>Precision-driven legal consulting, built on trust</h3>
          <p>Every claim we prepare is underpinned by years of specialised knowledge, rigorous statutory compliance, and a genuine commitment to the outcomes of the people we serve.</p>
          <p>We handle the complexity — so legal practitioners can focus on advocacy.</p>
          <div style={{ marginTop: "24px" }}>
            <a href="#services" className="btn-outline" style={{ fontSize: "11px" }}>Explore Our Services</a>
          </div>
        </div>
      </section>
      <section className="section-why" id="why">
        <div className="reveal">
          <p className="section-label" style={{ textAlign: "center", color: "#888" }}>Our Differentiators</p>
          <h2 className="section-heading section-heading-dark" style={{ marginTop: "12px" }}>Why Legal Practitioners Choose Us</h2>
          <div className="gold-rule" />
        </div>
        <div className="why-grid">
          {whyItems.map((w, i) => (
            <div className="why-card reveal" key={w.title} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="why-icon">{w.icon}</div>
              <p className="why-title">{w.title}</p>
              <p className="why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="section-vm">
        <div className="vm-watermark">BB</div>
        <div className="vm-inner">
          <div className="reveal">
            <p className="vm-panel-label">Vision</p>
            <div className="gold-rule-left" />
            <p className="vm-panel-text">
              "To be a trusted national legal consulting partner recognised for excellence, efficiency, and integrity within the South African legal services sector."
            </p>
          </div>
          <div className="vm-divider" />
          <div className="reveal" style={{ transitionDelay: "0.15s" }}>
            <p className="vm-panel-label">Mission</p>
            <div className="gold-rule-left" />
            <p className="vm-panel-text">
              "To provide professional, compliant, and efficient claim preparation and legal administrative consulting services that enhance case management outcomes for legal practitioners across South Africa."
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="section-founder" id="founder">
        <div className="reveal" style={{ textAlign: "center" }}>
          <p className="section-label" style={{ color: "#888" }}>Leadership</p>
          <h2 className="section-heading section-heading-dark" style={{ marginTop: "12px" }}>Our Founder</h2>
          <div className="gold-rule" />
        </div>
        <div className="founder-card reveal" style={{ transitionDelay: "0.1s" }}>
          <div className="founder-avatar" style={{ padding: 0, overflow: "hidden" }}>
            <img src="/mahlomola.jpg" alt="Mahlomola" className="founder-photo" />
          </div>
          <div className="founder-info">
            <h3 className="founder-name">Basia Batubatse</h3>
            <p className="founder-title">Founder & Principal Consultant</p>
            <p className="founder-bio">
              With a demonstrated focus on claim administration and legal consulting across South Africa's most demanding regulatory frameworks, Basia Batubatse founded the firm to bridge the gap between legal practitioners and the complex documentation requirements of RAF, IOD, Medical Negligence, and Guardian's Fund processes. Her approach is rooted in precision, compliance, and a deep respect for the trust placed in her by attorneys and their clients alike.
            </p>
            <div className="founder-badges">
              <span className="badge">RAF Specialist</span>
              <span className="badge">B-BBEE Enterprise</span>
              <span className="badge">Nationwide Practice</span>
            </div>
          </div>
        </div>
      </section>

      {/* CEO SECTION */}
      <section className="section-ceo" id="ceo">
        <div className="ceo-photo-side">
          <img src="/mahlomola.jpg" alt="CEO of Basia Batubatse Consulting" />
          <div className="ceo-photo-overlay" />
        </div>
        <div className="ceo-content-side">
          <p className="section-label">Chief Executive Officer</p>
          <div className="gold-rule-left" style={{ marginTop: "12px", marginBottom: "32px" }} />
          <blockquote className="ceo-quote reveal">
            "Our work is not just administrative — it carries the weight of people's futures. We treat every case file with the gravity it deserves."
          </blockquote>
          <h2 className="ceo-name reveal" style={{ transitionDelay: "0.1s" }}>Mahlomola Rakgosi</h2>
          <p className="ceo-role reveal" style={{ transitionDelay: "0.15s" }}>Chief Executive Officer</p>
          <p className="ceo-bio reveal" style={{ transitionDelay: "0.2s" }}>
            Mahlomola leads the strategic direction and operational excellence of Basia Batubatse Consulting. With deep roots in legal administration and a passion for driving equitable access to legal recourse, he has built a team and culture that places rigour, compassion, and compliance at the heart of every engagement. Under his leadership, the firm has grown to serve legal practitioners across all nine provinces of South Africa.
          </p>
          <div className="founder-badges reveal" style={{ transitionDelay: "0.25s" }}>
            <span className="badge">Strategic Leadership</span>
            <span className="badge">Legal Administration</span>
            <span className="badge">B-BBEE Champion</span>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section-gallery">
        <div className="reveal" style={{ textAlign: "center" }}>
          <p className="section-label">Our Presence</p>
          <h2 className="section-heading" style={{ marginTop: "12px" }}>The Firm in Focus</h2>
          <div className="gold-rule" />
        </div>
        <div className="gallery-grid">
          <div className="gallery-item gallery-item-large reveal" style={{ gridColumn: "span 2" }}>
            <img src="/gallery1.jpg" alt="Basia Batubatse Consulting" />
            <div className="gallery-overlay"><span className="gallery-label">Basia Batubatse Consulting</span></div>
          </div>
          <div className="gallery-item reveal" style={{ transitionDelay: "0.1s" }}>
            <img src="/gallery2.jpg" alt="Our Professional Team" />
            <div className="gallery-overlay"><span className="gallery-label">Professional Excellence</span></div>
          </div>
          <div className="gallery-item reveal" style={{ transitionDelay: "0.15s" }}>
            <img src="/mahlomola.jpg" alt="Leadership" />
            <div className="gallery-overlay"><span className="gallery-label">Leadership & Vision</span></div>
          </div>
          <div className="gallery-item reveal" style={{ transitionDelay: "0.2s" }}>
            <img src="/accident.jpg" alt="RAF Claims" />
            <div className="gallery-overlay"><span className="gallery-label">Road Accident Fund Claims</span></div>
          </div>
          <div className="gallery-item reveal" style={{ transitionDelay: "0.25s" }}>
            <img src="/iod.jpg" alt="IOD Claims" />
            <div className="gallery-overlay"><span className="gallery-label">Injury on Duty Claims</span></div>
          </div>
        </div>
      </section>
      <section className="section-bbbee reveal">
        <p style={{ fontSize: "32px", marginBottom: "18px" }}>🏆</p>
        <h2 className="bbbee-title">Proudly Black-Owned &amp; <span>B-BBEE Compliant</span></h2>
        <p className="bbbee-sub">
          Basia Batubatse Consulting is a 100% Black-owned enterprise, fully compliant with South Africa's Broad-Based Black Economic Empowerment framework — committed to transformation, equity, and inclusive excellence.
        </p>
      </section>

      {/* CONTACT */}
      <section className="section-contact" id="contact">
        <div className="reveal" style={{ textAlign: "center" }}>
          <p className="section-label">Get in Touch</p>
          <h2 className="section-heading" style={{ marginTop: "12px" }}>Contact Us</h2>
          <div className="gold-rule" />
        </div>
        <div className="contact-inner">
          <div className="reveal" style={{ transitionDelay: "0.05s" }}>
            <p style={{ fontSize: "14px", color: "rgba(240,235,224,0.5)", lineHeight: 1.7 }}>
              We work directly with legal practitioners and law firms. Reach out to discuss how we can support your case management needs.
            </p>
            <ul className="contact-list">
              <li>
                <span className="contact-icon">📍</span>
                <div>
                  <p className="contact-label">Office Address</p>
                  <p className="contact-value">Regus Office Building, Suite 509<br />115 Paul Kruger Street, Pretoria, 0002</p>
                </div>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <div>
                  <p className="contact-label">Phone & WhatsApp</p>
                  <p className="contact-value"><a href="tel:+27614686619">061 468 6619</a></p>
                </div>
              </li>
              <li>
                <span className="contact-icon">✉️</span>
                <div>
                  <p className="contact-label">Email</p>
                  <p className="contact-value">
                    <a href="mailto:basiabatubatsi@outlook.com">basiabatubatsi@outlook.com</a><br />
                    <a href="mailto:advise@basiabatubatse.co.za">advise@basiabatubatse.co.za</a>
                  </p>
                </div>
              </li>
              <li>
                <span className="contact-icon">🌐</span>
                <div>
                  <p className="contact-label">Website</p>
                  <p className="contact-value"><a href="https://www.basiabatubatse.co.za" target="_blank" rel="noreferrer">www.basiabatubatse.co.za</a></p>
                </div>
              </li>
            </ul>
            <p style={{ fontSize: "12px", color: "rgba(240,235,224,0.35)", marginTop: "16px" }}>Mon – Fri · 08:00 – 17:00 · Weekends by appointment</p>
          </div>
          <div className="reveal" style={{ transitionDelay: "0.1s" }}>
            <p style={{ fontSize: "14px", color: "rgba(240,235,224,0.5)", lineHeight: 1.7 }}>
              Send us a message and we will respond within one business day.
            </p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+27 00 000 0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="Tell us about your case management needs…" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required />
              </div>
              {/* Honeypot anti-spam */}
              <input type="checkbox" name="botcheck" style={{ display: "none" }} />
              {formStatus === "success" && (
                <div style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.4)", padding: "16px 20px", color: "var(--gold-light)", fontFamily: "var(--serif)", fontSize: "15px", fontStyle: "italic" }}>
                  ✓ Thank you! Your message has been sent. We'll respond within one business day.
                </div>
              )}
              {formStatus === "error" && (
                <div style={{ background: "rgba(200,50,50,0.1)", border: "1px solid rgba(200,50,50,0.3)", padding: "16px 20px", color: "#e88", fontSize: "13px" }}>
                  Something went wrong. Please email us directly at <a href="mailto:advise@basiabatubatse.co.za" style={{ color: "var(--gold-light)" }}>advise@basiabatubatse.co.za</a>
                </div>
              )}
              <button
                type="submit"
                className="submit-btn"
                disabled={formStatus === "loading"}
                style={{ opacity: formStatus === "loading" ? 0.7 : 1, cursor: formStatus === "loading" ? "wait" : "pointer" }}
              >
                {formStatus === "loading" ? "Sending…" : formStatus === "success" ? "Message Sent ✓" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <a href="#" className="nav-logo" style={{ textDecoration: "none" }}>
            <img src="/logo.png" alt="Basia Batubatse Consulting" style={{ height: "180px", width: "auto", objectFit: "contain" }} />
          </a>
          <ul className="footer-nav">
            {navLinks.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
          </ul>
          <div style={{ display: "flex", gap: "14px" }}>
            <a href="mailto:advise@basiabatubatse.co.za" style={{ color: "rgba(240,235,224,0.4)", fontSize: "18px", textDecoration: "none" }}>✉️</a>
            <a href="tel:+27614686619" style={{ color: "rgba(240,235,224,0.4)", fontSize: "18px", textDecoration: "none" }}>📞</a>
            <a href="https://wa.me/27614686619" target="_blank" rel="noreferrer" style={{ color: "rgba(240,235,224,0.4)", fontSize: "18px", textDecoration: "none" }}>💬</a>
          </div>
        </div>
        <div className="footer-divider" />
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 Basia Batubatse Consulting. All rights reserved.</p>
          <p className="footer-reg">Reg. No. K2020712081 &nbsp;|&nbsp; SARS Tax No. 9034061284</p>
          <p className="footer-tagline">Accuracy. Integrity. Excellence.</p>
        </div>
      </footer>

      {/* FLOATING: WhatsApp */}
      <a href="https://wa.me/27614686619" target="_blank" rel="noreferrer" className="whatsapp-fab" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* SCROLL TO TOP */}
      <button className={`scroll-top${showTop ? " show" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">↑</button>
    </>
  );
}
