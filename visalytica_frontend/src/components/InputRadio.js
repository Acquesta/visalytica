export default function InputRadio({ text, selected, handle }) {
  if (selected) {
    return (
      <div className="flex gap-2 items-center cursor-pointer" onClick={handle}>
        <div className="w-4 h-4 rounded-full bg-[#53D569] border-[2.5px] border-[#439F57] flex items-center justify-center">
          <div className="bg-white rounded-full w-1/2 h-1/2"></div>
        </div>
        <p className="text-cinza_texto dark:text-white font-medium ">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center cursor-pointer" onClick={handle}>
      <div className="w-4 h-4 rounded-full bg-cinza_medio border-[2.5px] border-cinza"></div>
      <p className="text-cinza_texto dark:text-white font-medium">{text}</p>
    </div>
  );
}
