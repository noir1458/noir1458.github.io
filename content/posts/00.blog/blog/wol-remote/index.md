---
title: WOL을 활용해 구형 Windows 노트북을 원격 머신으로 활용하기
slug: wol-remote
description: ipTIME DDNS와 L2TP VPN, macOS 단축어를 이용해 구형 Windows 노트북의 WOL 원격 접속을 자동화한 과정
publishedAt: '2026-08-17'
tags:
  - WOL
categories: blog
draft: false
math: false
---

구형 Windows 노트북을 집에 덮어둔 채 **절전 상태로 대기**시키고, 집에서는 Mac에서 한 번 클릭, 외부에서는 **VPN → 공유기 WOL → Parsec**까지 한 번에 실행해 필요할 때 원격으로 Windows 환경을 사용할 수 있게 만들었다. 작업 용도보다 **WOL과 원격 접속을 이용해 구형 Windows 노트북을 원격 머신으로 재활용하는 과정** 자체에 초점을 두고 글을 작성한다. 아래의 계정명, 비밀번호, DDNS·내부 IP·MAC 주소, VPN 이름, Keychain 서비스명, 장치 이름은 모두 placeholder로 적었다. iptime 공유기를 사용하는 사람이면 글 내용 복사해서 붙이고 물어보면서 시도하면 충분히 똑같이 따라할수 있을듯.

## 최종 결과

![alt text](image.png)

맥북에서 단축어 버튼 하나로 원격으로 노트북을 절전 상태에서 깨우고, Parsec로 접속하는데 성공했다.

최종적으로 완성된 흐름은 이렇다.

```mermaid
flowchart LR
    A[macOS 단축어 실행] --> B{집 LAN인가?}
    B -->|Yes| C[macOS에서 직접 wakeonlan]
    B -->|No| D[L2TP VPN 연결]
    D --> E[ipTIME 관리자 로그인]
    E --> F[ipTIME 자체 WOL]
    F --> G[VPN 종료]
    C --> H[Windows 노트북 절전 해제 대기]
    G --> H
    H --> I[macOS에서 Parsec 접속]
```

실제 운용은 다음처럼 단순해졌다.

```text
집:
Mac 단축어 → WOL → 15초 대기 → Parsec

외부:
Mac 단축어 → L2TP VPN → ipTIME 로그인 → 공유기 자체 WOL
→ VPN 종료 → 15초 대기 → Parsec

사용 종료:
Windows 바탕화면 '절전' 바로가기
```

노트북 덮개를 닫은 상태에서도 정상 동작했고, Parsec 해상도는 `1680×1050 (16:10)`으로 맞추니 macOS 클라이언트에서도 꽤 자연스러웠다. 다만 종료할때 절전을 해야 한다. 그냥 꺼버리면 집에 가서 다시 켜줘야한다.

노트북이 나온지 오래된것이라 완전 종료상태에서 깨우는건 안되는것으로 보인다. CD 넣는곳도 있고 작동시 하드디스크 돌아가는 소리가 나는 10년이 넘은 노트북이다. SSD만 신형으로 바꿔놓아서 못써먹을정도로 느리지는 않다.

## 환경

### Windows 호스트

- 구형 Windows 노트북
- Windows 10
- 유선 Ethernet NIC
- WSL Ubuntu (개인 공부용으로 사용)
- Parsec Host

### 공유기

- 구형 ipTIME 공유기
- 내부 주소: `<ROUTER_IP>`
- WOL 지원
- DDNS 지원
- L2TP VPN 서버 지원

### 클라이언트

- macOS
- Homebrew
- Parsec
- macOS 단축어(Shortcuts)
- 외부망 테스트용 모바일 핫스팟

예시 변수:

```text
<LAPTOP_MAC>       = 노트북 유선 NIC의 MAC 주소
<ETHERNET_ADAPTER_NAME> = Windows 유선 NIC 표시 이름
<HOME_ROUTER_MAC_1> = 첫 번째 집 공유기의 MAC 주소
<HOME_ROUTER_MAC_2> = 두 번째 집 공유기의 MAC 주소(없으면 비워둠)
<VPN_USER>         = VPN 접속 계정
<ROUTER_USER>      = 공유기 관리자 계정
<VPN_NAME>         = macOS VPN 구성의 표시 이름
<DDNS_HOST>        = DDNS 호스트 이름
<DEVICE_LABEL>     = 공유기 WOL 목록에 표시할 장치 이름
<ROUTER_IP>        = 공유기 내부 관리 주소
<WINDOWS_LAN_IP>   = Windows 노트북 내부 주소
<VPN_CLIENT_IP>    = VPN 할당용 미사용 내부 주소
<LAN_BROADCAST_IP> = 집 LAN의 broadcast 주소
<VPN_PASSWORD_SERVICE>    = VPN 비밀번호용 Keychain 서비스 이름
<VPN_SECRET_SERVICE>      = L2TP 비밀키용 Keychain 서비스 이름
<ROUTER_PASSWORD_SERVICE> = 공유기 비밀번호용 Keychain 서비스 이름
<DEFAULT_PASSWD_FIELD_VALUE> = DevTools에서 확인한 공유기 로그인 폼 필드 값
```

## Windows WOL 기본 조건 확인

### Wake 가능한 장치 확인

CMD 또는 PowerShell:

```cmd
powercfg /devicequery wake_armed
```

여기에:

```text
<ETHERNET_ADAPTER_NAME>
```

가 나오면 Windows가 해당 NIC를 Wake 가능한 장치로 인식하고 있는 것이다.

### 유선 MAC 주소 확인

