---
title: C++ Sort
slug: cppSort
publishedAt: '2025-07-26'
categories: cpp
math: false
---

```cpp
#include <iostream>
#include <bits/stdc++.h>

using namespace std;

bool compare(int i, int j){
    return i > j;
}

class Student {
    public:
        string name;
        int score;
        Student(string name, int score){
            this->name = name;
            this->score = score;
        }
        bool operator <(Student &student){
            return this->score < student.score;
        }
};

int main() {
	cin.tie(0); cout.tie(0);
	ios::sync_with_stdio(0);

    // 기본적으로 이터레이터 범위, compare 파라미터로 콜백함수를 선택적으로 처리
    // 기본정렬은 오름차순이다
    vector<int> v = {3,2,1,6,5,8,9,7,4};
    sort(v.begin(),v.end());
    for(auto &e:v){
        cout << e << " ";
    }
    cout << "\n";

    sort(v.begin(),v.end(),compare);
    for(auto &e:v){
        cout << e << " ";
    }
    cout << "\n";

    sort(v.begin(),v.end(),greater<>()); // less<>()
    for(auto &e:v){
        cout << e << " ";
    }
    cout << "\n";

    Student students[] = {
        Student("a",93),
        Student("b",90),
        Student("c",97)
    };
    sort(students,students+3);
    for(auto &e:students){
        cout << e.name << " " << e.score << "\n";
    }
    cout << "\n";

	return 0;
}

/*
1 2 3 4 5 6 7 8 9
9 8 7 6 5 4 3 2 1
9 8 7 6 5 4 3 2 1
b 90
a 93
c 97
*/
```
