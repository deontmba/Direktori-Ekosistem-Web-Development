"use client";

import { useEffect, useState } from "react";

interface ORMItem {
  orm: {
    type: string;
    value: string;
  };
}

export default function Home() {
  const [items, setItems] = useState<ORMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sparql")
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch data from SPARQL API");
        }
        return res.json();
      })
      .then((data) => {
        if (data.results?.bindings) {
          setItems(data.results.bindings);
        } else {
          setItems([]);
        }
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching SPARQL data:", err);
        setError(err.message || "An unexpected error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Helper to extract the local name from a URI (e.g. http://webdev.id/ontology#Prisma -> Prisma)
  const getLocalName = (uri: string) => {
    if (!uri) return "";
    return uri.split("#")[1] || uri.split("/").pop() || uri;
  };

  return (
    <main className="flex-grow flex flex-col justify-start items-center bg-gradient-to-b from-[#11111e] to-[#08080c] text-[#ededed] min-h-screen px-4 py-12 md:py-20 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        {/* Header Section */}
        <header className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Semantic Web Ontology
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 tracking-tight">
            WebDev Ecosystem
          </h1>
          <p className="text-gray-400 max-w-lg text-sm md:text-base leading-relaxed">
            Exploring the relations and compatibilities of web development technologies using RDF and SPARQL queries.
          </p>
        </header>

        {/* Database Status Alert */}
        <section className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/10">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Database Connectivity Status</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Connection URL: <code className="text-indigo-300 font-mono text-[11px] bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-500/10">http://localhost:7200/repositories/webdev</code>
              </p>
            </div>
            
            {loading ? (
              <span className="self-start md:self-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-ping"></span>
                Checking connection...
              </span>
            ) : error ? (
              <span className="self-start md:self-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                Database Offline
              </span>
            ) : (
              <span className="self-start md:self-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-bounce">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Connected
              </span>
            )}
          </div>

          {/* Connection Error - Actionable Instruction Manual */}
          {error && (
            <div className="mt-6 border-t border-white/5 pt-6 flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-sm text-rose-200">
                <p className="font-semibold mb-1">Could not connect to GraphDB SPARQL endpoint:</p>
                <p className="text-xs text-rose-300/80 leading-relaxed font-mono bg-black/30 p-2.5 rounded-lg border border-black/10 mt-1 overflow-x-auto whitespace-pre-wrap">
                  {error}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-3">🛠️ Steps to set up GraphDB and run this application:</h3>
                <ol className="text-xs text-gray-300 space-y-3 pl-4 list-decimal">
                  <li>
                    <span className="font-semibold text-white">Start your GraphDB server:</span>
                    <p className="text-gray-400 mt-1">Make sure Ontotext GraphDB is installed and running on your local machine.</p>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Ensure it runs on Port 7200:</span>
                    <p className="text-gray-400 mt-1">Open <a href="http://localhost:7200" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">http://localhost:7200</a> in your web browser to access the GraphDB Workbench.</p>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Create a repository named <code className="text-indigo-300 bg-indigo-950/40 px-1 py-0.5 rounded">webdev</code>:</span>
                    <p className="text-gray-400 mt-1">Go to <span className="text-white font-medium">Setup &gt; Repositories &gt; Create new repository</span>, set the Repository ID to <code className="text-indigo-300 font-mono">webdev</code>, and click Create.</p>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Import the ontology file:</span>
                    <p className="text-gray-400 mt-1">
                      Choose <code className="text-indigo-300 font-mono">webdev</code> as the active repository (using the dropdown in the top-right corner of the workbench).
                      Go to <span className="text-white font-medium">Import &gt; User data &gt; Upload RDF files</span>. Upload the file at <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded">ontology/webdev.ttl</code> from this project folder, and click <span className="text-white font-medium">Import</span>.
                    </p>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Refresh this page:</span>
                    <p className="text-gray-400 mt-1">Once the triples are loaded, this error will disappear and the SPARQL query will retrieve the ORMs automatically!</p>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </section>

        {/* Content Section - ORM Listing */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            🚀 Queried ORM Technologies (from Ontology)
          </h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-white/5 bg-white/[0.01]">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              <span className="text-sm text-gray-400">Executing SPARQL Query...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-white/5 bg-white/[0.01] gap-2">
              <p className="text-sm text-gray-400 font-medium">No active SPARQL connection. Showing offline preview placeholders:</p>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 opacity-50">
                {["Prisma (Demo)", "Sequelize (Demo)", "TypeORM (Demo)"].map((placeholder, idx) => (
                  <div key={idx} className="border border-white/5 bg-white/[0.02] p-4 rounded-xl text-center text-xs font-semibold text-gray-400">
                    {placeholder}
                  </div>
                ))}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-white/5 bg-white/[0.01] gap-2 text-center px-4">
              <span className="text-3xl">📭</span>
              <p className="text-sm font-semibold text-white">No ORM items found in the repository</p>
              <p className="text-xs text-gray-400 max-w-sm">
                The repository is empty. Please ensure you have successfully imported the <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded">ontology/webdev.ttl</code> file.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map((item, i) => {
                const name = getLocalName(item.orm.value);
                return (
                  <div
                    key={i}
                    className="group border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5"
                  >
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">ex:ORM</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors duration-200">{name}</h3>
                      <p className="text-[10px] font-mono text-gray-500 truncate mt-1 bg-black/20 p-1.5 rounded" title={item.orm.value}>
                        {item.orm.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}