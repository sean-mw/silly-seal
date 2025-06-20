"use client";

import Seal from "@/components/Seal";
import StatusBar from "@/components/StatusBar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="border-3 border-black rounded">
      <Seal />
      <div>
        <StatusBar
          title={"Hunger"}
          percent={0.5}
          buttonLabel={"Feed"}
          onClick={() => {
            router.push("/feed");
          }}
        />
        <StatusBar
          title={"Stimulation"}
          percent={0.8}
          buttonLabel={"Play"}
          onClick={() => {
            router.push("/play");
          }}
        />
        <StatusBar
          title={"Hygiene"}
          percent={0.2}
          buttonLabel={"Clean"}
          onClick={() => {
            router.push("/clean");
          }}
        />
      </div>
    </div>
  );
}
