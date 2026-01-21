---
title: 6. 트리 기초 & 순회 (Tree Traversal)
tags: datastructure
categories: datastructure
---

## 개념

트리는 계층적 구조를 표현하는 비선형 자료구조이다. 하나의 루트 노드에서 시작하여 자식 노드들로 뻗어나가는 형태를 갖는다.

### 트리 용어

| 용어 | 설명 |
|------|------|
| 루트(Root) | 트리의 최상위 노드 |
| 부모(Parent) | 특정 노드의 상위 노드 |
| 자식(Child) | 특정 노드의 하위 노드 |
| 리프(Leaf) | 자식이 없는 노드 |
| 형제(Sibling) | 같은 부모를 가진 노드들 |
| 깊이(Depth) | 루트에서 특정 노드까지의 거리 |
| 높이(Height) | 특정 노드에서 가장 먼 리프까지의 거리 |
| 레벨(Level) | 같은 깊이를 가진 노드들의 집합 |
| 차수(Degree) | 노드의 자식 수 |

### 이진 트리 (Binary Tree)

각 노드가 최대 2개의 자식(왼쪽, 오른쪽)을 갖는 트리이다.

| 종류 | 설명 |
|------|------|
| 정 이진 트리 (Full) | 모든 노드가 0개 또는 2개의 자식을 가짐 |
| 완전 이진 트리 (Complete) | 마지막 레벨 제외 모두 채워지고, 왼쪽부터 채워짐 |
| 포화 이진 트리 (Perfect) | 모든 레벨이 완전히 채워진 트리 |
| 편향 이진 트리 (Skewed) | 모든 노드가 한쪽 자식만 가짐 |

### 트리 순회 방식

| 순회 | 순서 | 용도 |
|------|------|------|
| 전위 (Preorder) | 루트 → 왼쪽 → 오른쪽 | 트리 복사, 전위 표기식 |
| 중위 (Inorder) | 왼쪽 → 루트 → 오른쪽 | BST에서 정렬된 순서 |
| 후위 (Postorder) | 왼쪽 → 오른쪽 → 루트 | 트리 삭제, 후위 표기식 |
| 레벨 (Level-order) | BFS 순서 | 너비 우선 탐색 |

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 순회 (전위/중위/후위/레벨) | O(N) | 모든 노드 방문 |
| 높이 계산 | O(N) | 모든 노드 방문 |
| 노드 개수 | O(N) | 모든 노드 방문 |
| 특정 노드 탐색 | O(N) | 일반 트리 기준 |

## 구현 (No-STL)

### 이진 트리 구조체 (정적 배열 기반)

```cpp
const int MAX_NODE = 100001;

struct Node {
    int left;
    int right;
    int parent;  // 필요시 사용
    int data;
} node[MAX_NODE];

int nodeCnt;
int root;

void init() {
    nodeCnt = 0;
    root = -1;
}

int makeNode(int data) {
    node[nodeCnt].data = data;
    node[nodeCnt].left = -1;
    node[nodeCnt].right = -1;
    node[nodeCnt].parent = -1;
    return nodeCnt++;
}

void setLeft(int parent, int child) {
    node[parent].left = child;
    if (child != -1) node[child].parent = parent;
}

void setRight(int parent, int child) {
    node[parent].right = child;
    if (child != -1) node[child].parent = parent;
}
```

### 전위 순회 (Preorder)

```cpp
// 재귀
void preorder(int cur) {
    if (cur == -1) return;
    // 현재 노드 처리 (node[cur].data)
    preorder(node[cur].left);
    preorder(node[cur].right);
}

// 반복 (스택 사용)
void preorderIterative(int root) {
    if (root == -1) return;

    int stack[MAX_NODE];
    int top = -1;
    stack[++top] = root;

    while (top >= 0) {
        int cur = stack[top--];
        // 현재 노드 처리

        // 오른쪽 먼저 push (왼쪽이 먼저 나오도록)
        if (node[cur].right != -1) stack[++top] = node[cur].right;
        if (node[cur].left != -1) stack[++top] = node[cur].left;
    }
}
```

### 중위 순회 (Inorder)

