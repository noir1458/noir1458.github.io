---
title: 14. 해시 테이블 - Open Addressing
tags: datastructure
categories: datastructure
---

## 개념

개방 주소법(Open Addressing)은 충돌 시 다른 빈 슬롯을 찾아 저장하는 방식이다. 모든 데이터가 해시 테이블 배열 내에 저장된다.

### Chaining vs Open Addressing

| 항목 | Chaining | Open Addressing |
|------|----------|-----------------|
| 충돌 해결 | 연결 리스트 | 다른 슬롯 탐색 |
| 메모리 | 추가 포인터 필요 | 배열만 사용 |
| 캐시 효율 | 낮음 | 높음 |
| 적재율 | 1 초과 가능 | 최대 1 |
| 삭제 | 간단 | 복잡 (tombstone) |

### 탐사 방법

| 방법 | 수식 | 특징 |
|------|------|------|
| 선형 탐사 | h(k) + i | 구현 간단, 클러스터링 |
| 이차 탐사 | h(k) + c₁i + c₂i² | 클러스터링 완화 |
| 이중 해싱 | h₁(k) + i·h₂(k) | 균등 분포, 연산 비용 |

## 핵심 연산 & 시간복잡도

| 연산 | 평균 | 최악 |
|------|------|------|
| 삽입 | O(1) | O(N) |
| 탐색 | O(1) | O(N) |
| 삭제 | O(1) | O(N) |

### 적재율과 성능

```
선형 탐사 평균 탐색: 1/2 * (1 + 1/(1-α))
권장 적재율: α < 0.7
```

## 구현 (No-STL)

### 선형 탐사 (Linear Probing)

```cpp
const int TABLE_SIZE = 100003;
const int EMPTY = -1;
const int DELETED = -2;

int keys[TABLE_SIZE];
int values[TABLE_SIZE];
int cnt;

void init() {
    cnt = 0;
    for (int i = 0; i < TABLE_SIZE; i++) {
        keys[i] = EMPTY;
    }
}

int hash(int key) {
    return ((key % TABLE_SIZE) + TABLE_SIZE) % TABLE_SIZE;
}

bool insert(int key, int value) {
    if (cnt >= TABLE_SIZE * 0.7) return false;  // 적재율 체크

    int h = hash(key);
    int i = 0;

    while (i < TABLE_SIZE) {
        int idx = (h + i) % TABLE_SIZE;

        if (keys[idx] == EMPTY || keys[idx] == DELETED) {
            keys[idx] = key;
            values[idx] = value;
            cnt++;
            return true;
        }

        if (keys[idx] == key) {
            values[idx] = value;  // 업데이트
            return true;
        }

        i++;
    }

    return false;  // 테이블 가득 참
}

int find(int key) {
    int h = hash(key);
    int i = 0;

    while (i < TABLE_SIZE) {
        int idx = (h + i) % TABLE_SIZE;

        if (keys[idx] == EMPTY) {
            return -1;  // 없음
        }

        if (keys[idx] == key) {
            return values[idx];
        }

        i++;
    }

    return -1;
}

bool erase(int key) {
    int h = hash(key);
    int i = 0;

    while (i < TABLE_SIZE) {
        int idx = (h + i) % TABLE_SIZE;

        if (keys[idx] == EMPTY) {
            return false;
        }

        if (keys[idx] == key) {
            keys[idx] = DELETED;  // tombstone
            cnt--;
            return true;
        }

        i++;
    }

    return false;
}
```

### 이차 탐사 (Quadratic Probing)

```cpp
const int TABLE_SIZE = 100003;  // 소수여야 함
const int EMPTY = -1;
const int DELETED = -2;

int keys[TABLE_SIZE];
int values[TABLE_SIZE];

int hash(int key) {
    return ((key % TABLE_SIZE) + TABLE_SIZE) % TABLE_SIZE;
}

bool insert(int key, int value) {
    int h = hash(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        // h + i^2 (이차 탐사)
        int idx = (h + i * i) % TABLE_SIZE;

        if (keys[idx] == EMPTY || keys[idx] == DELETED) {
            keys[idx] = key;
            values[idx] = value;
            return true;
        }

        if (keys[idx] == key) {
            values[idx] = value;
            return true;
        }
    }

    return false;
}

int find(int key) {
    int h = hash(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (h + i * i) % TABLE_SIZE;

        if (keys[idx] == EMPTY) return -1;
        if (keys[idx] == key) return values[idx];
    }

    return -1;
}
```

### 이중 해싱 (Double Hashing)

