import Previews from "./components/Preview";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-10">
        <div className="text-xl">Image Upload UI</div>
        <Previews />
      </div>
    </div>
  );
}
