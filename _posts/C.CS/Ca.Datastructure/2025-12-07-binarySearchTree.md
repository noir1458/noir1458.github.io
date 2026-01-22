---
title: 7. 이진 탐색 트리 (BST)
tags: datastructure
categories: datastructure
---

## 개념

이진 탐색 트리(Binary Search Tree)는 다음 속성을 만족하는 이진 트리이다.

- 왼쪽 서브트리의 모든 노드 값 < 현재 노드 값
- 오른쪽 서브트리의 모든 노드 값 > 현재 노드 값
- 중복 값은 허용하지 않음 (또는 한쪽에 몰아서 처리)

### BST의 특징

| 특징 | 설명 |
|------|------|
| 중위 순회 | 정렬된 순서로 출력됨 |
| 탐색 | 이진 탐색 원리 적용 |
| 동적 자료구조 | 삽입/삭제가 유연함 |
| 균형 문제 | 편향 시 성능 저하 |

### 균형 vs 편향

```
균형 BST (높이 = log N)        편향 BST (높이 = N)
        4                           1
       / \                           \
      2   6                           2
     / \ / \                           \
    1  3 5  7                           3
                                         \
                                          4
```

## 핵심 연산 & 시간복잡도

| 연산 | 평균 | 최악 (편향) | 설명 |
|------|------|-------------|------|
| 탐색 (Search) | O(log N) | O(N) | 루트부터 비교하며 이동 |
| 삽입 (Insert) | O(log N) | O(N) | 탐색 후 리프에 삽입 |
| 삭제 (Delete) | O(log N) | O(N) | 후속자/선행자로 대체 |
| 최솟값/최댓값 | O(log N) | O(N) | 왼쪽/오른쪽 끝까지 이동 |
| 중위 순회 | O(N) | O(N) | 정렬된 순서 출력 |

## 구현 (No-STL)

### 정적 배열 기반 BST

```cpp
const int MAX_NODE = 100001;

struct Node {
    int key;
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
    node[nodeCnt].left = -1;
    node[nodeCnt].right = -1;
    return nodeCnt++;
}
```

### 탐색 (Search)

```cpp
// 반복
int search(int key) {
    int cur = root;
    while (cur != -1) {
        if (key == node[cur].key) return cur;
        else if (key < node[cur].key) cur = node[cur].left;
        else cur = node[cur].right;
    }
    return -1;  // 못 찾음
}

// 재귀
int searchRecur(int cur, int key) {
    if (cur == -1) return -1;
    if (key == node[cur].key) return cur;
    if (key < node[cur].key) return searchRecur(node[cur].left, key);
    return searchRecur(node[cur].right, key);
}
```

### 삽입 (Insert)

```cpp
// 반복
void insert(int key) {
    int newNode = makeNode(key);

    if (root == -1) {
        root = newNode;
        return;
    }

    int cur = root;
    while (true) {
        if (key < node[cur].key) {
            if (node[cur].left == -1) {
                node[cur].left = newNode;
                return;
            }
            cur = node[cur].left;
        } else if (key > node[cur].key) {
            if (node[cur].right == -1) {
                node[cur].right = newNode;
                return;
            }
            cur = node[cur].right;
        } else {
            // 중복 키: 정책에 따라 처리
            return;
        }
    }
}

// 재귀
int insertRecur(int cur, int key) {
    if (cur == -1) return makeNode(key);

    if (key < node[cur].key) {
        node[cur].left = insertRecur(node[cur].left, key);
    } else if (key > node[cur].key) {
        node[cur].right = insertRecur(node[cur].right, key);
    }
    return cur;
}
```

### 삭제 (Delete)

```cpp
// 최솟값 노드 찾기
int findMin(int cur) {
    while (node[cur].left != -1) {
        cur = node[cur].left;
    }
    return cur;
}

// 삭제 (재귀)
int deleteNode(int cur, int key) {
    if (cur == -1) return -1;

    if (key < node[cur].key) {
        node[cur].left = deleteNode(node[cur].left, key);
    } else if (key > node[cur].key) {
        node[cur].right = deleteNode(node[cur].right, key);
    } else {
        // 삭제할 노드 찾음

        // Case 1: 리프 노드
        if (node[cur].left == -1 && node[cur].right == -1) {
            return -1;
        }

        // Case 2: 자식이 하나
        if (node[cur].left == -1) return node[cur].right;
        if (node[cur].right == -1) return node[cur].left;

        // Case 3: 자식이 둘 - 중위 후속자로 대체
        int successor = findMin(node[cur].right);
        node[cur].key = node[successor].key;
        node[cur].right = deleteNode(node[cur].right, node[successor].key);
    }
    return cur;
}
```

