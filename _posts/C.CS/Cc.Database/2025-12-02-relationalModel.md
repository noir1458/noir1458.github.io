---
title: 2. 관계형 모델과 이론
tags: database
categories: database
---

## 관계 데이터 모델

**관계 데이터 모델(Relational Data Model)**은 데이터를 2차원 테이블(릴레이션) 형태로 표현하는 논리적 데이터 모델이다. 1970년 E.F. Codd가 제안하였으며, 현재 가장 널리 사용되는 데이터 모델이다.

### 릴레이션의 구성

```
릴레이션 (Relation) = 테이블

┌──────────────────────────────────────────────┐
│            Student (릴레이션 이름)              │
├──────┬──────────┬────────┬───────────────────┤
│  id  │  name    │  dept  │  grade            │  ← 속성 (Attribute) = 컬럼
├──────┼──────────┼────────┼───────────────────┤
│ 1001 │ 홍길동    │ CS     │ 4                 │  ← 튜플 (Tuple) = 행
│ 1002 │ 김영희    │ EE     │ 3                 │
│ 1003 │ 이철수    │ CS     │ 2                 │
└──────┴──────────┴────────┴───────────────────┘

- 릴레이션 스키마: Student(id, name, dept, grade)
- 릴레이션 인스턴스: 특정 시점의 튜플 집합
- 차수 (Degree): 속성의 수 = 4
- 카디널리티 (Cardinality): 튜플의 수 = 3
```

### 릴레이션의 특성

```
1. 튜플의 유일성: 중복 튜플 없음
2. 튜플의 무순서: 행의 순서 무의미
3. 속성의 무순서: 열의 순서 무의미
4. 속성의 원자성: 각 속성 값은 원자값 (더 이상 분해 불가)
   → 다치 값 (Multi-valued) 허용하지 않음 = 1NF 조건
```

### 용어 정리

| 공식 용어 | 파일 시스템 | 실무 용어 |
|-----------|-----------|-----------|
| 릴레이션 (Relation) | 파일 (File) | 테이블 (Table) |
| 튜플 (Tuple) | 레코드 (Record) | 행 (Row) |
| 속성 (Attribute) | 필드 (Field) | 컬럼 (Column) |
| 도메인 (Domain) | 데이터 타입 | 데이터 타입 |

## 키 (Key)

### 키의 종류

```
1. 슈퍼키 (Super Key)
   - 튜플을 유일하게 식별할 수 있는 속성의 집합
   - 예: {id}, {id, name}, {id, name, dept}, ...

2. 후보키 (Candidate Key)
   - 슈퍼키 중 최소성을 만족하는 키
   - 더 이상 속성을 제거하면 유일성이 깨짐
   - 예: {id}, {name, dept} (이름+학과가 유일하다면)

3. 기본키 (Primary Key, PK)
   - 후보키 중 하나를 선택한 것
   - NULL 허용 안 됨
   - 중복 허용 안 됨

4. 대체키 (Alternate Key)
   - 후보키 중 기본키로 선택되지 않은 키

5. 외래키 (Foreign Key, FK)
   - 다른 릴레이션의 기본키를 참조하는 속성
   - 참조 무결성의 기반
```

### 키의 관계

```
슈퍼키 ⊃ 후보키 ⊃ 기본키
                 ⊃ 대체키

예: Student 릴레이션
  슈퍼키: {id}, {id, name}, {id, dept}, {name, dept}, ...
  후보키: {id}, {name, dept}
  기본키: {id} (선택)
  대체키: {name, dept}
```

## 무결성 제약 조건

### 종류

```
1. 개체 무결성 (Entity Integrity)
   - 기본키는 NULL이 될 수 없다
   - 기본키는 중복될 수 없다
   - 예: Student.id IS NOT NULL, UNIQUE

2. 참조 무결성 (Referential Integrity)
   - 외래키 값은 참조하는 릴레이션의 기본키 값이거나 NULL
   - 예: Enrollment.student_id → Student.id

3. 도메인 무결성 (Domain Integrity)
   - 속성 값은 정의된 도메인에 속해야 함
   - 예: grade는 1~4 사이의 정수

4. 키 무결성 (Key Integrity)
   - 릴레이션에는 반드시 하나 이상의 키가 존재

5. NULL 무결성
   - NOT NULL로 정의된 속성에 NULL 불허
```

