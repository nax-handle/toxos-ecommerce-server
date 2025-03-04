export interface ICategoryBranch {
  name: string;
}

export interface ICategory {
  name: string;
  branches: ICategoryBranch[];
}
