export type Message = {
  user: {
    name: string;
    isBot?: boolean;
  };
  message: string;
};

export type CreateEmbeddingResponse = {
  data: {
    statusCode: number;
    body: { vectors: number[] };
  };
};
