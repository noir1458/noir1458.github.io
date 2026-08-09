---
title: BOJ 17425 약수의 합
slug: BOJ17425
publishedAt: '2025-12-16'
categories: BOJ
math: true
---

## 문제
f(a) = a의 약수의 합  
g(x) = f(1) + f(2) + ... + f(x)  
자연수 N이 주어질때 g(N) 구하기


## 접근법
처음에는 입력 받고 각 케이스마다 f(), g() 함수 돌려서 답을 구하게 할려고 했었다. 그런데 f 함수에서 소인수 분해를 해야 하나...? 이런 생각을 하게 되면서 시간초과가 발생할것을 알았다.

그 뒤로 내 머리로 생각해내지는 못함.

## 풀이
```cpp
#include<bits/stdc++.h>
#include<iostream>
using namespace std;

int main(){
    ios::sync_with_stdio(0);
    cin.tie(0);cout.tie(0);

    int T; cin>>T;
    vector<int> v; // input 저장
    while (T--){
        int a; cin>>a;
        v.push_back(a);
    }

    // 최대값까지 인덱스 필요
    auto max_it = max_element(v.begin(), v.end());
    vector<int> s(*max_it + 1);

    // s 벡터에 약수합 구하기
    for(int i=1;i<s.size();i++){
        for(int j=i;j<s.size();j+=i){
            s[j] += i;
        }
    }

    // 누적합으로 벡터에 약수 합 구하기
    vector<long long> prefix_s(s.size());
    for(int i=1;i<s.size();i++){
        prefix_s[i] =  s[i] + prefix_s[i-1];
    }

    for(const auto &e:v){
        cout << prefix_s[e] << "\n"; 
    }
}
```
모든 입력을 다 받고 vector s의 size를 max+1 이 되도록 한다.  
그 이후 벡터에 약수의 합이 기록되도록 한다.
그 이후 다시 누적합을 벡터에 기록해서 정답을 출력한다. 누적합 할 생각을 안해서 다시한번 시간초과가 났다.

## 방법 비교
1.처음에 내가 하려고 했던 $\sqrt{n}$ 까지 나누는 소인수분해는 각 i 마다 $\sqrt{i}$ 만큼 시도하면, 총 연산이

$$ \sum_{i=1}^{N} 
\sqrt{i} 
\approx 
\frac{2}{3}N^{3/2} $$

2.반면 약수를 배수에 더하는 방식의 체는, 내부 반복 횟수가 d,2d,3d... 상황에서 $ kd \le N$ 인 최대 k는 $k= \left\lfloor N/d \right\rfloor $ 번

$$ \sum_{d=1}^{N} \left\lfloor 
\frac{N}{d}
\right\rfloor 
\approx
N\log{N}
$$

## 합 근사 방법
위에서 1번 근사 방법이 생소해서 gpt에게 물어봤다. 그냥 적분으로 근사하면 됨... 내가 모르는게 이상한건가 싶기는 한데 찾아보니 모를수도 있는 내용인것 같다. 오일러-맥클로린 공식에서

단순하게 생각하면 시간복잡도를 따질때 최고차항만 남기고 계수는 떼는 방식으로 하고 있다. 적분하면 최고차항과 그 계수는 건질수 있게 된다.

2번에서 floor함수는 근사에 큰 영향이 없고 적분하면 된다. floor함수가 있다면 원래 함수보다 작거나 같게 되지만 그 차이는 아무리 커도 1 미만. N번 더해도 오차의 합은 N정도 O(N), NlogN이 더 빠르게 커지므로 영향이 없다. 오일러-마스케로니 상수($\gamma$) 라는게 여기에서 나온다고 하네..

시간이 좀 지나서 다시 생각해보니 시간복잡도는 $N \rightarrow \infin$ 일때 증가하는 속도 상한이므로 당연히 적분도 된다고 단순하게 생각해도 될듯. 엄밀하게 하는건 위의 내용이 맞다고 한다
