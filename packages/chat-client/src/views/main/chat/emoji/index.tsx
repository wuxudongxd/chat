import emojiList from "./emojiList.json";

interface EmojiProps {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const Emoji = ({ setContent }: EmojiProps) => {
  return (
    <>
      {emojiList.list.map((emoji, index) => {
        return (
          <>
            <span
              className="cursor-pointer select-none inline-block w-7 h-7 text-center text-lg hover:bg-slate-200 hover:rounded transition-all"
              onClick={() => {
                setContent((content) => content + emoji);
              }}
            >
              {emoji}
            </span>
            {(index + 1) % 9 === 0 ? <br /> : null}
          </>
        );
      })}
    </>
  );
};

export default Emoji;