### 참조 무결성과 외래키

```
Student (부모 릴레이션)         Enrollment (자식 릴레이션)
┌──────┬──────────┐           ┌──────┬────────────┬──────────┐
│  id  │  name    │           │  eid │ student_id │ course   │
├──────┼──────────┤           ├──────┼────────────┼──────────┤
│ 1001 │ 홍길동    │    ←───── │  1   │ 1001       │ DB       │
│ 1002 │ 김영희    │    ←───── │  2   │ 1002       │ OS       │
│ 1003 │ 이철수    │           │  3   │ 1001       │ Network  │
└──────┴──────────┘           └──────┴────────────┴──────────┘

FK 참조 시 부모 릴레이션 변경 옵션:
- RESTRICT: 참조하는 튜플이 있으면 삭제/수정 거부
- CASCADE: 부모 삭제/수정 시 자식도 함께 삭제/수정
- SET NULL: 부모 삭제/수정 시 자식 FK를 NULL로
- SET DEFAULT: 부모 삭제/수정 시 자식 FK를 기본값으로
```

```sql
CREATE TABLE Enrollment (
    eid INT PRIMARY KEY,
    student_id INT,
    course VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES Student(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

## 관계 대수 (Relational Algebra)

릴레이션을 처리하기 위한 절차적 언어. SQL의 이론적 기반이다.

### 순수 관계 연산

```
1. 셀렉션 (Selection): σ
   σ_조건(R)
   - 조건을 만족하는 튜플 선택 (수평적 부분 집합)
   - 예: σ_{dept='CS'}(Student)
   → SQL: SELECT * FROM Student WHERE dept = 'CS'

2. 프로젝션 (Projection): π
   π_속성리스트(R)
   - 특정 속성만 선택 (수직적 부분 집합)
   - 중복 튜플 제거
   - 예: π_{name, dept}(Student)
   → SQL: SELECT DISTINCT name, dept FROM Student

3. 조인 (Join): ⋈
   R ⋈_조건 S
   - 두 릴레이션의 관련 튜플을 결합
   - 예: Student ⋈_{Student.id = Enrollment.student_id} Enrollment
   → SQL: SELECT * FROM Student JOIN Enrollment ON Student.id = Enrollment.student_id

4. 디비전 (Division): ÷
   R ÷ S
   - S의 모든 값을 포함하는 R의 튜플
   - 예: "모든 과목을 수강한 학생"
```

### 일반 집합 연산

```
5. 합집합 (Union): R ∪ S
   - 두 릴레이션의 모든 튜플 (중복 제거)
   → SQL: SELECT * FROM R UNION SELECT * FROM S

6. 교집합 (Intersection): R ∩ S
   - 두 릴레이션에 모두 존재하는 튜플
   → SQL: SELECT * FROM R INTERSECT SELECT * FROM S

7. 차집합 (Difference): R - S
   - R에는 있지만 S에는 없는 튜플
   → SQL: SELECT * FROM R EXCEPT SELECT * FROM S

8. 카티션 프로덕트 (Cartesian Product): R × S
   - 모든 가능한 조합
   → SQL: SELECT * FROM R, S (또는 CROSS JOIN)
```

**합집합 호환 (Union Compatible)**
- 합집합, 교집합, 차집합은 두 릴레이션의 차수가 같고, 대응되는 도메인이 같아야 수행 가능

### 조인의 종류

```
1. 세타 조인 (Theta Join)
   R ⋈_{조건} S
   - 임의의 비교 조건으로 조인
   - 조건: =, <, >, ≤, ≥, ≠

2. 동등 조인 (Equi Join)
   - 세타 조인에서 조건이 '='인 경우
   - 결과에 중복 속성 포함

