---
title: 19. AVL 트리
slug: avlTree
publishedAt: '2025-12-19'
categories: datastructure
math: false
---

## 개념

AVL 트리는 자가 균형 이진 탐색 트리(Self-Balancing BST)로, 모든 노드에서 왼쪽과 오른쪽 서브트리의 높이 차이가 최대 1이다.

### 균형 인수 (Balance Factor)

```
BF(node) = height(left) - height(right)
유효 범위: -1, 0, 1
```

### BST와 비교

| 항목 | 일반 BST | AVL 트리 |
|------|----------|----------|
| 탐색 | O(N) 최악 | O(log N) 보장 |
| 삽입 | O(N) 최악 | O(log N) 보장 |
| 삭제 | O(N) 최악 | O(log N) 보장 |
| 균형 | 보장 안됨 | 항상 균형 |
| 구현 | 간단 | 복잡 (회전) |

### 회전 연산

| 상황 | BF | 회전 |
|------|-----|------|
| LL | +2, 왼쪽 자식 ≥ 0 | 우회전 |
| RR | -2, 오른쪽 자식 ≤ 0 | 좌회전 |
| LR | +2, 왼쪽 자식 < 0 | 좌회전 → 우회전 |
| RL | -2, 오른쪽 자식 > 0 | 우회전 → 좌회전 |

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 탐색 | O(log N) | 항상 균형 |
| 삽입 | O(log N) | 삽입 후 회전 |
| 삭제 | O(log N) | 삭제 후 회전 |
| 최솟값/최댓값 | O(log N) | 왼쪽/오른쪽 끝 |

## 구현 (No-STL)

### 노드 구조체

```cpp
const int MAX_NODE = 100001;

struct Node {
    int key;
    int height;
    int left;
    int right;
} node[MAX_NODE];

int nodeCnt;
int root;

void init() {
    nodeCnt = 0;
    root = -1;
}

int makeNode(int key) {
    node[nodeCnt].key = key;
    node[nodeCnt].height = 1;
    node[nodeCnt].left = -1;
    node[nodeCnt].right = -1;
    return nodeCnt++;
}
```

### 높이 및 균형 인수

```cpp
int getHeight(int cur) {
    if (cur == -1) return 0;
    return node[cur].height;
}

void updateHeight(int cur) {
    int lh = getHeight(node[cur].left);
    int rh = getHeight(node[cur].right);
    node[cur].height = 1 + (lh > rh ? lh : rh);
}

int getBalance(int cur) {
    if (cur == -1) return 0;
    return getHeight(node[cur].left) - getHeight(node[cur].right);
}
```

### 회전 연산

```cpp
// 우회전 (Right Rotation)
//       y                x
//      / \              / \
//     x   C    →       A   y
//    / \                  / \
//   A   B                B   C

int rotateRight(int y) {
    int x = node[y].left;
    int B = node[x].right;

    node[x].right = y;
    node[y].left = B;

    updateHeight(y);
    updateHeight(x);

    return x;
}

// 좌회전 (Left Rotation)
//     x                  y
//    / \                / \
//   A   y      →       x   C
//      / \            / \
//     B   C          A   B

int rotateLeft(int x) {
    int y = node[x].right;
    int B = node[y].left;

    node[y].left = x;
    node[x].right = B;

    updateHeight(x);
    updateHeight(y);

    return y;
}
```

### 균형 유지

```cpp
int balance(int cur) {
    updateHeight(cur);
    int bf = getBalance(cur);

    // LL Case
    if (bf > 1 && getBalance(node[cur].left) >= 0) {
        return rotateRight(cur);
    }

    // RR Case
    if (bf < -1 && getBalance(node[cur].right) <= 0) {
        return rotateLeft(cur);
    }

    // LR Case
    if (bf > 1 && getBalance(node[cur].left) < 0) {
        node[cur].left = rotateLeft(node[cur].left);
        return rotateRight(cur);
    }

    // RL Case
    if (bf < -1 && getBalance(node[cur].right) > 0) {
        node[cur].right = rotateRight(node[cur].right);
        return rotateLeft(cur);
    }

    return cur;
}
```

### 삽입

```cpp
int insert(int cur, int key) {
    if (cur == -1) {
        return makeNode(key);
    }

    if (key < node[cur].key) {
        node[cur].left = insert(node[cur].left, key);
    } else if (key > node[cur].key) {
        node[cur].right = insert(node[cur].right, key);
    } else {
        return cur;  // 중복 키
    }

    return balance(cur);
}

void insertKey(int key) {
    root = insert(root, key);
}
```

### 삭제

```cpp
int findMin(int cur) {
    while (node[cur].left != -1) {
        cur = node[cur].left;
    }
    return cur;
}

int deleteNode(int cur, int key) {
    if (cur == -1) return -1;

    if (key < node[cur].key) {
        node[cur].left = deleteNode(node[cur].left, key);
    } else if (key > node[cur].key) {
        node[cur].right = deleteNode(node[cur].right, key);
    } else {
        // 삭제할 노드 찾음
        if (node[cur].left == -1 || node[cur].right == -1) {
            int child = (node[cur].left != -1) ? node[cur].left : node[cur].right;
            return child;
        }

        // 두 자식 모두 있음
        int successor = findMin(node[cur].right);
        node[cur].key = node[successor].key;
        node[cur].right = deleteNode(node[cur].right, node[successor].key);
    }

    return balance(cur);
}

void deleteKey(int key) {
    root = deleteNode(root, key);
}
```