```cmd
ipconfig /all
```

유선 이더넷 어댑터에서:

```text
Description      : <ETHERNET_ADAPTER_NAME>
Physical Address : <LAPTOP_MAC>
IPv4 Address     : <WINDOWS_LAN_IP>
```

를 확인한다.

WOL에는 Wi-Fi MAC이 아니라 **유선 Realtek NIC MAC**을 사용했다. 

## Realtek NIC 설정

장치 관리자:

```text
네트워크 어댑터
→ <ETHERNET_ADAPTER_NAME>
→ 속성
```

### 고급

```text
Wake on Magic Packet      → Enabled
Wake on pattern match     → Disabled여도 무방
WOL & Shutdown Link Speed → 기본값 유지
```

`Wake on Magic Packet`이 중요

### 전원 관리

```text
☑ 전원을 절약하기 위해 컴퓨터가 이 장치를 끌 수 있음
☑ 이 장치를 사용하여 컴퓨터의 대기 모드를 종료할 수 있음
☑ 매직 패킷에서만 컴퓨터의 대기 모드를 종료할 수 있음
```

이 상태에서 실제 S3 절전 WOL이 성공했다.

## BIOS에서 본 것

Boot 탭:

```text
Internal LAN [Enabled]
PXE OPROM    [Disabled]
```

- `Internal LAN`: 그대로 Enabled
- `PXE OPROM`: 네트워크 부팅용이므로 WOL과 무관

Advanced 탭에는:

```text
CPU Power Saving Mode
Hyperthreading
EDB
Fast BIOS Mode
AHCI Mode Control
Battery Life Cycle Extension
USB S3 Wake-up
```

정도만 있었고, 기대했던:

```text
Wake on LAN
Wake on PME
Power On By LAN
PCI-E Wake
Wake From S5
PME Event Wake Up
```

같은 항목은 없었다.

#### EDB

`Execute Disable Bit`이다. 대략 NX bit / DEP 계열의 하드웨어 보안 기능이라고 보면 된다. WOL과는 무관하므로 Enabled 그대로 두었다.

#### Smart Battery Calibration

배터리 잔량 표시를 보정하는 기능이다. 배터리 성능 복구 기능도 아니고 WOL과도 관계없다.

## 가장 중요한 결론: S3만 WOL이 됐다

실제 결과:

| 상태 | 결과 |
|---|---|
| S3 절전 | WOL 성공 |
| S4 최대 절전 | 실패 |
| S5 완전 종료 | 실패 |
| 다시 시작 | 문제 없음 |

즉 이 노트북은 원격 운용 시 **시스템 종료가 아니라 절전을 기본 사용 방식으로 삼아야 했다.**

운용 규칙은 다음으로 정리했다.

```text
평소 사용 종료 → 절전
Windows 업데이트/드라이버 → 다시 시작
며칠 이상 사용 안 함 → 완전 종료
```

완전 종료 후에는 WOL로 켤 수 없으므로 직접 전원 버튼을 눌러야 한다.

## 덮개를 닫아도 동작하게 하기

Windows 전원 옵션에서:

```text
덮개를 닫을 때 → 아무 것도 안 함
```

으로 설정했다.

이렇게 해두면 Parsec으로 사용 중 노트북 덮개를 닫아도 시스템은 계속 돌아간다.

최종적으로는 노트북을 덮어둔 채 사실상 헤드리스 머신처럼 쓸 수 있었다.

## Windows 바탕화면에 절전 버튼 만들기

원격 머신에서는 실수로 `시스템 종료`를 눌러버리는 것이 가장 귀찮다.

처음에는:

```text
rundll32.exe powrprof.dll,SetSuspendState Sleep
```

을 바로가기로 만들었지만 이 환경에서는 **최대 절전으로 들어가는 듯한 동작**을 했다.

최종적으로는 PowerShell을 사용했다.

바탕화면:

```text
우클릭 → 새로 만들기 → 바로 가기
```

대상:

```powershell
powershell.exe -NoProfile -WindowStyle Hidden -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Application]::SetSuspendState([System.Windows.Forms.PowerState]::Suspend,$false,$false)"
```

이름:

```text
절전
```

이 방식은 실제 테스트에서 절전 후 WOL 복귀가 정상 동작했다.

## 집 안에서 Mac → WOL

macOS:

```bash
brew install wakeonlan
```

같은 LAN에서:

```bash
wakeonlan <LAPTOP_MAC>
```

예:

```bash
wakeonlan <LAPTOP_MAC>
```

노트북이 즉시 깨어났다.

이 테스트로:

```text
Windows 설정
NIC 설정
절전 상태
Magic Packet 처리
```

가 모두 정상임을 먼저 확인했다.

## ipTIME 공유기 자체 WOL

ipTIME:

```text
고급 설정
→ 특수기능
→ WOL 기능
```

유선 MAC을 등록했다.

```text
MAC 주소: <LAPTOP_MAC>
PC 설명: <DEVICE_LABEL>
```

`PC 켜기`를 누르자 노트북이 정상적으로 깨어났다. 이 기능을 이용해서 자동화를 했다.

## DDNS 설정

외부 IP가 바뀌는 상황을 고려해 ipTIME DDNS를 사용했다.

```text
고급 설정
→ 특수기능
→ DDNS 설정
```

예:

```text
호스트 이름: <DDNS_HOST>
사용자 ID: 본인 이메일
```

그러면:

```text
<DDNS_HOST>
```

형태가 된다.

Mac에서 확인:

```bash
dig +short <DDNS_HOST>
```

집 공유기의 현재 공인 IP가 나오면 정상이다.

