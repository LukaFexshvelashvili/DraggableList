import { useEffect, useRef, useState } from "react";
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
  const lineIndicator = useRef<HTMLDivElement | null>(null);

  const getCard = useRef<HTMLDivElement | null>(null);
  const listBLock = useRef<HTMLDivElement | null>(null);

  const selectedBlock = useRef<number>(-1);

  const [copiedDiv, setCopiedDiv] = useState<{
    x: number;
    y: number;
    el: JSX.Element | null;
  }>({
    x: 0,
    y: 0,
    el: null,
  });

  const removeCopy = (e: MouseEvent) => {
    setTimeout(() => {
      setCopiedDiv({ x: 0, y: 0, el: null });
    }, 0);

    // REMOVE LINE
    if (lineIndicator.current) {
      lineIndicator.current.style.opacity = "0";
    }

    if (listBLock.current && getCard.current && selectedBlock.current !== -1) {
      // GET ON POSITION
      let getListPos = listBLock.current.getBoundingClientRect();
      let offsetY = e.clientY - getListPos.top;
      let cardOffset = Math.floor(offsetY / getCard.current.clientHeight);
      let getItem = CardList.splice(selectedBlock.current, 1)[0];
      CardList.splice(cardOffset, 0, getItem);
      selectedBlock.current = -1;
    }
  };
  useEffect(() => {
    document.addEventListener("mouseup", removeCopy);

    return () => {
      document.removeEventListener("mouseup", removeCopy);
    };
  }, []);

  useEffect(() => {
    const cursorFollow = (e: MouseEvent) => {
      // CALCULATE TOP POSITION FOR LINE
      if (getCard.current && lineIndicator.current && listBLock.current) {
        let getListPos = listBLock.current.getBoundingClientRect();
        let offsetY = e.clientY - getListPos.top;

        let cardOffset = Math.floor(offsetY / getCard.current.clientHeight);
        if (cardOffset > CardList.length) cardOffset = CardList.length;
        if (cardOffset <= 0) cardOffset = 0;
        lineIndicator.current.style.opacity = "1";
        lineIndicator.current.style.transform = `translateY(${
          (getCard.current.clientHeight + 15) * cardOffset
        }px)`;
      }

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
      <div className="List" ref={listBLock}>
        <div className="LineShow" ref={lineIndicator}></div>
        {CardList.map((e: ICard, i: number) => (
          <Card
            key={i}
            id={e.id}
            image={e.image}
            name={e.name}
            username={e.username}
            cursor={cursorCustom}
            selectedBlock={selectedBlock}
            setCopiedDiv={setCopiedDiv}
            getCard={getCard}
            active={copiedDiv.el ? false : true}
          />
        ))}
      </div>
    </>
  );
}

export default App;
