import { useNavigate } from "react-router-dom";
import { Rocket, Clock } from "lucide-react";

export default function ApplyLaunch() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-lg text-center card-gradient-strong rounded-3xl border border-zinc-800/40 p-8 md:p-12">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Applications Coming Soon
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-6">
          Forge isn't fully permissionless yet — presales are currently
          created by the Forge team only, so every launch can be vetted
          before it goes live. Public applications will open soon.
        </p>
        <p className="text-zinc-500 text-sm mb-8">
          Have a project you'd like to launch? Reach out to the team in the
          meantime.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate("/sales")}
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Explore Live Sales
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
