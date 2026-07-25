---
title: 13. 해시 테이블 - Chaining
slug: hashTableChaining
publishedAt: '2025-12-13'
categories: datastructure
math: false
---

## 개념

해시 테이블(Hash Table)은 키(key)를 해시 함수로 변환하여 배열 인덱스로 사용하는 자료구조이다. Chaining은 충돌을 연결 리스트로 처리하는 방식이다.

### 구성 요소

| 요소 | 설명 |
|------|------|
| 해시 함수 | 키를 배열 인덱스로 변환 |
| 버킷 배열 | 데이터를 저장하는 배열 |
| 체인 | 충돌 시 연결 리스트로 연결 |

### Chaining 방식

```
버킷 0: [A] -> [D] -> null
버킷 1: [B] -> null
버킷 2: [C] -> [E] -> [F] -> null
버킷 3: null
```

### 좋은 해시 함수의 조건

- 계산이 빠름
- 균등 분포 (충돌 최소화)
- 결정적 (같은 입력 → 같은 출력)

## 핵심 연산 & 시간복잡도

| 연산 | 평균 | 최악 |
|------|------|------|
| 삽입 | O(1) | O(N) |
| 탐색 | O(1) | O(N) |
| 삭제 | O(1) | O(N) |

※ 최악: 모든 키가 같은 버킷에 몰릴 때

### 적재율 (Load Factor)

```
α = n / m
n: 저장된 원소 수
m: 버킷 수

평균 탐색 시간: O(1 + α)
권장 적재율: 0.7 ~ 0.8
```

## 구현 (No-STL)

### 정수 키 해시 테이블

```cpp
const int BUCKET_SIZE = 10007;  // 소수 권장
const int MAX_NODE = 100001;

struct Node {
    int key;
    int value;
    int next;
} node[MAX_NODE];

int head[BUCKET_SIZE];  // 버킷의 첫 노드
int nodeCnt;

void init() {
    nodeCnt = 0;
    for (int i = 0; i < BUCKET_SIZE; i++) {
        head[i] = -1;
    }
}

int hash(int key) {
    return ((key % BUCKET_SIZE) + BUCKET_SIZE) % BUCKET_SIZE;
}

void insert(int key, int value) {
    int h = hash(key);

    // 중복 키 확인 (필요 시)
    for (int i = head[h]; i != -1; i = node[i].next) {
        if (node[i].key == key) {
            node[i].value = value;  // 업데이트
            return;
        }
    }

    // 새 노드 추가 (맨 앞에 삽입)
    node[nodeCnt].key = key;
    node[nodeCnt].value = value;
    node[nodeCnt].next = head[h];
    head[h] = nodeCnt++;
}

int find(int key) {
    int h = hash(key);

    for (int i = head[h]; i != -1; i = node[i].next) {
        if (node[i].key == key) {
            return node[i].value;
        }
    }
    return -1;  // 못 찾음
}

bool erase(int key) {
    int h = hash(key);

    int prev = -1;
    for (int i = head[h]; i != -1; prev = i, i = node[i].next) {
        if (node[i].key == key) {
            if (prev == -1) {
                head[h] = node[i].next;
            } else {
                node[prev].next = node[i].next;
            }
            return true;
        }
    }
    return false;
}
```

### 문자열 키 해시 테이블

```cpp
const int BUCKET_SIZE = 100003;
const int MAX_NODE = 100001;
const int MAX_LEN = 11;

struct Node {
    char key[MAX_LEN];
    int value;
    int next;
} node[MAX_NODE];

int head[BUCKET_SIZE];
int nodeCnt;

void init() {
    nodeCnt = 0;
    for (int i = 0; i < BUCKET_SIZE; i++) {
        head[i] = -1;
    }
}

// 문자열 비교
bool strEqual(const char* a, const char* b) {
    int i = 0;
    while (a[i] && b[i]) {
        if (a[i] != b[i]) return false;
        i++;
    }
    return a[i] == b[i];
}

// 문자열 복사
void strCopy(char* dest, const char* src) {
    int i = 0;
    while (src[i]) {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\0';
}

// 다항 해시 함수
unsigned int hash(const char* key) {
    unsigned int h = 0;
    const unsigned int PRIME = 31;

    for (int i = 0; key[i]; i++) {
        h = h * PRIME + key[i];
    }
    return h % BUCKET_SIZE;
}

void insert(const char* key, int value) {
    unsigned int h = hash(key);

    for (int i = head[h]; i != -1; i = node[i].next) {
        if (strEqual(node[i].key, key)) {
            node[i].value = value;
            return;
        }
    }

    strCopy(node[nodeCnt].key, key);
    node[nodeCnt].value = value;
    node[nodeCnt].next = head[h];
    head[h] = nodeCnt++;
}

int find(const char* key) {
    unsigned int h = hash(key);

    for (int i = head[h]; i != -1; i = node[i].next) {
        if (strEqual(node[i].key, key)) {
            return node[i].value;
        }
    }
    return -1;
}
```