## L2TP VPN 서버 구성

사용한 공유기에서는 PPTP와 L2TP가 보였고 L2TP를 사용했다.

```text
고급 설정
→ 특수기능
→ VPN 서버설정
```

설정:

```text
L2TP 서버 → 실행
비밀키     → 강한 랜덤 문자열
```

VPN 계정:

```text
VPN 접속 계정: <VPN_USER>
VPN 접속 암호: 별도 암호
할당 IP 주소: <VPN_CLIENT_IP>
```

### 시행착오: VPN 할당 IP 충돌

처음 VPN 클라이언트 IP를 Windows 노트북이 이미 사용 중인 주소와 겹치게 잡았다.

이런 식이면 안 된다.

```text
Windows 노트북 = <WINDOWS_LAN_IP>
VPN 클라이언트 = <WINDOWS_LAN_IP>  ← 충돌
```

따라서 미사용 주소로 변경:

```text
<VPN_CLIENT_IP>
```

가능하면 DHCP 자동 할당 범위와도 분리하는 편이 좋다.

## macOS L2TP 설정

macOS:

```text
시스템 설정
→ VPN
→ VPN 구성 추가
→ IPSec을 통한 L2TP
```

입력:

```text
표시 이름: <VPN_NAME>
서버 주소: <DDNS_HOST>
계정 이름: <VPN_USER>

사용자 인증:
암호 → VPN 계정 암호

시스템 인증:
공유 암호 → ipTIME L2TP 비밀키
```

중요:

```text
VPN 계정 암호 != L2TP 공유 비밀키
```

두 값은 서로 다르다.

## 집 Wi-Fi에서 VPN을 테스트하면 실패했던 문제

처음에는 Mac을 집 Wi-Fi에 붙인 상태에서 자기 집 DDNS로 VPN을 연결했다.

오류:

```text
PPP 서버로의 연결이 구축되지 않았습니다.
```

로그 확인:

```bash
log show --last 5m --predicate 'process == "pppd"' --info
```

중요 부분:

```text
L2TP connecting to server ...
IPSec connection established
L2TP connection established.
Using interface ppp0
...
LCP: timeout sending Config-Requests
Connection terminated.
```

즉:

```text
DDNS 정상
→ IPsec 정상
→ L2TP 정상
→ PPP LCP timeout
```

이었다.

### 해결

Mac을 **모바일 핫스팟**으로 바꿔 실제 외부망에서 VPN을 연결하니 정상.

```bash
scutil --nc status "<VPN_NAME>"
```

결과:

```text
Connected
```

그리고:

```bash
ping -c 3 <ROUTER_IP>
```

도 정상.

따라서 VPN 테스트는 실제 외부 네트워크에서 해야 한다.

## Chrome만 공유기 관리자 페이지가 안 열린 문제

한때:

```bash
ping <ROUTER_IP>
```

정상,

```bash
curl -I http://<ROUTER_IP>
```

도:

```text
HTTP/1.0 200 OK
```

인데 Chrome만:

```text
ERR_ADDRESS_UNREACHABLE
```

이 발생했다.

원인은 macOS:

```text
시스템 설정
→ 개인정보 보호 및 보안
→ 로컬 네트워크
```

의 Chrome 권한이었다.

Chrome의 로컬 네트워크 접근을 허용하니 해결됐다.

이 권한은 공유기, NAS, 프린터 같은 같은 LAN의 장치 접근과도 관계가 있다.

## 외부 VPN에서 Magic Packet 직접 보내기

VPN 연결 후:

```bash
wakeonlan <LAPTOP_MAC>
```

을 사용하면 기본적으로:

```text
255.255.255.255:9
```

로 보낸다.

이 패킷은 VPN 너머 집 LAN까지 정상 전달되지 않았다.

그래서:

```bash
wakeonlan -i <LAN_BROADCAST_IP> <LAPTOP_MAC>
```

을 사용했다.

라우팅 확인:

```bash
route -n get <LAN_BROADCAST_IP>
```

결과:

```text
interface: ppp0
```

초기 테스트에서 동작하기도 했지만 반복 테스트에서는 **항상 안정적으로 노트북을 깨우지 못했다.**

그런데 같은 VPN 상태에서 브라우저로:

```text
http://<ROUTER_IP>
```

에 접속해 ipTIME의 `PC 켜기`를 누르면 항상 정상.

결론:

> Mac이 VPN 너머로 직접 LAN broadcast를 보내게 하지 말고
> **VPN은 공유기 접근용으로만 쓰고, 공유기가 자기 LAN에서 WOL을 발생시키게 하자.**

## ipTIME WOL HTTP 요청 분석

Chrome DevTools:

```text
⌥⌘I → Network
```

팁:

```text
Preserve log → ON
Filter → domain:<ROUTER_IP>
```

또는:

```text
method:POST
```

를 사용하면 확장 프로그램 요청을 걸러내기 쉽다.

`PC 켜기` 클릭 직후의 요청을 `Copy as cURL`로 확인했다.

핵심:

```http
POST /sess-bin/timepro.cgi
Content-Type: application/x-www-form-urlencoded
Cookie: efm_session_id=<SESSION>
```

Payload:

```text
tmenu=iframe
smenu=expertconfwollist
nomore=0
wakeupchk=<LAPTOP_MAC>
act=wake
```

즉 WOL 요청 자체는:

```bash
curl 'http://<ROUTER_IP>/sess-bin/timepro.cgi' \
  -b "efm_session_id=$SESSION" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'tmenu=iframe' \
  --data-urlencode 'smenu=expertconfwollist' \
  --data-urlencode 'nomore=0' \
  --data-urlencode "wakeupchk=$MAC" \
  --data-urlencode 'act=wake'
```

