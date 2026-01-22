---
title: 20. Red-Black 트리
tags: datastructure
categories: datastructure
---

## 개념

레드-블랙 트리(Red-Black Tree)는 자가 균형 이진 탐색 트리로, 각 노드가 빨간색 또는 검은색을 가지며 5가지 속성을 만족한다.

### 5가지 속성

1. 모든 노드는 빨간색 또는 검은색
2. 루트는 검은색
3. 모든 리프(NIL)는 검은색
4. 빨간 노드의 자식은 모두 검은색 (연속 빨강 X)
5. 각 노드에서 리프까지 검은 노드 수 동일 (Black Height)

### AVL vs Red-Black

| 항목 | AVL | Red-Black |
|------|-----|-----------|
| 균형 조건 | 높이 차 ≤ 1 | Black Height 동일 |
| 균형 정도 | 더 엄격 | 덜 엄격 |
| 탐색 | 더 빠름 | 약간 느림 |
| 삽입/삭제 | 회전 많음 | 회전 적음 |
| 사용처 | 탐색 많을 때 | 삽입/삭제 많을 때 |
| STL | - | std::set/map |

### 높이 보장

```
h ≤ 2 * log₂(n + 1)
n개 노드에서 최대 높이가 2log(n)으로 보장
```

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 탐색 | O(log N) | 균형 보장 |
| 삽입 | O(log N) | 최대 2회 회전 |
| 삭제 | O(log N) | 최대 3회 회전 |

## 구현 (No-STL)

### 노드 구조체

```cpp
const int MAX_NODE = 100001;
const int RED = 0;
const int BLACK = 1;

struct Node {
    int key;
    int color;
    int left, right, parent;
} node[MAX_NODE];

int nodeCnt;
int root;
int NIL;  // 센티넬 노드

void init() {
    nodeCnt = 0;

    // NIL 노드 (센티넬)
    NIL = nodeCnt++;
    node[NIL].color = BLACK;
    node[NIL].left = NIL;
    node[NIL].right = NIL;
    node[NIL].parent = NIL;

    root = NIL;
}

int makeNode(int key) {
    int idx = nodeCnt++;
    node[idx].key = key;
    node[idx].color = RED;  // 새 노드는 빨강
    node[idx].left = NIL;
    node[idx].right = NIL;
    node[idx].parent = NIL;
    return idx;
}
```

### 회전 연산

```cpp
void rotateLeft(int x) {
    int y = node[x].right;
    node[x].right = node[y].left;

    if (node[y].left != NIL) {
        node[node[y].left].parent = x;
    }

    node[y].parent = node[x].parent;

    if (node[x].parent == NIL) {
        root = y;
    } else if (x == node[node[x].parent].left) {
        node[node[x].parent].left = y;
    } else {
        node[node[x].parent].right = y;
    }

    node[y].left = x;
    node[x].parent = y;
}

void rotateRight(int y) {
    int x = node[y].left;
    node[y].left = node[x].right;

    if (node[x].right != NIL) {
        node[node[x].right].parent = y;
    }

    node[x].parent = node[y].parent;

    if (node[y].parent == NIL) {
        root = x;
    } else if (y == node[node[y].parent].right) {
        node[node[y].parent].right = x;
    } else {
        node[node[y].parent].left = x;
    }

    node[x].right = y;
    node[y].parent = x;
}
```

### 삽입

