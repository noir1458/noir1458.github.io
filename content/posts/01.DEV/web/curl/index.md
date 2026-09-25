# curl 사용법 정리: 터미널에서 HTTP API 요청하기

FastAPI를 공부하다 보면 Swagger UI를 통해 API를 간편하게 테스트할 수 있다. Postman 같은 GUI 도구를 사용해도 편하다.

하지만 실제 서버 환경에서는 항상 GUI 도구를 사용할 수 있는 것은 아니다.

예를 들어 다음과 같은 상황에서는 터미널에서 직접 HTTP 요청을 보내야 하는 경우가 많다.

- SSH로 원격 Linux 서버에 접속한 경우
- Docker 컨테이너 내부에서 API를 확인하는 경우
- CI/CD 과정에서 API 상태를 확인하는 경우
- 쉘 스크립트에서 HTTP 요청을 자동화하는 경우
- HTTP 요청과 응답을 직접 분석하는 경우
- 웹 보안 실습에서 요청 헤더, Cookie, Body 등을 변경하는 경우

이때 가장 널리 사용하는 도구 중 하나가 `curl`이다.

---

## 1. curl이란?

`curl`은 URL을 이용해 서버와 데이터를 주고받을 수 있는 명령줄 도구다.

가장 간단한 형태는 다음과 같다.

```bash
curl http://127.0.0.1:8000/
```

FastAPI 서버에서 다음과 같은 응답을 반환한다고 가정하자.

```json
{
  "Hello": "FastAPI"
}
```

터미널에서 위 명령을 실행하면 다음과 같이 출력된다.

```text
{"Hello":"FastAPI"}
```

---

# 2. GET 요청

`curl`은 별도의 옵션을 지정하지 않으면 기본적으로 GET 요청을 보낸다.

```bash
curl http://127.0.0.1:8000/users
```

따라서 다음 두 명령은 거의 같은 의미다.

```bash
curl http://127.0.0.1:8000/users
```

```bash
curl -X GET http://127.0.0.1:8000/users
```

`-X` 옵션은 HTTP Method를 직접 지정할 때 사용한다.

```text
-X GET
-X POST
-X PUT
-X PATCH
-X DELETE
```

단순 GET 요청에서는 `-X GET`을 생략하는 경우가 많다.

---

# 3. Query Parameter 보내기

다음과 같은 API가 있다고 하자.

```text
GET /users?id=10
```

curl에서는 URL에 그대로 Query Parameter를 넣으면 된다.

```bash
curl "http://127.0.0.1:8000/users?id=10"
```

여러 개라면 다음과 같다.

```bash
curl "http://127.0.0.1:8000/users?id=10&active=true"
```

URL에 `?`, `&` 등 쉘에서 특별한 의미를 가질 수 있는 문자가 들어가기 때문에 URL 전체를 따옴표로 감싸는 습관을 들이는 것이 좋다.

---

# 4. HTTP Header 추가하기

`-H` 옵션을 사용하면 HTTP Header를 추가할 수 있다.

```bash
curl http://127.0.0.1:8000/ \
  -H "Accept: application/json"
```

여러 개의 Header를 보내고 싶다면 `-H`를 여러 번 사용한다.

```bash
curl http://127.0.0.1:8000/users \
  -H "Accept: application/json" \
  -H "Authorization: Bearer TOKEN"
```

예를 들어 JWT 인증이 적용된 API에서는 다음과 같은 요청을 자주 사용한다.

```bash
curl http://127.0.0.1:8000/profile \
  -H "Authorization: Bearer eyJhbGciOi..."
```

---

# 5. POST 요청과 JSON Body 보내기

POST 요청에서 JSON 데이터를 보내려면 `-d` 옵션을 사용할 수 있다.

```bash
curl -X POST http://127.0.0.1:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"test","age":20}'
```

각 옵션은 다음 의미를 가진다.

```text
-X POST
HTTP Method를 POST로 지정

-H
HTTP Header 추가

-d
Request Body 데이터 전달
```

JSON 데이터를 보내는 경우에는 보통 다음 Header를 함께 지정한다.

```http
Content-Type: application/json
```

전체 요청은 다음 구조가 된다.

```text
POST /users HTTP/1.1
Content-Type: application/json

{
  "name": "test",
  "age": 20
}
```

참고로 `-d`를 사용하면 curl이 기본적으로 POST 요청을 사용하기 때문에 다음과 같이 `-X POST`를 생략할 수도 있다.

```bash
curl http://127.0.0.1:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"test","age":20}'
```

---

# 6. 응답 Header까지 확인하기

기본 `curl`은 주로 Response Body만 출력한다.

```bash
curl http://127.0.0.1:8000/
```

결과:

```json
{"Hello":"FastAPI"}
```

HTTP 상태 코드와 Header까지 보고 싶다면 `-i` 옵션을 사용한다.

