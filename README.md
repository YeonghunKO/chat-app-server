[![ci / cd](https://github.com/YeonghunKO/chat-app-server/actions/workflows/action.yml/badge.svg)](https://github.com/YeonghunKO/chat-app-server/actions/workflows/action.yml)

# 📷chat app

[chat-app](https://github.com/YeonghunKO/chat-app-client/tree/main)의 백엔드를 관리하는 레포지토리 입니다

## 📢 주요 기능

1. 유저 정보데이터를 저장, 관리합니다.
2. 메시지 데이터를 저장, 관리합니다.
3. access token , refresh token을 사용하여 유저의 인가를 관리합니다.
4. socket.io를 이용해 실시간으로 클라이언트 요청을 처리합니다.

## ⏳ 진행 기간

2023년 8월 01일 ~ 현재

## ⛏개선 사항

_**아래는 기존코드에 문제점이 있다고 판단되어 개선하거나 새롭게 추가한 사항들입니다.**_

- jest, supertest, socket.io를 이용하여 [테스트 코드를 작성](https://github.com/YeonghunKO/chat-app-server/tree/master/__test__)하고 기능을 문서화 시켰습니다.
  - 컴포넌트를 리팩토링해야하거나, 새로운 기능을 추가하고 나면 항상 원래 의도한대로 잘 작동하는지 수동으로 체크해야했습니다. 그러나, 테스트 코드를 작성하면 수동테스트가 자동화되면서 불필요한 작업을 최소화할 수 있게 되었습니다.
  - A(arrange)A(act)A(assert) 구조로 테스트를 구분하고 주석처리하여 문서화 시켰습니다.
  - [socket테스트시](https://github.com/YeonghunKO/chat-app-server/blob/master/__test__/socket.test.ts), 단순 [계산로직](https://github.com/YeonghunKO/chat-app-server/blob/master/socket/user.ts#L7)과 액션(클라이언트에 직접적인 영향을 주는)을 구분하여 테스트 하였습니다.
  - 참고로, prisma를 모킹시 [공식문서](https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing)를 통해 모킹방법이 나와있으나, `typeerror: .default is not a function` 에러를 해결하지 못하여 그냥 [직접 구현하였습니다](https://github.com/YeonghunKO/chat-app-server/blob/master/__test__/mock/prismaInstance.ts).
  - 직접 모킹을 구현함으로써 일일이 구현을 해야하니 시간이 많이 든다는 단점이 있습니다. 그러나, 모킹 라이브러리에 종속되지 않아 디버깅이 쉽고, 코드 작성시 복잡성을 줄일 수 있다는 장점이 있습니다.
- 현재 로그인한 유저를 class로 관리하였습니다.([onlineUsers](https://github.com/YeonghunKO/chat-app-server/blob/master/utils/onlineUser.ts))
- jsonwebtokens를 이용해 인가를 적용했습니다.([jwtAuth](https://github.com/YeonghunKO/chat-app-server/blob/master/middleware/jwtAuth.ts))
  - 중요한 정보를 열람하는 api일 경우, 자원을 넘겨주기 전에 [validateToken](https://github.com/YeonghunKO/chat-app-server/blob/master/middleware/validateToken.ts)이라는 [middleware를 이용](https://github.com/YeonghunKO/chat-app-server/blob/master/index.ts#L41)하여 토큰 검증을 하였습니다.
  - 이로써, 쿠키에 토큰이 있는 유저만 정보를 열람 할 수 있게 되어 보안이 강화되었습니다.
- 날짜별로 메시지를 묶어서 프론트에 넘겨주었습니다([getMessages](https://github.com/YeonghunKO/chat-app-server/blob/master/controller/MessageController.ts#L81))
  - 이로써 프론트에서는 받은 데이터를 가공하지 않고 그대로 랜더링 할 수 있습니다.
- controller에서 발생하는 에러를 핸들링하였습니다.([errorHandle](https://github.com/YeonghunKO/chat-app-server/blob/master/utils/errorHandle.ts))
- uri 구조를 개선했습니다.
  - uri 안에 있는 있는 동사(ex> get-messages)는 [http method로 대신](https://github.com/YeonghunKO/chat-app-server/commit/a64971505fcab61c3c0ea72d71cc178518466e20)하였습니다.
- oracle cloud에 배포하고 nginx + certbot을 이용해 ssl을 추가하였습니다.
- github actions을 이용해 ci/cd를 완료하였습니다.
  - 테스트를 통과하고 나면 oracle cloud에 자동 빌드/배포 됩니다.

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

## 🔑 실행방법

.env를 만들고 아래 환경변수를 추가합니다.

```cmd
PORT =
CLIENT_URL =

SCRETE_ACCESS =
SCRETE_REFRESH =

DATABASE_URL=
```

```cmd
$ npm install
$ npm run start
```
