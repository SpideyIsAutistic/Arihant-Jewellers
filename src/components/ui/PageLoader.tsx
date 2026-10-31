export function PageLoader({ error }: { error?: Error }) {
  return (
    <div className="page-width grid min-h-[50vh] place-items-center py-24 text-center">
      {error ? (
        <p className="text-[14px] text-body2">
          {/permission|insufficient/i.test(error.message)
            ? "This page needs the latest database rules. Publish the site (npm run deploy), then refresh."
            : "We couldn't load this page. Please check your connection and refresh."}
        </p>
      ) : (
        <span className="text-[11px] font-medium tracking-[0.3em] text-subtle uppercase animate-pulse">Arihant Jewellers</span>
      )}
    </div>
  );
}
