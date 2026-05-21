export async function querySPARQL(query: string) {
  const res = await fetch(
    "http://localhost:7200/repositories/webdev",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-query",
        Accept: "application/sparql-results+json",
      },
      body: query,
    }
  );

  return res.json();
}