import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3001");
export const charactersAtom = atom([]);
export const mapAtom = atom(null);
export const userAtom = atom(null);
export const itemsAtom = atom(null);

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [_map, setMap] = useAtom(mapAtom);
  const [_user, setUser] = useAtom(userAtom);
  const [_items, setItems] = useAtom(itemsAtom);
  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }

    function onHello(value) {
      setMap(value.map);
      setUser(value.id);
      setItems(value.items);
      setCharacters(value.characters);
    }

    function onCharacters(value) {
      setCharacters(value);
    }

    function onMapUpdate(value) {
      setMap(value.map);
      setCharacters(value.characters);
    }

    /** 서버 측에서 emit으로 발생시킨 이벤트 감지, 실행할 콜백 함수 (이벤트 리스너) 등록 */
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);
    socket.on("mapUpdate", onMapUpdate);

    /** clean up - 메모리 누수 방지 위해 unmount 시 on으로 등록했던 이벤트 리스너를 off로 제거 (useEffect가 리턴하는 함수는 컴포넌트가 unmount 될 때 실행되니까 이 때 off 해주는 방식으로 클린업) */
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
      socket.on("mapUpdate", onMapUpdate);
    };
  }, []);
};