```cpp
// 재귀
void inorder(int cur) {
    if (cur == -1) return;
    inorder(node[cur].left);
    // 현재 노드 처리 (node[cur].data)
    inorder(node[cur].right);
}

// 반복 (스택 사용)
void inorderIterative(int root) {
    int stack[MAX_NODE];
    int top = -1;
    int cur = root;

    while (cur != -1 || top >= 0) {
        // 왼쪽으로 계속 이동
        while (cur != -1) {
            stack[++top] = cur;
            cur = node[cur].left;
        }

        cur = stack[top--];
        // 현재 노드 처리

        cur = node[cur].right;
    }
}
```

### 후위 순회 (Postorder)

```cpp
// 재귀
void postorder(int cur) {
    if (cur == -1) return;
    postorder(node[cur].left);
    postorder(node[cur].right);
    // 현재 노드 처리 (node[cur].data)
}

// 반복 (스택 2개 사용)
void postorderIterative(int root) {
    if (root == -1) return;

    int stack1[MAX_NODE], top1 = -1;
    int stack2[MAX_NODE], top2 = -1;

    stack1[++top1] = root;

    while (top1 >= 0) {
        int cur = stack1[top1--];
        stack2[++top2] = cur;

        if (node[cur].left != -1) stack1[++top1] = node[cur].left;
        if (node[cur].right != -1) stack1[++top1] = node[cur].right;
    }

    // stack2를 역순으로 출력하면 후위 순회
    while (top2 >= 0) {
        int cur = stack2[top2--];
        // 현재 노드 처리
    }
}
```

### 레벨 순회 (Level-order, BFS)

```cpp
void levelOrder(int root) {
    if (root == -1) return;

    int queue[MAX_NODE];
    int front = 0, rear = 0;
    queue[rear++] = root;

    while (front < rear) {
        int cur = queue[front++];
        // 현재 노드 처리

        if (node[cur].left != -1) queue[rear++] = node[cur].left;
        if (node[cur].right != -1) queue[rear++] = node[cur].right;
    }
}

// 레벨별로 구분하여 순회
void levelOrderByLevel(int root) {
    if (root == -1) return;

    int queue[MAX_NODE];
    int front = 0, rear = 0;
    queue[rear++] = root;

    int level = 0;
    while (front < rear) {
        int levelSize = rear - front;

        for (int i = 0; i < levelSize; i++) {
            int cur = queue[front++];
            // 현재 노드 처리 (level 정보 활용 가능)

            if (node[cur].left != -1) queue[rear++] = node[cur].left;
            if (node[cur].right != -1) queue[rear++] = node[cur].right;
        }
        level++;
    }
}
```

### 트리 높이 계산

```cpp
int getHeight(int cur) {
    if (cur == -1) return -1;  // 빈 트리는 높이 -1
    int leftHeight = getHeight(node[cur].left);
    int rightHeight = getHeight(node[cur].right);
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}
```

### 노드 개수 계산

```cpp
int countNodes(int cur) {
    if (cur == -1) return 0;
    return 1 + countNodes(node[cur].left) + countNodes(node[cur].right);
}
```

### N진 트리 (일반 트리)

```cpp
const int MAX_NODE = 100001;
const int MAX_CHILD = 100;  // 최대 자식 수

struct Node {
    int data;
    int child[MAX_CHILD];
    int childCnt;
} node[MAX_NODE];

int nodeCnt;

void init() {
    nodeCnt = 0;
}

int makeNode(int data) {
    node[nodeCnt].data = data;
    node[nodeCnt].childCnt = 0;
    return nodeCnt++;
}

void addChild(int parent, int child) {
    node[parent].child[node[parent].childCnt++] = child;
}

// N진 트리 전위 순회
void preorderNary(int cur) {
    // 현재 노드 처리
    for (int i = 0; i < node[cur].childCnt; i++) {
        preorderNary(node[cur].child[i]);
    }
}

// N진 트리 후위 순회
void postorderNary(int cur) {
    for (int i = 0; i < node[cur].childCnt; i++) {
        postorderNary(node[cur].child[i]);
    }
    // 현재 노드 처리
}
```

