import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

/** 접속한 유저 정보 담는 Array - 누군가 로그인 할 때마다 아래 chracters 배열에 추가 */
const characters = [];

/** item dictionary */
const items = {
  table: {
    name: "WoodTable",
    size: [3, 6],
  },
  chair: {
    name: "Chair",
    size: [1, 1],
  },
  couch: {
    name: "Couch",
    size: [3, 3],
  },
  stepCubbyStorage: {
    name: "StepCubbyStorage",
    size: [5, 2],
  },
};

/** map dictionary */
const map = {
  size: [20, 20],
  gridDivision: 2,
  items: [
    {
      ...items.chair,
      gridPosition: [12, 11],
      rotation: 3,
    },
    {
      ...items.chair,
      gridPosition: [9, 11],
      rotation: 1, // 1: 90deg, 2: 180deg, ...
    },
    {
      ...items.table,
      gridPosition: [10, 9],
      rotation: 2,
    },
    {
      ...items.couch,
      gridPosition: [8, 0],
    },
    {
      ...items.stepCubbyStorage,
      gridPosition: [-1, 0],
      rotation: 2,
    },
  ],
};

/** 랜덤 포지션 생성 함수 - 누군가 접속할 때마다 위치할 포지션을 랜덤으로 부여하기 위함 */
const generateRandomPosition = () => {
  return [Math.random() * map.size[0], 0, Math.random() * map.size[1]];
};
/** 랜덤 hex 컬러 생성 함수 - 누군가 접속할 때마다 캐릭터 모델의 material 색상 조합을 랜덤으로 부여하기 위함 */
const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

/** connection on - 누군가 서버에 접속했을 때 connection애 on 함 */
io.on("connection", (socket) => {
  console.log("user connected");

  /** characters 배열에 캐릭터 Mesh 모델의 파라미터로 값 던져서 받아온 값을 매핑하여 push */
  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    tieColor: generateRandomHexColor(),
    jacketColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
    feetColor: generateRandomHexColor(),
  });

  /** broadcating - 이벤트 발생시키는 부분 */
  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
    items,
  }); // 연결된 모든 client들에게 'hello'이벤트 발생

  io.emit("characters", characters); // 연결된 모든 client들에게 'characters'이벤트 발생 - client에서 onCharacters 이벤트가 발생할 때마다 characters 배열에 client측 onCharacters의 value 파라미터에 들어온 새 접속자 정보를 server측 characters 배열에 추가

  socket.on("move", (position) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    character.position = position;
    io.emit("characters", characters);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});
