import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Card from "./assets/Card/Card";
import CardList from "./assets/Lists/List";

interface ICard {
  id: number;
  image: string;
  name: string;
  username: string;
}

function App() {
  const cursorCustom = useRef<HTMLDivElement | null>(null);
  const [copiedDiv, setCopiedDiv] = useState<{
    x: number;
    y: number;
    el: JSX.Element | null;
  }>({
    x: 0,
    y: 0,
    el: null,
  });

  useEffect(() => {
    const removeCopy = () => {
      setCopiedDiv({ x: 0, y: 0, el: null });
    };
    document.addEventListener("mouseup", removeCopy);

    return () => {
      document.removeEventListener("mouseup", removeCopy);
    };
  }, []);

  useEffect(() => {
    const cursorFollow = (e: MouseEvent) => {
      if (cursorCustom.current && copiedDiv.el !== null) {
        cursorCustom.current.style.left = `${e.clientX - copiedDiv.x}px`;
        cursorCustom.current.style.top = `${e.clientY - copiedDiv.y}px`;
      }
    };

    if (copiedDiv.el) {
      document.addEventListener("mousemove", cursorFollow);
    } else {
      document.removeEventListener("mousemove", cursorFollow);
    }

    return () => {
      document.removeEventListener("mousemove", cursorFollow);
    };
  }, [copiedDiv]);

  return (
    <>
      <div className="CursorCustom" ref={cursorCustom}>
        {copiedDiv.el}
      </div>
      <div className="List">
        {CardList.map((e: ICard) => (
          <Card
            key={e.id}
            id={e.id}
            image={e.image}
            name={e.name}
            username={e.username}
            cursor={cursorCustom}
            setCopiedDiv={setCopiedDiv}
          />
        ))}
      </div>
    </>
  );
}

export default App;