## STL

STL에는 트리 자료구조 자체는 없지만, 트리 기반 컨테이너와 순회 관련 기능이 있다.

### 포인터 기반 이진 트리

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// 전위 순회
void preorder(TreeNode* root) {
    if (!root) return;
    // root->val 처리
    preorder(root->left);
    preorder(root->right);
}

// 중위 순회
void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    // root->val 처리
    inorder(root->right);
}

// 후위 순회
void postorder(TreeNode* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    // root->val 처리
}
```

### 반복 순회 (STL stack 사용)

```cpp
#include <stack>
#include <vector>

// 전위 순회
std::vector<int> preorderTraversal(TreeNode* root) {
    std::vector<int> result;
    if (!root) return result;

    std::stack<TreeNode*> st;
    st.push(root);

    while (!st.empty()) {
        TreeNode* cur = st.top();
        st.pop();
        result.push_back(cur->val);

        if (cur->right) st.push(cur->right);
        if (cur->left) st.push(cur->left);
    }

    return result;
}

// 중위 순회
std::vector<int> inorderTraversal(TreeNode* root) {
    std::vector<int> result;
    std::stack<TreeNode*> st;
    TreeNode* cur = root;

    while (cur || !st.empty()) {
        while (cur) {
            st.push(cur);
            cur = cur->left;
        }
        cur = st.top();
        st.pop();
        result.push_back(cur->val);
        cur = cur->right;
    }

    return result;
}

// 후위 순회
std::vector<int> postorderTraversal(TreeNode* root) {
    std::vector<int> result;
    if (!root) return result;

    std::stack<TreeNode*> st;
    st.push(root);

    while (!st.empty()) {
        TreeNode* cur = st.top();
        st.pop();
        result.push_back(cur->val);

        if (cur->left) st.push(cur->left);
        if (cur->right) st.push(cur->right);
    }

    std::reverse(result.begin(), result.end());
    return result;
}
```

### 레벨 순회 (STL queue 사용)

```cpp
#include <queue>
#include <vector>

std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    std::vector<std::vector<int>> result;
    if (!root) return result;

    std::queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int levelSize = q.size();
        std::vector<int> level;

        for (int i = 0; i < levelSize; i++) {
            TreeNode* cur = q.front();
            q.pop();
            level.push_back(cur->val);

            if (cur->left) q.push(cur->left);
            if (cur->right) q.push(cur->right);
        }

        result.push_back(level);
    }

    return result;
}
```

## 사용 예시

### 순회 결과로 트리 복원

전위 + 중위 또는 후위 + 중위 순회 결과로 원래 트리를 복원할 수 있다.

```cpp
#include <unordered_map>

// 전위 + 중위 → 트리 복원
TreeNode* buildTree(std::vector<int>& preorder, std::vector<int>& inorder) {
    std::unordered_map<int, int> inMap;
    for (int i = 0; i < inorder.size(); i++) {
        inMap[inorder[i]] = i;
    }

    int preIdx = 0;
    return build(preorder, inMap, preIdx, 0, inorder.size() - 1);
}

TreeNode* build(std::vector<int>& preorder,
                std::unordered_map<int, int>& inMap,
                int& preIdx, int inStart, int inEnd) {
    if (inStart > inEnd) return nullptr;

    int rootVal = preorder[preIdx++];
    TreeNode* root = new TreeNode(rootVal);

    int inIdx = inMap[rootVal];
    root->left = build(preorder, inMap, preIdx, inStart, inIdx - 1);
    root->right = build(preorder, inMap, preIdx, inIdx + 1, inEnd);

    return root;
}
```

### 트리 직경 (가장 먼 두 노드 사이의 거리)

```cpp
int diameter;

int getHeight(int cur) {
    if (cur == -1) return 0;

    int leftH = getHeight(node[cur].left);
    int rightH = getHeight(node[cur].right);

    // 현재 노드를 지나는 경로의 길이
    diameter = (diameter > leftH + rightH) ? diameter : leftH + rightH;

    return 1 + (leftH > rightH ? leftH : rightH);
}

