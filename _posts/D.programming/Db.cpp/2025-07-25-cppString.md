---
title: C++ string
tags: cpp
categories:
- cpp
---

```cpp
#include<iostream>
#include<bits/stdc++.h>
using namespace std;
int main(){
    cin.tie(0); cout.tie(0);
    ios::sync_with_stdio(0);

    string s1,s2;
    cin >> s1 >> s2;
    cout << s1 << " " << s2 <<"\n";


    // Modification
    cout << s1 + s2 << "\n";
    s1.append("!!");
    cout << s1 << "\n";
    s1.push_back('?'); // char여야함;;
    cout << s1 << "\n";
    s1.pop_back();
    cout << s1 << "\n";

    s1.insert(1,"000"); // 1번에 삽입
    cout << s1 << "\n";

    s1.erase(2,4); // 2,3,4번 지움
    cout << s1 << "\n";

    s1.replace(2,3,"###"); // 2번에 3개문자로 replace
    cout << s1 << "\n";

    s1.clear();
    cout << s1 << "clear..." << "\n";

    s1.swap(s2);
    cout << s1 << "\n";


    // Access
    // 아래 둘다 char반환?
    cout << s1[0] << "\n";
    cout << s1.at(1) << "\n"; // 이건 범위검사후 예외발생

    // string의 첫번째, 마지막 문자에 대한 참조 반환
    char& first = s1.front();
    char& last = s1.back();
    cout << "first : " << first << ", last : " << last << "\n";

    // c 스타일의 null로 끝나는 const char*
    const char* cstr = s1.c_str();
    cout << cstr << "\n";
    // 이건 메모리에 있는 원본 데이터 덩어리 buffer
    const char* d = s1.data();
    cout << d << "\n";


    // Capacity
    cout << s1.length() << " " << s1.size() << "\n";
    cout << s1.capacity() << "\n"; // 재할당 없이 저장가능한 최대 문자수
    // 비어있나 t/f?
    cout << s2.empty() << " " << s1.empty() << "\n";
    //
    s1.reserve(100);
    cout << s1.capacity() << "\n";
    s1.shrink_to_fit();
    cout << s1.capacity() << "\n";

    // 문자열 크기 강제조절, 늘어나면 지정문자로 채움
    cout << s1.resize(10,' ') << "\n";
    cout << s1.max_size() << "\n"; // 문자열이 가질수 있는 최대 길이 반환


    // Search
    cout << "\n" << "Search" <<"\n";
    string str = "Hello? world!";
    cout << str.find("world") << "\n"; // 특정 문자열이나 문자 찾고, 시작위치 반환
    cout << str.rfind('?') << "\n";  // 뒤에서부터 찾기

    // 인자로 주어진 문자 아무거나 하나가 처음으로 나타나는 위치
    cout << str.find_first_of("aeiou") << "\n";
    // 인자로 주어진거 말고 아무거나 처음으로
    cout << str.find_first_not_of("aeiou") << "\n";
    // 인자로 주어진 문자 아무거나 하나가 마지막으로 나타나는 위치
    cout << str.find_last_of("aeiou") << "\n";
    // 인자로 주어진 문자 제외하고 아무거나 하나가 마지막으로 나타나는 위치
    cout << str.find_last_not_of("aeiou") << "\n";


    // Substring & Comparison
    cout << str.substr(2,4) <<"\n";
    // 비교한다. 같다면 0 작으면 음수 크면 양수, 비교연산자도 가능
    cout << s1.compare(s2) << "\n";

    return 0;
}
```
