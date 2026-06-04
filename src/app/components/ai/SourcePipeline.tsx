export function SourcePipeline({
  stages,
  activeStage,
}: {
  stages: string[];
  activeStage: string;
}) {
  const activeIndex = Math.max(stages.findIndex((stage) => stage.toLowerCase() === activeStage.toLowerCase()), 0);

  return (
    <div className="grid gap-3 md:grid-cols-5">
      {stages.map((stage, index) => {
        const completed = index < activeIndex;
        const active = index === activeIndex;

        return (
          <div
            key={stage}
            className={`rounded-2xl border px-4 py-3 text-center text-sm font-medium ${
              completed
                ? 'border-success/20 bg-success/10 text-success'
                : active
                  ? 'border-primary/20 bg-primary/10 text-primary'
                  : 'border-slate-200 bg-white text-slate-500'
            }`}
          >
            {stage}
          </div>
        );
      })}
    </div>
  );
}