형태였다.

## 로그인 POST 찾기

로그인 시 요청이 페이지 이동 때문에 잠깐 보였다 사라졌기 때문에 DevTools의:

```text
Preserve log
```

를 켰다.

실제 로그인 요청:

```text
POST /sess-bin/login_handler.cgi
```

대략적인 Payload:

```text
init_status=1
captcha_on=0
captcha_file=
username=<ROUTER_USER>
passwd=<ROUTER_PASSWORD>
default_passwd=<DEFAULT_PASSWD_FIELD_VALUE>
captcha_code=
```

## 가장 오래 걸린 문제: curl cookie jar가 비어 있었다

처음에는 일반적인 로그인처럼 생각해서:

```bash
COOKIE_JAR=$(mktemp)

curl -c "$COOKIE_JAR" ...
```

로 쿠키를 받으려 했다.

그러나:

```text
# Netscape HTTP Cookie File
```

만 있고 `efm_session_id`가 생기지 않았다.

다음 URL들을 직접 열어도 마찬가지였다.

```text
http://<ROUTER_IP>/
http://<ROUTER_IP>/sess-bin/login.cgi
http://<ROUTER_IP>/sess-bin/login_session.cgi?logout=1
```

`Set-Cookie:` 헤더가 없었다.

## 결정적 해결: 로그인 응답의 JavaScript에서 session 추출

이 구형 ipTIME 펌웨어는 로그인 성공 후 세션을:

```http
Set-Cookie: efm_session_id=<SESSION>
```

로 주는 것이 아니라 응답 HTML/JS 안의:

```javascript
setCookie('<SESSION>')
```

형태로 전달하고 있었다.

브라우저는 JS를 실행하므로 쿠키가 생기지만, curl은 JS를 실행하지 않는다.

따라서 로그인 응답을 직접 파싱했다.

```bash
SESSION=$(printf '%s' "$LOGIN_RESP" \
  | /usr/bin/grep -o "setCookie('[^']*')" \
  | /usr/bin/head -1 \
  | /usr/bin/cut -d"'" -f2)
```

이 값을:

```bash
-b "efm_session_id=$SESSION"
```

으로 WOL 요청에 넘기니 **실제로 노트북이 깨어났다.**

이번 구성에서 가장 중요한 시행착오였다.

## 암호는 macOS Keychain에 저장

다음 값들을 스크립트에 평문으로 넣지 않았다.

```text
VPN 계정 비밀번호
L2TP Shared Secret
ipTIME 관리자 비밀번호
```

### VPN 비밀번호

```bash
read -s "VPN_PASS?VPN 계정 암호 입력: "
echo

security add-generic-password \
  -a "<VPN_USER>" \
  -s "<VPN_PASSWORD_SERVICE>" \
  -w "$VPN_PASS" \
  -U

unset VPN_PASS
```

### L2TP Shared Secret

```bash
read -s "VPN_SECRET?L2TP 비밀키 입력: "
echo

security add-generic-password \
  -a "<VPN_USER>" \
  -s "<VPN_SECRET_SERVICE>" \
  -w "$VPN_SECRET" \
  -U

unset VPN_SECRET
```

### 공유기 관리자 비밀번호

```bash
read -s "ROUTER_PASS?공유기 관리자 암호 입력: "
echo

security add-generic-password \
  -a "<ROUTER_USER>" \
  -s "<ROUTER_PASSWORD_SERVICE>" \
  -w "$ROUTER_PASS" \
  -U

unset ROUTER_PASS
```

확인:

```bash
security find-generic-password \
  -a "<ROUTER_USER>" \
  -s "<ROUTER_PASSWORD_SERVICE>" >/dev/null \
  && echo "공유기 암호 OK"
```

## macOS 단축어의 내장 VPN 액션 문제

Shortcuts의 VPN 액션으로 처리하려 했는데, 이 환경에서는 VPN 목록을 불러오는 과정에서 단축어 앱이 죽는 문제가 있었다.

대신 셸에서:

```bash
scutil --nc
```

를 사용했다.

상태:

```bash
scutil --nc status "<VPN_NAME>"
```

연결 성공:

```text
Connected
```

VPN 시작:

```bash
VPN_PASS=$(security find-generic-password \
  -a "<VPN_USER>" \
  -s "<VPN_PASSWORD_SERVICE>" \
  -w)

VPN_SECRET=$(security find-generic-password \
  -a "<VPN_USER>" \
  -s "<VPN_SECRET_SERVICE>" \
  -w)

/usr/sbin/scutil --nc start "<VPN_NAME>" \
  --user "<VPN_USER>" \
  --password "$VPN_PASS" \
  --secret "$VPN_SECRET"

unset VPN_PASS VPN_SECRET
```

실제 외부망에서 정상 연결됐다.

## 최종 외부용 단축어

macOS 단축어:

```text
새 단축어 → 셸 스크립트 실행
```

`관리자로 실행`은 OFF.

아래에서 placeholder만 본인 값으로 바꾼다.