int getDiameter(int root) {
    diameter = 0;
    getHeight(root);
    return diameter;
}
```

### 두 노드의 최소 공통 조상 (LCA) - 기본

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;

    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);

    if (left && right) return root;  // p, q가 양쪽에 있음
    return left ? left : right;
}
```

### 트리의 대칭 여부 확인

```cpp
bool isSymmetric(TreeNode* root) {
    if (!root) return true;
    return isMirror(root->left, root->right);
}

bool isMirror(TreeNode* t1, TreeNode* t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;
    return (t1->val == t2->val)
        && isMirror(t1->left, t2->right)
        && isMirror(t1->right, t2->left);
}
```

### 배열로 완전 이진 트리 표현

```cpp
// 인덱스 규칙 (1-based)
// 부모: i / 2
// 왼쪽 자식: i * 2
// 오른쪽 자식: i * 2 + 1

int tree[MAX_NODE];
int n;  // 노드 개수

// 전위 순회
void preorder(int idx) {
    if (idx > n) return;
    // tree[idx] 처리
    preorder(idx * 2);
    preorder(idx * 2 + 1);
}

// 중위 순회
void inorder(int idx) {
    if (idx > n) return;
    inorder(idx * 2);
    // tree[idx] 처리
    inorder(idx * 2 + 1);
}

// 후위 순회
void postorder(int idx) {
    if (idx > n) return;
    postorder(idx * 2);
    postorder(idx * 2 + 1);
    // tree[idx] 처리
}
```

## 주의사항 / Edge Cases

### 빈 트리 처리

```cpp
// 루트가 null인 경우 체크
void traverse(int root) {
    if (root == -1) return;  // 빈 트리
    // ...
}
```

### 재귀 깊이 초과

```cpp
// 편향 트리에서 재귀 호출 시 스택 오버플로우 위험
// N이 크면 (> 10만) 반복 버전 사용 권장

// 위험한 코드
void deepRecursion(int cur) {
    if (cur == -1) return;
    deepRecursion(node[cur].left);  // 편향 시 N번 재귀
}

// 안전한 코드: 반복 버전 사용
void iterativeTraversal(int root) {
    // 스택으로 구현
}
```

### 순회 순서 혼동

```cpp
// 전위: 루트 → 왼쪽 → 오른쪽
// 중위: 왼쪽 → 루트 → 오른쪽
// 후위: 왼쪽 → 오른쪽 → 루트

// 주의: 반복 버전에서 스택 push 순서
// 전위 반복: 오른쪽 먼저 push (왼쪽이 먼저 나오도록)
if (node[cur].right != -1) stack[++top] = node[cur].right;
if (node[cur].left != -1) stack[++top] = node[cur].left;
```

### 트리 복원 조건

```cpp
// 전위 + 중위 → 복원 가능
// 후위 + 중위 → 복원 가능
// 전위 + 후위 → 복원 불가능 (일반적으로)
//   단, Full Binary Tree인 경우는 가능

// 중복 값이 있으면 복원 불가능
// 모든 값이 유일해야 함
```

### 높이 정의 주의

```cpp
// 높이 정의는 문제마다 다를 수 있음

// 정의 1: 노드 수 기준 (루트만 있으면 1)
int height1(int cur) {
    if (cur == -1) return 0;
    return 1 + max(height1(node[cur].left), height1(node[cur].right));
}

// 정의 2: 간선 수 기준 (루트만 있으면 0)
int height2(int cur) {
    if (cur == -1) return -1;
    return 1 + max(height2(node[cur].left), height2(node[cur].right));
}
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Silver | 트리 순회 | [BOJ 1991](https://www.acmicpc.net/problem/1991) |
| Silver | 트리의 부모 찾기 | [BOJ 11725](https://www.acmicpc.net/problem/11725) |
| Gold | 트리의 지름 | [BOJ 1167](https://www.acmicpc.net/problem/1167) |
| Gold | 트리 | [BOJ 4803](https://www.acmicpc.net/problem/4803) |
| Gold | 이진 검색 트리 | [BOJ 5639](https://www.acmicpc.net/problem/5639) |