### 구조체로 캡슐화

```cpp
const int BUCKET_SIZE = 10007;
const int MAX_NODE = 100001;

template<typename K, typename V>
struct HashMap {
    struct Node {
        K key;
        V value;
        int next;
    } node[MAX_NODE];

    int head[BUCKET_SIZE];
    int nodeCnt;

    void init() {
        nodeCnt = 0;
        for (int i = 0; i < BUCKET_SIZE; i++) {
            head[i] = -1;
        }
    }

    int hash(int key) {
        return ((key % BUCKET_SIZE) + BUCKET_SIZE) % BUCKET_SIZE;
    }

    void put(K key, V value) {
        int h = hash(key);
        for (int i = head[h]; i != -1; i = node[i].next) {
            if (node[i].key == key) {
                node[i].value = value;
                return;
            }
        }
        node[nodeCnt].key = key;
        node[nodeCnt].value = value;
        node[nodeCnt].next = head[h];
        head[h] = nodeCnt++;
    }

    V* get(K key) {
        int h = hash(key);
        for (int i = head[h]; i != -1; i = node[i].next) {
            if (node[i].key == key) {
                return &node[i].value;
            }
        }
        return nullptr;
    }
};
```

### 좋은 해시 함수들

```cpp
// 정수 해시
int hashInt(int key) {
    // 곱셈 해시
    unsigned int x = (unsigned int)key;
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = (x >> 16) ^ x;
    return x % BUCKET_SIZE;
}

// 문자열 해시 (다항 롤링 해시)
unsigned int hashString(const char* s) {
    unsigned int h = 0;
    unsigned int base = 31;
    for (int i = 0; s[i]; i++) {
        h = h * base + (s[i] - 'a' + 1);
    }
    return h % BUCKET_SIZE;
}

// 문자열 해시 (FNV-1a 변형)
unsigned int hashStringFNV(const char* s) {
    unsigned int h = 2166136261u;
    for (int i = 0; s[i]; i++) {
        h ^= (unsigned char)s[i];
        h *= 16777619u;
    }
    return h % BUCKET_SIZE;
}

// 페어 해시
unsigned int hashPair(int a, int b) {
    unsigned int h1 = hashInt(a);
    unsigned int h2 = hashInt(b);
    return (h1 * 31 + h2) % BUCKET_SIZE;
}
```

## STL

### std::unordered_map

```cpp
#include <unordered_map>
#include <string>

// 기본 사용
std::unordered_map<int, int> intMap;
std::unordered_map<std::string, int> strMap;

// 삽입
intMap[1] = 100;
intMap.insert({2, 200});
intMap.emplace(3, 300);

// 탐색
if (intMap.find(1) != intMap.end()) {
    int val = intMap[1];
}
if (intMap.count(1)) {
    // 존재
}

// 삭제
intMap.erase(1);

// 순회
for (auto& [key, value] : intMap) {
    // key, value 사용
}
```

### std::unordered_set

```cpp
#include <unordered_set>

std::unordered_set<int> s;

s.insert(1);
s.insert(2);

if (s.count(1)) {
    // 존재
}

s.erase(1);
```

### 커스텀 해시 함수

```cpp
#include <unordered_map>

struct PairHash {
    size_t operator()(const std::pair<int, int>& p) const {
        return std::hash<int>()(p.first) ^ (std::hash<int>()(p.second) << 1);
    }
};

std::unordered_map<std::pair<int, int>, int, PairHash> pairMap;
pairMap[{1, 2}] = 100;
```

### 커스텀 구조체 키

