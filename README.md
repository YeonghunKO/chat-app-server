# 📷chat app

[chat-app](https://github.com/YeonghunKO/chat-app-client/tree/main)의 백엔드를 관리하는 레포지토리 입니다!

## 📢 주요 기능
1. 유저 정보데이터를 저장, 관리합니다.
2. 메시지 데이터를 저장, 관리합니다.
3. access token , refresh token을 사용하여 유저의 인가를 관리합니다.
4. socket.io를 이용해 실시간으로 클라이언트 요청을 처리합니다.

## ⏳ 진행 기간
2023년 8월 01일 ~ 현재

## ⛏개선 사항
_**아래는 기존코드에 문제점이 있다고 판단되어 개선하거나 새롭게 추가한 사항들입니다.**_

* jest, supertest를 이용하여 테스트 코드를 작성하고 기능을 문서화 시켰습니다.
  - ㅇ
* 현재 로그인한 유저를 class로 관리하였습니다.([onlineUsers](https://github.com/YeonghunKO/chat-app-server/blob/master/utils/onlineUser.ts))
* jsonwebtokens를 이용해 인가를 적용했습니다.([jwtAuth](https://github.com/YeonghunKO/chat-app-server/blob/master/middleware/jwtAuth.ts))
* controller에서 발생하는 에러를 핸들링하였습니다.([errorHandle](https://github.com/YeonghunKO/chat-app-server/blob/master/utils/errorHandle.ts))
* 날짜별로 메시지를 묶어서 프론트에 넘겨주었습니다([getMessages](https://github.com/YeonghunKO/chat-app-server/blob/master/controller/MessageController.ts))
   - 이로써 프론트는 날짜별로 일일이 필터링 할 필요없어졌습니다.
* uri 구조를 개선했습니다
   - uri 안에 있는 있는 동사(ex> get-messages)는 [http method로 대신](https://github.com/YeonghunKO/chat-app-server/commit/a64971505fcab61c3c0ea72d71cc178518466e20)하였습니다.
  
* oracle cloud에 배포하고 nginx + certbot을 이용해 ssl을 추가하였습니다. 

## 🚀 배포

- [배포 링크](https://api.chat-app.live)

## 🤖기술 스택

### 📚&nbsp;&nbsp;Frameworkes & Libraries

- express.js
- prisma
- jsonwebtoken
- socket.io
- nginx
- certbot

## ✍️TIL
- [2주간의 삽질](https://velog.io/@yhko1992/%EC%A7%80%EB%82%9C-%ED%95%9C%EB%8B%AC%EA%B0%84-%EC%82%BD%EC%A7%88%EC%9D%98-%EA%B8%B0%EB%A1%9D)
- [http에 ssl 적용](https://velog.io/@yhko1992/http%EC%97%90-ssl%EC%A0%81%EC%9A%A9%ED%95%98%EC%97%AC-https%EB%A1%9C-%EB%A7%8C%EB%93%A4%EC%96%B4%EC%A3%BC%EA%B8%B0)
- [oracle cloud에 서버를 배포하기 101](https://velog.io/@yhko1992/oracle-vc%EC%97%90%EC%84%9C-%ED%8F%AC%ED%8A%B8%EB%A5%BC-%EC%97%B4%EC%96%B4%EC%A3%BC%EA%B3%A0-%EB%B0%A9%ED%99%94%EB%B2%BD-%ED%97%88%EC%9A%A9%ED%95%98%EA%B8%B0)
- [nginx란 도대체 뭐지?](https://velog.io/@yhko1992/nginx%EB%9E%80-%EB%8F%84%EB%8C%80%EC%B2%B4-%EB%AD%90%EC%A7%80)
- [jwt로 토큰을 관리해보자!](https://velog.io/@yhko1992/express%EC%97%90%EC%84%9C-jwt%ED%86%A0%ED%81%B0-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0)
- [ssh를 끄더라도 서버가 계속 돌아가게 하려면?](https://velog.io/@yhko1992/ssh%ED%84%B0%EB%AF%B8%EB%84%90%EC%9D%84-%EA%BB%90%EC%9D%84%EB%95%8C%EB%8F%84-%EC%84%9C%EB%B2%84%EA%B0%80-%EA%B3%84%EC%86%8D-%EB%8F%8C%EC%95%84%EA%B0%80%EA%B2%8C-%ED%95%98%EB%A0%A4%EB%A9%B4)
- 
  

## 🔑 실행방법

.env를 만들고 아래 환경변수를 추가합니다

```cmd
PORT = 80
CLIENT_URL = http://localhost:3000

SCRETE_ACCESS = zzakdol
SCRETE_REFRESH = gongnam

DATABASE_URL="postgresql://postgres:koil132123451234@db.xpdqxuuljksmrjhubmtn.supabase.co:5432/postgres"
```


```cmd
$ npm install
$ npm run start
```