```cpp
const int TABLE_SIZE = 100003;
const int PRIME = 100001;  // TABLE_SIZE보다 작은 소수
const int EMPTY = -1;
const int DELETED = -2;

int keys[TABLE_SIZE];
int values[TABLE_SIZE];

int hash1(int key) {
    return ((key % TABLE_SIZE) + TABLE_SIZE) % TABLE_SIZE;
}

int hash2(int key) {
    return PRIME - (key % PRIME);  // 0이 되지 않도록
}

bool insert(int key, int value) {
    int h1 = hash1(key);
    int h2 = hash2(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (h1 + i * h2) % TABLE_SIZE;

        if (keys[idx] == EMPTY || keys[idx] == DELETED) {
            keys[idx] = key;
            values[idx] = value;
            return true;
        }

        if (keys[idx] == key) {
            values[idx] = value;
            return true;
        }
    }

    return false;
}

int find(int key) {
    int h1 = hash1(key);
    int h2 = hash2(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (h1 + i * h2) % TABLE_SIZE;

        if (keys[idx] == EMPTY) return -1;
        if (keys[idx] == key) return values[idx];
    }

    return -1;
}
```

### 문자열 키 (선형 탐사)

```cpp
const int TABLE_SIZE = 100003;
const int MAX_LEN = 11;

struct Entry {
    char key[MAX_LEN];
    int value;
    int state;  // 0: EMPTY, 1: OCCUPIED, 2: DELETED
} table[TABLE_SIZE];

void init() {
    for (int i = 0; i < TABLE_SIZE; i++) {
        table[i].state = 0;
    }
}

bool strEqual(const char* a, const char* b) {
    int i = 0;
    while (a[i] && b[i]) {
        if (a[i] != b[i]) return false;
        i++;
    }
    return a[i] == b[i];
}

void strCopy(char* dest, const char* src) {
    int i = 0;
    while (src[i]) {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\0';
}

unsigned int hash(const char* key) {
    unsigned int h = 0;
    for (int i = 0; key[i]; i++) {
        h = h * 31 + key[i];
    }
    return h % TABLE_SIZE;
}

bool insert(const char* key, int value) {
    unsigned int h = hash(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (h + i) % TABLE_SIZE;

        if (table[idx].state != 1) {  // EMPTY or DELETED
            strCopy(table[idx].key, key);
            table[idx].value = value;
            table[idx].state = 1;
            return true;
        }

        if (strEqual(table[idx].key, key)) {
            table[idx].value = value;
            return true;
        }
    }

    return false;
}

int find(const char* key) {
    unsigned int h = hash(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (h + i) % TABLE_SIZE;

        if (table[idx].state == 0) return -1;  // EMPTY

        if (table[idx].state == 1 && strEqual(table[idx].key, key)) {
            return table[idx].value;
        }
    }

    return -1;
}
```

### 구조체로 캡슐화

```cpp
const int TABLE_SIZE = 100003;

struct OpenAddressHashMap {
    static const int EMPTY = -1;
    static const int DELETED = -2;

    int keys[TABLE_SIZE];
    int values[TABLE_SIZE];
    int cnt;

    void init() {
        cnt = 0;
        for (int i = 0; i < TABLE_SIZE; i++) {
            keys[i] = EMPTY;
        }
    }

    int hash(int key) {
        return ((key % TABLE_SIZE) + TABLE_SIZE) % TABLE_SIZE;
    }

    void put(int key, int value) {
        int h = hash(key);
        for (int i = 0; i < TABLE_SIZE; i++) {
            int idx = (h + i) % TABLE_SIZE;
            if (keys[idx] == EMPTY || keys[idx] == DELETED || keys[idx] == key) {
                if (keys[idx] != key) cnt++;
                keys[idx] = key;
                values[idx] = value;
                return;
            }
        }
    }

    int get(int key) {
        int h = hash(key);
        for (int i = 0; i < TABLE_SIZE; i++) {
            int idx = (h + i) % TABLE_SIZE;
            if (keys[idx] == EMPTY) return -1;
            if (keys[idx] == key) return values[idx];
        }
        return -1;
    }

    bool remove(int key) {
        int h = hash(key);
        for (int i = 0; i < TABLE_SIZE; i++) {
            int idx = (h + i) % TABLE_SIZE;
            if (keys[idx] == EMPTY) return false;
            if (keys[idx] == key) {
                keys[idx] = DELETED;
                cnt--;
                return true;
            }
        }
        return false;
    }
};
```

## STL

STL의 `unordered_map`은 Chaining을 사용하지만, Open Addressing은 직접 구현해야 한다.

### 간단한 래퍼

```cpp
#include <unordered_map>

// STL은 기본적으로 Chaining 사용
// Open Addressing이 필요한 특수한 경우에만 직접 구현

std::unordered_map<int, int> m;  // Chaining
```

### Google의 Abseil (참고)

```cpp
// absl::flat_hash_map은 Open Addressing 사용
// 표준 라이브러리 아님, 참고용

// #include "absl/container/flat_hash_map.h"
// absl::flat_hash_map<int, int> m;
```

## 사용 예시

