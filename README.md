# Interactive Resume

## How it Works

This project is an interactive resume. It uses AI to answer questions about experience and projects in the first person. The LLM has access to a vectorized text file containing context on how to answer.

The application uses OpenAI's embedding model to generate embeddings for each line in the text file. These embeddings are then saved in a Supabase database. When a user asks a question, the application generates an embedding for the question and finds the most similar embeddings in the database. The lines of text associated with these embeddings are used as context for the AI to generate a response.

## Database Table

The application uses a Supabase table named embeddings to store embeddings. The database has pgVector enabled. Each row in the table represents an embedding and has the following columns:

- text: The line of text that the embedding represents.
- embedding: The embedding for the line of text.

The embedding column's default embedding vector length needs to be updated and a SQL function, `vector_query`, needs to be added to the database:

```sql
-- OpenAI's embedding vector length
ALTER TABLE "embeddings" ADD COLUMN embedding vector(1536);

-- vector_query function
create
or replace function vector_query (
  query_embedding vector (1536),
  match_threshold float,
  match_count int
) returns table (id bigint, content text, similarity float) language sql stable as $$
  select
    "embeddings".id,
    "embeddings".content,
    1 - ("embeddings".embedding <=> query_embedding) as similarity
  from "embeddings"
  where 1 - ("embeddings".embedding <=> query_embedding) > match_threshold
  order by ("embeddings".embedding <=> query_embedding) asc
  limit match_count;
$$;
```

## Getting Started

1. Set up services
2. Build table in Supabase
3. Populate `.env` file
4. Install packages
5. Populate the `documents/resume/index.txt` file
6. Run `yarn generate` to create embeddings and save them to supabase
7. Start the server with the `dev` command