```bash
VPN="<VPN_NAME>"
VPN_USER="<VPN_USER>"

ROUTER_IP="<ROUTER_IP>"
ROUTER_USER="<ROUTER_USER>"

MAC="<LAPTOP_MAC>"

VPN_STARTED=0


# 1. 집 LAN인지 확인
if ! /sbin/ping -c 1 -W 1000 "$ROUTER_IP" >/dev/null 2>&1; then

    VPN_PASS=$(/usr/bin/security find-generic-password \
      -a "$VPN_USER" \
      -s "<VPN_PASSWORD_SERVICE>" \
      -w)

    VPN_SECRET=$(/usr/bin/security find-generic-password \
      -a "$VPN_USER" \
      -s "<VPN_SECRET_SERVICE>" \
      -w)

    /usr/sbin/scutil --nc start "$VPN" \
      --user "$VPN_USER" \
      --password "$VPN_PASS" \
      --secret "$VPN_SECRET"

    unset VPN_PASS VPN_SECRET

    VPN_STARTED=1
    CONNECTED=0

    for i in {1..20}; do
        if /usr/sbin/scutil --nc status "$VPN" \
          | /usr/bin/head -n 1 \
          | /usr/bin/grep -q "^Connected$"; then
            CONNECTED=1
            break
        fi
        /bin/sleep 1
    done

    if [ "$CONNECTED" -ne 1 ]; then
        /usr/bin/osascript \
          -e 'display alert "VPN 연결 실패" message "집 VPN 연결에 실패했습니다."'
        exit 1
    fi

    for i in {1..10}; do
        if /sbin/ping -c 1 -W 1000 "$ROUTER_IP" >/dev/null 2>&1; then
            break
        fi
        /bin/sleep 1
    done
fi


# 2. ipTIME 로그인
ROUTER_PASS=$(/usr/bin/security find-generic-password \
  -a "$ROUTER_USER" \
  -s "<ROUTER_PASSWORD_SERVICE>" \
  -w)

LOGIN_RESP=$(/usr/bin/curl -sS \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H "Referer: http://${ROUTER_IP}/sess-bin/login_session.cgi?logout=1" \
  --data-urlencode 'init_status=1' \
  --data-urlencode 'captcha_on=0' \
  --data-urlencode 'captcha_file=' \
  --data-urlencode "username=$ROUTER_USER" \
  --data-urlencode "passwd=$ROUTER_PASS" \
  --data-urlencode 'default_passwd=<DEFAULT_PASSWD_FIELD_VALUE>' \
  --data-urlencode 'captcha_code=' \
  "http://${ROUTER_IP}/sess-bin/login_handler.cgi")

unset ROUTER_PASS


# 3. 응답 JS에서 세션 추출
SESSION=$(printf '%s' "$LOGIN_RESP" \
  | /usr/bin/grep -o "setCookie('[^']*')" \
  | /usr/bin/head -1 \
  | /usr/bin/cut -d"'" -f2)

unset LOGIN_RESP

if [ -z "$SESSION" ]; then
    if [ "$VPN_STARTED" -eq 1 ]; then
        /usr/sbin/scutil --nc stop "$VPN"
    fi

    /usr/bin/osascript \
      -e 'display alert "공유기 로그인 실패" message "ipTIME 세션을 가져오지 못했습니다."'
    exit 1
fi


# 4. 공유기 자체 WOL
/usr/bin/curl -sS \
  "http://${ROUTER_IP}/sess-bin/timepro.cgi" \
  -b "efm_session_id=$SESSION" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H "Origin: http://${ROUTER_IP}" \
  -H "Referer: http://${ROUTER_IP}/sess-bin/timepro.cgi?tmenu=iframe&smenu=expertconfwollist" \
  --data-urlencode 'tmenu=iframe' \
  --data-urlencode 'smenu=expertconfwollist' \
  --data-urlencode 'nomore=0' \
  --data-urlencode "wakeupchk=$MAC" \
  --data-urlencode 'act=wake' \
  >/dev/null

unset SESSION


# 5. 외부에서 시작한 VPN만 종료
if [ "$VPN_STARTED" -eq 1 ]; then
    /bin/sleep 2
    /usr/sbin/scutil --nc stop "$VPN"
fi


# 6. Windows / Parsec 대기
/bin/sleep 15

/usr/bin/open -a "Parsec"
```

실제 외부망에서 이 단축어 하나로 전체 과정이 성공했다.

## 집 전용 단축어

집에서는 훨씬 단순하다.

```bash
wakeonlan <LAPTOP_MAC>

/bin/sleep 15

/usr/bin/open -a "Parsec"
```

## Parsec 해상도

노트북 패널과 macOS 클라이언트의 화면 비율이 달라 기본 해상도가 약간 어색했다.

Parsec 오버레이 Resolution 에서 1680×1050 (16:10)을 사용했다.

macOS 클라이언트 기준으로 Fullscreen이 자연스럽고, 1280×800보다 작업 공간이 넓고, 1920×1200보다 구형 호스트에 부담이 적으며, Windows 글자 크기도 적당했다. CMD에서 폰트를 consolas로 바꾸고 16px로 사용하면 해상도를 변경해도 맥 화면에서 잘보인다.

## 디버깅에 유용했던 명령어

### Windows

```cmd
powercfg /devicequery wake_armed
ipconfig /all
shutdown /s /t 0
shutdown /h
```

### macOS

VPN 상태:

```bash
scutil --nc status "<VPN_NAME>"
```

VPN 시작/종료:

```bash
scutil --nc start "<VPN_NAME>"
scutil --nc stop "<VPN_NAME>"
```

공유기 접근:

```bash
ping -c 3 <ROUTER_IP>
curl -I http://<ROUTER_IP>
```

DDNS:

```bash
dig +short <DDNS_HOST>
```

VPN broadcast route:

```bash
route -n get <LAN_BROADCAST_IP>
```

pppd 로그:

```bash
log show --last 5m --predicate 'process == "pppd"' --info
```

로컬 WOL:

