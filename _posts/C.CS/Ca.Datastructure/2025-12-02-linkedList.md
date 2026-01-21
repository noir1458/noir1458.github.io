---
title: 2. 연결 리스트 (Linked List)
tags: datastructure
categories: datastructure
---

## 개념

연결 리스트는 각 노드가 데이터와 다음 노드를 가리키는 포인터로 구성된 자료구조이다.

- 메모리상에서 불연속적으로 저장된다
- 삽입/삭제가 O(1)로 빠르다 (위치를 알고 있을 때)
- 임의 접근이 불가능하여 탐색은 O(N)이다
- 포인터 저장을 위한 추가 메모리가 필요하다

### 종류

| 종류 | 설명 |
|------|------|
| 단일 연결 리스트 | 다음 노드만 가리킴 (next) |
| 이중 연결 리스트 | 이전/다음 노드 모두 가리킴 (prev, next) |
| 원형 연결 리스트 | 마지막 노드가 첫 노드를 가리킴 |

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 접근 | O(N) | 순차 탐색 필요 |
| 탐색 | O(N) | 순차 탐색 |
| 맨 앞 삽입 | O(1) | head 변경 |
| 맨 뒤 삽입 | O(1) | tail 유지 시 |
| 중간 삽입 | O(1) | 위치를 알 때 |
| 삭제 | O(1) | 위치를 알 때 |

## 구현 (No-STL)

### 단일 연결 리스트 (정적 배열 기반)

삼성 B형에서 동적 할당(malloc/new) 대신 정적 배열로 노드를 관리하는 방식이다.

```cpp
const int MAX_NODE = 100001;

struct Node {
    int data;
    int next;  // 다음 노드의 인덱스 (-1이면 없음)
} node[MAX_NODE];

int nodeCnt;   // 할당된 노드 수
int head;      // 리스트의 시작 인덱스

// 초기화
void init() {
    nodeCnt = 0;
    head = -1;
}

// 새 노드 할당
int getNode(int data) {
    node[nodeCnt].data = data;
    node[nodeCnt].next = -1;
    return nodeCnt++;
}

// 맨 앞에 삽입
void insertFront(int data) {
    int newNode = getNode(data);
    node[newNode].next = head;
    head = newNode;
}

// 맨 뒤에 삽입
void insertBack(int data) {
    int newNode = getNode(data);
    if (head == -1) {
        head = newNode;
        return;
    }
    int cur = head;
    while (node[cur].next != -1) {
        cur = node[cur].next;
    }
    node[cur].next = newNode;
}

// 특정 노드 뒤에 삽입
void insertAfter(int prevIdx, int data) {
    int newNode = getNode(data);
    node[newNode].next = node[prevIdx].next;
    node[prevIdx].next = newNode;
}

// 맨 앞 삭제
void deleteFront() {
    if (head == -1) return;
    head = node[head].next;
}

// 특정 노드 뒤의 노드 삭제
void deleteAfter(int prevIdx) {
    if (node[prevIdx].next == -1) return;
    node[prevIdx].next = node[node[prevIdx].next].next;
}

// 탐색
int find(int data) {
    int cur = head;
    while (cur != -1) {
        if (node[cur].data == data) return cur;
        cur = node[cur].next;
    }
    return -1;  // 못 찾음
}

// 전체 순회
void traverse() {
    int cur = head;
    while (cur != -1) {
        // node[cur].data 처리
        cur = node[cur].next;
    }
}
```

### 이중 연결 리스트 (정적 배열 기반)