```cpp
#include <unordered_map>

struct Point {
    int x, y;
    bool operator==(const Point& other) const {
        return x == other.x && y == other.y;
    }
};

struct PointHash {
    size_t operator()(const Point& p) const {
        return std::hash<int>()(p.x) ^ (std::hash<int>()(p.y) << 1);
    }
};

std::unordered_map<Point, int, PointHash> pointMap;
```

## 사용 예시

### 중복 원소 확인

```cpp
bool hasDuplicate(int arr[], int n) {
    init();
    for (int i = 0; i < n; i++) {
        if (find(arr[i]) != -1) {
            return true;
        }
        insert(arr[i], 1);
    }
    return false;
}
```

### 빈도수 카운팅

```cpp
void countFrequency(int arr[], int n) {
    init();
    for (int i = 0; i < n; i++) {
        int cnt = find(arr[i]);
        if (cnt == -1) {
            insert(arr[i], 1);
        } else {
            // 값 업데이트 필요
            insert(arr[i], cnt + 1);  // 기존 구현이 업데이트 지원 시
        }
    }
}
```

### Two Sum 문제

```cpp
// 두 수의 합이 target인 인덱스 쌍 찾기
std::pair<int, int> twoSum(int arr[], int n, int target) {
    init();

    for (int i = 0; i < n; i++) {
        int complement = target - arr[i];
        int idx = find(complement);
        if (idx != -1) {
            return {idx, i};
        }
        insert(arr[i], i);
    }

    return {-1, -1};
}
```

### 문자열 매칭

```cpp
// 사전에 있는 단어인지 확인
const int MAX_DICT = 10000;
bool isWordInDict(const char* word) {
    return find(word) != -1;
}

void addToDict(const char* word, int id) {
    insert(word, id);
}
```

## 주의사항 / Edge Cases

### 버킷 크기는 소수로

```cpp
// 좋음: 소수 사용
const int BUCKET_SIZE = 10007;
const int BUCKET_SIZE = 100003;
const int BUCKET_SIZE = 1000003;

// 나쁨: 2의 거듭제곱
const int BUCKET_SIZE = 1024;  // 충돌 증가 가능
```

### 음수 키 처리

```cpp
// 음수 모듈러 주의
int hash(int key) {
    return key % BUCKET_SIZE;  // key < 0이면 음수 반환!
}

// 올바른 방법
int hash(int key) {
    return ((key % BUCKET_SIZE) + BUCKET_SIZE) % BUCKET_SIZE;
}
```

### 문자열 해시 오버플로우

```cpp
// unsigned int 사용으로 자연스러운 오버플로우 처리
unsigned int hash(const char* s) {
    unsigned int h = 0;
    // ...
}
```

### unordered_map 해시 충돌 공격

```cpp
// 코딩테스트에서 의도적인 해시 충돌 데이터 가능
// 대안 1: map 사용 (O(log N) 보장)
// 대안 2: 커스텀 해시 사용

struct SafeHash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }

    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM =
            std::chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};

std::unordered_map<int, int, SafeHash> safeMap;
```

### 삭제 후 재사용

```cpp
// 노드 풀 재사용 불가 (간단한 구현)
// 재사용 필요 시 free list 구현

int freeHead = -1;

int allocNode() {
    if (freeHead != -1) {
        int idx = freeHead;
        freeHead = node[idx].next;
        return idx;
    }
    return nodeCnt++;
}

void freeNode(int idx) {
    node[idx].next = freeHead;
    freeHead = idx;
}
```

### 초기화 시간

```cpp
// 버킷 배열 초기화에 O(M) 시간
// M이 크면 부담될 수 있음

// 대안: 타임스탬프 방식
int timestamp[BUCKET_SIZE];
int currentTime = 0;

void init() {
    currentTime++;  // O(1)
}

bool isEmpty(int bucket) {
    return timestamp[bucket] != currentTime;
}
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Silver | 숫자 카드 | [BOJ 10815](https://www.acmicpc.net/problem/10815) |
| Silver | 숫자 카드 2 | [BOJ 10816](https://www.acmicpc.net/problem/10816) |
| Silver | 나는야 포켓몬 마스터 이다솜 | [BOJ 1620](https://www.acmicpc.net/problem/1620) |
| Gold | 수열과 쿼리 13 | [BOJ 13705](https://www.acmicpc.net/problem/13705) |
| Gold | 친구 네트워크 | [BOJ 4195](https://www.acmicpc.net/problem/4195) |
