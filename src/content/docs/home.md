---
title: 首页
description: 面向非技术人群的比特币自托管指南：bip39 助记词 + passphrase，简单又安全。
date: 2026-08-19
---



比特币genesis区块问世十多年来技术人员做了大量工作，但是自托管方案似乎并没有多大进步，对于我父母妻子妹妹这样的非技术背景用户来说，自托管仍旧是一个复杂而沉重的课题。2026年coldcard低熵bug事件后，各种片面的信息更是加剧了人们对自托管的恐慌。

“If you advocate for self-custody, you should also be telling people to use a multi-vendor multisig setup.”
-- NO! 根据笔者多年帮父母妻子妹妹自托管的经验，对于绝大部分人来说，复杂性的危害比黑客更严重，创建多签钱包可能是灾难的开始。很多技术人员常常忘记这个世界上绝大多数人的计算机水平是如何的"基础"，光想想如何向母亲妹妹解释"你不但要保存两把钥匙还要保存三个主公钥"就足够让我放弃了。

“Satoshi never used a hardware wallet, and his coin never be stolen, do what Satoshi did. Bitcoin Core wallet!”
-- 让人们处理好wallet.dat文件？让他们搞台离线电脑使用bitcoin core ？让他们记住产生新地址后要检查是否已经包含在备份里？不！对我家人来说太难了。他们需要更简单的！

比特币走向更广大的人民群众之前，我们需要又安全又简单的托管方案。不是多签！不是wallet.dat!

幸运的是，根据笔者给家人多年折腾不同自托管方案的经验，BIP39助记词+passphrase就是当前的版本答案，你不需要花太多时间不需要懂很多技术,就能构建既简单，同时安全性不亚于多重签名的托管方案（是的，不亚于！）。

技术社区需要围绕BIP39助记词+passphrase路线开发工具创建文字视频攻略，才是让比特币走向广大群众的正路。

利益相关，本人家庭大部分资产都在比特币并以此方案托管，本站所有攻略都是本人亲自使用过的。
请假设本站的工具和攻略藏有后门，verify！