```bash
curl -i http://127.0.0.1:8000/
```

예를 들어 다음과 같은 결과를 확인할 수 있다.

```http
HTTP/1.1 200 OK
date: Wed, 16 Sep 2026 16:13:57 GMT
server: uvicorn
content-length: 19
content-type: application/json

{"Hello":"FastAPI"}
```

API를 개발하거나 디버깅할 때 상당히 유용하다.

특히 다음 항목을 확인할 수 있다.

```text
HTTP 상태 코드
Content-Type
Content-Length
Server
Cookie
Cache 관련 Header
CORS 관련 Header
```

---

# 7. 요청과 응답을 자세하게 확인하기

`-v`는 verbose 옵션이다.

```bash
curl -v http://127.0.0.1:8000/
```

HTTP 통신 과정을 보다 자세하게 출력한다.

예를 들어 다음과 같은 형태로 나타난다.

```text
> GET / HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/8.x
> Accept: */*

< HTTP/1.1 200 OK
< server: uvicorn
< content-type: application/json
< content-length: 19

{"Hello":"FastAPI"}
```

여기서

```text
>
```

는 클라이언트가 서버로 보낸 데이터이고,

```text
<
```

는 서버가 클라이언트로 보낸 데이터다.

HTTP의 동작을 공부할 때 특히 유용한 옵션이다.

---

# 8. Header만 확인하기

Response Body는 필요 없고 Header만 확인하고 싶다면 `-I` 옵션을 사용할 수 있다.

```bash
curl -I https://example.com
```

예를 들면 다음과 같은 정보가 출력된다.

```http
HTTP/2 200
content-type: text/html
content-length: 1256
server: nginx
```

웹 서버의 응답 상태나 설정을 빠르게 확인할 때 편리하다.

---

# 9. Redirect 따라가기

웹 서버에 요청하면 다음과 같은 Redirect 응답을 받을 수 있다.

```text
301 Moved Permanently
302 Found
307 Temporary Redirect
308 Permanent Redirect
```

기본 curl은 Redirect 위치를 자동으로 따라가지 않는 경우가 있다.

이때 `-L` 옵션을 사용한다.

```bash
curl -L http://example.com
```

Redirect가 여러 번 발생해도 최종 주소까지 따라간다.

---

# 10. 파일 다운로드

curl을 이용해 파일을 다운로드할 수도 있다.

원래 파일명을 그대로 사용하려면 `-O`를 사용한다.

```bash
curl -O https://example.com/file.zip
```

파일명을 직접 지정하려면 소문자 `-o`를 사용한다.

```bash
curl -o test.zip https://example.com/file.zip
```

즉,

```text
-O
서버의 파일 이름 사용

-o
저장할 파일 이름 직접 지정
```

이다.

Linux 서버에서 필요한 파일을 다운로드할 때 자주 사용한다.

---

# 11. Basic Authentication

HTTP Basic Authentication이 적용되어 있다면 `-u` 옵션을 사용할 수 있다.

```bash
curl -u username:password http://127.0.0.1:8000/
```

다만 실제 비밀번호를 명령줄에 직접 적으면 Shell History에 남을 수 있으므로 주의해야 한다.

비밀번호를 생략하고 다음처럼 입력하면 curl이 비밀번호 입력을 요구한다.

```bash
curl -u username http://127.0.0.1:8000/
```

---

# 12. Cookie 보내기

Cookie를 직접 지정하려면 `-b` 옵션을 사용할 수 있다.

```bash
curl http://127.0.0.1:8000/profile \
  -b "session=abcdef"
```

HTTP 요청으로 보면 다음과 비슷하다.

```http
Cookie: session=abcdef
```

로그인 이후 Session 기반 인증을 테스트할 때 유용하다.

---

# 13. Cookie 저장하기

서버가 전달한 Cookie를 파일로 저장할 수도 있다.

```bash
curl -c cookies.txt http://127.0.0.1:8000/login
```

저장된 Cookie를 다시 사용할 때는 다음과 같이 실행한다.

```bash
curl -b cookies.txt http://127.0.0.1:8000/profile
```

즉,

```text
-c
서버가 반환한 Cookie 저장

-b
Cookie를 읽어서 서버에 전송
```

으로 기억할 수 있다.

로그인 세션의 동작 방식을 확인할 때 유용하다.

---

# 14. FastAPI와 curl 함께 사용하기

FastAPI에서는 Swagger UI를 기본 제공한다.

보통 다음 주소에서 접근할 수 있다.

```text
http://127.0.0.1:8000/docs
```

Swagger UI에서 `Execute`를 실행하면 curl 명령도 자동으로 생성해준다.