### 캐시 구현 (LRU 아닌 단순 캐시)

```cpp
const int CACHE_SIZE = 10007;
int cacheKey[CACHE_SIZE];
int cacheValue[CACHE_SIZE];

void initCache() {
    for (int i = 0; i < CACHE_SIZE; i++) {
        cacheKey[i] = EMPTY;
    }
}

int compute(int x) {
    // 비용이 큰 계산
    return x * x;  // 예시
}

int getWithCache(int x) {
    int cached = find(x);
    if (cached != -1) {
        return cached;
    }

    int result = compute(x);
    insert(x, result);
    return result;
}
```

### 좌표 압축 대안

```cpp
// 좌표 압축 없이 해시 테이블로 직접 매핑
// 음수 좌표도 처리 가능

int coordToIndex(int x, int y) {
    // 2D 좌표를 키로 변환
    long long key = (long long)x * 200001 + y;  // 범위에 따라 조정
    return find(key);
}
```

### 문자열 패턴 매칭 해시

```cpp
// 문자열 해시값을 저장하여 빠른 비교

unsigned int patternHash[1000];
int patternCount;

void addPattern(const char* s) {
    patternHash[patternCount++] = hash(s);
}

bool matchesAnyPattern(const char* s) {
    unsigned int h = hash(s);
    for (int i = 0; i < patternCount; i++) {
        if (patternHash[i] == h) {
            // 해시 충돌 가능성 있으므로 실제 문자열 비교 필요
            return true;
        }
    }
    return false;
}
```

## 주의사항 / Edge Cases

### Tombstone과 탐색

```cpp
// 삭제된 슬롯(DELETED)을 건너뛰지 않으면 탐색 실패
int find(int key) {
    int h = hash(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (h + i) % TABLE_SIZE;

        if (keys[idx] == EMPTY) {
            return -1;  // 여기서 멈춤
        }

        // DELETED는 건너뛰고 계속 탐색
        if (keys[idx] == key) {
            return values[idx];
        }
    }

    return -1;
}
```

### Tombstone 누적 문제

```cpp
// 삭제가 많으면 DELETED 슬롯이 누적되어 성능 저하
// 해결책: 재해싱 (rehashing)

void rehash() {
    int oldKeys[TABLE_SIZE];
    int oldValues[TABLE_SIZE];

    for (int i = 0; i < TABLE_SIZE; i++) {
        oldKeys[i] = keys[i];
        oldValues[i] = values[i];
    }

    init();

    for (int i = 0; i < TABLE_SIZE; i++) {
        if (oldKeys[i] != EMPTY && oldKeys[i] != DELETED) {
            insert(oldKeys[i], oldValues[i]);
        }
    }
}
```

### 이차 탐사와 테이블 크기

```cpp
// 이차 탐사는 테이블 크기가 소수이고 α < 0.5일 때
// 모든 슬롯 방문 보장

// 안전한 테이블 크기: 4k + 3 형태의 소수
// 10007, 100003, 1000003 등
```

### 클러스터링 (Clustering)

```cpp
// 선형 탐사의 문제: Primary Clustering
// 연속된 슬롯이 차면 점점 더 긴 탐색 필요

// 이차 탐사의 문제: Secondary Clustering
// 같은 초기 해시값이면 같은 탐사 순서

// 이중 해싱: 클러스터링 최소화
// 단, 두 번째 해시 함수 계산 비용 추가
```

### 삭제 없이 구현

```cpp
// 삭제가 없으면 DELETED 상태 불필요
// 더 간단하고 빠름

bool insert(int key, int value) {
    int h = hash(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (h + i) % TABLE_SIZE;

        if (keys[idx] == EMPTY || keys[idx] == key) {
            keys[idx] = key;
            values[idx] = value;
            return true;
        }
    }

    return false;
}
```

### 키 값 범위

```cpp
// EMPTY와 DELETED에 쓰는 값이 실제 키와 겹치지 않도록

// 방법 1: 키 범위 외의 값 사용
const int EMPTY = -1;      // 키가 음수가 아닐 때
const int DELETED = -2;

// 방법 2: 별도의 상태 배열
int keys[TABLE_SIZE];
int values[TABLE_SIZE];
int state[TABLE_SIZE];  // 0: EMPTY, 1: OCCUPIED, 2: DELETED
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Silver | 숫자 카드 | [BOJ 10815](https://www.acmicpc.net/problem/10815) |
| Silver | 듣보잡 | [BOJ 1764](https://www.acmicpc.net/problem/1764) |
| Gold | 수열과 쿼리 13 | [BOJ 13705](https://www.acmicpc.net/problem/13705) |
| Gold | 문자열 집합 | [BOJ 14425](https://www.acmicpc.net/problem/14425) |
| Platinum | 문자열 게임 2 | [BOJ 20437](https://www.acmicpc.net/problem/20437) |