### 탐색

```cpp
bool search(int cur, int key) {
    if (cur == -1) return false;
    if (key == node[cur].key) return true;
    if (key < node[cur].key) return search(node[cur].left, key);
    return search(node[cur].right, key);
}
```

### 전체 코드 (구조체화)

```cpp
const int MAX_NODE = 100001;

struct AVLTree {
    struct Node {
        int key, height, left, right;
    } node[MAX_NODE];

    int nodeCnt, root;

    void init() {
        nodeCnt = 0;
        root = -1;
    }

    int makeNode(int key) {
        node[nodeCnt] = {key, 1, -1, -1};
        return nodeCnt++;
    }

    int height(int cur) { return cur == -1 ? 0 : node[cur].height; }

    void updateHeight(int cur) {
        int lh = height(node[cur].left);
        int rh = height(node[cur].right);
        node[cur].height = 1 + (lh > rh ? lh : rh);
    }

    int balance(int cur) { return height(node[cur].left) - height(node[cur].right); }

    int rotateRight(int y) {
        int x = node[y].left;
        node[y].left = node[x].right;
        node[x].right = y;
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    int rotateLeft(int x) {
        int y = node[x].right;
        node[x].right = node[y].left;
        node[y].left = x;
        updateHeight(x);
        updateHeight(y);
        return y;
    }

    int rebalance(int cur) {
        updateHeight(cur);
        int bf = balance(cur);

        if (bf > 1) {
            if (balance(node[cur].left) < 0)
                node[cur].left = rotateLeft(node[cur].left);
            return rotateRight(cur);
        }
        if (bf < -1) {
            if (balance(node[cur].right) > 0)
                node[cur].right = rotateRight(node[cur].right);
            return rotateLeft(cur);
        }
        return cur;
    }

    int insert(int cur, int key) {
        if (cur == -1) return makeNode(key);
        if (key < node[cur].key) node[cur].left = insert(node[cur].left, key);
        else if (key > node[cur].key) node[cur].right = insert(node[cur].right, key);
        return rebalance(cur);
    }

    void insert(int key) { root = insert(root, key); }
};
```

## STL

C++에서 AVL 트리 직접 구현 대신 `std::set`/`std::map`을 사용하면 내부적으로 Red-Black Tree로 균형 BST 기능을 사용할 수 있다.

```cpp
#include <set>
#include <map>

std::set<int> s;  // 내부적으로 Red-Black Tree
s.insert(5);
s.erase(5);
s.find(5);

// AVL 트리가 필요한 특수 케이스가 아니면 STL 사용 권장
```

## 사용 예시

### 중위 순회 (정렬된 출력)

```cpp
void inorder(int cur) {
    if (cur == -1) return;
    inorder(node[cur].left);
    // node[cur].key 출력
    inorder(node[cur].right);
}
```

### K번째 원소 (서브트리 크기)

```cpp
// 각 노드에 서브트리 크기 저장
struct Node {
    int key, height, size;
    int left, right;
};

int getSize(int cur) {
    return cur == -1 ? 0 : node[cur].size;
}

void updateSize(int cur) {
    node[cur].size = 1 + getSize(node[cur].left) + getSize(node[cur].right);
}

int kthSmallest(int cur, int k) {
    int leftSize = getSize(node[cur].left);
    if (k <= leftSize) return kthSmallest(node[cur].left, k);
    if (k == leftSize + 1) return node[cur].key;
    return kthSmallest(node[cur].right, k - leftSize - 1);
}
```

## 주의사항 / Edge Cases

### 회전 후 높이 업데이트 순서

```cpp
int rotateRight(int y) {
    int x = node[y].left;
    node[y].left = node[x].right;
    node[x].right = y;

    updateHeight(y);  // 자식(y)을 먼저 업데이트
    updateHeight(x);  // 부모(x)를 나중에 업데이트

    return x;
}
```

### 균형 인수 판정

```cpp
// |BF| > 1 이면 불균형
if (bf > 1) {
    // 왼쪽이 무거움 → LL 또는 LR
    if (balance(node[cur].left) >= 0) {
        // LL: 우회전
    } else {
        // LR: 좌회전 후 우회전
    }
}
```

### 빈 트리 처리

```cpp
int insert(int cur, int key) {
    if (cur == -1) {
        return makeNode(key);  // 첫 노드
    }
    // ...
}
```

### 코딩테스트에서의 선택

```cpp
// AVL 직접 구현은 복잡함
// 대부분의 경우 std::set/std::map 사용 권장

// AVL 구현이 필요한 경우:
// - 특정 연산 커스터마이징 필요
// - 면접/CS 대비
// - No-STL 환경
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Gold | 이중 우선순위 큐 | [BOJ 7662](https://www.acmicpc.net/problem/7662) |
| Gold | 보석 도둑 | [BOJ 1202](https://www.acmicpc.net/problem/1202) |
| Platinum | 중앙값 | [BOJ 2696](https://www.acmicpc.net/problem/2696) |
| Platinum | 순서 통계량 | [BOJ 12899](https://www.acmicpc.net/problem/12899) |
| Platinum | K번째 수 | [BOJ 7469](https://www.acmicpc.net/problem/7469) |