예를 들어 다음과 같은 코드가 있다고 하자.

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"Hello": "FastAPI"}
```

서버를 실행한다.

```bash
uv run uvicorn main:app --reload
```

그리고 다른 터미널에서 다음 요청을 보낸다.

```bash
curl http://127.0.0.1:8000/
```

Header까지 확인하려면 다음과 같이 실행한다.

```bash
curl -i http://127.0.0.1:8000/
```

보다 자세한 통신 과정을 확인하려면 다음과 같이 실행한다.

```bash
curl -v http://127.0.0.1:8000/
```

---

# 15. Path Parameter 테스트

FastAPI에 다음 Endpoint가 있다고 하자.

```python
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}
```

다음과 같이 테스트할 수 있다.

```bash
curl http://127.0.0.1:8000/users/123
```

결과:

```json
{
  "user_id": 123
}
```

---

# 16. POST API 테스트

다음과 같은 FastAPI 코드가 있다고 하자.

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class User(BaseModel):
    name: str
    age: int


@app.post("/users")
def create_user(user: User):
    return user
```

curl에서는 다음과 같이 요청한다.

```bash
curl -i http://127.0.0.1:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"test","age":20}'
```

응답:

```json
{
  "name": "test",
  "age": 20
}
```

FastAPI를 공부할 때 Swagger UI에서 한 번 요청해보고, 생성된 curl 명령을 확인한 뒤 터미널에서도 직접 실행해보면 HTTP 구조를 익히는 데 도움이 된다.

---

# 17. 서버 환경에서 curl 사용하기

curl의 장점은 GUI가 없는 환경에서도 사용할 수 있다는 것이다.

예를 들어 원격 서버에 SSH로 접속했다고 하자.

```bash
ssh user@server
```

서버 내부에서 API가 동작하고 있는지 바로 확인할 수 있다.

```bash
curl http://localhost:8000/
```

Health Check Endpoint가 있다면 다음과 같이 확인할 수도 있다.

```bash
curl http://localhost:8000/health
```

Docker 컨테이너에서도 마찬가지다.

```bash
docker exec -it backend bash
```

컨테이너 내부에서:

```bash
curl http://localhost:8000/
```

이런 방식은 애플리케이션 문제인지, Docker 네트워크 문제인지, Reverse Proxy 문제인지 구분할 때도 유용하다.

---

# 18. 자주 사용하는 curl 옵션 정리

| 옵션 | 의미 |
|---|---|
| `-X` | HTTP Method 지정 |
| `-H` | HTTP Header 추가 |
| `-d` | Request Body 데이터 전달 |
| `-i` | Response Header와 Body 출력 |
| `-v` | 요청과 응답 과정 자세히 출력 |
| `-I` | Response Header만 요청 |
| `-L` | Redirect 따라가기 |
| `-o` | 지정한 파일명으로 저장 |
| `-O` | 서버의 파일명으로 저장 |
| `-u` | Basic Authentication |
| `-b` | Cookie 전송 |
| `-c` | Cookie 저장 |

처음부터 모든 옵션을 외울 필요는 없다.

우선 다음 정도에 익숙해지는 것을 목표로 하면 된다.

```text
curl URL

-X
-H
-d
-i
-v
-L
```

---

# 19. Postman과 curl

Postman과 curl 중 하나만 사용해야 하는 것은 아니다.

각각 장점이 다르다.

| 상황 | 적합한 도구 |
|---|---|
| API를 GUI로 빠르게 테스트 | Postman |
| 여러 API 요청을 Collection으로 관리 | Postman |
| 원격 Linux 서버 | curl |
| SSH 환경 | curl |
| Docker 컨테이너 내부 | curl |
| 쉘 스크립트 자동화 | curl |
| CI/CD | curl |
| HTTP 구조 학습 | curl |
| 요청 Header와 Body 직접 수정 | curl |
| 빠른 API 상태 확인 | curl |

백엔드 개발에서는 Postman이 편리하지만 Linux, Cloud, Infrastructure, Security 영역까지 공부한다면 curl 사용법도 익혀두는 것이 좋다.

---

# 정리

가장 기본적인 요청은 다음과 같다.

```bash
curl http://127.0.0.1:8000/
```

응답 Header를 같이 보고 싶다면:

```bash
curl -i http://127.0.0.1:8000/
```

HTTP 통신 과정을 자세히 보고 싶다면:

```bash
curl -v http://127.0.0.1:8000/
```

JSON POST 요청:

```bash
curl http://127.0.0.1:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"test","age":20}'
```

인증 Header 추가:

```bash
curl http://127.0.0.1:8000/profile \
  -H "Authorization: Bearer TOKEN"
```

처음에는 이 정도만 자유롭게 사용할 수 있어도 대부분의 기본적인 API 테스트를 터미널에서 수행할 수 있다.

FastAPI를 공부하면서 새로운 Endpoint를 만들 때마다 Swagger UI뿐만 아니라 curl로도 한 번씩 호출해보면 HTTP 요청과 응답 구조를 자연스럽게 익힐 수 있다.