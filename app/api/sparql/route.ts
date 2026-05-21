import { querySPARQL } from "@/lib/sparql";

export async function GET() {
  const query = `
  PREFIX ex: <http://webdev.id/ontology#>

  SELECT ?orm
  WHERE {
      ?orm a ex:ORM .
  }
  `;

  try {
    const data = await querySPARQL(query);
    return Response.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("SPARQL Query error:", errorMessage);
    return Response.json(
      {
        error: "Failed to connect to the SPARQL endpoint (GraphDB). Please make sure your GraphDB server is running and the 'webdev' repository is created.",
        results: { bindings: [] },
      },
      { status: 500 }
    );
  }
}