```cpp
void insertFixup(int z) {
    while (node[node[z].parent].color == RED) {
        if (node[z].parent == node[node[node[z].parent].parent].left) {
            int y = node[node[node[z].parent].parent].right;  // 삼촌

            if (node[y].color == RED) {
                // Case 1: 삼촌이 빨강
                node[node[z].parent].color = BLACK;
                node[y].color = BLACK;
                node[node[node[z].parent].parent].color = RED;
                z = node[node[z].parent].parent;
            } else {
                if (z == node[node[z].parent].right) {
                    // Case 2: 삼촌 검정, z가 오른쪽 자식
                    z = node[z].parent;
                    rotateLeft(z);
                }
                // Case 3: 삼촌 검정, z가 왼쪽 자식
                node[node[z].parent].color = BLACK;
                node[node[node[z].parent].parent].color = RED;
                rotateRight(node[node[z].parent].parent);
            }
        } else {
            // 대칭 (왼쪽 ↔ 오른쪽)
            int y = node[node[node[z].parent].parent].left;

            if (node[y].color == RED) {
                node[node[z].parent].color = BLACK;
                node[y].color = BLACK;
                node[node[node[z].parent].parent].color = RED;
                z = node[node[z].parent].parent;
            } else {
                if (z == node[node[z].parent].left) {
                    z = node[z].parent;
                    rotateRight(z);
                }
                node[node[z].parent].color = BLACK;
                node[node[node[z].parent].parent].color = RED;
                rotateLeft(node[node[z].parent].parent);
            }
        }
    }
    node[root].color = BLACK;
}

void insert(int key) {
    int z = makeNode(key);

    int y = NIL;
    int x = root;

    while (x != NIL) {
        y = x;
        if (key < node[x].key) {
            x = node[x].left;
        } else {
            x = node[x].right;
        }
    }

    node[z].parent = y;

    if (y == NIL) {
        root = z;
    } else if (key < node[y].key) {
        node[y].left = z;
    } else {
        node[y].right = z;
    }

    insertFixup(z);
}
```

### 삭제 (간략화)

```cpp
void transplant(int u, int v) {
    if (node[u].parent == NIL) {
        root = v;
    } else if (u == node[node[u].parent].left) {
        node[node[u].parent].left = v;
    } else {
        node[node[u].parent].right = v;
    }
    node[v].parent = node[u].parent;
}

int minimum(int x) {
    while (node[x].left != NIL) {
        x = node[x].left;
    }
    return x;
}

void deleteFixup(int x) {
    while (x != root && node[x].color == BLACK) {
        if (x == node[node[x].parent].left) {
            int w = node[node[x].parent].right;

            if (node[w].color == RED) {
                node[w].color = BLACK;
                node[node[x].parent].color = RED;
                rotateLeft(node[x].parent);
                w = node[node[x].parent].right;
            }

            if (node[node[w].left].color == BLACK &&
                node[node[w].right].color == BLACK) {
                node[w].color = RED;
                x = node[x].parent;
            } else {
                if (node[node[w].right].color == BLACK) {
                    node[node[w].left].color = BLACK;
                    node[w].color = RED;
                    rotateRight(w);
                    w = node[node[x].parent].right;
                }
                node[w].color = node[node[x].parent].color;
                node[node[x].parent].color = BLACK;
                node[node[w].right].color = BLACK;
                rotateLeft(node[x].parent);
                x = root;
            }
        } else {
            // 대칭
            int w = node[node[x].parent].left;

            if (node[w].color == RED) {
                node[w].color = BLACK;
                node[node[x].parent].color = RED;
                rotateRight(node[x].parent);
                w = node[node[x].parent].left;
            }

            if (node[node[w].right].color == BLACK &&
                node[node[w].left].color == BLACK) {
                node[w].color = RED;
                x = node[x].parent;
            } else {
                if (node[node[w].left].color == BLACK) {
                    node[node[w].right].color = BLACK;
                    node[w].color = RED;
                    rotateLeft(w);
                    w = node[node[x].parent].left;
                }
                node[w].color = node[node[x].parent].color;
                node[node[x].parent].color = BLACK;
                node[node[w].left].color = BLACK;
                rotateRight(node[x].parent);
                x = root;
            }
        }
    }
    node[x].color = BLACK;
}

void deleteNode(int z) {
    int y = z;
    int yOriginalColor = node[y].color;
    int x;

    if (node[z].left == NIL) {
        x = node[z].right;
        transplant(z, node[z].right);
    } else if (node[z].right == NIL) {
        x = node[z].left;
        transplant(z, node[z].left);
    } else {
        y = minimum(node[z].right);
        yOriginalColor = node[y].color;
        x = node[y].right;

        if (node[y].parent == z) {
            node[x].parent = y;
        } else {
            transplant(y, node[y].right);
            node[y].right = node[z].right;
            node[node[y].right].parent = y;
        }

        transplant(z, y);
        node[y].left = node[z].left;
        node[node[y].left].parent = y;
        node[y].color = node[z].color;
    }

    if (yOriginalColor == BLACK) {
        deleteFixup(x);
    }
}
```

