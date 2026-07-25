---
title: 17. 메모리 풀 (Memory Pool)
slug: memoryPool
publishedAt: '2025-12-17'
categories: datastructure
math: false
---

## 개념

메모리 풀(Memory Pool)은 미리 할당한 메모리 블록을 관리하여 동적 할당의 오버헤드를 줄이는 기법이다.

### 동적 할당 vs 메모리 풀

| 항목 | 동적 할당 (new/malloc) | 메모리 풀 |
|------|------------------------|-----------|
| 할당 속도 | 느림 (OS 호출) | 빠름 (배열 접근) |
| 메모리 단편화 | 발생 가능 | 없음 |
| 사용 패턴 | 유연함 | 고정 크기 |
| 코딩테스트 | 느림, 권장 안함 | 빠름, 권장 |

### 메모리 풀의 장점

- 할당/해제가 O(1)
- 메모리 단편화 없음
- 캐시 효율 좋음
- 코딩테스트에서 빠른 실행 시간

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 초기화 | O(1) | 카운터만 초기화 |
| 할당 | O(1) | 인덱스 반환 |
| 해제 | O(1) | Free list에 추가 (선택) |
| 전체 초기화 | O(1) | 카운터 리셋 |

## 구현 (No-STL)

### 기본 메모리 풀 (해제 없음)

```cpp
const int MAX_NODE = 100001;

struct Node {
    int data;
    int left, right;
} pool[MAX_NODE];

int poolCnt;

void initPool() {
    poolCnt = 0;
}

int allocNode() {
    return poolCnt++;
}

// 사용 예
void example() {
    initPool();

    int node1 = allocNode();
    pool[node1].data = 10;
    pool[node1].left = -1;
    pool[node1].right = -1;

    int node2 = allocNode();
    pool[node2].data = 20;
}
```

### Free List 방식 (해제 가능)

```cpp
const int MAX_NODE = 100001;

struct Node {
    int data;
    int next;
} pool[MAX_NODE];

int poolCnt;
int freeHead;  // 해제된 노드들의 연결 리스트

void initPool() {
    poolCnt = 0;
    freeHead = -1;
}

int allocNode() {
    if (freeHead != -1) {
        int idx = freeHead;
        freeHead = pool[idx].next;
        return idx;
    }
    return poolCnt++;
}

void freeNode(int idx) {
    pool[idx].next = freeHead;
    freeHead = idx;
}
```

### 연결 리스트용 메모리 풀

```cpp
const int MAX_NODE = 100001;

struct ListNode {
    int data;
    int prev;
    int next;
} pool[MAX_NODE];

int poolCnt;
int HEAD, TAIL;  // 더미 노드

void initPool() {
    poolCnt = 0;
}

void initList() {
    HEAD = poolCnt++;
    TAIL = poolCnt++;
    pool[HEAD].prev = -1;
    pool[HEAD].next = TAIL;
    pool[TAIL].prev = HEAD;
    pool[TAIL].next = -1;
}

int allocNode(int data) {
    int idx = poolCnt++;
    pool[idx].data = data;
    return idx;
}

void insertAfter(int prevNode, int data) {
    int newNode = allocNode(data);
    int nextNode = pool[prevNode].next;

    pool[newNode].prev = prevNode;
    pool[newNode].next = nextNode;
    pool[prevNode].next = newNode;
    pool[nextNode].prev = newNode;
}

void removeNode(int node) {
    int prevNode = pool[node].prev;
    int nextNode = pool[node].next;
    pool[prevNode].next = nextNode;
    pool[nextNode].prev = prevNode;
}
```

### 트리용 메모리 풀

```cpp
const int MAX_NODE = 100001;

struct TreeNode {
    int data;
    int left;
    int right;
    int parent;
} pool[MAX_NODE];

int poolCnt;
int root;

void initPool() {
    poolCnt = 0;
    root = -1;
}

int allocNode(int data) {
    int idx = poolCnt++;
    pool[idx].data = data;
    pool[idx].left = -1;
    pool[idx].right = -1;
    pool[idx].parent = -1;
    return idx;
}

void setLeftChild(int parent, int child) {
    pool[parent].left = child;
    if (child != -1) {
        pool[child].parent = parent;
    }
}

void setRightChild(int parent, int child) {
    pool[parent].right = child;
    if (child != -1) {
        pool[child].parent = parent;
    }
}
```

### 해시 테이블용 메모리 풀

```cpp
const int MAX_NODE = 100001;
const int BUCKET_SIZE = 10007;

struct HashNode {
    int key;
    int value;
    int next;
} pool[MAX_NODE];

int poolCnt;
int head[BUCKET_SIZE];

void init() {
    poolCnt = 0;
    for (int i = 0; i < BUCKET_SIZE; i++) {
        head[i] = -1;
    }
}

int allocNode(int key, int value) {
    int idx = poolCnt++;
    pool[idx].key = key;
    pool[idx].value = value;
    pool[idx].next = -1;
    return idx;
}

void insert(int key, int value) {
    int h = ((key % BUCKET_SIZE) + BUCKET_SIZE) % BUCKET_SIZE;
    int newNode = allocNode(key, value);
    pool[newNode].next = head[h];
    head[h] = newNode;
}
```

### 구조체로 캡슐화