```bash
wakeonlan <LAPTOP_MAC>
```

broadcast 지정:

```bash
wakeonlan -i <LAN_BROADCAST_IP> <LAPTOP_MAC>
```

## 문제와 해결 요약

| 문제 | 원인 | 해결 |
|---|---|---|
| 절전 WOL은 되는데 종료 WOL이 안 됨 | BIOS/하드웨어의 S5 Wake 미지원 | 원격 운용 시 S3 절전 사용 |
| 최대 절전에서도 안 깨어남 | 해당 머신의 S4 Wake 불가 | 최대 절전 대신 S3 |
| `rundll32 SetSuspendState`가 원하는 절전이 아님 | 호출 방식/환경 차이 | PowerShell `PowerState.Suspend` |
| 집 Wi-Fi에서 VPN 실패 | 자기 공유기로 내부에서 외부 DDNS VPN 접속 | 핫스팟 등 실제 외부망 테스트 |
| Chrome만 `<ROUTER_IP>` 접속 안 됨 | macOS 로컬 네트워크 권한 | Chrome 권한 허용 |
| 기본 wakeonlan이 외부 VPN에서 실패 | 255.255.255.255 local broadcast | `<LAN_BROADCAST_IP>` 시도 |
| broadcast WOL이 불안정 | L2TP 너머 broadcast 전달 문제 | 공유기 자체 WOL 사용 |
| curl cookie jar가 비어 있음 | ipTIME이 JS `setCookie()`로 session 전달 | 로그인 응답 본문 직접 파싱 |
| Shortcuts VPN 액션이 죽음 | macOS Shortcuts 쪽 문제 | `scutil --nc` 사용 |
| WOL POST가 실행됐는데 안 깨어남 | 유효한 `efm_session_id`가 없었음 | 로그인 응답에서 session 추출 |

## 보안상 반드시 주의할 점

자동화 과정에서 다음 정보는 외부에 공개하면 안 된다.

```text
공유기 관리자 비밀번호
VPN 계정 비밀번호
L2TP Shared Secret
현재 efm_session_id
```

권장:

1. 비밀번호는 스크립트에 평문으로 넣지 않는다.
2. macOS Keychain을 사용한다.
3. `Copy as cURL`을 공유할 때 Cookie와 비밀번호를 제거한다.
4. 세션 쿠키를 실수로 공개했다면 공유기에서 로그아웃한다.
5. 관리자 비밀번호를 공개했다면 즉시 변경한다.
6. 공유기 관리자 페이지를 외부에 직접 노출하기보다 VPN을 먼저 거치는 구조를 사용한다.

## 보너스: WSL 개인 공부 환경

원격 Windows 머신 안에서도 Linux 기반 공부와 개발 실습을 할 수 있도록 WSL에 필요한 도구를 추가로 설치했다.

```text
WSL Ubuntu
├─ Python 3.12
├─ pwntools
├─ unicorn
├─ GDB
└─ pwndbg
```

Python 3.12:

```bash
uv python install 3.12
uv venv ~/pwn --python 3.12
source ~/pwn/bin/activate
```

alias:

```bash
echo "alias pwn='source ~/pwn/bin/activate'" >> ~/.bashrc
source ~/.bashrc
```

pwntools:

```bash
uv pip install -U pwntools
```

확인:

```bash
python -c "from pwn import *; import unicorn; print('pwntools OK'); print('unicorn', unicorn.__version__)"
```

pwndbg:

```bash
curl -qsL 'https://install.pwndbg.re' | sh -s -- -t pwndbg-gdb
```

사용:

```bash
gdb       # 순수 GDB
pwndbg    # pwndbg 포함 GDB
```

둘을 굳이 alias로 합치지 않았다.

## 통합 전 사용 루틴

### 집

```text
'집 PC 켜기'
→ wakeonlan
→ 15초
→ Parsec
```

### 외부

```text
'외부 PC 켜기'
→ L2TP VPN
→ ipTIME 관리자 로그인
→ 로그인 JS에서 session 추출
→ 공유기 자체 WOL
→ VPN 종료
→ 15초
→ Parsec
```

### 사용 후

```text
Windows 바탕화면 '절전'
```

## 집/외부 단축어를 하나로 통합

처음에는 단축어를 두 개로 나눠 사용했다.

```text
집 PC 켜기
→ 같은 LAN에서 wakeonlan
→ 15초
→ Parsec

외부 PC 켜기
→ L2TP VPN
→ ipTIME 관리자 로그인
→ 공유기 자체 WOL
→ VPN 종료
→ 15초
→ Parsec
```

둘 다 잘 동작했지만, 실제로 사용해보니 매번 현재 위치에 따라 단축어를 골라 누를 필요는 없었다.

단축어 하나가 현재 접속한 공유기가 집 공유기인지 자동으로 판별하면 된다.

처음에는 단순히:

```text
<ROUTER_IP>에 접속 가능한가?
```

를 기준으로 집/외부를 판별하려 했지만 이 방식은 좋지 않았다.

공유기 관리 주소는 카페, 학교, 다른 집, 다른 공유기에서도 같은 사설 IP를 사용할 수 있다.

집에 공유기가 여러 대 있는 환경까지 생각하면 더욱 확실한 기준이 필요했다.

그래서 최종적으로는 **현재 `<ROUTER_IP>` 장비의 MAC 주소를 ARP로 확인하고, 미리 등록한 집 공유기 MAC과 비교하는 방식**을 사용했다.

### 현재 공유기 MAC 확인

먼저 집 Wi-Fi에 연결한 상태에서:

```bash
ping -c 1 <ROUTER_IP> >/dev/null
arp -n <ROUTER_IP>
```

예:

```text
? (<ROUTER_IP>) at <HOME_ROUTER_MAC_1>
```

여기서:

```text
<HOME_ROUTER_MAC_1>
```

가 현재 게이트웨이 장비의 MAC 주소다.

집에 공유기가 두 대이고 어느 쪽 Wi-Fi에 연결되어도 직접 WOL이 가능하다면 두 공유기의 MAC을 모두 집 장비 목록에 넣으면 된다.

> 아래 스크립트에서는 실제 MAC 주소 대신 `<HOME_ROUTER_MAC_1>`, `<HOME_ROUTER_MAC_2>` placeholder를 사용한다.

### 최종 통합 단축어

macOS 단축어의 `셸 스크립트 실행`에 다음처럼 넣었다.

`관리자로 실행`은 OFF로 둔다.

```bash
VPN="<VPN_NAME>"
VPN_USER="<VPN_USER>"

ROUTER_IP="<ROUTER_IP>"
ROUTER_USER="<ROUTER_USER>"

MAC="<LAPTOP_MAC>"
WOL="$(command -v wakeonlan 2>/dev/null)"

if [ -z "$WOL" ]; then
    if [ -x "/opt/homebrew/bin/wakeonlan" ]; then
        WOL="/opt/homebrew/bin/wakeonlan"
    elif [ -x "/usr/local/bin/wakeonlan" ]; then
        WOL="/usr/local/bin/wakeonlan"
    else
        /usr/bin/osascript \
          -e 'display alert "wakeonlan 없음" message "wakeonlan을 설치하거나 경로를 확인하세요."'
        exit 1
    fi
fi

# 집 공유기 MAC
HOME_ROUTER_MAC_1="<HOME_ROUTER_MAC_1>"
HOME_ROUTER_MAC_2="<HOME_ROUTER_MAC_2>"

VPN_STARTED=0


# ─────────────────────────────
# 함수: 현재 $ROUTER_IP 장비의 MAC 확인
# ─────────────────────────────

get_current_router_mac() {

    # 실제로 현재 장비와 통신이 되는 경우에만 ARP 결과 사용
    if ! /sbin/ping -c 1 -W 1000 "$ROUTER_IP" >/dev/null 2>&1; then
        return 1
    fi

    /usr/sbin/arp -n "$ROUTER_IP" 2>/dev/null \
      | /usr/bin/awk '/ at / {print tolower($4); exit}'
}


# ─────────────────────────────
# 1. 집 / 외부 판별
# ─────────────────────────────

CURRENT_ROUTER_MAC=$(get_current_router_mac)

HOME_MODE=0

if [ -n "$CURRENT_ROUTER_MAC" ]; then

    case "$CURRENT_ROUTER_MAC" in

        "$HOME_ROUTER_MAC_1"|"$HOME_ROUTER_MAC_2")
            HOME_MODE=1
            ;;

    esac

fi


# ─────────────────────────────
# 2-A. 집이면 직접 WOL
# ─────────────────────────────

if [ "$HOME_MODE" -eq 1 ]; then

    "$WOL" "$MAC"


# ─────────────────────────────
# 2-B. 외부면 VPN → ipTIME 자체 WOL
# ─────────────────────────────

else

    # 이미 VPN이 연결되어 있는지 확인
    if ! /usr/sbin/scutil --nc status "$VPN" \
      | /usr/bin/head -n 1 \
      | /usr/bin/grep -q "^Connected$"; then


        # VPN 인증정보를 Keychain에서 가져오기
        VPN_PASS=$(/usr/bin/security find-generic-password \
          -a "$VPN_USER" \
          -s "<VPN_PASSWORD_SERVICE>" \
          -w)

        VPN_SECRET=$(/usr/bin/security find-generic-password \
          -a "$VPN_USER" \
          -s "<VPN_SECRET_SERVICE>" \
          -w)


        # VPN 연결
        /usr/sbin/scutil --nc start "$VPN" \
          --user "$VPN_USER" \
          --password "$VPN_PASS" \
          --secret "$VPN_SECRET"

        unset VPN_PASS VPN_SECRET

        VPN_STARTED=1


        # VPN 연결 완료 대기
        CONNECTED=0

        for i in {1..20}; do

            if /usr/sbin/scutil --nc status "$VPN" \
              | /usr/bin/head -n 1 \
              | /usr/bin/grep -q "^Connected$"; then

                CONNECTED=1
                break

            fi

            /bin/sleep 1

        done


        if [ "$CONNECTED" -ne 1 ]; then

            /usr/bin/osascript \
              -e 'display alert "VPN 연결 실패" message "집 VPN 연결에 실패했습니다."'

            exit 1

        fi

    fi


    # VPN에서 공유기 접근 가능할 때까지 대기
    ROUTER_READY=0

    for i in {1..10}; do

        if /sbin/ping -c 1 -W 1000 "$ROUTER_IP" >/dev/null 2>&1; then

            ROUTER_READY=1
            break

        fi

        /bin/sleep 1

    done


    if [ "$ROUTER_READY" -ne 1 ]; then

        if [ "$VPN_STARTED" -eq 1 ]; then
            /usr/sbin/scutil --nc stop "$VPN"
        fi

        /usr/bin/osascript \
          -e 'display alert "공유기 접근 실패" message "VPN은 연결되었지만 ipTIME 공유기에 접근할 수 없습니다."'

        exit 1

    fi


    # ─────────────────────────────
    # 3. ipTIME 관리자 로그인
    # ─────────────────────────────

    ROUTER_PASS=$(/usr/bin/security find-generic-password \
      -a "$ROUTER_USER" \
      -s "<ROUTER_PASSWORD_SERVICE>" \
      -w)

    LOGIN_RESP=$(/usr/bin/curl -sS \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      -H "Referer: http://${ROUTER_IP}/sess-bin/login_session.cgi?logout=1" \
      --data-urlencode 'init_status=1' \
      --data-urlencode 'captcha_on=0' \
      --data-urlencode 'captcha_file=' \
      --data-urlencode "username=$ROUTER_USER" \
      --data-urlencode "passwd=$ROUTER_PASS" \
      --data-urlencode 'default_passwd=<DEFAULT_PASSWD_FIELD_VALUE>' \
      --data-urlencode 'captcha_code=' \
      "http://${ROUTER_IP}/sess-bin/login_handler.cgi")

    unset ROUTER_PASS


    # 로그인 응답에서 efm_session_id 추출
    SESSION=$(printf '%s' "$LOGIN_RESP" \
      | /usr/bin/grep -o "setCookie('[^']*')" \
      | /usr/bin/head -1 \
      | /usr/bin/cut -d"'" -f2)

    unset LOGIN_RESP


    if [ -z "$SESSION" ]; then

        if [ "$VPN_STARTED" -eq 1 ]; then
            /usr/sbin/scutil --nc stop "$VPN"
        fi

        /usr/bin/osascript \
          -e 'display alert "공유기 로그인 실패" message "ipTIME 세션을 가져오지 못했습니다."'

        exit 1

    fi


    # ─────────────────────────────
    # 4. ipTIME 자체 WOL 실행
    # ─────────────────────────────

    /usr/bin/curl -sS \
      "http://${ROUTER_IP}/sess-bin/timepro.cgi" \
      -b "efm_session_id=$SESSION" \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      -H "Origin: http://${ROUTER_IP}" \
      -H "Referer: http://${ROUTER_IP}/sess-bin/timepro.cgi?tmenu=iframe&smenu=expertconfwollist" \
      --data-urlencode 'tmenu=iframe' \
      --data-urlencode 'smenu=expertconfwollist' \
      --data-urlencode 'nomore=0' \
      --data-urlencode "wakeupchk=$MAC" \
      --data-urlencode 'act=wake' \
      >/dev/null

    unset SESSION


    # 이 단축어가 연결한 VPN만 종료
    if [ "$VPN_STARTED" -eq 1 ]; then

        /bin/sleep 2
        /usr/sbin/scutil --nc stop "$VPN"

    fi

fi


# ─────────────────────────────
# 5. Windows / Parsec 기동 대기
# ─────────────────────────────

/bin/sleep 15

/usr/bin/open -a "Parsec"
```