```cpp
const int MAX_NODE = 100001;

struct Node {
    int data;
    int prev;
    int next;
} node[MAX_NODE];

int nodeCnt;
int head, tail;

void init() {
    nodeCnt = 0;
    head = tail = -1;
}

int getNode(int data) {
    node[nodeCnt].data = data;
    node[nodeCnt].prev = -1;
    node[nodeCnt].next = -1;
    return nodeCnt++;
}

// 맨 앞에 삽입
void insertFront(int data) {
    int newNode = getNode(data);
    if (head == -1) {
        head = tail = newNode;
        return;
    }
    node[newNode].next = head;
    node[head].prev = newNode;
    head = newNode;
}

// 맨 뒤에 삽입
void insertBack(int data) {
    int newNode = getNode(data);
    if (tail == -1) {
        head = tail = newNode;
        return;
    }
    node[newNode].prev = tail;
    node[tail].next = newNode;
    tail = newNode;
}

// 특정 노드 뒤에 삽입
void insertAfter(int prevIdx, int data) {
    int newNode = getNode(data);
    int nextIdx = node[prevIdx].next;

    node[newNode].prev = prevIdx;
    node[newNode].next = nextIdx;
    node[prevIdx].next = newNode;

    if (nextIdx != -1) {
        node[nextIdx].prev = newNode;
    } else {
        tail = newNode;
    }
}

// 특정 노드 삭제
void deleteNode(int idx) {
    int prevIdx = node[idx].prev;
    int nextIdx = node[idx].next;

    if (prevIdx != -1) {
        node[prevIdx].next = nextIdx;
    } else {
        head = nextIdx;
    }

    if (nextIdx != -1) {
        node[nextIdx].prev = prevIdx;
    } else {
        tail = prevIdx;
    }
}
```

### 더미 노드를 사용한 이중 연결 리스트

경계 조건 처리를 단순화하기 위해 head/tail 더미 노드를 사용하는 방식이다.

```cpp
const int MAX_NODE = 100003;  // 더미 노드 2개 포함

struct Node {
    int data;
    int prev;
    int next;
} node[MAX_NODE];

int nodeCnt;
int HEAD, TAIL;  // 더미 노드 인덱스

void init() {
    nodeCnt = 0;
    HEAD = nodeCnt++;  // 더미 head
    TAIL = nodeCnt++;  // 더미 tail
    node[HEAD].next = TAIL;
    node[TAIL].prev = HEAD;
}

int getNode(int data) {
    node[nodeCnt].data = data;
    return nodeCnt++;
}

// prevIdx 뒤에 삽입 (경계 조건 체크 불필요)
void insertAfter(int prevIdx, int data) {
    int newNode = getNode(data);
    int nextIdx = node[prevIdx].next;

    node[newNode].prev = prevIdx;
    node[newNode].next = nextIdx;
    node[prevIdx].next = newNode;
    node[nextIdx].prev = newNode;
}

// 맨 앞에 삽입
void insertFront(int data) {
    insertAfter(HEAD, data);
}

// 맨 뒤에 삽입
void insertBack(int data) {
    insertAfter(node[TAIL].prev, data);
}

// 노드 삭제 (경계 조건 체크 불필요)
void deleteNode(int idx) {
    int prevIdx = node[idx].prev;
    int nextIdx = node[idx].next;
    node[prevIdx].next = nextIdx;
    node[nextIdx].prev = prevIdx;
}

// 순회 (더미 노드 제외)
void traverse() {
    int cur = node[HEAD].next;
    while (cur != TAIL) {
        // node[cur].data 처리
        cur = node[cur].next;
    }
}
```

## STL

### std::list (이중 연결 리스트)

```cpp
#include <list>

// 선언 및 초기화
std::list<int> lst;
std::list<int> lst2 = {1, 2, 3, 4, 5};
std::list<int> lst3(5, 10);  // 크기 5, 10으로 초기화

// 주요 메서드
lst.size();        // 크기
lst.empty();       // 비어있는지 확인
lst.clear();       // 전체 삭제
lst.front();       // 첫 번째 요소
lst.back();        // 마지막 요소

// 삽입
lst.push_front(1);          // 맨 앞 삽입
lst.push_back(2);           // 맨 뒤 삽입
lst.emplace_front(1);       // 맨 앞 삽입 (생성자 직접 호출)
lst.emplace_back(2);        // 맨 뒤 삽입

// 삭제
lst.pop_front();            // 맨 앞 삭제
lst.pop_back();             // 맨 뒤 삭제

// 반복자로 삽입/삭제
auto it = lst.begin();
++it;                       // 두 번째 위치로 이동
lst.insert(it, 100);        // it 앞에 100 삽입, O(1)
lst.erase(it);              // it 위치 삭제, O(1)

// 순회
for (auto it = lst.begin(); it != lst.end(); ++it) {
    // *it 처리
}
for (int x : lst) {
    // x 처리
}

// 기타 유용한 메서드
lst.remove(5);              // 값이 5인 모든 요소 삭제
lst.unique();               // 연속된 중복 제거 (정렬 후 사용)
lst.sort();                 // 정렬
lst.reverse();              // 뒤집기
lst.merge(lst2);            // 정렬된 두 리스트 병합
lst.splice(it, lst2);       // lst2의 모든 요소를 it 앞으로 이동
```