### 최솟값/최댓값

```cpp
int getMin() {
    if (root == -1) return -1;
    int cur = root;
    while (node[cur].left != -1) {
        cur = node[cur].left;
    }
    return node[cur].key;
}

int getMax() {
    if (root == -1) return -1;
    int cur = root;
    while (node[cur].right != -1) {
        cur = node[cur].right;
    }
    return node[cur].key;
}
```

### 중위 순회 (정렬 출력)

```cpp
void inorder(int cur) {
    if (cur == -1) return;
    inorder(node[cur].left);
    // node[cur].key 처리 (정렬된 순서)
    inorder(node[cur].right);
}
```

### K번째 작은 원소 (서브트리 크기 저장)

```cpp
struct Node {
    int key;
    int left, right;
    int size;  // 서브트리 크기
} node[MAX_NODE];

int getSize(int cur) {
    return cur == -1 ? 0 : node[cur].size;
}

void updateSize(int cur) {
    if (cur != -1) {
        node[cur].size = 1 + getSize(node[cur].left) + getSize(node[cur].right);
    }
}

// K번째 작은 원소 (1-indexed)
int kthSmallest(int cur, int k) {
    if (cur == -1) return -1;

    int leftSize = getSize(node[cur].left);

    if (k <= leftSize) {
        return kthSmallest(node[cur].left, k);
    } else if (k == leftSize + 1) {
        return node[cur].key;
    } else {
        return kthSmallest(node[cur].right, k - leftSize - 1);
    }
}
```

## STL

C++ STL에서 BST 기반 컨테이너는 `std::set`, `std::map`, `std::multiset`, `std::multimap`이 있다. 내부적으로 Red-Black Tree로 구현되어 항상 균형을 유지한다.

### std::set (정렬된 집합)

```cpp
#include <set>

std::set<int> s;

// 삽입: O(log N)
s.insert(5);
s.insert(3);
s.insert(7);

// 삭제: O(log N)
s.erase(5);

// 탐색: O(log N)
if (s.find(3) != s.end()) {
    // 존재
}
if (s.count(3)) {
    // 존재 (0 또는 1)
}

// 최솟값/최댓값: O(1)
int minVal = *s.begin();
int maxVal = *s.rbegin();

// 크기
s.size();
s.empty();

// 순회 (정렬된 순서)
for (int x : s) {
    // x 처리
}
```

### std::set - lower_bound / upper_bound

```cpp
std::set<int> s = {1, 3, 5, 7, 9};

// lower_bound: key 이상인 첫 번째 원소
auto it1 = s.lower_bound(5);  // *it1 = 5
auto it2 = s.lower_bound(4);  // *it2 = 5

// upper_bound: key 초과인 첫 번째 원소
auto it3 = s.upper_bound(5);  // *it3 = 7
auto it4 = s.upper_bound(4);  // *it4 = 5

// K 이하의 최댓값 찾기
auto it = s.upper_bound(6);
if (it != s.begin()) {
    --it;
    int maxLE = *it;  // 6 이하 최댓값 = 5
}

// K 이상의 최솟값 찾기
auto it = s.lower_bound(4);
if (it != s.end()) {
    int minGE = *it;  // 4 이상 최솟값 = 5
}
```

### std::map (key-value 저장)

```cpp
#include <map>

std::map<int, std::string> m;

// 삽입
m[1] = "one";
m[2] = "two";
m.insert({3, "three"});

// 접근
std::string val = m[1];  // "one"

// 탐색
if (m.find(2) != m.end()) {
    // 존재
}
if (m.count(2)) {
    // 존재
}

// 삭제
m.erase(1);

// 순회 (key 정렬 순서)
for (auto& [key, value] : m) {
    // key, value 처리
}
```

### std::multiset (중복 허용)

```cpp
#include <set>

std::multiset<int> ms;

ms.insert(5);
ms.insert(5);
ms.insert(3);

ms.count(5);  // 2

// 하나만 삭제
ms.erase(ms.find(5));  // 5 하나만 삭제

// 모두 삭제
ms.erase(5);  // 모든 5 삭제
```

## 사용 예시

### 구간 내 원소 개수

