export type AtRecipe = {
    id: number;
    title: string;
    description: string;
};

export type AtResponse<T> = {
    success: boolean;
    data: T;
};

export type AtAddRecipeRequestBody = {
    title: string;
    description: string;
};
