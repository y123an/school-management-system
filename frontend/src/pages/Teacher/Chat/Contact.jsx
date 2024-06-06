import Avatar from "./Avatar";

export default function Contact({ _id, name, onClick, selected, online }) {
  return (
    <div
      key={_id}
      onClick={() => onClick(_id)}
      className={
        "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
        (selected ? "bg-blue-50" : "")
      }
    >
      {selected && <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} name={name} _id={_id} />
        <span className="text-gray-800">{name}</span>
      </div>
    </div>
  );
}
