---
title: 'C++ Map, Hash Tables, Dictionaries'
slug: cppMapHash
publishedAt: '2025-07-27'
categories: cpp
math: false
---

## Map

```cpp
#include <iostream>
#include<map>
#include<cstring>
#include<iterator>

using namespace std;

int main() {
	cin.tie(0); cout.tie(0);
	ios::sync_with_stdio(0);
	map<string,int> m;
	map<string,int>::iterator p,p2;

	//삽입
	m.insert(pair<string,int>("a1",2));
	m.insert(pair<string,int>("b1",3));
	m.insert(pair<string,int>("c1",4));
	//삭제
	m.erase("a1");
	p = m.find("b1"); //iterator 반환
	p2 = m.find("j1"); // 키가 존재하지 않을 시 end()반환

	int value1 = m["c1"];
	int value2 = m["z1"]; // 키가 없을시 해당 키와 기본값을 자동생성
	//int value3 = m.at("zz1"); // 키가 존재하지 않으면 out_of_range 예외 발생

	cout << m.size() <<"\n";
	cout << m.empty() << "\n";

	if(p2==m.end()){
		cout << "noexistnt \n";
	}

	for(p=m.begin();p!=m.end();p++){
		cout << p->first << " " << p->second << "\n";
	}
	return 0;
}
```

- 레드블랙트리 이용(균형 이진 탐색 트리)
- key 기준 오름차순 정렬
- 삽입, 삭제, 검색에 O(logN)
- 키 중복 허용하지 않음

## unordered_map

```cpp
#include <iostream>
#include<unordered_map>
#include<cstring>
#include<iterator>

using namespace std;

int main() {
	cin.tie(0); cout.tie(0);
	ios::sync_with_stdio(0);
	unordered_map<string,int> m;
	unordered_map<string,int>::iterator p,p2;

	//삽입
	m.insert(pair<string,int>("a1",2));
	m.insert(pair<string,int>("b1",3));
	m.insert(pair<string,int>("c1",4));
	//삭제
	m.erase("a1");
	p = m.find("b1"); //iterator 반환
	p2 = m.find("j1"); // 키가 존재하지 않을 시 end()반환

	int value1 = m["c1"];
	int value2 = m["z1"]; // 키가 없을시 해당 키와 기본값을 자동생성
	//int value3 = m.at("zz1"); // 키가 존재하지 않으면 out_of_range 예외 발생

	cout << m.size() <<"\n";
	cout << m.empty() << "\n";
	cout << m.bucket_count() << "\n";
	cout << m.load_factor() << "\n";

	if(p2==m.end()){
		cout << "noexistnt \n";
	}

	for(p=m.begin();p!=m.end();p++){
		cout << p->first << " " << p->second << "\n";
	}
	return 0;
}
```

- unordered_map 해시테이블
- 정렬되지 않음
- 삽입 삭제 검색에 평균 O(1), 해시충돌 발생시 최악 O(N)
- 키 중복 허용하지 않음

그냥 이거 쓰는게 일반적으로 좋다.

## unordered_multimap

```cpp
#include <iostream>
#include<unordered_map>
#include<cstring>
#include<iterator>

using namespace std;

int main() {
	cin.tie(0); cout.tie(0);
	ios::sync_with_stdio(0);
	// 여러 엔트리가 같은 키를 갖도록 허용
	unordered_multimap<string,int> m;
	unordered_multimap<string,int>::iterator p,p2;

	//삽입
	m.insert(pair<string,int>("a1",2));
	m.insert(pair<string,int>("a1",20));
	m.insert(pair<string,int>("a1",200));
	m.insert(pair<string,int>("b1",3));
	m.insert(pair<string,int>("c1",4));
	m.insert(pair<string,int>("d1",4));
	m.insert(pair<string,int>("e1",4));
	//삭제
	m.erase("c1");
	p = m.find("b1"); //iterator 반환
	p2 = m.find("j1"); // 키가 존재하지 않을 시 end()반환

	cout << m.size() <<"\n";
	cout << m.empty() << "\n";
	cout << m.bucket_count() << "\n";
	cout << m.load_factor() << "\n";

	cout << "key : a1 count : " << m.count("a1") << "\n";

	//a1의 모든 value 출력
	auto range = m.equal_range("a1");
	for(auto it = range.first; it != range.second; ++it){
		cout << it->second << " ";
	}
	cout << "\n";

	if(p2==m.end()){
		cout << "noexistnt \n";
	}

	for(p=m.begin();p!=m.end();p++){
		cout << p->first << " " << p->second << "\n";
	}
	return 0;
}
```

- unordered_multimap
- 키가 정렬되지 않은 상태에서 중복 허용
- 하나의 키에 여러개의 값을 전달할 수 있다
- ordered - 레드블랙트리 O(log N) 정렬됨, unordered - 해시 O(1) 정렬안됨
- find(key) - 특정 키를 가진 첫 번째 원소의 반복자 반환
- count(key) - 특정 키와 일치하는 원소 개수 반환

```cpp
std::pair<std::string,int>(”a1”,2)
std::make_pair(”a1”,2)
({”a1”,2})

//모두 같은 방식이다

m[key] = value

//이렇게 키가 없으면 새로만들고, 있으면 값을 덮어씌우는것도 가능
```

pair을 명시적으로 쓰는것은 구식 방법이다  
c++11이후로는 중괄호나 대괄호 사용하는게 편하다
