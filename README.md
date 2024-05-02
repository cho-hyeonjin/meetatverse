# [MEETATVERSE](https://meetatverse-client-u16512.vm.elestio.app/)

### R3F와 Socket.io, jotai, Node.js 를 이용하여 구현한 3D 멀티플레이 웹 서비스

### [MEETATVERS 접속하기✨](https://meetatverse-client-u16512.vm.elestio.app/)

## 💬 프로젝트 소개 

### Meet at metaverse! 🙋🏻‍♀️🙋🏻‍♂️🙋🏻🪐

**밋앳버스**는 가상 환경에서의 멀티 플레이 기능을 통한 **3D 메타버스 인테리어 게임 서비스** 입니다.

## 💡 기획 의도


평소 인테리어에 관심이 많아 인테리어를 주제로 React, Three.js, 상태관리를 적용한 프로젝트를 진행하고 싶었습니다.

그러던 중 Figma와 같이 여러 유저가 하나의 웹 환경을 공유하며 함께 인테리어를 구상할 수 있는 '인테리어 협업툴'이라는 아이디어가 떠올라

양방향 통신 기술을 이용한 인테리어 웹게임 형식의 프로젝트를 진행하게 되었습니다.

Socket.io를 이용한 양방향 통신으로 여러 명의 유저가 공유하는 하나의 3D 가상 환경을 구성하는 것을 시작으로

아래의 기능들을 추가하며 프로젝트를 완성해 나갔습니다.

## 기술 스택

`Three.js` `R3F` `drei` `Socket.io` `Jotai` `Vite` `Node.js` `Blender`

## 📋 구현 기능 리스트

- Socket.io를 이용한 멀티 플레이 가상환경 구축
- 가상환경을 공유하는 다중 플레이어 접속 및 이동 기능 구현
- 채팅, 가상 공간 공동 편집과 같은 플레이어 간의 협업 기능 구현
- Jotai 라이브러리를 이용한 상태관리 
- Blender를 이용한 gltf(glb) 모델 생성
- gltf 에셋을 React 컴포넌트화하여 Three.js, R3F Object로 구현
- Shadow와 Light 세부 조정을 통해 3D 그래픽의 공간감 및 현실감 증대
- pathfinding 라이브러리를 이용하여 Grid 시스템 및 3D모델 이동 기능 구현
- buildMode, shopMode를 분리 구성하여 인테리어 편집 모드 세분화
- 비밀번호 유효성 검사를 통해 편집 권한 허용 기능 구현
- Ready Player Me SDK를 이용한 커스텀 캐릭터 구성 기능 구현

- **[🔗 Github | meetatverse](https://github.com/cho-hyeonjin/meetatverse)**
- **[🔗 배포 사이트 | MEETATVERSE](https://meetatverse-client-u16512.vm.elestio.app/)**

<!-- 실시간 양방향 통신으로 채팅 및 실시간 멀티플레이 기능 - 협업 기능으로의 확장 -->

## 📹 서비스 미리보기

https://github.com/cho-hyeonjin/meetatverse/assets/78816754/bcdd67af-d935-4a17-a34c-505225258fa0

### 다중 접속이 가능한 가상 환경

https://github.com/cho-hyeonjin/meetatverse/assets/78816754/f24667c4-75fe-4c64-9622-c53f79dc56af

### 채팅 기능

https://github.com/cho-hyeonjin/meetatverse/assets/78816754/5efdbbf8-de37-49cf-b0fb-8e2c2e6c9b42

### 가상환경에서의 인테리어 협업 기능

편집 권한 비밀번호: chohyunjin