```cpp
template<typename T, int MAX_SIZE>
struct MemoryPool {
    T pool[MAX_SIZE];
    int cnt;
    int freeList;

    void init() {
        cnt = 0;
        freeList = -1;
    }

    int alloc() {
        if (freeList != -1) {
            int idx = freeList;
            freeList = *(int*)&pool[idx];  // 첫 4바이트를 next로 사용
            return idx;
        }
        return cnt++;
    }

    void free(int idx) {
        *(int*)&pool[idx] = freeList;
        freeList = idx;
    }

    T& get(int idx) {
        return pool[idx];
    }
};
```

## STL

STL에서는 커스텀 allocator를 사용할 수 있지만, 코딩테스트에서는 보통 직접 구현이 더 간단하다.

### 기본적으로 new/delete 피하기

```cpp
// 느림 (권장하지 않음)
struct Node {
    int data;
    Node* left;
    Node* right;
};

Node* root = new Node();
delete root;

// 빠름 (권장)
const int MAX_NODE = 100001;
struct Node {
    int data;
    int left, right;
} pool[MAX_NODE];
int poolCnt = 0;
```

### placement new (참고)

```cpp
#include <new>

char buffer[sizeof(Node) * MAX_NODE];
int idx = 0;

Node* allocNode() {
    return new(&buffer[sizeof(Node) * idx++]) Node();
}
```

## 사용 예시

### 그래프 인접 리스트

```cpp
const int MAX_V = 100001;
const int MAX_E = 200001;

struct Edge {
    int to;
    int weight;
    int next;
} edge[MAX_E];

int head[MAX_V];
int edgeCnt;

void init(int V) {
    edgeCnt = 0;
    for (int i = 0; i <= V; i++) {
        head[i] = -1;
    }
}

void addEdge(int from, int to, int weight) {
    edge[edgeCnt].to = to;
    edge[edgeCnt].weight = weight;
    edge[edgeCnt].next = head[from];
    head[from] = edgeCnt++;
}
```

### 트라이

```cpp
const int MAX_NODE = 1000001;
const int ALPHA = 26;

int trie[MAX_NODE][ALPHA];
bool isEnd[MAX_NODE];
int nodeCnt;

void init() {
    nodeCnt = 1;
    for (int i = 0; i < ALPHA; i++) {
        trie[0][i] = 0;
    }
    isEnd[0] = false;
}

int newNode() {
    for (int i = 0; i < ALPHA; i++) {
        trie[nodeCnt][i] = 0;
    }
    isEnd[nodeCnt] = false;
    return nodeCnt++;
}
```

### 세그먼트 트리 (동적)

```cpp
const int MAX_NODE = 4000001;

struct SegNode {
    long long sum;
    int left, right;
} seg[MAX_NODE];

int segCnt;
int segRoot;

void initSeg() {
    segCnt = 0;
    segRoot = segCnt++;
    seg[segRoot].sum = 0;
    seg[segRoot].left = -1;
    seg[segRoot].right = -1;
}

int newSegNode() {
    int idx = segCnt++;
    seg[idx].sum = 0;
    seg[idx].left = -1;
    seg[idx].right = -1;
    return idx;
}
```

### 테스트케이스 초기화

```cpp
int T;
scanf("%d", &T);

while (T--) {
    initPool();  // 매 테스트케이스마다 풀 초기화

    // 문제 풀이
}
```

## 주의사항 / Edge Cases

### 풀 크기 계산

```cpp
// 필요한 최대 노드 수 계산
// 트라이: 문자열 총 길이
// 그래프: 간선 수 (무방향이면 x2)
// 세그먼트 트리: 4N

const int MAX_NODE = 100001;  // 넉넉하게 잡기
```

### 인덱스 vs 포인터

```cpp
// 인덱스 사용 (권장)
struct Node {
    int data;
    int next;  // 인덱스
} pool[MAX_NODE];

// 포인터 사용 (비권장)
struct Node {
    int data;
    Node* next;  // 포인터
};
```

### 초기화 범위

```cpp
// 풀 전체 초기화는 비효율적
void initBad() {
    for (int i = 0; i < MAX_NODE; i++) {
        pool[i].data = 0;
        // ...
    }
}

// 카운터만 초기화 (효율적)
void initGood() {
    poolCnt = 0;  // 이전 데이터는 덮어씀
}
```

### NULL 대신 -1

```cpp
// 포인터 NULL 대신 인덱스 -1 사용
int root = -1;

if (root == -1) {
    // 비어있음
}
```

### 재사용 시 주의

```cpp
// Free list에서 꺼낸 노드는 이전 데이터가 남아있을 수 있음
int allocNode() {
    int idx;
    if (freeHead != -1) {
        idx = freeHead;
        freeHead = pool[idx].next;
        // 초기화 필요할 수 있음
        pool[idx].data = 0;
        pool[idx].next = -1;
    } else {
        idx = poolCnt++;
    }
    return idx;
}
```

### 전역 변수 초기화

```cpp
// 전역 배열은 자동으로 0 초기화
int pool[MAX_NODE];  // 모두 0

// 하지만 여러 테스트케이스에서 명시적 초기화 권장
void init() {
    poolCnt = 0;
    // 필요한 부분만 초기화
}
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Silver | 에디터 | [BOJ 1406](https://www.acmicpc.net/problem/1406) |
| Gold | 개미굴 | [BOJ 14725](https://www.acmicpc.net/problem/14725) |
| Gold | 문자열 집합 | [BOJ 14425](https://www.acmicpc.net/problem/14425) |
| Platinum | K번째 수 | [BOJ 7469](https://www.acmicpc.net/problem/7469) |
| Platinum | XOR 합 | [BOJ 13505](https://www.acmicpc.net/problem/13505) |