3. 자연 조인 (Natural Join)
   R ⋈ S
   - 동등 조인 + 중복 속성 제거
   - 같은 이름의 속성을 자동 매칭

4. 외부 조인 (Outer Join)
   - 매칭되지 않는 튜플도 결과에 포함 (NULL 채움)
   ├── 왼쪽 외부 조인 (LEFT OUTER JOIN): R의 모든 튜플 포함
   ├── 오른쪽 외부 조인 (RIGHT OUTER JOIN): S의 모든 튜플 포함
   └── 완전 외부 조인 (FULL OUTER JOIN): R, S 모두 포함

5. 세미 조인 (Semi Join)
   R ⋉ S
   - R의 튜플 중 S와 매칭되는 것만 반환
   - R의 속성만 결과에 포함
```

### 조인 예시

```
Student                    Department
┌──────┬────────┬────┐    ┌────┬───────────┐
│  id  │ name   │dept│    │dept│ building  │
├──────┼────────┼────┤    ├────┼───────────┤
│ 1001 │ 홍길동  │ CS │    │ CS │ 공학관     │
│ 1002 │ 김영희  │ EE │    │ EE │ 전자관     │
│ 1003 │ 이철수  │ ME │    │ ME │ 기계관     │
└──────┴────────┴────┘    └────┴───────────┘

자연 조인 (Student ⋈ Department):
┌──────┬────────┬────┬───────────┐
│  id  │ name   │dept│ building  │
├──────┼────────┼────┼───────────┤
│ 1001 │ 홍길동  │ CS │ 공학관     │
│ 1002 │ 김영희  │ EE │ 전자관     │
│ 1003 │ 이철수  │ ME │ 기계관     │
└──────┴────────┴────┴───────────┘
```

## 관계 해석 (Relational Calculus)

관계 대수와 동치인 **비절차적** 질의 언어.

### 튜플 관계 해석

```
{ t | P(t) }
- 조건 P를 만족하는 튜플 t의 집합

예: { t | Student(t) ∧ t.dept = 'CS' }
= CS학과 학생 전체

예: { t.name | Student(t) ∧ t.grade = 4 }
= 4학년 학생의 이름
```

### 도메인 관계 해석

```
{ <x₁, x₂, ...> | P(x₁, x₂, ...) }
- 조건 P를 만족하는 도메인 변수들의 조합

예: { <n> | ∃i, ∃d, ∃g (Student(i, n, d, g) ∧ d = 'CS') }
= CS학과 학생의 이름
```

### 관계 대수 vs 관계 해석

| 구분 | 관계 대수 | 관계 해석 |
|------|----------|----------|
| 성격 | 절차적 (How) | 비절차적 (What) |
| 표현 | 연산의 순서 명시 | 조건만 명시 |
| 표현력 | 동일 (관계적 완전) | 동일 (관계적 완전) |
| SQL 대응 | 내부 처리 | 사용자 질의 |

**관계적 완전 (Relationally Complete)**: 관계 대수로 표현할 수 있는 모든 것을 표현 가능한 질의 언어. SQL은 관계적으로 완전하다.

## 함수적 종속 (Functional Dependency)

정규화의 기반이 되는 개념.

### 정의

```
속성 X의 값이 속성 Y의 값을 유일하게 결정하면
"X → Y" (X가 Y를 함수적으로 결정한다)

예: Student 릴레이션
- id → name (학번이 이름을 결정)
- id → dept (학번이 학과를 결정)
- id → {name, dept, grade} (학번이 모든 속성을 결정)
```

### 종류

```
1. 완전 함수적 종속 (Full FD)
   - X의 진부분 집합이 Y를 결정하지 못함
   - 예: {학번, 과목번호} → 성적
         학번만으로는 성적 결정 불가, 과목번호만으로도 불가

2. 부분 함수적 종속 (Partial FD)
   - X의 진부분 집합이 Y를 결정할 수 있음
   - 예: {학번, 과목번호} → 학과
         학번만으로 학과 결정 가능 → 부분 종속