### 탐색

```cpp
int search(int key) {
    int cur = root;
    while (cur != NIL) {
        if (key == node[cur].key) return cur;
        if (key < node[cur].key) cur = node[cur].left;
        else cur = node[cur].right;
    }
    return NIL;
}
```

## STL

C++ STL의 `std::set`, `std::map`, `std::multiset`, `std::multimap`은 Red-Black Tree로 구현되어 있다.

```cpp
#include <set>
#include <map>

// std::set - 정렬된 집합
std::set<int> s;
s.insert(5);
s.erase(5);
s.find(5);
s.lower_bound(5);
s.upper_bound(5);

// std::map - 정렬된 키-값 쌍
std::map<int, std::string> m;
m[1] = "one";
m.erase(1);

// 모든 연산 O(log N) 보장
```

## 사용 예시

### 범위 검색

```cpp
#include <set>

std::set<int> s = {1, 3, 5, 7, 9};

// [3, 7] 범위의 원소
auto start = s.lower_bound(3);
auto end = s.upper_bound(7);

for (auto it = start; it != end; ++it) {
    // *it 사용
}
```

### 순위 기반 연산 (Order Statistics)

```cpp
// GNU 확장 (pb_ds)
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>

using namespace __gnu_pbds;

typedef tree<int, null_type, std::less<int>,
             rb_tree_tag, tree_order_statistics_node_update> ordered_set;

ordered_set os;
os.insert(5);
os.insert(3);
os.insert(7);

os.find_by_order(1);  // 2번째 원소 (0-indexed) = 5
os.order_of_key(5);   // 5보다 작은 원소 개수 = 1
```

## 주의사항 / Edge Cases

### NIL 센티넬

```cpp
// NIL 노드를 별도로 관리
// 모든 리프와 루트의 부모가 NIL을 가리킴
// 코드 간결화에 도움

int NIL;
node[NIL].color = BLACK;  // NIL은 항상 검정
```

### 삽입 후 루트 색상

```cpp
void insertFixup(int z) {
    // ...
    node[root].color = BLACK;  // 루트는 항상 검정!
}
```

### 코딩테스트에서의 선택

```cpp
// Red-Black Tree 직접 구현은 매우 복잡
// 대부분의 경우 std::set/std::map 사용 권장

// 직접 구현이 필요한 경우:
// - 면접/CS 대비
// - 커스텀 연산 필요
// - No-STL 환경
```

### 삭제 Case 분석

```cpp
// 삭제는 삽입보다 복잡
// 4가지 Case 존재:
// Case 1: 형제 w가 빨강
// Case 2: 형제 w가 검정, w의 자식 둘 다 검정
// Case 3: 형제 w가 검정, w의 왼쪽 자식 빨강, 오른쪽 검정
// Case 4: 형제 w가 검정, w의 오른쪽 자식 빨강
```

### AVL vs Red-Black 선택

```cpp
// 탐색 위주 → AVL (높이가 더 낮음)
// 삽입/삭제 위주 → Red-Black (회전이 적음)
// 일반적인 경우 → Red-Black (STL 기본)
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Gold | 이중 우선순위 큐 | [BOJ 7662](https://www.acmicpc.net/problem/7662) |
| Gold | 보석 도둑 | [BOJ 1202](https://www.acmicpc.net/problem/1202) |
| Platinum | K번째 수 | [BOJ 7469](https://www.acmicpc.net/problem/7469) |
| Platinum | 순서 통계량 | [BOJ 12899](https://www.acmicpc.net/problem/12899) |
| Platinum | 수열과 쿼리 1 | [BOJ 13537](https://www.acmicpc.net/problem/13537) |
