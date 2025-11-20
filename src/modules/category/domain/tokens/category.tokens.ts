/**
 * Injection tokens for Category module
 * These tokens are used for dependency injection to avoid direct coupling
 * between modules and allow for easier testing and flexibility
 */

export const CATEGORY_REPOSITORY_TOKENS = {
  /**
   * Token for IFindCategoryByIdRepository
   * Used when other modules need to find a category by ID
   */
  FIND_CATEGORY_BY_ID: Symbol('IFindCategoryByIdRepository'),

  /**
   * Token for IFindCategoriesRepository
   * Used when other modules need to find multiple categories
   */
  FIND_CATEGORIES: Symbol('IFindCategoriesRepository'),

  /**
   * Token for ICreateCategoryRepository
   * Used when other modules need to create categories
   */
  CREATE_CATEGORY: Symbol('ICreateCategoryRepository'),

  /**
   * Token for IUpdateCategoryRepository
   * Used when other modules need to update categories
   */
  UPDATE_CATEGORY: Symbol('IUpdateCategoryRepository'),

  /**
   * Token for IDeleteCategoryRepository
   * Used when other modules need to delete categories
   */
  DELETE_CATEGORY: Symbol('IDeleteCategoryRepository'),
} as const;