3. 이행적 함수적 종속 (Transitive FD)
   - X → Y이고 Y → Z이면 X → Z
   - 예: 학번 → 학과, 학과 → 학과장
         → 학번 → 학과장 (이행적 종속)
```

### 암스트롱 공리 (Armstrong's Axioms)

```
기본 규칙:
1. 반사 규칙: Y ⊆ X이면 X → Y
2. 증가 규칙: X → Y이면 XZ → YZ
3. 이행 규칙: X → Y이고 Y → Z이면 X → Z

유도 규칙:
4. 합집합 규칙: X → Y이고 X → Z이면 X → YZ
5. 분해 규칙: X → YZ이면 X → Y이고 X → Z
6. 의사이행 규칙: X → Y이고 WY → Z이면 WX → Z
```

### 함수적 종속의 폐포 (Closure)

```
X⁺ = X가 결정할 수 있는 모든 속성의 집합

알고리즘:
1. result = X
2. F에서 Y → Z를 찾아, Y ⊆ result이면 result = result ∪ Z
3. result가 변하지 않을 때까지 반복

예: F = {A → B, B → C, A → D}
A⁺ = {A} → {A, B} → {A, B, C} → {A, B, C, D}

후보키 판별: X⁺가 전체 속성 집합이면 X는 슈퍼키
```

## 핵심 정리

```
1. 릴레이션 = 속성(컬럼) + 튜플(행) + 제약 조건
2. 키: 슈퍼키 ⊃ 후보키 ⊃ 기본키 / 대체키
3. 무결성: 개체(PK≠NULL) + 참조(FK→PK) + 도메인
4. 관계 대수: σ(선택), π(투영), ⋈(조인), ÷(디비전), ∪∩−×
5. 함수적 종속: 완전/부분/이행 → 정규화의 기반
6. 관계 대수 = 관계 해석 (표현력 동일, 관계적 완전)
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 기본키와 외래키의 차이는?**
> - 기본키: 릴레이션 내 튜플을 유일하게 식별. NULL 불허, 중복 불허
> - 외래키: 다른 릴레이션의 기본키를 참조. NULL 허용 가능
> - 외래키를 통해 릴레이션 간 관계를 표현하고 참조 무결성을 보장

**Q2. 후보키와 슈퍼키의 차이는?**
> - 슈퍼키: 유일성만 만족 (속성 집합에 불필요한 속성 포함 가능)
> - 후보키: 유일성 + 최소성 (속성 하나라도 빼면 유일성 상실)
> - 기본키는 후보키 중 하나를 선택한 것

**Q3. 관계 대수에서 셀렉션과 프로젝션의 차이는?**
> - 셀렉션(σ): 조건에 맞는 **행(튜플)** 선택 (수평적 분할)
> - 프로젝션(π): 특정 **열(속성)** 선택 (수직적 분할)
> - 셀렉션 → WHERE 절, 프로젝션 → SELECT 절에 대응

**Q4. 자연 조인과 동등 조인의 차이는?**
> - 동등 조인: = 조건으로 조인, 중복 속성 **포함**
> - 자연 조인: 같은 이름 속성으로 자동 조인, 중복 속성 **제거**
> - 자연 조인 = 동등 조인 + 중복 속성 제거

**Q5. 함수적 종속이란?**
> - 속성 X의 값이 Y의 값을 유일하게 결정하는 관계 (X → Y)
> - 완전 종속: X의 부분 집합으로는 결정 불가
> - 부분 종속: X의 부분 집합으로도 결정 가능 → 2NF 위반
> - 이행 종속: X→Y→Z로 간접 결정 → 3NF 위반

**Q6. 참조 무결성 위반 시 처리 방법은?**
> - RESTRICT: 위반하는 연산 거부
> - CASCADE: 연쇄적으로 삭제/수정
> - SET NULL: FK를 NULL로 설정
> - SET DEFAULT: FK를 기본값으로 설정
> - 상황에 따라 적절한 옵션 선택 (보통 CASCADE 또는 RESTRICT)
