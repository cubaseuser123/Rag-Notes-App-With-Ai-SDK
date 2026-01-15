import { embed, embedMany } from "ai";

// AI Gateway automatically handles model strings in "provider/model-name" format
export const embeddingModel = "google/text-multilingual-embedding-002";

function generateChunks(input: string) {
    return input
        .split("\n\n")
        .map((chunk) => chunk.trim())
        .filter(Boolean);
}

export async function generateEmbeddings(value: string): Promise<Array<{ content: string; embedding: number[] }>> {
    const chunks = generateChunks(value)

    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: chunks,
    })

    return embeddings.map((embedding, index) => ({
        content: chunks[index],
        embedding: embedding as number[],
    }))
}

export async function generateEmbedding(value: string): Promise<number[]> {
    const { embedding } = await embed({
        model: embeddingModel,
        value,
    });
    return embedding;
}