### std::forward_list (단일 연결 리스트, C++11)

```cpp
#include <forward_list>

std::forward_list<int> flist = {1, 2, 3};

// 주요 메서드 (맨 앞 연산만 O(1))
flist.front();              // 첫 번째 요소
flist.push_front(0);        // 맨 앞 삽입
flist.pop_front();          // 맨 앞 삭제
flist.insert_after(it, 5);  // it 다음에 삽입
flist.erase_after(it);      // it 다음 요소 삭제

// before_begin(): 첫 번째 요소 앞 위치 반환
flist.insert_after(flist.before_begin(), 0);  // 실질적으로 push_front
```

## 사용 예시

### LRU 캐시

가장 최근에 사용된 항목을 리스트 앞에 유지하는 캐시 구현이다.

```cpp
#include <list>
#include <unordered_map>

class LRUCache {
    int capacity;
    std::list<std::pair<int, int>> cache;  // {key, value}
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map;

public:
    LRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        if (map.find(key) == map.end()) return -1;

        // 해당 항목을 맨 앞으로 이동
        cache.splice(cache.begin(), cache, map[key]);
        return map[key]->second;
    }

    void put(int key, int value) {
        if (map.find(key) != map.end()) {
            cache.splice(cache.begin(), cache, map[key]);
            map[key]->second = value;
            return;
        }

        if (cache.size() == capacity) {
            int oldKey = cache.back().first;
            cache.pop_back();
            map.erase(oldKey);
        }

        cache.push_front({key, value});
        map[key] = cache.begin();
    }
};
```

## 주의사항 / Edge Cases

### 빈 리스트 처리

```cpp
// head가 -1인지 확인
if (head == -1) {
    // 리스트가 비어있음
}

// STL
if (lst.empty()) {
    // lst.front() 호출하면 에러
}
```

### 노드 삭제 시 포인터 업데이트

```cpp
// 단일 연결 리스트에서 특정 노드 삭제
// 이전 노드를 알아야 함
void deleteNode(int targetIdx) {
    if (head == targetIdx) {
        head = node[head].next;
        return;
    }

    int cur = head;
    while (cur != -1 && node[cur].next != targetIdx) {
        cur = node[cur].next;
    }
    if (cur != -1) {
        node[cur].next = node[targetIdx].next;
    }
}
```

### 순환 참조 확인 (Floyd's Cycle Detection)

```cpp
bool hasCycle() {
    int slow = head, fast = head;
    while (fast != -1 && node[fast].next != -1) {
        slow = node[slow].next;
        fast = node[node[fast].next].next;
        if (slow == fast) return true;
    }
    return false;
}
```

### 메모리 재사용

정적 배열 방식에서 삭제된 노드를 재사용하려면 free list를 관리해야 한다.

```cpp
int freeHead = -1;  // 재사용 가능한 노드 리스트

int getNode(int data) {
    int idx;
    if (freeHead != -1) {
        idx = freeHead;
        freeHead = node[freeHead].next;
    } else {
        idx = nodeCnt++;
    }
    node[idx].data = data;
    node[idx].next = -1;
    return idx;
}

void freeNode(int idx) {
    node[idx].next = freeHead;
    freeHead = idx;
}
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Silver | 에디터 | [BOJ 1406](https://www.acmicpc.net/problem/1406) |
| Silver | 요세푸스 문제 | [BOJ 1158](https://www.acmicpc.net/problem/1158) |
| Gold | 키로거 | [BOJ 5397](https://www.acmicpc.net/problem/5397) |
| Gold | 풍선 터뜨리기 | [BOJ 2346](https://www.acmicpc.net/problem/2346) |
