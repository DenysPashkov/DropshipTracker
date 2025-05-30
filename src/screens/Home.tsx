export function Home() {
  return (
    <div className="h-full">
      <div className=" flex flex-col w-full h-full bg-green-200">
        <div className="flex flex-row w-full h-10 bg-blue-300 justify-between">
          <p>yo</p>
          <p>sup</p>
        </div>
        <p className="flex w-full h-full bg-purple-200">body</p>
      </div>
      <div className="w-20 h-20 bg-yellow-300 z-2 fixed bottom-4 right-4">
        Plus Button
      </div>
    </div>
  );
}
