---
title: Tonelli Shanks Algorithm
slug: TonelliShanks
publishedAt: '2026-02-01'
categories: cryptography
math: true
---

## 목적
$r^2 \equiv a \pmod p$를 만족하는 $r$ 찾기

## case : $p = 4k+3$
$$r^2 = (a^{\frac{p+1}{4}})^2 = a^{\frac{p+1}{2}} = a^{\frac{p-1+2}{2}} = a^{\frac{p-1}{2}} \cdot a^1$$

$a$가 Quadratic Residue 라면

$$a^{\frac{p-1}{2}} \equiv 1 \pmod p$$

$$r^2 \equiv 1 \cdot a \equiv a \pmod p$$

지수에 $(p+1)/4$만 넣어서 계산하면 바로 제곱근이 나온다

## case : $p = 4k+1$
이건 (p+1)/4 가 정수가 아니다.  
p-1에 있는 2의 거듭제곱을 하나씩 소모하며 강제로 지수를 정수로 만들기

<img width="382" height="652" alt="Image" src="https://github.com/user-attachments/assets/bd34ebc9-49ca-4d51-8895-efa2f68993cd" />

### update parameters
- $m = i$
- $c = b^2 \pmod p$
- $t = t \cdot c \pmod p$
- $r = r \cdot b \pmod p$

```python
def TonelliShanks(n,p):
    assert p%4==1

    # QR확인
    if pow(n,(p-1)//2,p) != 1:
        return None

    # p-1 = Q*2^s
    s = 0
    q = p-1
    while q%2==0:
        s += 1
        q //= 2
    
    # QNR인 z찾기
    # 단순히 2부터 시작해서 Legendre symbol이 -1인 값 찾기
    z = 2
    while pow(z,(p-1)//2,p) != p-1:
        z += 1

    # init
    m = s
    c = pow(z,q,p)
    t = pow(n,q,p)
    r = pow(n,(q+1)//2,p)

    # t를 1로 만들기 위해서 r을 보정해나감
    while True:
        if t==0: return 0
        if t==1: return r

        # t^(2^i) == 1이 되는 최소의 i 찾기
        tmp_t = t
        i = 0
        for i in range(1,m):
            tmp_t = pow(tmp_t,2,p)
            if tmp_t == 1:
                break
        
        # 보정값 b 계산 및 변수 업데이트
        b = pow(c,2**(m-i-1),p)
        m = i
        c = pow(b,2,p)
        t = (t*c)%p
        r = (r*b)%p

if __name__=="__main__":
    a =  
    p = 

    #print(p%4) # 1

    root = TonelliShanks(a,p)
    res = min(root, p-root)
    print(res)
```


## 덧붙임

- Mathematical Assumption: $p$는 소수여야 함. (합성수일 경우 Rabin Cryptosystem의 복호화 영역으로 넘어감)
- Complexity: $O(\log^4 p)$ 혹은 최적화 시 $O(S^2 \log p)$.
- Advanced Study:Tonelli-Shanks보다 더 범용적인 Cipolla's Algorithm.
    - $p \equiv 1 \pmod 4$일 때 $-1$이 항상 Quadratic Residue인 이유 (제 1 보충법칙).
