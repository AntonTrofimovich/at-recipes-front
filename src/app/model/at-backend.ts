export type AtRecipe = {
    id: string;
    title: string;
    description: string;
};

export type AtResponse<T> = {
    success: boolean;
    data: T;
};
