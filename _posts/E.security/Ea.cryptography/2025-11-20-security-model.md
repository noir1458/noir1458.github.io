---
title: 공개키 암호 시스템의 security-model IND-CCA game
tags: cryptography
categories:
- cryptography
---

## Security Model for Public Key Encryption
 
1. Setup - Challenger runs KeyGen($\lambda$) to obtain (pk,sk) and passes a public key pk to Adversary

2. Phase 1 - A asks decryption queries on $ C_i $ 's to a decryption oracle $ \mathbb{D}_1  $ and receives corresponded plaintexts

3. Challenge - A submits two plaintexts $M_0, M_1$ to C, C tosses a coin B $\in \{0,1\}$, runs Enc(pk,$M_b$) -> $C_b^{*}$ , and passes $C_b^{*}$ to A as the challenge cipher text

4. Phase 2 - A asks decryption queries on $C_i$ 's to a decryption oracle $D_2$ and receives corresponded plaintexts. The constraint is that $C_b^{*}$ cannot be queried.

5. Guess - A outputs b'

공개키 암호가 안전하다고 주장하려면, 공격자가 절대 이길수 없음을 보여야 한다.

![](/images/2025-11-21-security-model/2025-11-21-security-model-2025-11-22-00-24-03.png)

Setup에서, challenger가 키를 생성하고 (pk, sk) 에서 pk 는 공격자 A 에게 주어진다

![](/images/2025-11-21-security-model/2025-11-21-security-model-2025-11-22-00-26-38.png)

Phase 1에서, A는 어떤 암호문 $C_i$ 에 대해서 복호화를 요청하고, Challenger는 $M_i$ 를 알려준다 (충분히)

![](/images/2025-11-21-security-model/2025-11-21-security-model-2025-11-22-00-28-22.png)

Challenge에서, 공격자 A는 $M_0,M_1$을 제출한다, Challenger 는 무작위로 비트 b $\in {0,1}$ 을 선택하고 이 암호문 $C_b^{*}$ 을 A에게 전달한다

![](/images/2025-11-21-security-model/2025-11-21-security-model-2025-11-22-00-30-46.png)

Phase 2에서, A는 다시 복호화를 요청한다. 그러나 $C^{*}$는 요청하지 않는다. (게임이 성립하지 않음)

![](/images/2025-11-21-security-model/2025-11-21-security-model-2025-11-22-00-32-11.png)

Guess에서, A가 b'를 내보낸다.

if b=b'이라면 A가 게임을 이기게 된다.

![](/images/2025-11-21-security-model/2025-11-21-security-model-2025-11-22-00-34-58.png)

이 값이 충분히 작으면 안전하다. 무작위로 찍어서 맞출 확률은 이미 50%이고 이것보다 유의미하게 넘어서지 못함.

## IND-XXX

A public key encryption scheme is IND-XXX secure if there is no adversary whose advantage is non-negligible in the security parameter

- IND-CPA : 2,4 둘다 x, 오라클이 안주어짐
    - 수동적 공격, 공격자는 PK를 가지고 있으므로 enc는 마음대로 가능, 그래서 Chosen Plaintext Attack
    - 그러나 Decryption Oracle 에는 접근 불가능
    - 가장 기초적인 보안 수준으로, 공격자가 암호문을 보고 평문을 유추할수 없어야 한다
    - 한계 : 현실에서는 공격자가 복호화 장비에 오류를 일으키거나 응답 시간을 측정하는 등 간접적으로 복호화 정보를 얻을 수 있는데, CPA는 이를 방어하지 못함
- IND-CCA1 : 2 가능, 문제 보기 전에만 허가
    - Lunchtime Attack / Midnight Attack 이라는 별명이 있다고 한다
    - non-adaptive chosen cipher attack
    - 공격자가 문제를 받기 전까지는 복호화 오라클을 사용 가능(관리자가 점심 먹으러 간 사이에 몰래 복호화기 사용...?)
    - 과거에 복호화 기계 사용해본적이 있어도, 지금 주어진 새로운 암호문을 깰 수는 없다.
    - 한계 : $C^{*}$을 받은 직후 암호문을 조작해서 공격하는 시나리오를 막지 못함
- IND-CCA2 : 2,4 가능, 문제 보고 나서도 가능
    - 능동적 공격, 문제 받기 전에도 복호화가 가능하고, 문제 $C^{*}$ 을 받은 이후 에도 상황에 맞춰서 복호화 오라클을 쓸 수 있다.
    - adaptive chosen cipher attack
    - 가단성(Malleability) 이 없음을 증명. 공격자가 $C^*$을 $C'$로 변조해서 오라클에 던졌을 떄, 유의미한 평문 정보가 나오면 안된다. (암호문을 조금이라도 변조시 평문이 예측 가능하게 바뀌지 않아야)