```cpp
#include <set>

std::set<int> s = {1, 3, 5, 7, 9};

// [L, R] 구간의 원소 개수
int countInRange(int L, int R) {
    auto left = s.lower_bound(L);
    auto right = s.upper_bound(R);
    return std::distance(left, right);
}
```

### 좌표 압축

```cpp
#include <set>
#include <map>
#include <vector>

std::vector<int> compress(std::vector<int>& arr) {
    std::set<int> s(arr.begin(), arr.end());

    std::map<int, int> m;
    int idx = 0;
    for (int x : s) {
        m[x] = idx++;
    }

    std::vector<int> result;
    for (int x : arr) {
        result.push_back(m[x]);
    }
    return result;
}
```

### BST 유효성 검사

```cpp
bool isValidBST(int cur, int minVal, int maxVal) {
    if (cur == -1) return true;

    if (node[cur].key <= minVal || node[cur].key >= maxVal) {
        return false;
    }

    return isValidBST(node[cur].left, minVal, node[cur].key) &&
           isValidBST(node[cur].right, node[cur].key, maxVal);
}

// 호출: isValidBST(root, INT_MIN, INT_MAX);
```

### 정렬된 배열을 균형 BST로 변환

```cpp
int sortedArrayToBST(int arr[], int left, int right) {
    if (left > right) return -1;

    int mid = (left + right) / 2;
    int cur = makeNode(arr[mid]);

    node[cur].left = sortedArrayToBST(arr, left, mid - 1);
    node[cur].right = sortedArrayToBST(arr, mid + 1, right);

    return cur;
}
```

### 두 BST 병합 (중위 순회 활용)

```cpp
#include <vector>

void inorderCollect(int cur, std::vector<int>& result) {
    if (cur == -1) return;
    inorderCollect(node[cur].left, result);
    result.push_back(node[cur].key);
    inorderCollect(node[cur].right, result);
}

// 두 정렬된 배열 병합 후 BST 생성
```

## 주의사항 / Edge Cases

### 편향 트리 주의

```cpp
// 정렬된 데이터를 순서대로 삽입하면 편향 트리 발생
for (int i = 1; i <= n; i++) {
    insert(i);  // 오른쪽으로 편향된 트리
}
// 이 경우 모든 연산이 O(N)

// 해결책:
// 1. 랜덤 순서로 삽입
// 2. 균형 BST 사용 (AVL, Red-Black Tree)
// 3. STL set/map 사용 (내부적으로 Red-Black Tree)
```

### 삭제 시 후속자/선행자 선택

```cpp
// 두 자식이 있는 노드 삭제 시
// 방법 1: 중위 후속자 (오른쪽 서브트리의 최솟값)
// 방법 2: 중위 선행자 (왼쪽 서브트리의 최댓값)

// 둘 다 정답이지만, 일관성 유지 필요
```

### 중복 키 처리

```cpp
// 정책 1: 무시 (삽입 안 함)
// 정책 2: 왼쪽 서브트리에 삽입 (key <= 로 변경)
// 정책 3: 카운트 저장

struct Node {
    int key;
    int count;  // 중복 개수
    int left, right;
};
```

### set에서 원소 수정

```cpp
std::set<int> s = {1, 2, 3};

// 잘못된 방법: set의 원소는 직접 수정 불가
// *s.begin() = 10;  // 컴파일 에러

// 올바른 방법: 삭제 후 재삽입
s.erase(s.begin());
s.insert(10);
```

### lower_bound 결과 체크

```cpp
std::set<int> s = {1, 3, 5};

auto it = s.lower_bound(10);
// it == s.end() 체크 필수!

if (it != s.end()) {
    int val = *it;  // 안전
}

// 역방향 탐색 시
auto it = s.lower_bound(2);
if (it != s.begin()) {
    --it;
    int val = *it;  // 2 미만의 최댓값 = 1
}
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Silver | 이진 검색 트리 | [BOJ 5639](https://www.acmicpc.net/problem/5639) |
| Silver | 트리 순회 | [BOJ 1991](https://www.acmicpc.net/problem/1991) |
| Gold | 이중 우선순위 큐 | [BOJ 7662](https://www.acmicpc.net/problem/7662) |
| Gold | 보석 도둑 | [BOJ 1202](https://www.acmicpc.net/problem/1202) |
| Gold | 나무 자르기 | [BOJ 2805](https://www.acmicpc.net/problem/2805) |
