import { useEffect, useRef } from "react";
import "./Card.css";

interface ICard {
  id: number;
  image: string;
  name: string;
  username: string;
  cursor: any;
  selectedBlock: React.MutableRefObject<number>;
  setCopiedDiv: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      el: JSX.Element | null;
    }>
  >;
  getCard: React.MutableRefObject<HTMLDivElement | null>;
  active: boolean;
}

export default function Card({
  id,
  image,
  name,
  username,
  cursor,
  selectedBlock,
  setCopiedDiv,
  getCard,
  active,
}: ICard) {
  const userCard = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const getCopyMove = (e: MouseEvent) => {
      let getCopy = (
        <div
          className={userCard.current ? userCard.current.className : undefined}
          dangerouslySetInnerHTML={
            userCard.current
              ? { __html: userCard.current.innerHTML }
              : undefined
          }
        ></div>
      );

      setCopiedDiv({ x: e.offsetX, y: e.offsetY, el: getCopy });
      selectedBlock.current = id;

      cursor.current.style.left = `${e.clientX - e.offsetX}px`;
      cursor.current.style.top = `${e.clientY - e.offsetY}px`;
    };

    if (userCard.current) {
      userCard.current.addEventListener("mousedown", getCopyMove);
    }
    return () => {
      userCard.current?.removeEventListener("mousedown", getCopyMove);
    };
  }, []);

  return (
    <div
      ref={(ref) => {
        userCard.current = ref;
        getCard.current = ref;
      }}
      className={`Card ${active ? "" : "Blocked"}`}
      data-id={id}
    >
      <div className="CardImage">
        <img src={image} alt="ProfileIcon" />
      </div>
      <div className="CardInfo">
        <h2>{name}</h2>
        <h3>@{username}</h3>
      </div>
    </div>
  );
}