최종적으로 단축어 하나가 다음처럼 동작하게 됐다.

```text
Mac에서 단축어 실행
        ↓
현재 게이트웨이 MAC 확인
        ↓
집 공유기인가?
   ├─ Yes → 같은 LAN에서 wakeonlan
   │
   └─ No  → L2TP VPN 연결
             ↓
           ipTIME 로그인
             ↓
           공유기 자체 WOL
             ↓
           VPN 종료
        ↓
15초 대기
        ↓
Parsec 실행
```

이렇게 하면 사용자는 현재 집인지 외부인지 신경 쓸 필요 없이 **WOL 단축어 하나만 실행하면 된다.**

집/외부용 단축어 두 개를 따로 유지하는 것보다 실제 사용에서는 이 방식이 가장 깔끔했다.

## 결론

처음에는 단순히 “WOL 켜고 Parsec 쓰면 되겠지”라고 생각했지만 실제로는:

```text
NIC Wake 권한
→ BIOS 확인
→ S3/S4/S5 구분
→ 절전 바로가기
→ 로컬 WOL
→ 공유기 WOL
→ DDNS
→ L2TP VPN
→ 외부망 테스트
→ broadcast route
→ DevTools로 WOL POST 분석
→ 로그인 POST 분석
→ JS session 추출
→ Keychain
→ Shortcuts 자동화
→ Parsec 해상도 조정
```

까지 갔다.

1. **WOL은 전원 상태별로 다르다.** 이 머신은 S3만 안정적으로 가능했다.
2. **VPN 너머 broadcast보다 공유기가 자기 LAN에서 직접 WOL을 보내게 하는 편이 안정적이었다.**
3. **구형 공유기 웹 UI 자동화에서는 인증 세션이 일반적인 방식으로 전달된다고 가정하면 안 된다.** 이 경우 `Set-Cookie`가 아니라 JS `setCookie()` 응답을 직접 파싱해야 했다.

결과적으로 오래된 노트북이:

```text
덮개 닫힘
+ 절전 대기
+ 외부에서 한 번 클릭으로 Wake
+ Parsec
+ 필요하면 WSL 같은 공부 환경 추가
```

형태의 꽤 쓸 만한 **원격 Windows 머신**으로 바뀌었다. 이후 외부 카페에서 단축어로 켜는것을 실패했는데, 윈도우에서 S3 절전 이후 일정 시간 이후 S4 최대절전모드로 넘어가는 옵션이 있는것으로 보인다. 이 설정만 다시 건드리고 확인 예정

공유기에서 WOL, DDNS 설정은 생각보다 쉬웠는데, 로그인하는거 cURL 따와서 하는 부분부터는 혼자서 하라고 했으면 절대 못했을것 같다. 윈도우 설정 점검하는것도 생각보다 체크할게 많아서 GPT 도움받으면서 많이 배웠다.
